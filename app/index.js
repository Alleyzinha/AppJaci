import React, { useEffect } from 'react';

import { View, ActivityIndicator } from 'react-native';

import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/auth.store';

/**
 * Rota inicial do app.
 *
 * Carrega a sessão salva e direciona
 * para a home do perfil correto, ou
 * para a tela de escolha de perfil
 * quando não há sessão.
 */

export default function Index() {
  const { token, perfil, isLoading, loadSession } = useAuthStore();

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

  return <Redirect href={perfil === 'protegida' ? '/protegida' : '/guardiao'} />;
}
