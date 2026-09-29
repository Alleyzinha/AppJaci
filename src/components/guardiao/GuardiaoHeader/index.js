import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { getFirstName } from '@/utils/name';
import { colors } from '@/styles/tokens';
import { styles } from './styles';

export default function GuardiaoHeader({
  userName = 'Guardião',
  showBackButton = false,
  onStatusPress,
}) {
  const nome = useAuthStore((estado) => estado.userName);
  const primeiroNome = getFirstName(nome || userName);
  return (
    <LinearGradient
      colors={[colors.guardiao.primary, colors.guardiao.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View pointerEvents="none" accessible={false} style={styles.arcoExterno} />
      <View pointerEvents="none" accessible={false} style={styles.arcoInterno} />
      <View style={styles.conteudo}>
        {showBackButton && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/guardiao'))}
            style={({ pressed }) => [styles.voltar, pressed && styles.pressionado]}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        )}
        <View style={styles.textos}>
          <Text style={styles.marca}>
            jaci<Text style={styles.ponto}>.</Text>
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nome}>
            Olá, {primeiroNome}
          </Text>
        </View>
        {onStatusPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Status da proteção"
            onPress={onStatusPress}
            style={({ pressed }) => [styles.voltar, pressed && styles.pressionado]}
          >
            <Ionicons name="shield-checkmark-outline" size={21} color="#FFFFFF" />
          </Pressable>
        )}
        <View accessible={false} style={styles.avatarBorda}>
          <LinearGradient
            colors={['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.08)']}
            style={styles.avatar}
          >
            <Text style={styles.inicial}>{primeiroNome?.[0]?.toUpperCase() || 'G'}</Text>
          </LinearGradient>
          <View style={styles.avatarDetalhe}>
            <Ionicons name="heart" size={12} color={colors.guardiao.primaryDark} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
