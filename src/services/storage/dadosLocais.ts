import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Pequenos dados de segurança local (modo camuflagem).
 * Usam a mesma proteção do SecureStore no app nativo e o localStorage
 * persistente no navegador (diferente da sessão, que é por aba).
 */
export async function salvarLocal(chave: string, valor: string) {
  const destino = `appjaci.local.${chave}`;
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(destino, valor);
    } catch {
      /* navegador sem armazenamento: ignora */
    }
  } else {
    await SecureStore.setItemAsync(destino, valor);
  }
}

export async function lerLocal(chave: string): Promise<string | null> {
  const origem = `appjaci.local.${chave}`;
  try {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' ? window.localStorage.getItem(origem) : null;
    }
    return await SecureStore.getItemAsync(origem);
  } catch {
    return null;
  }
}

export async function removerLocal(chave: string) {
  const destino = `appjaci.local.${chave}`;
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(destino);
  } else {
    await SecureStore.deleteItemAsync(destino);
  }
}
