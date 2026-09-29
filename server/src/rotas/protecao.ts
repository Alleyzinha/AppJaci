import { posicaoSchema, atualizacaoSchema } from '../localizacao.js';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { consultar, executar, transacao } from '../banco/conexao.js';
import { apenasProtegida, autenticar, ErroHttp } from '../seguranca.js';

const identificador = z.object({ id: z.coerce.number().int().positive() });
const entrada = z.object({
  titulo: z.string().trim().min(1, 'Informe um título.').max(200),
  descricao: z.string().trim().min(1, 'Escreva sua nota.').max(500),
});

export async function rotasProtecao(app: FastifyInstance) {
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
        : `SELECT l.*, u.nome FROM tbLocalizacaoUsuario l JOIN tbUsuario u ON u.idUsuario = l.idUsuario JOIN tbGuardiao g ON g.idUsuario = l.idUsuario WHERE g.idContaGuardiao = ? AND g.status = 'ativo' AND l.compartilhada = TRUE`;
    return { localizacoes: await consultar(sql, [req.usuario.idUsuario]) };
  });
  app.post('/api/sos', { preHandler: apenasProtegida }, async (req, reply) => {
    const alerta = await transacao(async (conexao) => {
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
      if (ativo) return ativo;
      const resultado = await executar(
        'INSERT INTO tbAlertaSos (idUsuario) VALUES (?)',
        [req.usuario.idUsuario],
        conexao,
      );
      return { idAlertaSos: resultado.insertId };
    });
    return reply.code(201).send({
      ...alerta,
      mensagem:
        'Alerta registrado. Seus guardiões podem consultá-lo no aplicativo. Não há envio de SMS ou acionamento automático da polícia.',
    });
  });
  app.get('/api/sos', { preHandler: autenticar }, async (req) => {
    const sql =
      req.usuario.perfil === 'protegida'
        ? 'SELECT a.*, u.nome FROM tbAlertaSos a JOIN tbUsuario u ON u.idUsuario = a.idUsuario WHERE a.idUsuario = ?'
        : `SELECT a.*, u.nome FROM tbAlertaSos a JOIN tbUsuario u ON u.idUsuario = a.idUsuario JOIN tbGuardiao g ON g.idUsuario = a.idUsuario WHERE g.idContaGuardiao = ? AND g.status = 'ativo'`;
    return {
      alertas: await consultar(`${sql} ORDER BY a.dataHora DESC, a.idAlertaSos DESC LIMIT 50`, [
        req.usuario.idUsuario,
      ]),
    };
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
