import type {
  AnexoRascunhoLocal,
  DadosRegistroLocal,
  RegistroLocalDiario,
} from './diarioLocal.types';

const DB_NAME = 'jaci-diario-local';
const DB_VERSION = 1;

type AnexoNoBanco = Omit<AnexoRascunhoLocal, 'uri' | 'arquivoWeb' | 'disponivel' | 'persistido'> & {
  blob: Blob;
};
type RegistroNoBanco = Omit<RegistroLocalDiario, 'anexos'> & { anexos: AnexoNoBanco[] };

function abrirBanco(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const requisicao = indexedDB.open(DB_NAME, DB_VERSION);
    requisicao.onupgradeneeded = () => {
      if (!requisicao.result.objectStoreNames.contains('registros')) {
        requisicao.result.createObjectStore('registros', { keyPath: 'id' });
      }
    };
    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () =>
      reject(new Error('Não foi possível abrir o armazenamento local do navegador.'));
  });
}

async function lerTodos(): Promise<RegistroNoBanco[]> {
  const banco = await abrirBanco();
  return new Promise((resolve, reject) => {
    const transacao = banco.transaction('registros', 'readonly');
    const requisicao = transacao.objectStore('registros').getAll();
    requisicao.onsuccess = () => resolve(requisicao.result || []);
    requisicao.onerror = () =>
      reject(new Error('Não foi possível ler os registros deste navegador.'));
    transacao.oncomplete = () => banco.close();
    transacao.onerror = () => banco.close();
  });
}

async function gravar(registro: RegistroNoBanco) {
  const banco = await abrirBanco();
  return new Promise<void>((resolve, reject) => {
    const transacao = banco.transaction('registros', 'readwrite');
    transacao.objectStore('registros').put(registro);
    transacao.oncomplete = () => {
      banco.close();
      resolve();
    };
    transacao.onerror = () => {
      banco.close();
      reject(new Error('Não foi possível guardar este registro no navegador.'));
    };
    transacao.onabort = () => {
      banco.close();
      reject(new Error('O navegador cancelou o armazenamento deste registro.'));
    };
  });
}

async function apagar(id: string) {
  const banco = await abrirBanco();
  return new Promise<void>((resolve, reject) => {
    const transacao = banco.transaction('registros', 'readwrite');
    transacao.objectStore('registros').delete(id);
    transacao.oncomplete = () => {
      banco.close();
      resolve();
    };
    transacao.onerror = () => {
      banco.close();
      reject(new Error('Não foi possível remover este registro do navegador.'));
    };
  });
}

function criarUris(registro: RegistroNoBanco): RegistroLocalDiario {
  return {
    ...registro,
    anexos: registro.anexos.map(({ blob, ...anexo }) => ({
      ...anexo,
      uri: URL.createObjectURL(blob),
      tamanhoBytes: blob.size || anexo.tamanhoBytes,
      persistido: true,
      disponivel: blob.size > 0,
    })),
  };
}

export async function listarRegistrosLocais(donoId: string): Promise<RegistroLocalDiario[]> {
  const registros = (await lerTodos())
    .filter((registro) => registro.donoId === donoId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  return registros.map(criarUris);
}

export async function salvarRegistroLocal(
  donoId: string,
  dados: DadosRegistroLocal,
): Promise<RegistroLocalDiario> {
  const id =
    dados.id || `registro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const anterior = (await lerTodos()).find(
    (registro) => registro.id === id && registro.donoId === donoId,
  );
  const anexos: AnexoNoBanco[] = [];

  try {
    for (const anexo of dados.anexos) {
      const existente = anexo.persistido
        ? anterior?.anexos.find((item) => item.id === anexo.id)
        : undefined;
      const blob =
        existente?.blob ||
        anexo.arquivoWeb ||
        (await fetch(anexo.uri).then((resposta) => resposta.blob()));
      if (!blob.size) throw new Error(`O arquivo “${anexo.nomeArquivo}” não está mais disponível.`);
      anexos.push({
        id: anexo.id,
        tipo: anexo.tipo,
        nomeArquivo: anexo.nomeArquivo,
        tipoMime: anexo.tipoMime || blob.type || 'application/octet-stream',
        tamanhoBytes: blob.size,
        duracaoMs: anexo.duracaoMs,
        blob,
      });
    }

    const registro: RegistroNoBanco = {
      id,
      donoId,
      mensagem: dados.mensagem.trim(),
      criadoEm: anterior?.criadoEm || new Date().toISOString(),
      anexos,
    };
    await gravar(registro);
    return criarUris(registro);
  } catch (erro) {
    if (erro instanceof Error) throw erro;
    throw new Error('Não foi possível guardar este registro no navegador.');
  }
}

export async function excluirRegistroLocal(donoId: string, id: string): Promise<void> {
  const registro = (await lerTodos()).find((item) => item.id === id && item.donoId === donoId);
  if (registro) await apagar(id);
}

export async function liberarPreviewsLocais(registros: RegistroLocalDiario[]) {
  for (const registro of registros) {
    for (const anexo of registro.anexos) {
      if (anexo.uri.startsWith('blob:')) URL.revokeObjectURL(anexo.uri);
    }
  }
}

export async function liberarAnexosRascunho(anexos: AnexoRascunhoLocal[]) {
  for (const anexo of anexos) {
    if (anexo.temporarioApp && anexo.uri.startsWith('blob:')) URL.revokeObjectURL(anexo.uri);
  }
}
