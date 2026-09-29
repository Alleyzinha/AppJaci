import { randomInt } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { consultar, executar, transacao } from '../banco/conexao.js';
import {
  autenticar,
  ErroHttp,
  tokenPara,
  usuarioPublico,
  validarToken,
  type Usuario,
} from '../seguranca.js';

const email = z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(100);
const senha = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(72)
  .refine((valor) => Buffer.byteLength(valor, 'utf8') <= 72, 'A senha deve ter até 72 bytes.')
  .regex(/[A-Z]/, 'Inclua uma letra maiúscula.')
  .regex(/[a-z]/, 'Inclua uma letra minúscula.')
  .regex(/[0-9]/, 'Inclua um número.')
  .regex(/[^A-Za-z0-9]/, 'Inclua um símbolo.');
const codigo = z.string().regex(/^\d{6}$/, 'Informe o código de seis dígitos.');
type Codigo = { idCodigo: number; codigoHash: string; expiraEm: Date; tentativas: number };

type FinalidadeCodigo = 'email' | 'senha' | 'pin';

export async function rotasAutenticacao(app: FastifyInstance) {
  async function enviarCodigo(usuario: Usuario, finalidade: FinalidadeCodigo) {
    const valor = String(randomInt(100000, 1000000));
    const hash = await bcrypt.hash(valor, 10);
    const validade = new Date(Date.now() + 900000);
    await executar(
      `INSERT INTO tbCodigoAcesso (idUsuario, finalidade, codigoHash, expiraEm)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE codigoHash = ?, expiraEm = ?, tentativas = 0`,
      [usuario.idUsuario, finalidade, hash, validade, hash, validade],
    );
    if (!process.env.SMTP_HOST) {
      if (process.env.NODE_ENV === 'production')
        throw new ErroHttp(503, 'Envio de e-mail indisponível.');
      app.log.info(
        { email: usuario.email, codigo: valor },
        'Código de desenvolvimento (não usar em produção)',
      );
      return;
    }
    const transporte = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transporte.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: usuario.email,
      subject:
        finalidade === 'email'
          ? 'Confirme seu e-mail na Jaci'
          : finalidade === 'pin'
            ? 'Autorização para mudar seu PIN na Jaci'
            : 'Recuperação de senha Jaci',
      text: `Seu código Jaci é ${valor}. Ele expira em 15 minutos.`,
    });
  }

  async function consumirCodigo(
    endereco: string,
    valor: string,
    finalidade: FinalidadeCodigo,
    novaSenha?: string,
  ) {
    const resultado = await transacao(async (conexao) => {
      const [usuario] = await consultar<Usuario>(
        'SELECT * FROM tbUsuario WHERE email = ? FOR UPDATE',
        [endereco],
        conexao,
      );
      if (!usuario) return null;
      const [registro] = await consultar<Codigo>(
        'SELECT * FROM tbCodigoAcesso WHERE idUsuario = ? AND finalidade = ? FOR UPDATE',
        [usuario.idUsuario, finalidade],
        conexao,
      );
      if (!registro || registro.expiraEm < new Date() || registro.tentativas >= 5) return null;
      if (!(await bcrypt.compare(valor, registro.codigoHash))) {
        await executar(
          'UPDATE tbCodigoAcesso SET tentativas = tentativas + 1 WHERE idCodigo = ?',
          [registro.idCodigo],
          conexao,
        );
        return null;
      }
      if (finalidade === 'email') {
        await executar(
          'UPDATE tbUsuario SET emailConfirmadoEm = ? WHERE idUsuario = ?',
          [new Date(), usuario.idUsuario],
          conexao,
        );
      } else if (finalidade === 'senha') {
        await executar(
          'UPDATE tbUsuario SET senha = ?, versaoSessao = versaoSessao + 1 WHERE idUsuario = ?',
          [novaSenha!, usuario.idUsuario],
          conexao,
        );
      }
      // finalidade 'pin' não altera nada aqui: o novo PIN é gravado na rota dedicada.
      await executar('DELETE FROM tbCodigoAcesso WHERE idCodigo = ?', [registro.idCodigo], conexao);
      return usuario;
    });
    if (!resultado)
      throw new ErroHttp(400, 'Código inválido, expirado ou bloqueado. Solicite outro código.');
    return resultado;
  }

  app.post(
    '/api/auth/register',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } } },
    async (req, reply) => {
      const dados = z
        .object({
          name: z.string().trim().min(2).max(100),
          email,
          phone: z.string().trim().min(8).max(30),
          password: senha,
          profile: z.enum(['protegida', 'guardiao']),
        })
        .parse(req.body);
      const [existente] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE email = ?', [
        dados.email,
      ]);
      if (existente) {
        if (existente.emailConfirmadoEm)
          throw new ErroHttp(409, 'Este e-mail já está cadastrado. Faça login.');
        // O cadastro público nunca substitui a senha de uma conta existente.
        await enviarCodigo(existente, 'email');
        return reply.code(200).send({ requiresEmailVerification: true });
      }
      const resultado = await executar(
        'INSERT INTO tbUsuario (nome, email, telefone, senha, perfil) VALUES (?, ?, ?, ?, ?)',
        [
          dados.name,
          dados.email,
          dados.phone,
          await bcrypt.hash(dados.password, 12),
          dados.profile,
        ],
      );
      const [usuario] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE idUsuario = ?', [
        resultado.insertId,
      ]);
      await enviarCodigo(usuario, 'email');
      return reply
        .code(201)
        .send({ user: usuarioPublico(usuario), requiresEmailVerification: true });
    },
  );

  app.post('/api/auth/email/verify', async (req) => {
    const dados = z.object({ email, code: codigo }).parse(req.body);
    const usuario = await consumirCodigo(dados.email, dados.code, 'email');
    return { user: usuarioPublico(usuario), setupToken: tokenPara(usuario, 'pin') };
  });
  app.post(
    '/api/auth/email/resend',
    { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (req) => {
      const dados = z.object({ email }).parse(req.body);
      const [usuario] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE email = ?', [
        dados.email,
      ]);
      if (usuario && !usuario.emailConfirmadoEm) await enviarCodigo(usuario, 'email');
      return { ok: true };
    },
  );
  app.post('/api/auth/pin/setup', async (req) => {
    const dados = z
      .object({
        setupToken: z.string(),
        pin: z.string().regex(/^\d{4}$/, 'O PIN deve possuir quatro dígitos.'),
      })
      .parse(req.body);
    const token = validarToken(dados.setupToken, 'pin');
    const resultado = await executar(
      'UPDATE tbUsuario SET pinHash = ? WHERE idUsuario = ? AND pinHash IS NULL AND emailConfirmadoEm IS NOT NULL AND versaoSessao = ?',
      [await bcrypt.hash(dados.pin, 12), token.sub!, token.versao],
    );
    if (!resultado.affectedRows)
      throw new ErroHttp(409, 'PIN já configurado ou autorização expirada.');
    return { ok: true };
  });
  app.post(
    '/api/auth/pin/verify',
    { preHandler: autenticar, config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    async (req) => {
      const { pin } = z.object({ pin: z.string().regex(/^\d{4}$/) }).parse(req.body);
      if (!req.usuario.pinHash)
        throw new ErroHttp(409, 'Configure seu PIN em Configurações > Mudar PIN.');
      if (!(await bcrypt.compare(pin, req.usuario.pinHash)))
        throw new ErroHttp(403, 'PIN incorreto. Tente novamente.');
      return { ok: true };
    },
  );
  app.post(
    '/api/auth/pin/change/request',
    { preHandler: autenticar, config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (req) => {
      await enviarCodigo(req.usuario, 'pin');
      return { ok: true };
    },
  );
  app.post('/api/auth/pin/change', { preHandler: autenticar }, async (req) => {
    const dados = z
      .object({
        code: codigo,
        pin: z.string().regex(/^\d{4}$/, 'O PIN deve possuir quatro dígitos.'),
      })
      .parse(req.body);
    const usuario = await consumirCodigo(req.usuario.email, dados.code, 'pin');
    await executar('UPDATE tbUsuario SET pinHash = ? WHERE idUsuario = ?', [
      await bcrypt.hash(dados.pin, 12),
      req.usuario.idUsuario,
    ]);
    return { ok: true, user: usuarioPublico(usuario) };
  });
  app.post(
    '/api/auth/password/forgot',
    { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (req) => {
      const dados = z.object({ email }).parse(req.body);
      const [usuario] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE email = ?', [
        dados.email,
      ]);
      if (usuario) await enviarCodigo(usuario, 'senha');
      return { ok: true };
    },
  );
  app.post('/api/auth/password/reset', async (req) => {
    const dados = z.object({ email, code: codigo, password: senha }).parse(req.body);
    await consumirCodigo(dados.email, dados.code, 'senha', await bcrypt.hash(dados.password, 12));
    return { ok: true };
  });
  app.post(
    '/api/auth/login',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } } },
    async (req) => {
      const dados = z.object({ email, password: z.string().min(1).max(100) }).parse(req.body);
      const [usuario] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE email = ?', [
        dados.email,
      ]);
      if (!usuario || !(await bcrypt.compare(dados.password, usuario.senha)))
        throw new ErroHttp(401, 'E-mail ou senha inválidos.');
      if (!usuario.emailConfirmadoEm)
        throw new ErroHttp(403, 'Confirme seu e-mail antes de entrar.');
      return { accessToken: tokenPara(usuario), user: usuarioPublico(usuario) };
    },
  );
  app.get('/api/users/me', { preHandler: autenticar }, async (req) => ({
    user: usuarioPublico(req.usuario),
  }));
  app.patch('/api/users/me', { preHandler: autenticar }, async (req) => {
    const dados = z
      .object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().min(8).max(30) })
      .parse(req.body);
    await executar('UPDATE tbUsuario SET nome = ?, telefone = ? WHERE idUsuario = ?', [
      dados.name,
      dados.phone,
      req.usuario.idUsuario,
    ]);
    return { user: usuarioPublico({ ...req.usuario, nome: dados.name, telefone: dados.phone }) };
  });
}
