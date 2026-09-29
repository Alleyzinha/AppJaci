import React, { useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import FundoDecorativo from '@/components/ui/FundoDecorativo';
import GuardiaoHeader from '@/components/guardiao/GuardiaoHeader';
import SosEmergencyButton from '@/components/guardiao/SosEmergencyButton';
import SosQuickActions from '@/components/guardiao/SosQuickActions';
import GuardiaoBottomBar from '@/components/guardiao/GuardiaoBottomBar';
import { listarAlertas } from '@/features/protecao/api/protecao.api';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';
import { styles } from './styles';

const GuardiaoSosScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const userName = useAuthStore((state) => state.userName);
  const cliente = useQueryClient();
  const [atualizando, setAtualizando] = useState(false);

  // Consulta de alertas SOS da rede em tempo real
  const consultaAlertas = useQuery({
    queryKey: ['sos', 'guardiao'],
    queryFn: listarAlertas,
    refetchInterval: 12000,
  });

  const aoAtualizar = async () => {
    setAtualizando(true);
    await consultaAlertas.refetch();
    setAtualizando(false);
  };

  const handleEmergencyPress = () => {
    Linking.openURL('tel:190');
  };

  const handleActionPress = async (action) => {
    switch (action) {
      case '180':
        await Linking.openURL('tel:180');
        break;

      case 'delegacias':
        try {
          await Linking.openURL(
            'https://www.google.com/maps/search/?api=1&query=delegacias+da+mulher+perto+de+mim',
          );
        } catch {
          // Fallback caso não abra o mapa
        }
        break;

      case 'localizacao':
        router.push('/guardiao/localizacao');
        break;

      default:
        break;
    }
  };

  const handleBottomPress = (item) => {
    switch (item) {
      case 'inicio':
        router.replace('/guardiao');
        break;

      case 'localizacao':
        router.push('/guardiao/localizacao');
        break;

      case 'sos':
        router.replace('/guardiao/sos');
        break;

      case 'direitos':
        router.push('/guardiao/direitos');
        break;

      case 'ajustes':
        router.push('/guardiao/configuracoes');
        break;

      default:
        break;
    }
  };

  const alertas = consultaAlertas.data || [];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <View style={[styles.content, isDark && styles.contentDark]}>
        <FundoDecorativo perfil="guardiao" />
        <GuardiaoHeader userName={userName || 'WILLIAM'} showBackButton={true} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={aoAtualizar}
              tintColor={isDark ? '#FFF' : '#3A7E94'}
            />
          }
        >
          {/* BOTÃO GRANDE E BONITO DE EMERGÊNCIA 190 */}
          <SosEmergencyButton onPress={handleEmergencyPress} onLongPress={handleEmergencyPress} />

          <Text style={[styles.instruction, isDark && styles.instructionDark]}>
            Segure o botão por 2 segundos para ligar direto para a{'\n'}Polícia Militar (190)
          </Text>

          {/* ATALHOS RÁPIDOS (180, DELEGACIAS, LOCALIZAÇÃO) */}
          <SosQuickActions onActionPress={handleActionPress} />

          {/* ALERTAS DA PROTEGIDA / REDE */}
          <View style={styles.secaoAlertas}>
            <Text style={[styles.secaoTitulo, isDark && styles.secaoTituloDark]}>
              Alertas da sua rede
            </Text>

            {consultaAlertas.isPending ? (
              <View
                accessibilityLiveRegion="polite"
                style={[styles.alertaVazio, isDark && styles.alertaVazioDark]}
              >
                <ActivityIndicator color={isDark ? '#8DCFE2' : '#4E899A'} />
                <Text style={[styles.alertaVazioTexto, isDark && styles.alertaVazioTextoDark]}>
                  Carregando alertas da sua rede…
                </Text>
              </View>
            ) : consultaAlertas.isError ? (
              <View
                accessibilityLiveRegion="polite"
                style={[styles.alertaVazio, isDark && styles.alertaVazioDark]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={26}
                  color={isDark ? '#8DCFE2' : '#4E899A'}
                />
                <Text style={[styles.alertaVazioTexto, isDark && styles.alertaVazioTextoDark]}>
                  Não foi possível carregar os alertas agora. Puxe para atualizar.
                </Text>
              </View>
            ) : alertas.length === 0 ? (
              <View style={[styles.alertaVazio, isDark && styles.alertaVazioDark]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={28}
                  color={isDark ? '#8EAAB5' : '#6E8B97'}
                  style={{ marginBottom: 6 }}
                />
                <Text style={[styles.alertaVazioTexto, isDark && styles.alertaVazioTextoDark]}>
                  Nenhum alerta ativo encontrado no momento.
                </Text>
              </View>
            ) : (
              alertas.map((alerta) => (
                <View
                  key={alerta.idAlertaSos}
                  style={[styles.alertaCard, isDark && styles.alertaCardDark]}
                >
                  <View style={styles.alertaCardTopo}>
                    <Text style={[styles.alertaNome, isDark && styles.alertaNomeDark]}>
                      {alerta.nome}
                    </Text>
                    <View
                      style={
                        alerta.status === 'ativo'
                          ? styles.alertaBadgeAtivo
                          : styles.alertaBadgeEncerrado
                      }
                    >
                      <Text
                        style={
                          alerta.status === 'ativo'
                            ? styles.alertaBadgeAtivoTexto
                            : styles.alertaBadgeEncerradoTexto
                        }
                      >
                        {alerta.status === 'ativo' ? 'ALERTA ATIVO' : 'ENCERRADO'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.alertaData, isDark && styles.alertaDataDark]}>
                    Registrado em {new Date(alerta.dataHora).toLocaleString('pt-BR')}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <GuardiaoBottomBar activeItem="sos" onItemPress={handleBottomPress} />
    </SafeAreaView>
  );
};

export default GuardiaoSosScreen;
