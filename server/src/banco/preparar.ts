import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { banco, configuracaoBanco } from './conexao.js';

const nome = configuracaoBanco.database;
if (!/^[A-Za-z0-9_]+$/.test(nome))
  throw new Error('DB_NAME deve conter apenas letras, números e sublinhado.');
const conexao = await mysql.createConnection({ ...configuracaoBanco, database: undefined });
try {
  await conexao.query(
    `CREATE DATABASE IF NOT EXISTS \`${nome}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await conexao.changeUser({ database: nome });
  const sql = (
    await Promise.all(
      ['001_estrutura.sql', '002_chat.sql'].map((arquivo) =>
        readFile(new URL(`../../banco/${arquivo}`, import.meta.url), 'utf8'),
      ),
    )
  ).join('\n');
  // O arquivo contém somente DDL controlado pelo projeto, sem SQL recebido da API.
  for (const comando of sql
    .replace(/--[^\n]*/g, '')
    .split(';')
    .map((parte) => parte.trim())
    .filter(Boolean)) {
    await conexao.query(comando);
  }
  console.info(`Banco ${nome} preparado com sucesso.`);
} finally {
  await conexao.end();
  await banco.end();
}
