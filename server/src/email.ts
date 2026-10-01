import nodemailer, { type SendMailOptions } from 'nodemailer';
import { ErroHttp } from './seguranca.js';

export async function enviarEmail(opcoes: SendMailOptions) {
  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      transporte.sendMail(opcoes),
      new Promise<never>((_, reject) => {
        temporizador = setTimeout(() => reject(new Error('Tempo de envio esgotado.')), 10000);
      }),
    ]);
  } catch {
    throw new ErroHttp(
      503,
      'Não foi possível enviar o código de confirmação. Verifique a configuração de e-mail do servidor e tente novamente.',
    );
  } finally {
    clearTimeout(temporizador);
    transporte.close();
  }
}
