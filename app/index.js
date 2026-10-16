import React, { useEffect } from 'react';

import { View, ActivityIndicator } from 'react-native';

import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/auth.store';
import { colors } from '@/styles/tokens';

/**
 * Rota inicial do app.
 *
 * Carrega a sessão salva e direciona
 * para a home do perfil correto, ou
 * para a tela inicial de boas-vindas
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
          backgroundColor: colors.authEntry.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.common.magenta} />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href={perfil === 'protegida' ? '/protegida' : '/guardiao'} />;
}
