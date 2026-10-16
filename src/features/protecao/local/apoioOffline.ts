import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type ContatoOffline = { nome: string; telefone: string; relacao?: string };
type ContatoRede = { name?: string; phone?: string; relation?: string };

function chave(donoId: string) {
  const id = donoId.replace(/[^a-zA-Z0-9_-]/g, '');
  return id ? `appjaci:apoio-offline:${id}` : '';
}

export async function salvarContatosOffline(donoId: string, contatos: ContatoRede[]) {
  const idChave = chave(donoId);
  if (!idChave) return;
  const valor = JSON.stringify(
    contatos.slice(0, 6).map(({ name, phone, relation }) => ({
      nome: String(name || '').slice(0, 70),
      telefone: String(phone || '').slice(0, 22),
      relacao: String(relation || '').slice(0, 35),
    })),
  );
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(idChave, valor);
  } else {
    await SecureStore.setItemAsync(idChave, valor);
  }
}

export async function lerContatosOffline(donoId: string): Promise<ContatoOffline[]> {
  const idChave = chave(donoId);
  if (!idChave) return [];
  try {
    const valor =
      Platform.OS === 'web'
        ? typeof window !== 'undefined'
          ? window.sessionStorage.getItem(idChave)
          : null
        : await SecureStore.getItemAsync(idChave);
    const dados = JSON.parse(valor || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}
