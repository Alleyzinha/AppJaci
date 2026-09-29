import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { criarAplicacao } from '../../src/aplicacao.js';
import { banco, consultar, executar, configuracaoBanco } from '../../src/banco/conexao.js';

test('cadastro, sessão, privacidade, vínculos e persistência de ponta a ponta', async () => {
  assert.match(
    configuracaoBanco.database,
    /_teste$/,
    'Use exclusivamente um DB_NAME terminado em _teste.',
  );
  process.env.JWT_SECRET = randomBytes(48).toString('hex');
  process.env.NODE_ENV = 'test';
  process.env.SMTP_HOST = '';
  const app = await criarAplicacao(false);
  const administradoresAnteriores = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = '';
  const ids: number[] = [];
  const sufixo = randomBytes(6).toString('hex');
  const senha = 'Teste@12345';
  async function chamar(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    token?: string,
    payload?: object,
  ) {
    return app.inject({
      method,
      url,
      headers: token ? { authorization: `Bearer ${token}` } : {},
      payload,
    });
  }
  async function conta(perfil: string, indice: number) {
    const email = `jaci-${sufixo}-${indice}@example.com`;
    const cadastro = await chamar('POST', '/api/auth/register', undefined, {
      name: `Teste ${indice}`,
      email,
      phone: '11999999999',
      password: senha,
      profile: perfil,
    });
    assert.equal(cadastro.statusCode, 201, cadastro.body);
    const id = Number(cadastro.json().user.id);
    ids.push(id);
    const antes = await chamar('POST', '/api/auth/login', undefined, { email, password: senha });
    assert.equal(antes.statusCode, 403);
    await executar('UPDATE tbCodigoAcesso SET codigoHash = ? WHERE idUsuario = ?', [
      await bcrypt.hash('123456', 4),
      id,
    ]);
    const verificacao = await chamar('POST', '/api/auth/email/verify', undefined, {
      email,
      code: '123456',
    });
    assert.equal(verificacao.statusCode, 200, verificacao.body);
    const { setupToken } = verificacao.json();
    assert.equal((await chamar('GET', '/api/diario', setupToken)).statusCode, 401);
    assert.equal(
      (await chamar('POST', '/api/auth/pin/setup', undefined, { setupToken, pin: '1234' }))
        .statusCode,
      200,
    );
    assert.equal(
      (await chamar('POST', '/api/auth/pin/setup', undefined, { setupToken, pin: '4321' }))
        .statusCode,
      409,
    );
    assert.equal(
      (await chamar('POST', '/api/auth/email/verify', undefined, { email, code: '123456' }))
        .statusCode,
      400,
    );
    const login = await chamar('POST', '/api/auth/login', undefined, { email, password: senha });
    assert.equal(login.statusCode, 200, login.body);
    return { id, email, token: login.json().accessToken };
  }
  try {
    assert.equal((await chamar('GET', '/health')).statusCode, 200);
    const protegida = await conta('protegida', 1);
    const outra = await conta('protegida', 2);
    const guardiao = await conta('guardiao', 3);
    // O perfil escolhido no cadastro não concede permissão administrativa.
    assert.equal((await chamar('GET', '/api/admin/usuarios', protegida.token)).statusCode, 403);
    assert.equal((await chamar('GET', '/api/admin/resumo', guardiao.token)).statusCode, 403);
    process.env.ADMIN_EMAILS = ` ${guardiao.email.toUpperCase()} `;
    const resumoAdmin = await chamar('GET', '/api/admin/resumo', guardiao.token);
    assert.equal(resumoAdmin.statusCode, 200);
    assert.ok(resumoAdmin.json().resumo.total >= 3);
    const listaAdmin = await chamar(
      'GET',
      `/api/admin/usuarios?busca=${encodeURIComponent(protegida.email)}`,
      guardiao.token,
    );
    assert.equal(listaAdmin.statusCode, 200);
    assert.equal(listaAdmin.headers['cache-control'], 'no-store');
    assert.equal(listaAdmin.json().total, 1);
    assert.deepEqual(
      Object.keys(listaAdmin.json().usuarios[0]).sort(),
      ['criadoEm', 'email', 'emailConfirmadoEm', 'idUsuario', 'nome', 'perfil', 'telefone'].sort(),
    );
    assert.equal(
      (
        await chamar(
          'GET',
          `/api/admin/usuarios?busca=${encodeURIComponent(protegida.email)}&perfil=guardiao`,
          guardiao.token,
        )
      ).json().total,
      0,
    );
    assert.equal(
      (
        await chamar(
          'GET',
          `/api/admin/usuarios?busca=${encodeURIComponent(protegida.email)}&confirmacao=pendente`,
          guardiao.token,
        )
      ).json().total,
      0,
    );
    assert.equal(
      (
        await chamar(
          'GET',
          `/api/admin/usuarios?busca=${encodeURIComponent("' OR 1=1 --")}`,
          guardiao.token,
        )
      ).json().total,
      0,
    );
    assert.equal(
      (await chamar('GET', '/api/admin/usuarios?pagina=0', guardiao.token)).statusCode,
      400,
    );
    process.env.ADMIN_EMAILS = '';
    assert.equal((await chamar('GET', '/api/admin/usuarios', guardiao.token)).statusCode, 403);
    const atualizacao = await chamar('PATCH', '/api/users/me', protegida.token, {
      name: 'Nome atualizado',
      phone: '11888888888',
    });
    assert.equal(atualizacao.statusCode, 200);
    assert.equal(
      (await chamar('GET', '/api/users/me', protegida.token)).json().user.name,
      'Nome atualizado',
    );
    assert.equal((await chamar('GET', '/api/users/me', outra.token)).json().user.name, 'Teste 2');
    const nota = await chamar('POST', '/api/diario', protegida.token, {
      titulo: 'Minha nota',
      descricao: "Conteúdo privado com acentos e apóstrofo: d'água.",
    });
    assert.equal(nota.statusCode, 201, nota.body);
    const idNota = nota.json().idDiario;
    const dataNota = (await chamar('GET', '/api/diario', protegida.token)).json().entradas[0]
      .dataHora;
    assert.ok(Math.abs(Date.now() - new Date(dataNota).getTime()) < 10000, 'Data gravada em UTC');
    assert.equal((await chamar('GET', '/api/diario', outra.token)).json().entradas.length, 0);
    assert.equal((await chamar('DELETE', `/api/diario/${idNota}`, outra.token)).statusCode, 404);
    assert.equal((await chamar('GET', '/api/diario', guardiao.token)).statusCode, 403);
    assert.equal(
      (
        await chamar('PUT', `/api/diario/${idNota}`, protegida.token, {
          titulo: 'Atualizada',
          descricao: 'Texto atualizado',
        })
      ).statusCode,
      200,
    );
    assert.equal(
      (await chamar('GET', '/api/diario', protegida.token)).json().entradas[0].titulo,
      'Atualizada',
    );
    assert.equal(
      (await chamar('POST', '/api/diario', protegida.token, { titulo: '', descricao: 'x' }))
        .statusCode,
      400,
    );
    const vinculo = await chamar('POST', '/api/guardians', protegida.token, {
      name: 'Guardião',
      email: guardiao.email,
      phone: '11999999999',
      relation: 'Amigo',
    });
    assert.equal(vinculo.statusCode, 201, vinculo.body);
    assert.equal(
      (await chamar('GET', '/api/guardians/protected', guardiao.token)).json().protectedUser.id,
      String(protegida.id),
    );
    const inicioLocalizacao = await chamar('POST', '/api/localizacao/iniciar', protegida.token, {
      latitude: -23.5,
      longitude: -46.6,
      capturadoEm: Date.now(),
    });
    assert.equal(inicioLocalizacao.statusCode, 200, inicioLocalizacao.body);
    const idCompartilhamento = inicioLocalizacao.json().idCompartilhamento;
    assert.equal(
      (
        await chamar('PUT', '/api/localizacao', protegida.token, {
          idCompartilhamento,
          latitude: -23.51,
          longitude: -46.61,
          capturadoEm: Date.now(),
        })
      ).statusCode,
      200,
    );
    assert.equal(
      (
        await chamar('PUT', '/api/localizacao', protegida.token, {
          idCompartilhamento,
          latitude: 200,
          longitude: 1,
          capturadoEm: Date.now(),
        })
      ).statusCode,
      400,
    );
    assert.equal(
      (
        await chamar('PUT', '/api/localizacao', outra.token, {
          idCompartilhamento,
          latitude: -23.51,
          longitude: -46.61,
          capturadoEm: Date.now(),
        })
      ).statusCode,
      409,
    );
    assert.equal(
      (
        await chamar('POST', '/api/localizacao/iniciar', guardiao.token, {
          latitude: -23.51,
          longitude: -46.61,
          capturadoEm: Date.now(),
        })
      ).statusCode,
      403,
    );
    assert.equal(
      (await chamar('GET', '/api/localizacao', guardiao.token)).json().localizacoes.length,
      1,
    );
    assert.equal(
      (await chamar('GET', '/api/localizacao', outra.token)).json().localizacoes.length,
      0,
    );
    assert.equal((await chamar('DELETE', '/api/localizacao', protegida.token)).statusCode, 200);
    // Um pacote que chega depois de parar nunca recria o compartilhamento.
    assert.equal(
      (
        await chamar('PUT', '/api/localizacao', protegida.token, {
          idCompartilhamento,
          latitude: -23.52,
          longitude: -46.62,
          capturadoEm: Date.now(),
        })
      ).statusCode,
      409,
    );

    assert.equal(
      (await chamar('GET', '/api/localizacao', guardiao.token)).json().localizacoes.length,
      0,
    );
    const alertas = await Promise.all([
      chamar('POST', '/api/sos', protegida.token),
      chamar('POST', '/api/sos', protegida.token),
    ]);
    assert.equal(alertas[0].statusCode, 201, alertas[0].body);
    assert.equal(alertas[0].json().idAlertaSos, alertas[1].json().idAlertaSos);
    const idAlerta = alertas[0].json().idAlertaSos;
    assert.equal((await chamar('GET', '/api/sos', guardiao.token)).json().alertas.length, 1);
    assert.equal(
      (await chamar('PATCH', `/api/sos/${idAlerta}/encerrar`, outra.token)).statusCode,
      404,
    );
    assert.equal(
      (await chamar('PATCH', `/api/sos/${idAlerta}/encerrar`, protegida.token)).statusCode,
      200,
    );
    assert.equal(
      (await chamar('GET', '/api/sos', guardiao.token)).json().alertas[0].status,
      'encerrado',
    );
    assert.equal(
      (await chamar('DELETE', `/api/guardians/${vinculo.json().guardian.id}`, protegida.token))
        .statusCode,
      200,
    );
    assert.equal((await chamar('GET', '/api/sos', guardiao.token)).json().alertas.length, 0);
    assert.equal(
      (await chamar('DELETE', `/api/diario/${idNota}`, protegida.token)).statusCode,
      200,
    );
    await chamar('POST', '/api/auth/password/forgot', undefined, { email: protegida.email });
    await executar(
      "UPDATE tbCodigoAcesso SET codigoHash = ? WHERE idUsuario = ? AND finalidade = 'senha'",
      [await bcrypt.hash('654321', 4), protegida.id],
    );
    for (let tentativa = 0; tentativa < 5; tentativa++)
      assert.equal(
        (
          await chamar('POST', '/api/auth/password/reset', undefined, {
            email: protegida.email,
            code: '000000',
            password: 'Nova@12345',
          })
        ).statusCode,
        400,
      );
    assert.equal(
      (
        await chamar('POST', '/api/auth/password/reset', undefined, {
          email: protegida.email,
          code: '654321',
          password: 'Nova@12345',
        })
      ).statusCode,
      400,
    );
    await chamar('POST', '/api/auth/password/forgot', undefined, { email: protegida.email });
    await executar(
      "UPDATE tbCodigoAcesso SET codigoHash = ? WHERE idUsuario = ? AND finalidade = 'senha'",
      [await bcrypt.hash('654321', 4), protegida.id],
    );
    assert.equal(
      (
        await chamar('POST', '/api/auth/password/reset', undefined, {
          email: protegida.email,
          code: '654321',
          password: 'Nova@12345',
        })
      ).statusCode,
      200,
    );
    assert.equal((await chamar('GET', '/api/users/me', protegida.token)).statusCode, 401);
    const [armazenada] = await consultar<{ senha: string }>(
      'SELECT senha FROM tbUsuario WHERE idUsuario = ?',
      [protegida.id],
    );
    assert.notEqual(armazenada.senha, 'Nova@12345');
    assert.ok(await bcrypt.compare('Nova@12345', armazenada.senha));
  } finally {
    if (administradoresAnteriores === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = administradoresAnteriores;
    for (const id of ids) await executar('DELETE FROM tbUsuario WHERE idUsuario = ?', [id]);
    await app.close();
    await banco.end();
  }
});
