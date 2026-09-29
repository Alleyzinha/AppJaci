import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import {
  tokenPara,
  validarToken,
  usuarioPublico,
  segredo,
  type Usuario,
} from '../src/seguranca.js';
import { criarAplicacao } from '../src/aplicacao.js';

process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.NODE_ENV = 'test';
const usuario = {
  idUsuario: 7,
  nome: 'Pessoa de teste',
  email: 'teste@example.com',
  telefone: '11999999999',
  senha: 'hash-privado',
  pinHash: 'pin-privado',
  perfil: 'protegida',
  emailConfirmadoEm: new Date(),
  versaoSessao: 3,
} satisfies Usuario;

test('resposta pública não contém senha, PIN ou versão de sessão', () => {
  assert.deepEqual(Object.keys(usuarioPublico(usuario)).sort(), [
    'email',
    'id',
    'name',
    'phone',
    'profile',
  ]);
});
test('autorização de PIN não pode ser usada como sessão', () => {
  const token = tokenPara(usuario, 'pin');
  assert.equal(validarToken(token, 'pin').sub, '7');
  assert.throws(() => validarToken(token, 'sessao'), /Sessão inválida/);
  assert.throws(() => validarToken('token-adulterado', 'sessao'), /Sessão inválida/);
});
test('segredo padrão não é aceito', () => {
  const anterior = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'troque-por-uma-chave-aleatoria-de-pelo-menos-32-caracteres';
  assert.throws(segredo, /Configure JWT_SECRET/);
  process.env.JWT_SECRET = anterior;
});
test('rotas privadas rejeitam visitante antes de consultar o banco', async () => {
  const app = await criarAplicacao(false);
  try {
    for (const url of [
      '/api/diario',
      '/api/localizacao',
      '/api/sos',
      '/api/guardians',
      '/api/users/me',
      '/api/admin/usuarios',
      '/api/admin/resumo',
    ]) {
      const resposta = await app.inject({ method: 'GET', url });
      assert.equal(resposta.statusCode, 401, url);
    }
    const resposta = await app.inject({
      method: 'POST',
      url: '/api/auth/pin/setup',
      payload: { email: usuario.email, pin: '1234' },
    });
    assert.equal(resposta.statusCode, 400);
    const invalido = await app.inject({ method: 'POST', url: '/api/auth/register', payload: {} });
    assert.equal(invalido.statusCode, 400);
  } finally {
    await app.close();
  }
});

test('página administrativa serve somente a interface, sem dados de cadastro', async () => {
  const app = await criarAplicacao(false);
  try {
    const resposta = await app.inject({ method: 'GET', url: '/admin' });
    assert.equal(resposta.statusCode, 200);
    assert.match(resposta.headers['content-type']!, /text\/html/);
    assert.equal(resposta.headers['cache-control'], 'no-store');
    assert.match(resposta.body, /Acessar o painel/);
    assert.ok(resposta.headers['content-security-policy']);
    for (const arquivo of ['painel.css', 'painel.js']) {
      assert.equal((await app.inject({ method: 'GET', url: `/admin/${arquivo}` })).statusCode, 200);
    }
  } finally {
    await app.close();
  }
});
