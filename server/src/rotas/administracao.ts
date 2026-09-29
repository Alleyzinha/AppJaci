import { readFile } from 'node:fs/promises';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { consultar } from '../banco/conexao.js';
import { autenticar, ErroHttp } from '../seguranca.js';

export async function apenasAdministracao(requisicao: FastifyRequest) {
  await autenticar(requisicao);
  const autorizados = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!autorizados.includes(requisicao.usuario.email.toLowerCase())) {
    throw new ErroHttp(403, 'Sua conta não tem acesso ao painel administrativo.');
  }
}

export async function rotasAdministracao(app: FastifyInstance) {
  // Arquivos fixos: nenhuma parte do caminho é recebida da pessoa visitante.
  for (const [rota, arquivo, tipo] of [
    ['/admin', 'index.html', 'text/html; charset=utf-8'],
    ['/admin/', 'index.html', 'text/html; charset=utf-8'],
    ['/admin/painel.css', 'painel.css', 'text/css; charset=utf-8'],
    ['/admin/painel.js', 'painel.js', 'text/javascript; charset=utf-8'],
  ]) {
    app.get(rota, async (_req, reply) => {
      const conteudo = await readFile(new URL(`../../painel/${arquivo}`, import.meta.url), 'utf8');
      return reply.header('Cache-Control', 'no-store').type(tipo).send(conteudo);
    });
  }

  app.get('/api/admin/resumo', { preHandler: apenasAdministracao }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const [resumo] = await consultar<{
      total: number;
      protegidas: number | null;
      guardioes: number | null;
      pendentes: number | null;
    }>(`SELECT COUNT(*) AS total, SUM(perfil = 'protegida') AS protegidas,
      SUM(perfil = 'guardiao') AS guardioes,
      SUM(emailConfirmadoEm IS NULL) AS pendentes FROM tbUsuario`);
    return {
      administrador: { nome: req.usuario.nome },
      resumo: Object.fromEntries(
        Object.entries(resumo).map(([chave, valor]) => [chave, Number(valor || 0)]),
      ),
    };
  });

  app.get('/api/admin/usuarios', { preHandler: apenasAdministracao }, async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const filtros = z
      .object({
        busca: z.string().trim().max(100).default(''),
        perfil: z.enum(['todos', 'protegida', 'guardiao', 'administrador']).default('todos'),
        confirmacao: z.enum(['todos', 'confirmado', 'pendente']).default('todos'),
        pagina: z.coerce.number().int().min(1).max(100000).default(1),
      })
      .parse(req.query);
    const condicoes = ['(LOCATE(?, nome) > 0 OR LOCATE(?, email) > 0 OR LOCATE(?, telefone) > 0)'];
    const parametros = [filtros.busca, filtros.busca, filtros.busca];
    if (filtros.perfil !== 'todos') {
      condicoes.push('perfil = ?');
      parametros.push(filtros.perfil);
    }
    if (filtros.confirmacao !== 'todos')
      condicoes.push(
        `emailConfirmadoEm IS ${filtros.confirmacao === 'confirmado' ? 'NOT ' : ''}NULL`,
      );
    const onde = condicoes.join(' AND ');
    const [contagem] = await consultar<{ total: number }>(
      `SELECT COUNT(*) AS total FROM tbUsuario WHERE ${onde}`,
      parametros,
    );
    // Seleção explícita impede que novas colunas privadas apareçam no painel por acidente.
    const usuarios = await consultar(
      `SELECT idUsuario, nome, email, telefone, perfil,
      emailConfirmadoEm, criadoEm FROM tbUsuario WHERE ${onde}
      ORDER BY idUsuario DESC LIMIT 20 OFFSET ${(filtros.pagina - 1) * 20}`,
      parametros,
    );
    return { usuarios, total: Number(contagem.total), pagina: filtros.pagina, porPagina: 20 };
  });
}
