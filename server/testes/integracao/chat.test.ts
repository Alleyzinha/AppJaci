import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { criarAplicacao } from '../../src/aplicacao.js';
import { banco, configuracaoBanco, executar } from '../../src/banco/conexao.js';
import { tokenPara, type Usuario } from '../../src/seguranca.js';

test('chat persiste mensagens, confirma leitura e protege rede, equipe e IA', async () => {
  assert.match(configuracaoBanco.database, /_teste$/);
  const app = await criarAplicacao(false);
  const ids: number[] = [];
  const equipeAnterior = process.env.CHAT_TEAM_EMAILS;
  async function conta(perfil: 'protegida' | 'guardiao') {
    const email = `chat-${randomUUID()}@example.com`;
    const resultado = await executar(
      'INSERT INTO tbUsuario (nome, email, telefone, senha, perfil, emailConfirmadoEm) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(3))',
      ['Conta de teste', email, '11999999999', 'hash-ficticio', perfil],
    );
    ids.push(resultado.insertId);
    return {
      id: resultado.insertId,
      email,
      token: tokenPara({ idUsuario: resultado.insertId, perfil, versaoSessao: 0 } as Usuario),
    };
  }
  const chamar = (method: 'GET' | 'POST' | 'PATCH', url: string, token: string, payload?: object) =>
    app.inject({ method, url, headers: { authorization: `Bearer ${token}` }, payload });
  try {
    const protegida = await conta('protegida');
    const guardiao = await conta('guardiao');
    const intruso = await conta('guardiao');
    const atendente = await conta('guardiao');
    process.env.CHAT_TEAM_EMAILS = atendente.email;
    await executar(
      'INSERT INTO tbGuardiao (idUsuario, idContaGuardiao, nome, telefone, email, parentesco) VALUES (?, ?, ?, ?, ?, ?)',
      [protegida.id, guardiao.id, 'Guardião de teste', '11999999999', guardiao.email, 'Amigo'],
    );
    const contatos = await chamar('GET', '/api/chat/contatos', protegida.token);
    assert.equal(contatos.statusCode, 200);
    assert.equal(contatos.json().contatos.length, 2);
    const url = `/api/chat/${guardiao.id}/mensagens?modo=rede`;
    const mensagem = { texto: 'Oi, podemos conversar?', clienteId: randomUUID() };
    assert.equal((await chamar('POST', url, protegida.token, mensagem)).statusCode, 201);
    assert.equal((await chamar('POST', url, protegida.token, mensagem)).statusCode, 201);
    let historico = await chamar(
      'GET',
      `/api/chat/${protegida.id}/mensagens?modo=rede`,
      guardiao.token,
    );
    assert.equal(historico.json().mensagens.length, 1, 'repetir envio não duplica a mensagem');
    const idMensagem = historico.json().mensagens[0].id;
    assert.equal(
      (
        await chamar('PATCH', `/api/chat/${protegida.id}/lidas?modo=rede`, guardiao.token, {
          ate: idMensagem,
        })
      ).statusCode,
      200,
    );
    historico = await chamar('GET', url, protegida.token);
    assert.ok(historico.json().mensagens[0].lidaEm);
    assert.equal((await chamar('GET', url, intruso.token)).statusCode, 403);
    assert.equal(
      (
        await chamar('POST', `/api/chat/${protegida.id}/mensagens?modo=rede`, intruso.token, {
          texto: 'Intrusão',
          clienteId: randomUUID(),
        })
      ).statusCode,
      403,
    );
    assert.equal(
      (await chamar('POST', url, protegida.token, { texto: ' ', clienteId: randomUUID() }))
        .statusCode,
      400,
    );
    assert.equal(
      (
        await chamar('POST', `/api/chat/${protegida.id}/mensagens?modo=equipe`, atendente.token, {
          texto: 'Olá',
          clienteId: randomUUID(),
        })
      ).statusCode,
      403,
      'equipe só responde após a pessoa iniciar',
    );
    assert.equal(
      (
        await chamar('POST', `/api/chat/${atendente.id}/mensagens?modo=equipe`, protegida.token, {
          texto: 'Preciso de atendimento',
          clienteId: randomUUID(),
        })
      ).statusCode,
      201,
    );
    assert.equal(
      (
        await chamar('POST', `/api/chat/${protegida.id}/mensagens?modo=equipe`, atendente.token, {
          texto: 'Como posso ajudar?',
          clienteId: randomUUID(),
        })
      ).statusCode,
      201,
    );
    assert.equal(
      (await chamar('GET', `/api/chat/${atendente.id}/mensagens?modo=equipe`, intruso.token)).json()
        .mensagens.length,
      0,
    );
    await executar('DELETE FROM tbGuardiao WHERE idUsuario = ? AND idContaGuardiao = ?', [
      protegida.id,
      guardiao.id,
    ]);
    assert.equal(
      (await chamar('GET', url, protegida.token)).statusCode,
      403,
      'remover vínculo revoga acesso',
    );
    assert.equal(
      (await chamar('GET', '/api/chat/assistente/historico', intruso.token)).json().mensagens
        .length,
      0,
    );
    assert.equal(
      (
        await chamar('POST', '/api/chat/assistente/mensagens', protegida.token, {
          texto: 'Olá',
          consentimento: false,
        })
      ).statusCode,
      400,
    );
  } finally {
    if (equipeAnterior === undefined) delete process.env.CHAT_TEAM_EMAILS;
    else process.env.CHAT_TEAM_EMAILS = equipeAnterior;
    for (const id of ids) await executar('DELETE FROM tbUsuario WHERE idUsuario = ?', [id]);
    await app.close();
    await banco.end();
  }
});
