import { posicaoSchema, atualizacaoSchema } from '../localizacao.js';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { consultar, executar, transacao } from '../banco/conexao.js';
import { apenasProtegida, autenticar, ErroHttp } from '../seguranca.js';
import { notificarGuardioesDoSos } from '../notificacoes.js';

const identificador = z.object({ id: z.coerce.number().int().positive() });
const entrada = z.object({
  titulo: z.string().trim().min(1, 'Informe um título.').max(200),
  descricao: z.string().trim().min(1, 'Escreva sua nota.').max(500),
});

export async function rotasProtecao(app: FastifyInstance) {
  app.post('/api/notificacoes/dispositivo', { preHandler: autenticar }, async (req) => {
    const { token } = z
      .object({ token: z.string().regex(/^Expo(nent)?PushToken\[[^\]]+\]$/).max(255) })
      .parse(req.body);
    await executar(
      `INSERT INTO tbDispositivoPush (idUsuario, token) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE idUsuario = VALUES(idUsuario), atualizadoEm = CURRENT_TIMESTAMP(3)`,
      [req.usuario.idUsuario, token],
    );
    return { ok: true };
  });
  app.delete('/api/notificacoes/dispositivo', { preHandler: autenticar }, async (req) => {
    const { token } = z
      .object({ token: z.string().regex(/^Expo(nent)?PushToken\[[^\]]+\]$/).max(255) })
      .parse(req.body);
    await executar('DELETE FROM tbDispositivoPush WHERE idUsuario = ? AND token = ?', [
      req.usuario.idUsuario,
      token,
    ]);
    return { ok: true };
  });
  app.get('/api/plano-seguranca', { preHandler: apenasProtegida }, async (req) => {
    const [plano] = await consultar(
      'SELECT contatos, locaisSeguros, passos, atualizadoEm FROM tbPlanoSeguranca WHERE idUsuario = ?',
      [req.usuario.idUsuario],
    );
    return { plano: plano ?? { contatos: '', locaisSeguros: '', passos: '' } };
  });
  app.put('/api/plano-seguranca', { preHandler: apenasProtegida }, async (req) => {
    const dados = z
      .object({
        contatos: z.string().trim().max(3000),
        locaisSeguros: z.string().trim().max(3000),
        passos: z.string().trim().max(5000),
      })
      .parse(req.body);
    await executar(
      `INSERT INTO tbPlanoSeguranca (idUsuario, contatos, locaisSeguros, passos)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE contatos = VALUES(contatos),
      locaisSeguros = VALUES(locaisSeguros), passos = VALUES(passos)`,
      [req.usuario.idUsuario, dados.contatos, dados.locaisSeguros, dados.passos],
    );
    return { ok: true };
  });
  app.get('/api/checkin', { preHandler: autenticar }, async (req) => {
    if (req.usuario.perfil === 'protegida') {
      const [checkin] = await consultar(
        `SELECT intervaloHoras, observacao, proximoEm, confirmadoEm,
        (proximoEm < UTC_TIMESTAMP(3)) AS atrasado FROM tbCheckin WHERE idUsuario = ?`,
        [req.usuario.idUsuario],
      );
      return { checkin: checkin ?? null };
    }
    const checkins = await consultar(
      `SELECT CAST(u.idUsuario AS CHAR) AS idUsuario, u.nome,
      c.intervaloHoras, c.observacao, c.proximoEm, c.confirmadoEm,
      (c.proximoEm < UTC_TIMESTAMP(3)) AS atrasado
      FROM tbCheckin c JOIN tbUsuario u ON u.idUsuario = c.idUsuario
      JOIN tbProtegida p ON p.idUsuario = u.idUsuario
      JOIN tbVinculo v ON v.idProtegida = p.idProtegida AND v.status = 'Ativo'
      JOIN tbGuardiao g ON g.idGuardiao = v.idGuardiao AND g.status = 'ativo'
      WHERE g.idContaGuardiao = ? ORDER BY c.proximoEm ASC`,
      [req.usuario.idUsuario],
    );
    return { checkins };
  });
  app.put('/api/checkin', { preHandler: apenasProtegida }, async (req) => {
    const dados = z
      .object({
        intervaloHoras: z.number().int().min(1).max(24),
        observacao: z.string().trim().max(300),
      })
      .parse(req.body);
    const proximoEm = new Date(Date.now() + dados.intervaloHoras * 60 * 60 * 1000);
    await executar(
      `INSERT INTO tbCheckin (idUsuario, intervaloHoras, observacao, proximoEm)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE intervaloHoras = VALUES(intervaloHoras),
      observacao = VALUES(observacao), proximoEm = VALUES(proximoEm), alertaAtrasoEnviadoEm = NULL`,
      [req.usuario.idUsuario, dados.intervaloHoras, dados.observacao, proximoEm],
    );
    return { ok: true, proximoEm };
  });
  app.post('/api/checkin/confirmar', { preHandler: apenasProtegida }, async (req) => {
    const [checkin] = await consultar<{ intervaloHoras: number }>(
      'SELECT intervaloHoras FROM tbCheckin WHERE idUsuario = ?',
      [req.usuario.idUsuario],
    );
    if (!checkin) throw new ErroHttp(404, 'Configure um check-in primeiro.');
    const proximoEm = new Date(Date.now() + checkin.intervaloHoras * 60 * 60 * 1000);
    await executar(
      'UPDATE tbCheckin SET confirmadoEm = ?, proximoEm = ?, alertaAtrasoEnviadoEm = NULL WHERE idUsuario = ?',
      [new Date(), proximoEm, req.usuario.idUsuario],
    );
    return { ok: true, proximoEm };
  });
  app.get('/api/localizacao/permissoes', { preHandler: apenasProtegida }, async (req) => ({
    permissoes: await consultar(
      `SELECT CAST(g.idContaGuardiao AS CHAR) AS id, g.nome, g.email,
      COALESCE(p.permitido, TRUE) AS permitido
      FROM tbGuardiao g JOIN tbVinculo v ON v.idGuardiao = g.idGuardiao AND v.status = 'Ativo'
      JOIN tbProtegida perfil ON perfil.idProtegida = v.idProtegida
      LEFT JOIN tbPermissaoLocalizacao p ON p.idUsuario = perfil.idUsuario
        AND p.idContaGuardiao = g.idContaGuardiao
      WHERE perfil.idUsuario = ? AND g.status = 'ativo' ORDER BY g.nome`,
      [req.usuario.idUsuario],
    ),
  }));
  app.put('/api/localizacao/permissoes', { preHandler: apenasProtegida }, async (req) => {
    const dados = z
      .object({ guardiaoIds: z.array(z.number().int().positive()).max(50) })
      .parse(req.body);
    const unicos = new Set(dados.guardiaoIds);
    if (unicos.size !== dados.guardiaoIds.length)
      throw new ErroHttp(400, 'A lista de guardiões contém itens repetidos.');
    await transacao(async (conexao) => {
      const vinculados = await consultar<{ idContaGuardiao: number }>(
        `SELECT g.idContaGuardiao FROM tbGuardiao g
        JOIN tbVinculo v ON v.idGuardiao = g.idGuardiao AND v.status = 'Ativo'
        JOIN tbProtegida p ON p.idProtegida = v.idProtegida
        WHERE p.idUsuario = ? AND g.status = 'ativo'`,
        [req.usuario.idUsuario],
        conexao,
      );
      const idsValidos = new Set(vinculados.map((item) => Number(item.idContaGuardiao)));
      if (dados.guardiaoIds.some((id) => !idsValidos.has(id)))
        throw new ErroHttp(400, 'Selecione apenas guardiões vinculados à sua conta.');
      await executar(
        'DELETE FROM tbPermissaoLocalizacao WHERE idUsuario = ?',
        [req.usuario.idUsuario],
        conexao,
      );
      for (const id of idsValidos) {
        await executar(
          'INSERT INTO tbPermissaoLocalizacao (idUsuario, idContaGuardiao, permitido) VALUES (?, ?, ?)',
          [req.usuario.idUsuario, id, unicos.has(id)],
          conexao,
        );
      }
    });
    return { ok: true };
  });
  app.get('/api/diario', { preHandler: apenasProtegida }, async (req) => {
    const { pagina } = z
      .object({ pagina: z.coerce.number().int().min(1).max(100000).default(1) })
      .parse(req.query);
    return {
      entradas: await consultar(
        `SELECT * FROM tbDiario WHERE idUsuario = ? ORDER BY dataHora DESC, idDiario DESC LIMIT 20 OFFSET ${(pagina - 1) * 20}`,
        [req.usuario.idUsuario],
      ),
      pagina,
    };
  });
  app.post('/api/diario', { preHandler: apenasProtegida }, async (req, reply) => {
    const dados = entrada.parse(req.body);
    const resultado = await executar(
      'INSERT INTO tbDiario (idUsuario, titulo, descricao) VALUES (?, ?, ?)',
      [req.usuario.idUsuario, dados.titulo, dados.descricao],
    );
    return reply.code(201).send({ idDiario: resultado.insertId });
  });
  app.put('/api/diario/:id', { preHandler: apenasProtegida }, async (req) => {
    const { id } = identificador.parse(req.params);
    const dados = entrada.parse(req.body);
    const resultado = await executar(
      'UPDATE tbDiario SET titulo = ?, descricao = ? WHERE idDiario = ? AND idUsuario = ?',
      [dados.titulo, dados.descricao, id, req.usuario.idUsuario],
    );
    if (!resultado.affectedRows) throw new ErroHttp(404, 'Nota não encontrada.');
    return { ok: true };
  });
  app.delete('/api/diario/:id', { preHandler: apenasProtegida }, async (req) => {
    const { id } = identificador.parse(req.params);
    const resultado = await executar('DELETE FROM tbDiario WHERE idDiario = ? AND idUsuario = ?', [
      id,
      req.usuario.idUsuario,
    ]);
    if (!resultado.affectedRows) throw new ErroHttp(404, 'Nota não encontrada.');
    return { ok: true };
  });
  app.post('/api/localizacao/iniciar', { preHandler: apenasProtegida }, async (req) => {
    const dados = posicaoSchema.parse(req.body);
    const idCompartilhamento = await transacao(async (conexao) => {
      await consultar(
        'SELECT idUsuario FROM tbUsuario WHERE idUsuario = ? FOR UPDATE',
        [req.usuario.idUsuario],
        conexao,
      );
      await executar(
        'DELETE FROM tbLocalizacaoUsuario WHERE idUsuario = ?',
        [req.usuario.idUsuario],
        conexao,
      );
      const resultado = await executar(
        'INSERT INTO tbLocalizacaoUsuario (idUsuario, latitude, longitude, compartilhada, atualizadoEm) VALUES (?, ?, ?, TRUE, ?)',
        [req.usuario.idUsuario, dados.latitude, dados.longitude, new Date(dados.capturadoEm)],
        conexao,
      );
      return resultado.insertId;
    });
    return { idCompartilhamento };
  });
  app.put('/api/localizacao', { preHandler: apenasProtegida }, async (req) => {
    const dados = atualizacaoSchema.parse(req.body);
    const resultado = await executar(
      'UPDATE tbLocalizacaoUsuario SET latitude = ?, longitude = ?, atualizadoEm = ? WHERE idUsuario = ? AND idLocalizacaoUsuario = ? AND compartilhada = TRUE AND atualizadoEm <= ?',
      [
        dados.latitude,
        dados.longitude,
        new Date(dados.capturadoEm),
        req.usuario.idUsuario,
        dados.idCompartilhamento,
        new Date(dados.capturadoEm),
      ],
    );
    if (!resultado.affectedRows) {
      const [ativo] = await consultar(
        'SELECT idLocalizacaoUsuario FROM tbLocalizacaoUsuario WHERE idUsuario = ? AND idLocalizacaoUsuario = ?',
        [req.usuario.idUsuario, dados.idCompartilhamento],
      );
      if (!ativo)
        throw new ErroHttp(
          409,
          'Compartilhamento encerrado. Inicie novamente para enviar sua posi\u00e7\u00e3o.',
        );
    }
    return { ok: true };
  });
  app.delete('/api/localizacao', { preHandler: apenasProtegida }, async (req) => {
    const { idCompartilhamento } = z
      .object({ idCompartilhamento: z.coerce.number().int().positive().optional() })
      .parse(req.query);
    await executar(
      'DELETE FROM tbLocalizacaoUsuario WHERE idUsuario = ?' +
        (idCompartilhamento ? ' AND idLocalizacaoUsuario = ?' : ''),
      idCompartilhamento ? [req.usuario.idUsuario, idCompartilhamento] : [req.usuario.idUsuario],
    );
    return { ok: true };
  });
  app.get('/api/localizacao', { preHandler: autenticar }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const sql =
      req.usuario.perfil === 'protegida'
        ? 'SELECT l.*, u.nome FROM tbLocalizacaoUsuario l JOIN tbUsuario u ON u.idUsuario = l.idUsuario WHERE l.idUsuario = ?'
        : `SELECT l.*, u.nome FROM tbLocalizacaoUsuario l JOIN tbUsuario u ON u.idUsuario = l.idUsuario
        JOIN tbProtegida p ON p.idUsuario = l.idUsuario
        JOIN tbVinculo v ON v.idProtegida = p.idProtegida AND v.status = 'Ativo'
        JOIN tbGuardiao g ON g.idGuardiao = v.idGuardiao
        LEFT JOIN tbPermissaoLocalizacao perm ON perm.idUsuario = p.idUsuario
          AND perm.idContaGuardiao = g.idContaGuardiao
        WHERE g.idContaGuardiao = ? AND g.status = 'ativo' AND l.compartilhada = TRUE
          AND (perm.idPermissao IS NULL OR perm.permitido = TRUE)`;
    return { localizacoes: await consultar(sql, [req.usuario.idUsuario]) };
  });
  app.post('/api/sos', { preHandler: apenasProtegida }, async (req, reply) => {
    const resultadoSos = await transacao(async (conexao) => {
      await consultar(
        'SELECT idUsuario FROM tbUsuario WHERE idUsuario = ? FOR UPDATE',
        [req.usuario.idUsuario],
        conexao,
      );
      const [ativo] = await consultar<{ idAlertaSos: number }>(
        "SELECT idAlertaSos FROM tbAlertaSos WHERE idUsuario = ? AND status = 'ativo'",
        [req.usuario.idUsuario],
        conexao,
      );
      if (ativo) return { alerta: ativo, criado: false };
      const resultado = await executar(
        'INSERT INTO tbAlertaSos (idUsuario, data, hora) VALUES (?, UTC_DATE(), UTC_TIME())',
        [req.usuario.idUsuario],
        conexao,
      );
      return { alerta: { idAlertaSos: resultado.insertId }, criado: true };
    });
    if (resultadoSos.criado) {
      try {
        await notificarGuardioesDoSos(req.usuario.idUsuario);
      } catch (erro) {
        req.log.error({ err: erro, idAlertaSos: resultadoSos.alerta.idAlertaSos }, 'Falha ao enviar push SOS');
      }
    }
    return reply.code(201).send({
      ...resultadoSos.alerta,
      mensagem:
        'Alerta registrado. Seus guardiões podem consultá-lo no aplicativo. Não há envio de SMS ou acionamento automático da polícia.',
    });
  });
  app.get('/api/sos', { preHandler: autenticar }, async (req) => {
    const sql =
      req.usuario.perfil === 'protegida'
        ? `SELECT a.*, u.nome, r.confirmadoEm, g.nome AS guardiaoQueConfirmou
          FROM tbAlertaSos a JOIN tbUsuario u ON u.idUsuario = a.idUsuario
          LEFT JOIN tbSosReconhecimento r ON r.idAlertaSos = a.idAlertaSos
          LEFT JOIN tbUsuario g ON g.idUsuario = r.idContaGuardiao WHERE a.idUsuario = ?`
        : `SELECT a.*, u.nome, r.confirmadoEm, confirmado.nome AS guardiaoQueConfirmou
        FROM tbAlertaSos a JOIN tbUsuario u ON u.idUsuario = a.idUsuario
        JOIN tbProtegida p ON p.idUsuario = a.idUsuario
        JOIN tbVinculo v ON v.idProtegida = p.idProtegida AND v.status = 'Ativo'
        JOIN tbGuardiao g ON g.idGuardiao = v.idGuardiao
        LEFT JOIN tbSosReconhecimento r ON r.idAlertaSos = a.idAlertaSos
        LEFT JOIN tbUsuario confirmado ON confirmado.idUsuario = r.idContaGuardiao
        WHERE g.idContaGuardiao = ? AND g.status = 'ativo'`;
    return {
      alertas: await consultar(`${sql} ORDER BY a.dataHora DESC, a.idAlertaSos DESC LIMIT 50`, [
        req.usuario.idUsuario,
      ]),
    };
  });
  app.patch('/api/sos/:id/confirmar-recebimento', { preHandler: autenticar }, async (req) => {
    if (req.usuario.perfil !== 'guardiao')
      throw new ErroHttp(403, 'A confirmação de alertas é exclusiva de guardiões.');
    const { id } = identificador.parse(req.params);
    const [alerta] = await consultar<{ idAlertaSos: number }>(
      `SELECT a.idAlertaSos FROM tbAlertaSos a
      JOIN tbProtegida p ON p.idUsuario = a.idUsuario
      JOIN tbVinculo v ON v.idProtegida = p.idProtegida AND v.status = 'Ativo'
      JOIN tbGuardiao g ON g.idGuardiao = v.idGuardiao AND g.status = 'ativo'
      WHERE a.idAlertaSos = ? AND a.status = 'ativo' AND g.idContaGuardiao = ?`,
      [id, req.usuario.idUsuario],
    );
    if (!alerta) throw new ErroHttp(404, 'Alerta ativo não encontrado na sua rede.');
    await executar(
      'INSERT IGNORE INTO tbSosReconhecimento (idAlertaSos, idContaGuardiao) VALUES (?, ?)',
      [id, req.usuario.idUsuario],
    );
    return { ok: true };
  });
  app.patch('/api/sos/:id/encerrar', { preHandler: apenasProtegida }, async (req) => {
    const { id } = identificador.parse(req.params);
    const resultado = await executar(
      "UPDATE tbAlertaSos SET status = 'encerrado', encerradoEm = ? WHERE idAlertaSos = ? AND idUsuario = ? AND status = 'ativo'",
      [new Date(), id, req.usuario.idUsuario],
    );
    if (!resultado.affectedRows) throw new ErroHttp(404, 'Alerta ativo não encontrado.');
    return { ok: true };
  });
}
