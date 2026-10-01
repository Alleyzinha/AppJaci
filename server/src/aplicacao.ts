import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { z, ZodError } from 'zod';
import { consultar } from './banco/conexao.js';
import { segredo } from './seguranca.js';
import { rotasAutenticacao } from './rotas/autenticacao.js';
import { rotasGuardioes } from './rotas/guardioes.js';
import { rotasProtecao } from './rotas/protecao.js';
import { rotasAdministracao } from './rotas/administracao.js';
import { rotasChat } from './rotas/chat.js';
import { rotasAssistente } from './rotas/assistente.js';

export async function criarAplicacao(logger = true) {
  z.config(z.locales.ptBR());
  segredo();
  if (process.env.NODE_ENV === 'production' && !process.env.SMTP_HOST)
    throw new Error('Configure SMTP em produção.');
  const app = Fastify({ logger, bodyLimit: 32 * 1024 });
  const origens = (process.env.CORS_ORIGIN || 'http://localhost:8081,http://localhost:8082')
    .split(',')
    .map((valor) => valor.trim());
  await app.register(cors, {
    origin: origens,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  await app.register(helmet);
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.get('/health', async () => {
    await consultar('SELECT 1');
    return { ok: true, banco: 'mysql' };
  });
  app.setErrorHandler((erro, req, reply) => {
    if (erro instanceof ZodError)
      return reply.code(400).send({ error: erro.issues.map((item) => item.message).join(' ') });
    const falha = erro as Error & { code?: string; statusCode?: number };
    if (falha.code === 'ER_DUP_ENTRY')
      return reply.code(409).send({ error: 'Este cadastro já existe.' });
    if (falha.statusCode && falha.statusCode < 500)
      return reply.code(falha.statusCode).send({
        error:
          falha.statusCode === 429
            ? 'Muitas tentativas. Aguarde e tente novamente.'
            : falha.message,
      });
    req.log.error({ err: erro }, 'Falha ao processar solicitação');
    return reply
      .code(500)
      .send({ error: 'Não foi possível concluir a solicitação. Tente novamente.' });
  });
  await rotasAutenticacao(app);
  await rotasGuardioes(app);
  await rotasProtecao(app);
  await rotasAdministracao(app);
  await rotasChat(app);
  await rotasAssistente(app);
  return app;
}
