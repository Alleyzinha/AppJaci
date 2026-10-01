import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { mensagemSchema } from '../src/rotas/chat.js';
import { responderAssistente } from '../src/rotas/assistente.js';

test('chat rejeita mensagens vazias, excessivas e identificadores inválidos', () => {
  const clienteId = 'ba699418-e5a4-4dad-8031-1c23c613c22c';
  for (const texto of ['', '   ', 'a'.repeat(2001)]) {
    assert.equal(mensagemSchema.safeParse({ texto, clienteId }).success, false);
  }
  assert.equal(mensagemSchema.safeParse({ texto: 'Olá', clienteId: 'invalido' }).success, false);
  assert.equal(mensagemSchema.parse({ texto: '  Olá  ', clienteId }).texto, 'Olá');
});

test('assistente sem chave fica indisponível e não inventa respostas', async () => {
  const anterior = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    await assert.rejects(responderAssistente([{ papel: 'user', texto: 'Olá' }]), {
      statusCode: 503,
    });
  } finally {
    if (anterior === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = anterior;
  }
});

test('assistente envia apenas o histórico fornecido e trata falhas do provedor', async () => {
  const anterior = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'chave-ficticia-de-teste';
  const chamada = mock.method(globalThis, 'fetch', async (_url: any, opcoes: any) => {
    const dados = JSON.parse(opcoes.body);
    assert.equal(dados.store, false);
    assert.deepEqual(dados.input, [{ role: 'user', content: 'Como usar o diário?' }]);
    return new Response(
      JSON.stringify({ output: [{ content: [{ type: 'output_text', text: 'Abra o Diário.' }] }] }),
      { status: 200 },
    );
  });
  try {
    assert.equal(
      await responderAssistente([{ papel: 'user', texto: 'Como usar o diário?' }]),
      'Abra o Diário.',
    );
    chamada.mock.mockImplementation(async () => new Response('', { status: 429 }));
    await assert.rejects(responderAssistente([]), { statusCode: 503 });
  } finally {
    chamada.mock.restore();
    if (anterior === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = anterior;
  }
});
