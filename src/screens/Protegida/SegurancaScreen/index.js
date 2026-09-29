import React, { useState } from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import ProtegidaHeader from '@/components/protegida/ProtegidaHeader';
import ProtegidaBottomBar from '@/components/protegida/ProtegidaBottomBar';

import { styles } from './styles';

const temas = [
  {
    id: 'deslocamento',
    title: 'DESLOCAMENTO',
    description: 'Cuidados ao sair e chegar em algum lugar.',
    icon: 'walk-outline',
    tips: [
      'Avise alguém de confiança sobre seu destino.',
      'Prefira locais movimentados e bem iluminados.',
      'Evite compartilhar sua localização com desconhecidos.',
      'Tenha o celular carregado antes de sair.',
      'Se perceber uma situação estranha, procure um local seguro.',
    ],
  },

  {
    id: 'casa',
    title: 'EM CASA',
    description: 'Cuidados para aumentar sua segurança.',
    icon: 'home-outline',
    tips: [
      'Mantenha portas e janelas trancadas.',
      'Evite informar a desconhecidos que está sozinha.',
      'Não compartilhe códigos ou senhas de acesso.',
      'Conheça seus vizinhos de confiança.',
      'Tenha contatos de emergência facilmente acessíveis.',
    ],
  },

  {
    id: 'digital',
    title: 'SEGURANÇA DIGITAL',
    description: 'Proteja seus dados e sua privacidade.',
    icon: 'phone-portrait-outline',
    tips: [
      'Use senhas fortes e diferentes para cada serviço.',
      'Nunca compartilhe sua senha ou códigos de confirmação.',
      'Tenha cuidado com links recebidos por mensagens.',
      'Evite realizar operações importantes em redes Wi-Fi públicas.',
      'Mantenha seus aplicativos sempre atualizados.',
    ],
  },

  {
    id: 'encontros',
    title: 'ENCONTROS',
    description: 'Cuidados ao encontrar alguém pessoalmente.',
    icon: 'people-outline',
    tips: [
      'Prefira locais públicos para primeiros encontros.',
      'Avise uma pessoa de confiança onde você estará.',
      'Evite depender da outra pessoa para voltar para casa.',
      'Mantenha seu celular carregado.',
      'Se algo parecer errado, você não precisa permanecer no local.',
    ],
  },

  {
    id: 'risco',
    title: 'SITUAÇÕES DE RISCO',
    description: 'O que fazer quando você se sentir ameaçada.',
    icon: 'warning-outline',
    tips: [
      'Confie na sua percepção quando algo parecer errado.',
      'Procure imediatamente um local seguro.',
      'Entre em contato com alguém de confiança.',
      'Evite confrontar uma pessoa que esteja ameaçando você.',
      'Em uma emergência, procure os serviços oficiais de emergência.',
    ],
  },
];

export default function SegurancaScreen() {
  const [selectedTema, setSelectedTema] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleOpenTema = (tema) => {
    setSelectedTema(tema);
  };

  const handleCloseModal = () => {
    setSelectedTema(null);
  };

  const handleBottomNavigation = (item) => {
    switch (item) {
      case 'inicio':
        router.replace('/protegida');
        break;

      case 'diario':
        router.push('/protegida/diario');
        break;

      case 'chat':
        router.push('/protegida/chat');
        break;

      case 'direitos':
        router.push('/protegida/direitos');
        break;

      case 'ajustes':
        router.push('/protegida/ajustes');
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF5F8', '#FFF5F8']} style={styles.background}>
        <ProtegidaHeader userName="JACI" showBackButton onBackPress={handleBack} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="shield-checkmark-outline" size={40} color="#FFFFFF" />
            </View>

            <View style={styles.introContent}>
              <Text style={styles.introTitle}>Informação também é proteção</Text>

              <Text style={styles.introText}>
                Confira algumas dicas simples que podem ajudar você a se manter mais segura no dia a
                dia.
              </Text>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>ESCOLHA UM TEMA</Text>

            <Text style={styles.sectionDescription}>
              Toque em uma opção para visualizar as dicas.
            </Text>
          </View>

          <View style={styles.temasContainer}>
            {temas.map((tema) => (
              <Pressable
                key={tema.id}
                onPress={() => handleOpenTema(tema)}
                style={({ pressed }) => [styles.temaCard, pressed && styles.temaCardPressed]}
              >
                <View style={styles.temaIcon}>
                  <Ionicons name={tema.icon} size={31} color="#FFFFFF" />
                </View>

                <View style={styles.temaContent}>
                  <Text style={styles.temaTitle}>{tema.title}</Text>

                  <Text style={styles.temaDescription}>{tema.description}</Text>
                </View>

                <Ionicons name="chevron-forward-outline" size={22} color="#C92B91" />
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* MODAL DE DICAS */}
        <Modal
          visible={!!selectedTema}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedTema && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalIcon}>
                      <Ionicons name={selectedTema.icon} size={30} color="#FFFFFF" />
                    </View>

                    <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                      <Ionicons name="close" size={25} color="#C92B91" />
                    </Pressable>
                  </View>

                  <Text style={styles.modalTitle}>{selectedTema.title}</Text>

                  <Text style={styles.modalDescription}>{selectedTema.description}</Text>

                  <ScrollView style={styles.tipsScroll} showsVerticalScrollIndicator={false}>
                    {selectedTema.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <View style={styles.tipNumber}>
                          <Text style={styles.tipNumberText}>{index + 1}</Text>
                        </View>

                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <Pressable
                    onPress={handleCloseModal}
                    style={({ pressed }) => [
                      styles.modalButton,
                      pressed && styles.modalButtonPressed,
                    ]}
                  >
                    <Text style={styles.modalButtonText}>Entendi</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>

        <ProtegidaBottomBar activeItem="inicio" onItemPress={handleBottomNavigation} />
      </LinearGradient>
    </View>
  );
}
