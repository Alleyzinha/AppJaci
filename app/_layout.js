import React from 'react';
import '@/services/localizacao/compartilhamento';

import { QueryClientProvider } from '@tanstack/react-query';

import { Stack } from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/services/query/queryClient';
import { useSegurancaStore } from '@/stores/seguranca.store';
import { useAuthStore } from '@/stores/auth.store';
import { registrarPush } from '@/services/notificacoes/push';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function NotificacoesGlobais() {
  const token = useAuthStore((estado) => estado.token);
  React.useEffect(() => {
    if (token) void registrarPush();
  }, [token]);
  React.useEffect(() => {
    if (Platform.OS === 'web') return;

    const abrir = (resposta) => {
      const tela = resposta.notification.request.content.data?.tela;
      if (tela === '/guardiao/sos' || tela === '/guardiao/checkin') router.push(tela);
    };
    const inicial = Notifications.getLastNotificationResponse();
    if (inicial) abrir(inicial);
    const assinatura = Notifications.addNotificationResponseReceivedListener(abrir);
    return () => assinatura.remove();
  }, []);
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <CamuflagemGlobal />
        <NotificacoesGlobais />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
