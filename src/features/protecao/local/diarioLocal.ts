import { Platform } from 'react-native';
import type { DadosRegistroLocal, RegistroLocalDiario } from './diarioLocal.types';

async function adapter() {
  return Platform.OS === 'web' ? import('./diarioLocal.web') : import('./diarioLocal.native');
}

export async function listarRegistrosLocais(donoId: string): Promise<RegistroLocalDiario[]> {
  return (await adapter()).listarRegistrosLocais(donoId);
}

export async function salvarRegistroLocal(
  donoId: string,
  dados: DadosRegistroLocal,
): Promise<RegistroLocalDiario> {
  return (await adapter()).salvarRegistroLocal(donoId, dados);
}

export async function excluirRegistroLocal(donoId: string, id: string): Promise<void> {
  return (await adapter()).excluirRegistroLocal(donoId, id);
}

export async function liberarPreviewsLocais(registros: RegistroLocalDiario[]): Promise<void> {
  return (await adapter()).liberarPreviewsLocais(registros);
}

export async function liberarAnexosRascunho(anexos: RegistroLocalDiario['anexos']): Promise<void> {
  return (await adapter()).liberarAnexosRascunho(anexos);
}
