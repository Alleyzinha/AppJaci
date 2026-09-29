export type TipoAnexoLocal = 'photo' | 'video' | 'audio';

export interface AnexoRascunhoLocal {
  id: string;
  tipo: TipoAnexoLocal;
  nomeArquivo: string;
  tipoMime: string;
  uri: string;
  tamanhoBytes?: number;
  duracaoMs?: number;
  persistido?: boolean;
  temporarioApp?: boolean;
  disponivel?: boolean;
  arquivoWeb?: Blob;
}

export interface RegistroLocalDiario {
  id: string;
  donoId: string;
  mensagem: string;
  criadoEm: string;
  anexos: AnexoRascunhoLocal[];
}

export interface DadosRegistroLocal {
  id?: string;
  mensagem: string;
  anexos: AnexoRascunhoLocal[];
}
