import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Sessao = { token: string; perfil: string; userName?: string; userId?: string };
const CHAVE = 'appjaci.sessao.v2';

export async function saveSession(sessao: Sessao) {
  const valor = JSON.stringify(sessao);
  if (Platform.OS === 'web') {
    window.sessionStorage.setItem(CHAVE, valor);
  } else {
    await SecureStore.setItemAsync(CHAVE, valor);
  }
}

export async function getSession(): Promise<Sessao | null> {
  try {
    const valor =
      Platform.OS === 'web'
        ? typeof window !== 'undefined'
          ? window.sessionStorage.getItem(CHAVE)
          : null
        : await SecureStore.getItemAsync(CHAVE);
    if (!valor) return null;
    const sessao = JSON.parse(valor);
    if (typeof sessao.token !== 'string' || !['protegida', 'guardiao'].includes(sessao.perfil))
      return null;
    return sessao;
  } catch {
    return null;
  }
}

export async function clearSession() {
  if (Platform.OS === 'web') {
    window.sessionStorage.removeItem(CHAVE);
    for (const chave of ['appjaci:auth:token', 'appjaci:auth:perfil', 'appjaci:auth:userName'])
      window.localStorage.removeItem(chave);
  } else {
    await SecureStore.deleteItemAsync(CHAVE);
  }
}
