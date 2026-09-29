import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (tentativas, erro) =>
        ![400, 401, 403, 404].includes(erro?.response?.status) && tentativas < 2,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
    mutations: { retry: false },
  },
});
