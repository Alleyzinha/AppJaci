import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { consultar, executar } from '../banco/conexao.js';
import {
  apenasProtegida,
  autenticar,
  ErroHttp,
  usuarioPublico,
  type Usuario,
} from '../seguranca.js';

const selecao = `SELECT CAST(g.idGuardiao AS CHAR) AS id, CAST(p.idUsuario AS CHAR) AS protectedUserId,
  g.nome AS name, g.email, g.telefone AS phone, g.parentesco AS relation, g.observacao AS observation,
  g.disponibilidade AS availability, g.cep, g.criadoEm AS createdAt FROM tbGuardiao g
  JOIN tbVinculo v ON v.idGuardiao = g.idGuardiao AND v.status = 'Ativo'
  JOIN tbProtegida p ON p.idProtegida = v.idProtegida`;

export async function rotasGuardioes(app: FastifyInstance) {
  app.get('/api/guardians', { preHandler: apenasProtegida }, async (req) => ({
    guardians: await consultar(`${selecao} WHERE p.idUsuario = ? ORDER BY g.criadoEm DESC`, [
      req.usuario.idUsuario,
    ]),
  }));
  app.post('/api/guardians', { preHandler: apenasProtegida }, async (req, reply) => {
    const dados = z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().toLowerCase().email().max(100),
        phone: z.string().trim().min(8).max(30),
        relation: z.string().trim().min(2).max(100),
        observation: z.string().trim().max(500).optional(),
        availability: z.string().trim().max(100).default('Não informada'),
        cep: z
          .string()
          .regex(/^\d{5}-?\d{3}$/)
          .optional(),
      })
      .parse(req.body);
    const [conta] = await consultar<Usuario>(
      "SELECT * FROM tbUsuario WHERE email = ? AND perfil = 'guardiao' AND emailConfirmadoEm IS NOT NULL",
      [dados.email],
    );
    if (!conta)
      throw new ErroHttp(404, 'Não existe uma conta confirmada de guardião com esse e-mail.');
    const resultado = await executar(
      'INSERT INTO tbGuardiao (idUsuario, idContaGuardiao, nome, email, telefone, parentesco, observacao, disponibilidade, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        req.usuario.idUsuario,
        conta.idUsuario,
        dados.name,
        dados.email,
        dados.phone,
        dados.relation,
        dados.observation ?? null,
        dados.availability,
        dados.cep ?? null,
      ],
    );
    const [perfilProtegido] = await consultar<{ idProtegida: number }>(
      'SELECT idProtegida FROM tbProtegida WHERE idUsuario = ?',
      [req.usuario.idUsuario],
    );
    await executar(
      "INSERT INTO tbVinculo (idProtegida, idGuardiao, status) VALUES (?, ?, 'Ativo')",
      [perfilProtegido.idProtegida, resultado.insertId],
    );
    const [guardian] = await consultar(`${selecao} WHERE g.idGuardiao = ?`, [resultado.insertId]);
    return reply.code(201).send({ guardian });
  });
  app.get('/api/guardians/protected', { preHandler: autenticar }, async (req) => {
    if (req.usuario.perfil !== 'guardiao')
      throw new ErroHttp(403, 'Esta consulta é exclusiva de guardiões.');
    const usuarios = await consultar<Usuario>(
      `SELECT DISTINCT u.* FROM tbUsuario u
      JOIN tbProtegida p ON p.idUsuario = u.idUsuario
      JOIN tbVinculo v ON v.idProtegida = p.idProtegida AND v.status = 'Ativo'
      JOIN tbGuardiao g ON g.idGuardiao = v.idGuardiao
      WHERE (g.idContaGuardiao = ? OR LOWER(g.email) = LOWER(?)) AND g.status = 'ativo' ORDER BY u.idUsuario`,
      [req.usuario.idUsuario, req.usuario.email],
    );
    return {
      protectedUser: usuarios[0] ? usuarioPublico(usuarios[0]) : null,
      protectedUsers: usuarios.map(usuarioPublico),
    };
  });
  app.delete('/api/guardians/:id', { preHandler: apenasProtegida }, async (req) => {
    const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params);
    const resultado = await executar(
      'DELETE v FROM tbVinculo v JOIN tbProtegida p ON p.idProtegida = v.idProtegida WHERE v.idGuardiao = ? AND p.idUsuario = ?',
      [id, req.usuario.idUsuario],
    );
    if (!resultado.affectedRows) throw new ErroHttp(404, 'Guardião não encontrado.');
    await executar('DELETE FROM tbGuardiao WHERE idGuardiao = ?', [id]);
    return { ok: true };
  });
}
