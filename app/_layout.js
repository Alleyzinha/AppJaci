import React from 'react';
import '@/services/localizacao/compartilhamento';

import { QueryClientProvider } from '@tanstack/react-query';

import { Stack } from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/services/query/queryClient';
import { useSegurancaStore } from '@/stores/seguranca.store';

import '@/services/api/interceptors';

/** Modo camuflagem: troca o título visível do app para um nome neutro. */
function CamuflagemGlobal() {
  const camuflagem = useSegurancaStore((estado) => estado.camuflagem);
  const carregar = useSegurancaStore((estado) => estado.carregar);
  React.useEffect(() => {
    carregar();
  }, [carregar]);
  React.useEffect(() => {
    if (typeof document !== 'undefined') document.title = camuflagem ? 'Notas' : 'AppJaci';
  }, [camuflagem]);
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <CamuflagemGlobal />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
