import React from 'react';

import { SafeAreaView, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CarrosselAcolhimento from '@/components/auth/CarrosselAcolhimento';
import { router } from 'expo-router';

import AppButton from '@/components/ui/AppButton';
import { colors, fontFamilies } from '@/styles/tokens';

import { styles } from './styles';

export default function BoasVindasScreen() {
  const { width, height } = useWindowDimensions();
  const desktop = width >= 980 && height >= 620;

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={[styles.content, desktop && styles.desktopContent]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.brandRow} accessibilityLabel="Jaci">
          <Text style={styles.brandName}>
            jaci<Text style={styles.brandPeriod}>.</Text>
          </Text>
          <View accessible={false} style={styles.brandDivider} />
        </View>

        {!desktop && <CarrosselAcolhimento compacto />}

        <View style={[styles.intro, desktop && styles.desktopIntro]}>
          <Text style={styles.eyebrow}>BEM-VINDA À JACI</Text>
          <Text
            accessibilityRole="header"
            style={[styles.headline, desktop && styles.desktopHeadline]}
          >
            Você merece se sentir segura.
          </Text>

          <Text style={styles.description}>
            Um espaço de acolhimento, proteção e cuidado. No seu tempo.
          </Text>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Ionicons name="heart-outline" size={17} color={colors.protegida.authAccentDark} />
            <Text style={styles.featureText}>Acolhimento</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="people-outline" size={17} color={colors.protegida.authAccentDark} />
            <Text style={styles.featureText}>Sua rede</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={colors.protegida.authAccentDark}
            />
            <Text style={styles.featureText}>Proteção</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Criar minha conta"
            fontFamily={fontFamilies.bodyBold}
            colors={[colors.protegida.authAccentDark, colors.protegida.authAccentDark]}
            onPress={() => router.push('/(auth)/perfil?intent=signup')}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Já tem uma conta?</Text>
            <Text
              accessibilityRole="link"
              accessibilityLabel="Entrar na minha conta"
              accessibilityHint="Escolha Protegida ou Guardião antes de acessar o login"
              onPress={() => router.push('/(auth)/perfil?intent=login')}
              style={styles.loginLink}
            >
              Entrar
            </Text>
          </View>
        </View>

        <Text style={styles.footerMotto}>Um passo de cada vez.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
