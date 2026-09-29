import { api } from './api';
import { useAuthStore } from '@/stores/auth.store';

// A sessão já foi carregada pelo AuthGuard: não é necessário ler o disco a cada consulta.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const sessao = useAuthStore.getState();
    if (
      erro.response?.status === 401 &&
      sessao.token &&
      erro.config?.headers?.Authorization === `Bearer ${sessao.token}`
    ) {
      await sessao.signOut();
    }
    return Promise.reject(erro);
  },
);
