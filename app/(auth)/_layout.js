import React from 'react';

import { ActivityIndicator, StyleSheet, View, useWindowDimensions } from 'react-native';
import CarrosselAcolhimento from '@/components/auth/CarrosselAcolhimento';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Lora_600SemiBold } from '@expo-google-fonts/lora';

import { colors, fontFamilies } from '@/styles/tokens';

const authFontAssets = {
  [fontFamilies.body]: DMSans_400Regular,
  [fontFamilies.bodyMedium]: DMSans_500Medium,
  [fontFamilies.bodySemibold]: DMSans_600SemiBold,
  [fontFamilies.bodyBold]: DMSans_700Bold,
  [fontFamilies.display]: Lora_600SemiBold,
};

export default function AuthLayout() {
  const { width, height } = useWindowDimensions();
  const desktop = width >= 980 && height >= 620;
  const [fontsLoaded, fontError] = useFonts(authFontAssets);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingScreen} accessibilityLabel="Carregando">
        <ActivityIndicator size="small" color={colors.common.magenta} />
      </View>
    );
  }

  return (
    <View style={[styles.page, desktop && styles.desktopPage]}>
      <View style={[styles.layout, desktop && styles.desktopLayout]}>
        {desktop && <CarrosselAcolhimento />}
        <View style={[styles.navigator, desktop && styles.desktopNavigator]}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: colors.authEntry.background },
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.authEntry.background },
  desktopPage: { padding: 28 },
  layout: { flex: 1, width: '100%' },
  desktopLayout: { flexDirection: 'row', maxWidth: 1360, alignSelf: 'center', gap: 28 },
  navigator: { flex: 1, minWidth: 0, overflow: 'hidden' },
  desktopNavigator: {
    maxWidth: 520,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.authEntry.divider,
    paddingTop: 20,
    paddingBottom: 12,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.authEntry.background,
  },
});
