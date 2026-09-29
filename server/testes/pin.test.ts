import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { rotasAutenticacao } from '../src/rotas/autenticacao.js';
import { autenticar } from '../src/seguranca.js';

test('PIN do diario valida o hash da conta e rejeita PIN incorreto ou ausente', async () => {
  let verificar: any;
  let opcoes: any;
  const app = {
    post: (url: string, config: any, handler: any) => {
      if (url === '/api/auth/pin/verify') {
        verificar = handler;
        opcoes = config;
      }
    },
    get: () => {},
    patch: () => {},
  };
  await rotasAutenticacao(app as unknown as FastifyInstance);
  assert.equal(opcoes.preHandler, autenticar);
  assert.equal(opcoes.config.rateLimit.max, 5);
  const usuario = { pinHash: await bcrypt.hash('0123', 4) };
  assert.deepEqual(await verificar({ body: { pin: '0123' }, usuario }), { ok: true });
  await assert.rejects(verificar({ body: { pin: '9999' }, usuario }), { statusCode: 403 });
  await assert.rejects(verificar({ body: { pin: '123' }, usuario }));
  await assert.rejects(verificar({ body: { pin: '0123' }, usuario: { pinHash: null } }), {
    statusCode: 409,
  });
  usuario.pinHash = await bcrypt.hash('5678', 4);
  await assert.rejects(verificar({ body: { pin: '0123' }, usuario }), { statusCode: 403 });
  assert.deepEqual(await verificar({ body: { pin: '5678' }, usuario }), { ok: true });
});
