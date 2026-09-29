import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import { Pressable, ScrollView, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import AppButton from '@/components/ui/AppButton';

import { authStyles as styles } from '../authStyles';

export default function EscolhaPerfilScreen() {
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const handleConfirmar = () => {
    if (!perfilSelecionado) return;

    if (perfilSelecionado === 'PROTEGIDA') {
      router.push('/(auth)/cadastro?perfil=protegida');
    } else if (perfilSelecionado === 'GUARDIAO') {
      router.push('/(auth)/cadastro?perfil=guardiao');
    }
  };

  const renderCard = (id, iconName, title, sub) => {
    const selecionado = perfilSelecionado === id;

    return (
      <Pressable
        onPress={() => setPerfilSelecionado(id)}

        style={({ pressed }) => [
          styles.card,
          selecionado && styles.cardSelecionado,
          pressed && styles.cardPressionado,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={iconName}

            size={26}

            color={selecionado ? '#FFD000' : '#FFFFFF'}
          />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{title}</Text>

          <Text style={styles.cardSub}>{sub}</Text>
        </View>

        <View style={styles.checkArea}>
          {selecionado ? (
            <Ionicons name="checkmark-circle" size={24} color="#FFD000" />
          ) : (
            <View style={styles.radioOutline} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#E95378', '#8B48C7', '#341E6D']}

      start={{
        x: 0,
        y: 0,
      }}

      end={{
        x: 1,
        y: 1,
      }}

      style={styles.container}
    >
      <View style={styles.glowTopRight} pointerEvents="none" />

      <View style={styles.glowBottomLeft} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}

          showsVerticalScrollIndicator={false}

          keyboardShouldPersistTaps="handled"

          bounces={false}

          overScrollMode="never"

          style={{
            overscrollBehavior: 'none',
          }}
        >
          <View style={styles.mainWrapper}>
            {/* INDICADOR DE PASSO */}

            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>PASSO 01 DE 03</Text>
              </View>

              <View style={styles.stepBarBackground}>
                <View style={styles.stepBarFill} />
              </View>
            </View>

            {/* CABEÇALHO */}

            <View style={styles.headerGroup}>
              <Text style={styles.titulo}>ESCOLHA SEU PERFIL</Text>

              <Text style={styles.subtitulo}>Como você deseja acessar a plataforma Jaci?</Text>
            </View>

            {/* CARDS DE PERFIL */}

            <View style={styles.cardsGroup}>
              {renderCard(
                'PROTEGIDA',
                'shield-checkmark-outline',
                'PROTEGIDA',
                'Acesso seguro e rede de apoio instantânea',
              )}

              {renderCard(
                'GUARDIAO',
                'people-outline',
                'GUARDIÃO',
                'Receba alertas e ofereça suporte imediato',
              )}
            </View>

            {/* BOTÃO DE CONFIRMAÇÃO */}

            <View style={styles.footerGroup}>
              <View style={styles.buttonContainer}>
                <AppButton
                  title="Confirmar escolha"

                  disabled={!perfilSelecionado}

                  onPress={handleConfirmar}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
