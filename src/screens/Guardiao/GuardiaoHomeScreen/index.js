import { SafeAreaView } from 'react-native-safe-area-context';
import FundoDecorativo from '@/components/ui/FundoDecorativo';
import { Linking } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import GuardiaoHeader from '@/components/guardiao/GuardiaoHeader';
import WelcomeGuardiao from '@/components/guardiao/WelcomeGuardiao';
import QuickActions from '@/components/guardiao/QuickActions';
import EmergencyCard from '@/components/guardiao/EmergencyCard';
import GuardiaoBottomBar from '@/components/guardiao/GuardiaoBottomBar';
import { getLinkedProtected } from '@/features/guardians/api/guardians.api';
import { getFirstName } from '@/utils/name';

import { colors } from '@/styles/tokens';

import { styles } from './styles';

import { useThemeStore } from '@/stores/theme.store';

const GuardiaoHomeScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);

  /*
   * =====================================================
   * MODAL DA PROTEGIDA
   * =====================================================
   */

  const [showProtegidaModal, setShowProtegidaModal] = useState(false);

  const [protectedUser, setProtectedUser] = useState(null);

  useEffect(() => {
    getLinkedProtected()
      .then((data) => setProtectedUser(data.protectedUser))
      .catch(() => setProtectedUser(null));
  }, []);

  /*
   * =====================================================
   * DADOS DA PROTEGIDA VINCULADA
   *
   * Por enquanto são dados de protótipo.
   * Depois podem vir da API/banco de dados.
   * =====================================================
   */

  const protegidaVinculada = {
    nome: getFirstName(protectedUser?.name) || 'Nenhuma protegida vinculada',
    telefone: protectedUser?.phone || 'Adicione uma protegida para visualizar os dados',
    email: protectedUser?.email || '',
    relacao: protectedUser ? 'Vínculo ativo' : 'Sem vínculo',
    observacao: protectedUser ? 'Você está vinculado a esta protegida.' : 'Aguardando vínculo',
    status: protectedUser ? 'Proteção ativa' : 'Sem protegida vinculada',
  };

  /*
   * =====================================================
   * AÇÕES RÁPIDAS
   * =====================================================
   */

  const handleActionPress = (action) => {
    switch (action) {
      case 'configuracao':
        router.push('/guardiao/configuracoes');
        break;

      case 'direitos':
        router.push('/guardiao/direitos');
        break;

      case 'localizacao':
        router.push('/guardiao/localizacao');
        break;

      default:
        break;
    }
  };

  /*
   * =====================================================
   * NAVEGAÇÃO INFERIOR
   * =====================================================
   */

  const handleBottomPress = (item) => {
    switch (item) {
      case 'inicio':
        router.replace('/guardiao');
        break;

      case 'localizacao':
        router.push('/guardiao/localizacao');
        break;

      case 'sos':
        router.push('/guardiao/sos');
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

  /*
   * =====================================================
   * EMERGÊNCIA
   * =====================================================
   */

  const handleEmergencyPress = () => {
    router.push('/guardiao/sos');
  };

  /*
   * =====================================================
   * ABRIR MODAL DA PROTEGIDA
   * =====================================================
   */

  const handleProtegidaPress = () => {
    setShowProtegidaModal(true);
  };

  /*
   * =====================================================
   * FECHAR MODAL
   * =====================================================
   */

  const handleCloseProtegidaModal = () => {
    setShowProtegidaModal(false);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, isDark && styles.safeAreaDark]}
      >
        <View style={[styles.content, isDark && styles.contentDark]}>
          <FundoDecorativo perfil="guardiao" />
          {/* =====================================================
              HEADER
          ===================================================== */}

          <GuardiaoHeader />

          {/* =====================================================
              CONTEÚDO
          ===================================================== */}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* SAUDAÇÃO */}

            <WelcomeGuardiao />

            {/* =====================================================
                PROTEGIDA VINCULADA
            ===================================================== */}

            <Pressable
              onPress={handleProtegidaPress}

              style={({ pressed }) => [
                styles.protegidaCard,
                isDark && styles.protegidaCardDark,

                pressed && styles.protegidaCardPressed,
              ]}

              accessibilityRole="button"

              accessibilityLabel={`Ver dados da Protegida ${protegidaVinculada.nome}`}
            >
              {/* ÍCONE */}

              <View style={styles.protegidaIconWrapper}>
                <Ionicons name="shield-checkmark-outline" size={30} color={colors.common.white} />
              </View>

              {/* INFORMAÇÕES */}

              <View style={styles.protegidaInfo}>
                <Text style={[styles.protegidaLabel, isDark && styles.protegidaLabelDark]}>
                  PROTEGIDA VINCULADA
                </Text>

                <Text style={[styles.protegidaName, isDark && styles.protegidaNameDark]}>
                  <Text numberOfLines={2} ellipsizeMode="tail">
                    {protegidaVinculada.nome}
                  </Text>
                </Text>

                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />

                  <Text style={[styles.statusText, isDark && styles.statusTextDark]}>
                    {protegidaVinculada.status}
                  </Text>
                </View>
              </View>

              {/* SETA */}

              <View style={[styles.protegidaArrow, isDark && styles.protegidaArrowDark]}>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={isDark ? colors.guardiao.dark.accent : colors.guardiao.primaryDark}
                />
              </View>
            </Pressable>

            {/* =====================================================
                AÇÕES RÁPIDAS
            ===================================================== */}

            <QuickActions onActionPress={handleActionPress} />

            {/* =====================================================
                EMERGÊNCIA
            ===================================================== */}

            <EmergencyCard onPress={handleEmergencyPress} />
          </ScrollView>
        </View>

        {/* =====================================================
            NAVEGAÇÃO INFERIOR
        ===================================================== */}

        <GuardiaoBottomBar activeItem="inicio" onItemPress={handleBottomPress} />

        {/* =====================================================
            MODAL DA PROTEGIDA
        ===================================================== */}

        <Modal
          visible={showProtegidaModal}

          transparent

          animationType="fade"

          onRequestClose={handleCloseProtegidaModal}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <ScrollView
              style={{ width: '100%' }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 16,
              }}
            >
              <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
                {/* =================================================
                  CABEÇALHO
              ================================================= */}

                <View style={styles.modalHeader}>
                  <View style={styles.modalIconWrapper}>
                    <Ionicons name="shield-checkmark-outline" size={32} color="#FFFFFF" />
                  </View>
                </View>

                {/* =================================================
                  TÍTULO
              ================================================= */}

                <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                  PROTEGIDA VINCULADA
                </Text>

                <Text style={[styles.modalName, isDark && styles.modalNameDark]}>
                  {protegidaVinculada.nome}
                </Text>

                {/* =================================================
                  TELEFONE
              ================================================= */}

                <View style={styles.infoItem}>
                  <View style={[styles.infoIcon, isDark && styles.infoIconDark]}>
                    <Ionicons
                      name="call-outline"
                      size={21}
                      color={isDark ? colors.guardiao.dark.accent : colors.guardiao.primaryDark}
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>TELEFONE</Text>

                    <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                      {protegidaVinculada.telefone}
                    </Text>
                  </View>
                </View>

                {/* =================================================
                  EMAIL
              ================================================= */}

                <View style={styles.infoItem}>
                  <View style={[styles.infoIcon, isDark && styles.infoIconDark]}>
                    <Ionicons
                      name="mail-outline"
                      size={21}
                      color={isDark ? colors.guardiao.dark.accent : colors.guardiao.primaryDark}
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>E-MAIL</Text>

                    <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                      {protegidaVinculada.email}
                    </Text>
                  </View>
                </View>

                {/* =================================================
                  RELAÇÃO
              ================================================= */}

                <View style={styles.infoItem}>
                  <View style={[styles.infoIcon, isDark && styles.infoIconDark]}>
                    <Ionicons
                      name="people-outline"
                      size={21}
                      color={isDark ? colors.guardiao.dark.accent : colors.guardiao.primaryDark}
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>RELAÇÃO</Text>

                    <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                      {protegidaVinculada.relacao}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoIcon, isDark && styles.infoIconDark]}>
                    <Ionicons
                      name="information-circle-outline"
                      size={21}
                      color={isDark ? colors.guardiao.dark.accent : colors.guardiao.primaryDark}
                    />
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                      OBSERVAÇÃO
                    </Text>

                    <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                      {protegidaVinculada.observacao}
                    </Text>
                  </View>
                </View>

                <View style={[styles.modalStatus, isDark && styles.modalStatusDark]}>
                  <Ionicons name="shield-checkmark" size={22} color="#3E9B69" />

                  <Text style={[styles.modalStatusText, isDark && styles.modalStatusTextDark]}>
                    {protegidaVinculada.status}
                  </Text>
                </View>

                <Pressable
                  onPress={handleCloseProtegidaModal}

                  style={({ pressed }) => [
                    styles.modalButton,
                    pressed && styles.modalButtonPressed,
                  ]}
                >
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default GuardiaoHomeScreen;
