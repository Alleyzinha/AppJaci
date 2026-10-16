import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import { Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import AppButton from '@/components/ui/AppButton';
import { colors, fontFamilies } from '@/styles/tokens';

import { styles } from './styles';

const PERFIS = [
  {
    id: 'protegida',
    title: 'Protegida',
    description: 'Busque apoio e compartilhe com sua rede de confiança.',
  },
  {
    id: 'guardiao',
    title: 'Guardião',
    description: 'Receba alertas e esteja por perto para oferecer apoio.',
  },
];

const CORES_PERFIL = {
  protegida: colors.protegida,
  guardiao: colors.guardiao,
};

export default function EscolhaPerfilScreen() {
  const { intent, email } = useLocalSearchParams();
  const intentParam = Array.isArray(intent) ? intent[0] : intent;
  const fluxoLogin = intentParam === 'login';
  const emailParam = typeof email === 'string' ? email : '';
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const perfil = PERFIS.find((item) => item.id === perfilSelecionado);
  const corPerfil = perfilSelecionado ? CORES_PERFIL[perfilSelecionado] : null;

  const handleContinuar = () => {
    if (!perfilSelecionado) return;

    if (fluxoLogin) {
      router.replace({
        pathname: '/(auth)/login',
        params: { perfil: perfilSelecionado, ...(emailParam ? { email: emailParam } : {}) },
      });
      return;
    }

    router.push({
      pathname: '/(auth)/cadastro',
      params: { perfil: perfilSelecionado },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.header}>
          <Text accessibilityLabel="Jaci" style={styles.brandName}>
            jaci<Text style={styles.brandPeriod}>.</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={handleBack}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={19} color={colors.authEntry.heading} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>

        <View style={styles.intro}>
          <Text accessibilityRole="header" style={styles.title}>
            {fluxoLogin ? 'Como você acessa a Jaci?' : 'Como você vai usar a Jaci?'}
          </Text>
          <Text style={styles.description}>
            {fluxoLogin
              ? 'Escolha o perfil vinculado à sua conta.'
              : 'Escolha o perfil da conta que você vai criar.'}
          </Text>
        </View>

        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Escolha de perfil"
          style={styles.options}
        >
          {PERFIS.map((item) => {
            const selecionado = perfilSelecionado === item.id;
            const paleta = CORES_PERFIL[item.id];

            return (
              <Pressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityLabel={`${item.title}. ${item.description}`}
                accessibilityHint={
                  selecionado ? 'Perfil selecionado' : 'Toque duas vezes para selecionar'
                }
                accessibilityState={{ selected: selecionado }}
                onPress={() => setPerfilSelecionado(item.id)}
                style={({ pressed }) => [
                  styles.profileOption,
                  selecionado
                    ? {
                        backgroundColor: paleta.authSurface,
                        borderColor: paleta.authAccent,
                        borderWidth: 2,
                      }
                    : styles.profileOptionUnselected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.profileText}>
                  <Text
                    style={[styles.profileTitle, selecionado && { color: paleta.authAccentDark }]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.profileDescription}>{item.description}</Text>
                  {selecionado && (
                    <Text style={[styles.selectedLabel, { color: paleta.authAccentDark }]}>
                      Perfil selecionado
                    </Text>
                  )}
                </View>
                <View
                  accessible={false}
                  style={[
                    styles.radio,
                    selecionado
                      ? { borderColor: paleta.authAccent, backgroundColor: paleta.authAccent }
                      : styles.radioUnselected,
                  ]}
                >
                  {selecionado ? (
                    <Ionicons name="checkmark" size={16} color={colors.common.white} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summary} accessibilityLiveRegion="polite">
          <View
            accessible={false}
            style={[styles.summaryDot, corPerfil && { backgroundColor: corPerfil.authAccent }]}
          />
          <Text style={styles.summaryText}>
            {perfil ? (
              <>
                Seu perfil é <Text style={styles.summaryStrong}>{perfil.title}</Text>. Próxima
                etapa: {fluxoLogin ? 'entrar na conta.' : 'criar uma conta.'}
              </>
            ) : (
              'Selecione seu perfil para continuar.'
            )}
          </Text>
        </View>

        <View style={styles.actionSection}>
          <AppButton
            title={
              perfil
                ? `${fluxoLogin ? 'Entrar' : 'Criar conta'} como ${perfil.title}`
                : fluxoLogin
                  ? 'Escolher perfil para entrar'
                  : 'Escolher perfil para criar conta'
            }
            disabled={!perfil}
            fontFamily={fontFamilies.bodyBold}
            colors={[
              corPerfil ? corPerfil.authAccentDark : colors.authEntry.heading,
              corPerfil ? corPerfil.authAccentDark : colors.authEntry.heading,
            ]}
            disabledColors={[colors.authEntry.disabled, colors.authEntry.disabled]}
            disabledTextColor={colors.authEntry.disabledText}
            textColor={colors.common.white}
            onPress={handleContinuar}
          />
          <Text style={styles.actionHint}>
            {fluxoLogin
              ? 'Você pode trocar de perfil depois.'
              : 'A próxima etapa são seus dados de cadastro.'}
          </Text>
        </View>

        <Text style={styles.footer}>Cuidado que conecta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
