import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarAplicacao } from '../src/aplicacao.js';
import { ErroHttp } from '../src/seguranca.js';

test('preserva erros recuperáveis e oculta falhas internas', async () => {
  const anterior = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'chave-exclusiva-para-teste-de-erros-http-12345';
  const app = await criarAplicacao(false);
  try {
    app.get('/teste/indisponivel', async () => {
      throw new ErroHttp(503, 'Envio de e-mail indisponível.');
    });
    app.get('/teste/interno', async () => {
      throw new Error('Informação interna confidencial');
    });
    const indisponivel = await app.inject('/teste/indisponivel');
    assert.equal(indisponivel.statusCode, 503);
    assert.deepEqual(indisponivel.json(), { error: 'Envio de e-mail indisponível.' });
    const interno = await app.inject('/teste/interno');
    assert.equal(interno.statusCode, 500);
    assert.deepEqual(interno.json(), {
      error: 'Não foi possível concluir a solicitação. Tente novamente.',
    });
  } finally {
    await app.close();
    if (anterior === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = anterior;
  }
});
