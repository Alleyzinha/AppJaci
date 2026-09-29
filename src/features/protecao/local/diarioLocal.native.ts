import { Directory, File, Paths } from 'expo-file-system';
import type {
  AnexoRascunhoLocal,
  DadosRegistroLocal,
  RegistroLocalDiario,
} from './diarioLocal.types';

type RegistroPersistido = Omit<RegistroLocalDiario, 'anexos'> & {
  anexos: Array<Omit<AnexoRascunhoLocal, 'arquivoWeb' | 'disponivel'>>;
};

function diretorioDoUsuario(donoId: string) {
  const idSeguro = donoId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!idSeguro) throw new Error('Não foi possível identificar a conta deste diário.');
  const diretorio = new Directory(Paths.document, 'jaci-diario', idSeguro);
  diretorio.create({ intermediates: true, idempotent: true });
  return diretorio;
}

function arquivoManifesto(donoId: string) {
  return new File(diretorioDoUsuario(donoId), 'registros.json');
}

async function lerRegistros(donoId: string): Promise<RegistroPersistido[]> {
  const arquivo = arquivoManifesto(donoId);
  if (!arquivo.exists) return [];
  try {
    const registros = JSON.parse(await arquivo.text());
    return Array.isArray(registros)
      ? registros.filter((item) => item?.donoId === donoId && Array.isArray(item.anexos))
      : [];
  } catch {
    throw new Error('Não foi possível ler os registros guardados neste aparelho.');
  }
}

function uriAnexo(donoId: string, anexo: AnexoRascunhoLocal) {
  const diretorio = diretorioDoUsuario(donoId);
  const extensao =
    anexo.nomeArquivo.match(/\.[a-zA-Z0-9]{1,8}$/)?.[0] ||
    anexo.uri.match(/\.[a-zA-Z0-9]{1,8}(?:\?|$)/)?.[0]?.replace('?', '');
  const padrao = anexo.tipo === 'photo' ? '.jpg' : anexo.tipo === 'video' ? '.mp4' : '.m4a';
  const nome = `${anexo.id.replace(/[^a-zA-Z0-9_-]/g, '')}${extensao || padrao}`;
  return new File(diretorio, nome);
}

async function escreverManifesto(donoId: string, registros: RegistroPersistido[]) {
  const manifesto = arquivoManifesto(donoId);
  manifesto.create({ intermediates: true, overwrite: true });
  manifesto.write(JSON.stringify(registros));
}

export async function listarRegistrosLocais(donoId: string): Promise<RegistroLocalDiario[]> {
  const registros = await lerRegistros(donoId);
  return registros.map((registro) => ({
    ...registro,
    anexos: registro.anexos.map((anexo) => ({
      ...anexo,
      disponivel: new File(anexo.uri).exists,
      persistido: true,
    })),
  }));
}

export async function salvarRegistroLocal(
  donoId: string,
  dados: DadosRegistroLocal,
): Promise<RegistroLocalDiario> {
  const registros = await lerRegistros(donoId);
  const id =
    dados.id || `registro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const anterior = registros.find((item) => item.id === id);
  const arquivosNovos: File[] = [];
  const anexos = [];

  try {
    for (const anexo of dados.anexos) {
      if (anexo.persistido) {
        anexos.push({
          id: anexo.id,
          tipo: anexo.tipo,
          nomeArquivo: anexo.nomeArquivo,
          tipoMime: anexo.tipoMime,
          uri: anexo.uri,
          tamanhoBytes: anexo.tamanhoBytes,
          duracaoMs: anexo.duracaoMs,
          persistido: true,
        });
        continue;
      }

      const origem = new File(anexo.uri);
      if (!origem.exists)
        throw new Error(`O arquivo “${anexo.nomeArquivo}” não está mais disponível.`);
      const destino = uriAnexo(donoId, anexo);
      origem.copy(destino);
      arquivosNovos.push(destino);
      anexos.push({
        id: anexo.id,
        tipo: anexo.tipo,
        nomeArquivo: anexo.nomeArquivo,
        tipoMime: anexo.tipoMime,
        uri: destino.uri,
        tamanhoBytes: destino.size || anexo.tamanhoBytes,
        duracaoMs: anexo.duracaoMs,
        persistido: true,
      });
    }

    const registro: RegistroPersistido = {
      id,
      donoId,
      mensagem: dados.mensagem.trim(),
      criadoEm: anterior?.criadoEm || new Date().toISOString(),
      anexos,
    };
    const atualizados = [registro, ...registros.filter((item) => item.id !== id)];
    await escreverManifesto(donoId, atualizados);

    const idsMantidos = new Set(anexos.map((anexo) => anexo.id));
    for (const antigo of anterior?.anexos || []) {
      if (!idsMantidos.has(antigo.id)) {
        const arquivo = new File(antigo.uri);
        if (arquivo.exists) arquivo.delete();
      }
    }
    return {
      ...registro,
      anexos: registro.anexos.map((anexo) => ({ ...anexo, disponivel: true })),
    };
  } catch (erro) {
    for (const arquivo of arquivosNovos) {
      if (arquivo.exists) arquivo.delete();
    }
    if (erro instanceof Error) throw erro;
    throw new Error('Não foi possível guardar este registro neste aparelho.');
  }
}

export async function excluirRegistroLocal(donoId: string, id: string): Promise<void> {
  const registros = await lerRegistros(donoId);
  const removido = registros.find((item) => item.id === id);
  if (!removido) return;
  await escreverManifesto(
    donoId,
    registros.filter((item) => item.id !== id),
  );
  for (const anexo of removido.anexos) {
    const arquivo = new File(anexo.uri);
    if (arquivo.exists) arquivo.delete();
  }
}

export async function liberarPreviewsLocais(_registros: RegistroLocalDiario[]) {
  // URIs file:// persistentes pertencem ao sandbox do app e não precisam ser revogadas.
}

export async function liberarAnexosRascunho(anexos: AnexoRascunhoLocal[]) {
  for (const anexo of anexos) {
    if (anexo.temporarioApp && anexo.uri.startsWith('file://')) {
      try {
        const arquivo = new File(anexo.uri);
        if (arquivo.exists) arquivo.delete();
      } catch {
        // A falha ao limpar cache não deve impedir o registro local já concluído.
      }
    }
  }
}
