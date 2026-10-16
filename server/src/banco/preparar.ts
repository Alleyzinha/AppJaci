import { readFile } from 'node:fs/promises';
import mysql, { type RowDataPacket } from 'mysql2/promise';
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
      [
        '001_estrutura.sql',
        '002_chat.sql',
        '003_modelo_bdJaci.sql',
        '004_recursos_seguranca.sql',
        '005_notificacoes.sql',
      ].map((arquivo) => readFile(new URL(`../../banco/${arquivo}`, import.meta.url), 'utf8')),
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
  const [colunas] = await conexao.query<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbAlertaSos' AND COLUMN_NAME IN ('data', 'hora')`,
    [nome],
  );
  const nomesColunas = new Set(colunas.map((coluna) => String(coluna.COLUMN_NAME)));
  if (!nomesColunas.has('data'))
    await conexao.query('ALTER TABLE tbAlertaSos ADD COLUMN data DATE NULL');
  if (!nomesColunas.has('hora'))
    await conexao.query('ALTER TABLE tbAlertaSos ADD COLUMN hora TIME NULL');
  await conexao.query(
    'UPDATE tbAlertaSos SET data = DATE(dataHora), hora = TIME(dataHora) WHERE data IS NULL OR hora IS NULL',
  );
  await conexao.query(
    'ALTER TABLE tbAlertaSos MODIFY COLUMN data DATE NOT NULL, MODIFY COLUMN hora TIME NOT NULL',
  );
  const [colunasCheckin] = await conexao.query<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbCheckin' AND COLUMN_NAME = 'alertaAtrasoEnviadoEm'`,
    [nome],
  );
  if (colunasCheckin.length === 0)
    await conexao.query('ALTER TABLE tbCheckin ADD COLUMN alertaAtrasoEnviadoEm DATETIME(3) NULL');
  console.info(`Banco ${nome} preparado com sucesso.`);
} finally {
  await conexao.end();
  await banco.end();
}
