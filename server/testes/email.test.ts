import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { enviarEmail } from '../src/email.js';

test('falha de SMTP retorna erro recuperável e encerra o transporte', async () => {
  const fechar = mock.fn();
  const criar = mock.method(nodemailer, 'createTransport', () => ({
    sendMail: async () => {
      throw Object.assign(new Error('Credenciais recusadas'), { code: 'EAUTH' });
    },
    close: fechar,
  }));
  try {
    await assert.rejects(enviarEmail({ to: 'teste@example.com', text: 'Teste' }), {
      statusCode: 503,
    });
    assert.equal(fechar.mock.callCount(), 1);
  } finally {
    criar.mock.restore();
  }
});

test('envio de e-mail bem-sucedido encerra o transporte', async () => {
  const fechar = mock.fn();
  const enviar = mock.fn(async () => ({}));
  const criar = mock.method(nodemailer, 'createTransport', () => ({
    sendMail: enviar,
    close: fechar,
  }));
  try {
    await enviarEmail({ to: 'teste@example.com', text: 'Teste' });
    assert.equal(enviar.mock.callCount(), 1);
    assert.equal(fechar.mock.callCount(), 1);
  } finally {
    criar.mock.restore();
  }
});
