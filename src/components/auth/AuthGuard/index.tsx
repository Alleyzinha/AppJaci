import React, { useEffect } from 'react';

import { View, ActivityIndicator } from 'react-native';

import { Redirect, useSegments } from 'expo-router';

import { useAuthStore } from '@/stores/auth.store';

/**
 * Componente de guarda de rota.
 *
 * Enquanto a sessão está sendo
 * carregada do secure storage,
 * mostra um splash simples.
 *
 * Se não houver sessão, redireciona
 * para a escolha de perfil (login).
 */

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, perfil, isLoading, loadSession } = useAuthStore();
  const segmentos = useSegments();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#223A44',
        }}
      >
        <ActivityIndicator size="large" color="#CF2B9D" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/perfil" />;
  }

  if (perfil && segmentos[0] !== perfil) {
    return <Redirect href={perfil === 'protegida' ? '/protegida' : '/guardiao'} />;
  }

  return <>{children}</>;
}
