import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function enderecoApi() {
  const configurado = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configurado) return configurado;

  if (__DEV__) {
    const host =
      Platform.OS === 'web'
        ? typeof window !== 'undefined' && window.location.hostname
        : Constants.expoConfig?.hostUri?.split(':')[0];
    if (host) return `http://${host}:3000/api`;
    if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  }

  return 'http://localhost:3000/api';
}

export function mensagemErroApi(erro, padrao) {
  if (typeof erro?.response?.data?.error === 'string') return erro.response.data.error;
  if (erro?.code === 'ECONNABORTED' || erro?.code === 'ETIMEDOUT')
    return 'O servidor demorou para responder. Tente novamente.';
  if (axios.isAxiosError(erro) && !erro.response)
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está em execução.';
  return padrao;
}

export const api = axios.create({
  baseURL: enderecoApi(),

  timeout: 15000,

  headers: {
    Accept: 'application/json',

    'Content-Type': 'application/json',
  },
});
