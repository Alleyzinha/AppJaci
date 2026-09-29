import type { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { consultar } from './banco/conexao.js';

export type Usuario = {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  pinHash: string | null;
  perfil: 'protegida' | 'guardiao';
  emailConfirmadoEm: Date | null;
  versaoSessao: number;
};
declare module 'fastify' {
  interface FastifyRequest {
    usuario: Usuario;
  }
}

export class ErroHttp extends Error {
  constructor(
    public statusCode: number,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

export function segredo() {
  const valor = process.env.JWT_SECRET;
  if (!valor || valor.length < 32 || valor.startsWith('troque-'))
    throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres aleatórios.');
  return valor;
}

export function tokenPara(usuario: Usuario, finalidade = 'sessao') {
  return jwt.sign(
    { profile: usuario.perfil, versao: usuario.versaoSessao, finalidade },
    segredo(),
    {
      subject: String(usuario.idUsuario),
      expiresIn: finalidade === 'pin' ? '15m' : '2h',
      algorithm: 'HS256',
    },
  );
}

export function validarToken(token: string, finalidade: string) {
  try {
    const dados = jwt.verify(token, segredo(), { algorithms: ['HS256'] });
    if (typeof dados === 'string' || dados.finalidade !== finalidade || !dados.sub)
      throw new Error();
    return dados;
  } catch {
    throw new ErroHttp(401, 'Sessão inválida ou expirada.');
  }
}

export async function autenticar(requisicao: FastifyRequest) {
  const cabecalho = requisicao.headers.authorization;
  if (!cabecalho?.startsWith('Bearer ')) throw new ErroHttp(401, 'Faça login para continuar.');
  const dados = validarToken(cabecalho.slice(7), 'sessao');
  const [usuario] = await consultar<Usuario>('SELECT * FROM tbUsuario WHERE idUsuario = ?', [
    dados.sub!,
  ]);
  if (!usuario?.emailConfirmadoEm || usuario.versaoSessao !== dados.versao)
    throw new ErroHttp(401, 'Sessão inválida ou expirada.');
  requisicao.usuario = usuario;
}

export async function apenasProtegida(requisicao: FastifyRequest) {
  await autenticar(requisicao);
  if (requisicao.usuario.perfil !== 'protegida')
    throw new ErroHttp(403, 'Esta ação está disponível apenas para protegidas.');
}

// O contrato existente do aplicativo usa inglês; o banco e os novos módulos usam português.
export function usuarioPublico(usuario: Usuario) {
  return {
    id: String(usuario.idUsuario),
    name: usuario.nome,
    email: usuario.email,
    phone: usuario.telefone,
    profile: usuario.perfil,
  };
}
