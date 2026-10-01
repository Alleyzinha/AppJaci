import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { consultar, executar, transacao, type Executor } from '../banco/conexao.js';
import { autenticar, ErroHttp, type Usuario } from '../seguranca.js';

export const mensagemSchema = z.object({
  texto: z.string().trim().min(1, 'Escreva uma mensagem.').max(2000),
  clienteId: z.string().uuid(),
});
const parametros = z.object({ id: z.coerce.number().int().positive() });
const modoSchema = z.enum(['rede', 'equipe']);
export function emailsEquipe() {
  return (process.env.CHAT_TEAM_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
const equipe = (usuario: Usuario) => emailsEquipe().includes(usuario.email.toLowerCase());

export async function autorizarConversa(
  usuario: Usuario,
  id: number,
  modo: string,
  executor?: Executor,
) {
  if (id === usuario.idUsuario) throw new ErroHttp(403, 'Escolha outro contato.');
  if (modo === 'rede') {
    const [vinculo] = await consultar(
      `SELECT idGuardiao FROM tbGuardiao WHERE status = 'ativo' AND
      ((idUsuario = ? AND idContaGuardiao = ?) OR (idUsuario = ? AND idContaGuardiao = ?)) FOR UPDATE`,
      [usuario.idUsuario, id, id, usuario.idUsuario],
      executor,
    );
    if (vinculo) return;
  } else {
    const [contato] = await consultar<Usuario>(
      'SELECT * FROM tbUsuario WHERE idUsuario = ? AND emailConfirmadoEm IS NOT NULL',
      [id],
      executor,
    );
    if (contato && equipe(contato)) return;
    if (contato && equipe(usuario)) {
      const [iniciada] = await consultar(
        'SELECT idMensagem FROM tbChatMensagem WHERE modo = ? AND idRemetente = ? AND idDestinatario = ? LIMIT 1',
        ['equipe', id, usuario.idUsuario],
        executor,
      );
      if (iniciada) return;
    }
  }
  throw new ErroHttp(403, 'Esta conversa não está disponível para sua conta.');
}

export async function rotasChat(app: FastifyInstance) {
  app.get('/api/chat/contatos', { preHandler: autenticar }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const usuario = req.usuario;
    const rede = await consultar<{ id: number; nome: string }>(
      `SELECT DISTINCT u.idUsuario id, u.nome FROM tbUsuario u JOIN tbGuardiao g ON
      ((g.idUsuario = ? AND g.idContaGuardiao = u.idUsuario) OR (g.idContaGuardiao = ? AND g.idUsuario = u.idUsuario))
      WHERE g.status = 'ativo' AND u.emailConfirmadoEm IS NOT NULL`,
      [usuario.idUsuario, usuario.idUsuario],
    );
    const emails = emailsEquipe();
    const atendentes = emails.length
      ? await consultar<{ id: number; nome: string }>(
          `SELECT idUsuario id, nome FROM tbUsuario WHERE LOWER(email) IN (${emails.map(() => '?').join(',')}) AND idUsuario <> ? AND emailConfirmadoEm IS NOT NULL`,
          [...emails, usuario.idUsuario],
        )
      : [];
    const atendimentos = equipe(usuario)
      ? await consultar<{ id: number; nome: string }>(
          `SELECT DISTINCT u.idUsuario id, u.nome FROM tbUsuario u JOIN tbChatMensagem m ON m.idRemetente = u.idUsuario WHERE m.idDestinatario = ? AND m.modo = 'equipe' LIMIT 100`,
          [usuario.idUsuario],
        )
      : [];
    const naoLidas = await consultar<{ id: number; modo: string; quantidade: number }>(
      'SELECT idRemetente id, modo, COUNT(*) quantidade FROM tbChatMensagem WHERE idDestinatario = ? AND lidaEm IS NULL GROUP BY idRemetente, modo',
      [usuario.idUsuario],
    );
    const contatos = [
      ...rede.map((c) => ({ ...c, modo: 'rede' })),
      ...atendentes.map((c) => ({ ...c, modo: 'equipe' })),
      ...atendimentos.map((c) => ({ ...c, modo: 'equipe' })),
    ];
    return {
      contatos: contatos
        .filter((c, i) => contatos.findIndex((v) => v.id === c.id && v.modo === c.modo) === i)
        .map((c) => ({
          ...c,
          naoLidas: Number(
            naoLidas.find((n) => n.id === c.id && n.modo === c.modo)?.quantidade || 0,
          ),
        })),
      assistenteDisponivel: !!process.env.OPENAI_API_KEY,
    };
  });

  app.get('/api/chat/:id/mensagens', { preHandler: autenticar }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const { id } = parametros.parse(req.params);
    const { modo, antes } = z
      .object({ modo: modoSchema, antes: z.coerce.number().int().positive().optional() })
      .parse(req.query);
    await autorizarConversa(req.usuario, id, modo);
    const mensagens = await consultar(
      `SELECT idMensagem id, idRemetente remetente, texto, criadaEm, lidaEm FROM tbChatMensagem WHERE modo = ? AND
      ((idRemetente = ? AND idDestinatario = ?) OR (idRemetente = ? AND idDestinatario = ?))
      ${antes ? 'AND idMensagem < ?' : ''} ORDER BY idMensagem DESC LIMIT 50`,
      [modo, req.usuario.idUsuario, id, id, req.usuario.idUsuario, ...(antes ? [antes] : [])],
    );
    return { mensagens: mensagens.reverse(), temMais: mensagens.length === 50 };
  });
  app.post('/api/chat/:id/mensagens', { preHandler: autenticar }, async (req, reply) => {
    const { id } = parametros.parse(req.params);
    const { modo } = z.object({ modo: modoSchema }).parse(req.query);
    const dados = mensagemSchema.parse(req.body);
    await transacao(async (conexao) => {
      await autorizarConversa(req.usuario, id, modo, conexao);
      await executar(
        'INSERT INTO tbChatMensagem (idRemetente, idDestinatario, modo, texto, clienteId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idMensagem = idMensagem',
        [req.usuario.idUsuario, id, modo, dados.texto, dados.clienteId],
        conexao,
      );
    });
    return reply.code(201).send({ ok: true });
  });
  app.patch('/api/chat/:id/lidas', { preHandler: autenticar }, async (req) => {
    const { id } = parametros.parse(req.params);
    const { modo } = z.object({ modo: modoSchema }).parse(req.query);
    const { ate } = z.object({ ate: z.number().int().positive() }).parse(req.body);
    await autorizarConversa(req.usuario, id, modo);
    await executar(
      'UPDATE tbChatMensagem SET lidaEm = UTC_TIMESTAMP(3) WHERE idRemetente = ? AND idDestinatario = ? AND modo = ? AND idMensagem <= ? AND lidaEm IS NULL',
      [id, req.usuario.idUsuario, modo, ate],
    );
    return { ok: true };
  });
}
