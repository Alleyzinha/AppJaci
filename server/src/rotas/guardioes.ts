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

const selecao = `SELECT CAST(idGuardiao AS CHAR) AS id, CAST(idUsuario AS CHAR) AS protectedUserId,
  nome AS name, email, telefone AS phone, parentesco AS relation, observacao AS observation,
  disponibilidade AS availability, cep, criadoEm AS createdAt FROM tbGuardiao`;

export async function rotasGuardioes(app: FastifyInstance) {
  app.get('/api/guardians', { preHandler: apenasProtegida }, async (req) => ({
    guardians: await consultar(`${selecao} WHERE idUsuario = ? ORDER BY criadoEm DESC`, [
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
    const [guardian] = await consultar(`${selecao} WHERE idGuardiao = ?`, [resultado.insertId]);
    return reply.code(201).send({ guardian });
  });
  app.get('/api/guardians/protected', { preHandler: autenticar }, async (req) => {
    if (req.usuario.perfil !== 'guardiao')
      throw new ErroHttp(403, 'Esta consulta é exclusiva de guardiões.');
    const usuarios = await consultar<Usuario>(
      `SELECT u.* FROM tbUsuario u JOIN tbGuardiao g ON g.idUsuario = u.idUsuario WHERE g.idContaGuardiao = ? AND g.status = 'ativo' ORDER BY g.idGuardiao`,
      [req.usuario.idUsuario],
    );
    return {
      protectedUser: usuarios[0] ? usuarioPublico(usuarios[0]) : null,
      protectedUsers: usuarios.map(usuarioPublico),
    };
  });
  app.delete('/api/guardians/:id', { preHandler: apenasProtegida }, async (req) => {
    const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params);
    const resultado = await executar(
      'DELETE FROM tbGuardiao WHERE idGuardiao = ? AND idUsuario = ?',
      [id, req.usuario.idUsuario],
    );
    if (!resultado.affectedRows) throw new ErroHttp(404, 'Guardião não encontrado.');
    return { ok: true };
  });
}
