import FundoDecorativo from '@/components/ui/FundoDecorativo';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

import ProtegidaHeader from '@/components/protegida/ProtegidaHeader';

import WelcomeProtegida from '@/components/protegida/WelcomeProtegida';

import QuickActionsProtegida from '@/components/protegida/QuickActionsProtegida';

import ProtegidaEmergencyCard from '@/components/protegida/ProtegidaEmergencyCard';

import ProtegidaBottomBar from '@/components/protegida/ProtegidaBottomBar';

import { styles } from './styles';

import { useThemeStore } from '@/stores/theme.store';

const ProtegidaHomeScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);

  const handleActionPress = (action) => {
    switch (action) {
      case 'sos':
        router.push('/protegida/sos');

        break;

      case 'configuracao':
        router.push('/protegida/configuracoes');

        break;

      case 'guardioes':
        router.push('/protegida/guardioes');

        break;

      case 'chat':
        router.push('/protegida/chat');

        break;

      case 'diario':
        router.push('/protegida/diario');

        break;

      case 'direitos':
        router.push('/protegida/direitos');

        break;

      case 'seguranca':
        router.push('/protegida/seguranca');

        break;

      case 'localizacao':
        router.push('/protegida/localizacao');

        break;

      default:
        break;
    }
  };

  const handleBottomPress = (item) => {
    switch (item) {
      case 'diario':
        router.push('/protegida/diario');

        break;

      case 'chat':
        router.push('/protegida/chat');

        break;

      case 'inicio':
        router.replace('/protegida');

        break;

      case 'sos':
        router.replace('/protegida/sos');

        break;

      case 'direitos':
        router.push('/protegida/direitos');

        break;

      case 'ajustes':
        router.push('/protegida/configuracoes');

        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <View style={[styles.content, isDark && styles.contentDark]}>
        <FundoDecorativo perfil="protegida" />
        <ProtegidaHeader userName="JACI" showBackButton={false} />

        <ScrollView
          showsVerticalScrollIndicator={false}

          contentContainerStyle={styles.scrollContent}
        >
          <WelcomeProtegida />

          <QuickActionsProtegida onActionPress={handleActionPress} />

          <ProtegidaEmergencyCard onPress={() => router.push('/protegida/sos')} />
        </ScrollView>
      </View>

      <ProtegidaBottomBar
        activeItem="inicio"

        onItemPress={handleBottomPress}
      />
    </SafeAreaView>
  );
};

export default ProtegidaHomeScreen;
