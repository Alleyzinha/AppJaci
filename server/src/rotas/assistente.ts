import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { consultar, executar, transacao } from '../banco/conexao.js';
import { autenticar, ErroHttp } from '../seguranca.js';

type MensagemIA = { id: number; papel: 'user' | 'assistant'; texto: string; criadaEm: Date };
export async function responderAssistente(historico: Pick<MensagemIA, 'papel' | 'texto'>[]) {
  if (!process.env.OPENAI_API_KEY)
    throw new ErroHttp(
      503,
      'O assistente virtual ainda não está disponível. Você pode conversar com sua rede ou consultar o acolhimento.',
    );
  try {
    const resposta = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        store: false,
        max_output_tokens: 600,
        instructions:
          'Você é o assistente virtual Jaci. Responda em português de forma acolhedora e breve. Ajude a usar o aplicativo e organizar próximos passos. Você é uma IA, não uma psicóloga, equipe humana ou serviço de emergência. Não invente atendimento, disponibilidade, contatos, ações realizadas ou acesso à localização. Não peça senhas, PINs ou endereço. Não diagnostique nem prescreva tratamentos. Em perigo imediato, oriente a buscar segurança e ligar 190; para orientação sobre violência contra a mulher, 180. Não afirme ter acionado ajuda. Preserve a autonomia da pessoa.',
        input: historico.map((m) => ({ role: m.papel, content: m.texto })),
      }),
    });
    if (!resposta.ok) throw new Error('Provedor indisponível.');
    const dados = (await resposta.json()) as {
      output?: { content?: { type: string; text?: string }[] }[];
    };
    const texto = dados.output
      ?.flatMap((m) => m.content || [])
      .filter((c) => c.type === 'output_text')
      .map((c) => c.text || '')
      .join('\n')
      .trim();
    if (!texto) throw new Error('Resposta vazia.');
    return texto;
  } catch {
    throw new ErroHttp(
      503,
      'O assistente está indisponível no momento. Tente novamente mais tarde.',
    );
  }
}

export async function rotasAssistente(app: FastifyInstance) {
  app.get('/api/chat/assistente/historico', { preHandler: autenticar }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const mensagens = await consultar<MensagemIA>(
      'SELECT idMensagem id, papel, texto, criadaEm FROM tbChatAssistente WHERE idUsuario = ? ORDER BY idMensagem DESC LIMIT 100',
      [req.usuario.idUsuario],
    );
    return { mensagens: mensagens.reverse() };
  });
  app.post(
    '/api/chat/assistente/mensagens',
    { preHandler: autenticar, config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    async (req) => {
      const { texto, consentimento } = z
        .object({ texto: z.string().trim().min(1).max(2000), consentimento: z.literal(true) })
        .parse(req.body);
      if (!consentimento) throw new ErroHttp(400, 'Autorize o envio ao assistente.');
      const historico = await consultar<MensagemIA>(
        'SELECT papel, texto FROM tbChatAssistente WHERE idUsuario = ? ORDER BY idMensagem DESC LIMIT 20',
        [req.usuario.idUsuario],
      );
      const resposta = await responderAssistente([
        ...historico.reverse(),
        { papel: 'user', texto },
      ]);
      await transacao(async (conexao) => {
        for (const [papel, conteudo] of [
          ['user', texto],
          ['assistant', resposta],
        ])
          await executar(
            'INSERT INTO tbChatAssistente (idUsuario, papel, texto) VALUES (?, ?, ?)',
            [req.usuario.idUsuario, papel, conteudo],
            conexao,
          );
      });
      return { ok: true };
    },
  );
}
