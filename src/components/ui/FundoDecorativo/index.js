import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

/** Decoração sem interação, atrás do conteúdo e fora da árvore de acessibilidade. */
export default function FundoDecorativo({ perfil }) {
  const perfilAtual = useAuthStore((estado) => estado.perfil);
  const escuro = useThemeStore((estado) => estado.isDark);
  const { width } = useWindowDimensions();
  const guardiao = (perfil || perfilAtual) === 'guardiao';
  const rgb = guardiao ? '118,179,197' : '247,119,182';
  const tamanho = Math.min(640, Math.max(340, width * 0.7));
  const cor = (alpha) => `rgba(${rgb},${alpha})`;
  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.fundo}
    >
      <LinearGradient
        colors={[cor(escuro ? 0.13 : 0.18), cor(0)]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.mancha,
          {
            width: tamanho,
            height: tamanho,
            borderRadius: tamanho / 2,
            right: -tamanho * 0.45,
            top: 70,
          },
        ]}
      />
      <View
        style={[
          styles.anel,
          {
            width: tamanho,
            height: tamanho,
            borderRadius: tamanho / 2,
            borderColor: cor(escuro ? 0.12 : 0.2),
            left: -tamanho * 0.65,
            top: '43%',
          },
        ]}
      />
      <View
        style={[
          styles.anel,
          {
            width: tamanho - 38,
            height: tamanho - 38,
            borderRadius: tamanho / 2,
            borderColor: cor(escuro ? 0.08 : 0.13),
            left: -tamanho * 0.65 + 19,
            top: '43%',
            marginTop: 19,
          },
        ]}
      />
      <LinearGradient
        colors={[cor(0), cor(escuro ? 0.08 : 0.12)]}
        style={[
          styles.mancha,
          {
            width: tamanho,
            height: tamanho,
            borderRadius: tamanho / 2,
            right: -tamanho * 0.35,
            bottom: -tamanho * 0.55,
          },
        ]}
      />
      <View style={styles.pontos}>
        {Array.from({ length: 9 }, (_, i) => (
          <View key={i} style={[styles.ponto, { backgroundColor: cor(escuro ? 0.18 : 0.3) }]} />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fundo: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  mancha: { position: 'absolute' },
  anel: { position: 'absolute', borderWidth: 1 },
  pontos: {
    position: 'absolute',
    right: 16,
    top: '52%',
    width: 38,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ponto: { width: 3, height: 3, borderRadius: 2 },
});
