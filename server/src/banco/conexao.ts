import 'dotenv/config';
import mysql, {
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
  type ExecuteValues,
} from 'mysql2/promise';

export const configuracaoBanco = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'jaci',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bdJaci',
  charset: 'utf8mb4',
  timezone: 'Z',
};

export const banco = mysql.createPool({
  ...configuracaoBanco,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 100,
});

// timezone no driver converte datas; a sessão SQL também precisa gravar em UTC.
banco.on('connection', (conexao) => {
  conexao.query("SET time_zone = '+00:00'");
});
export type Executor = typeof banco | PoolConnection;

export async function consultar<T>(
  sql: string,
  parametros: ExecuteValues[] = [],
  executor: Executor = banco,
): Promise<T[]> {
  const [linhas] = await executor.execute<RowDataPacket[]>(sql, parametros);
  return linhas as T[];
}

export async function executar(
  sql: string,
  parametros: ExecuteValues[] = [],
  executor: Executor = banco,
) {
  const [resultado] = await executor.execute<ResultSetHeader>(sql, parametros);
  return resultado;
}

export async function transacao<T>(operacao: (conexao: PoolConnection) => Promise<T>) {
  const conexao = await banco.getConnection();
  try {
    await conexao.beginTransaction();
    const resultado = await operacao(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}
