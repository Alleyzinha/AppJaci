import { SafeAreaView } from 'react-native-safe-area-context';
import { useCadastroStore } from '@/stores/cadastro.store';
import React, { useState } from 'react';

import { Pressable, ScrollView, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import AppButton from '@/components/ui/AppButton';
import { colors, fontFamilies } from '@/styles/tokens';

import { styles } from './styles';

const PIN_LENGTH = 4;
const DIGIT_ACCESSIBLE_LABELS = {
  0: 'Zero',
  1: 'Um',
  2: 'Dois',
  3: 'Três',
  4: 'Quatro',
  5: 'Cinco',
  6: 'Seis',
  7: 'Sete',
  8: 'Oito',
  9: 'Nove',
};

function normalizarPerfil(perfil) {
  const value = Array.isArray(perfil) ? perfil[0] : perfil;
  return value === 'protegida' || value === 'guardiao' ? value : null;
}

export default function CriarPinScreen() {
  const { email, perfil: perfilParam } = useLocalSearchParams();
  const perfil = normalizarPerfil(perfilParam);
  const isGuardiao = perfil === 'guardiao';
  const perfilNome = isGuardiao ? 'Guardião' : 'Protegida';
  const perfilCores = isGuardiao ? colors.guardiao : colors.protegida;

  const [pin, setPin] = useState('');
  const [pinArray, setPinArray] = useState([]);
  const formularioValido = pinArray.length === PIN_LENGTH;

  if (!perfil) {
    return <Redirect href="/(auth)/perfil?intent=signup" />;
  }

  const handleDigitPress = (digit) => {
    if (pinArray.length >= PIN_LENGTH) return;

    const novoPin = [...pinArray, digit];
    setPinArray(novoPin);
    setPin(novoPin.join(''));
  };

  const handleDeletePress = () => {
    if (!pinArray.length) return;

    const novoPin = pinArray.slice(0, -1);
    setPinArray(novoPin);
    setPin(novoPin.join(''));
  };

  const handleContinuar = () => {
    if (!formularioValido) return;

    useCadastroStore.getState().definirPin(pin);
    router.push({
      pathname: '/(auth)/confirmar-pin',
      params: {
        email: typeof email === 'string' ? email : '',
        perfil,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(auth)');
  };

  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={handleBack}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.authEntry.heading} />
          </Pressable>
          <Text accessibilityLabel="Jaci" style={styles.brandName}>
            jaci<Text style={styles.brandPeriod}>.</Text>
          </Text>
          <Text style={[styles.profileLabel, { color: perfilCores.authAccentDark }]}>
            {perfilNome}
          </Text>
        </View>

        <View style={styles.intro}>
          <Text accessibilityRole="header" style={styles.title}>
            Crie seu PIN
          </Text>
          <Text style={styles.subtitle}>Escolha quatro números para acessar sua conta.</Text>
        </View>

        <Text
          accessibilityRole="text"
          style={[
            styles.confirmationHint,
            { backgroundColor: perfilCores.authSurface, color: perfilCores.authAccentDark },
          ]}
        >
          Na próxima tela, você vai digitar o mesmo PIN novamente para confirmar.
        </Text>

        <View style={styles.pinSection}>
          <View style={styles.pinCountRow}>
            <Text style={styles.pinLabel}>Seu PIN</Text>
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.pinCount, { color: perfilCores.authAccentDark }]}
            >
              {pinArray.length} de {PIN_LENGTH} dígitos
            </Text>
          </View>
          <View
            accessibilityRole="group"
            accessibilityLabel={`PIN oculto, ${pinArray.length} de quatro dígitos preenchidos`}
            style={styles.pinContainer}
          >
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const preenchido = index < pinArray.length;
              const atual = index === pinArray.length && !formularioValido;
              return (
                <View
                  key={index}
                  accessible={false}
                  style={[
                    styles.pinSlot,
                    preenchido && {
                      backgroundColor: perfilCores.authSurface,
                      borderColor: perfilCores.authSurface,
                    },
                    atual &&
                      !preenchido && { borderColor: perfilCores.authAccent, borderStyle: 'dashed' },
                  ]}
                >
                  {preenchido ? (
                    <View
                      style={[styles.pinDot, { backgroundColor: perfilCores.authAccentDark }]}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View accessibilityLabel="Teclado numérico" style={styles.keypadContainer}>
          {teclas.map((tecla, index) => {
            if (tecla === '') {
              return (
                <View key={`spacer-${index}`} accessible={false} style={styles.keypadSpacer} />
              );
            }

            if (tecla === 'del') {
              return (
                <Pressable
                  key="delete"
                  accessibilityRole="button"
                  accessibilityLabel="Apagar último número"
                  accessibilityHint="Remove o último dígito informado"
                  accessibilityState={{ disabled: pinArray.length === 0 }}
                  disabled={pinArray.length === 0}
                  onPress={handleDeletePress}
                  style={({ pressed }) => [
                    styles.keypadDelete,
                    { backgroundColor: perfilCores.authSurface },
                    pressed && styles.keypadPressed,
                    pinArray.length === 0 && styles.keypadDisabled,
                  ]}
                >
                  <Ionicons name="backspace-outline" size={23} color={perfilCores.authAccentDark} />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={tecla}
                accessibilityRole="button"
                accessibilityLabel={DIGIT_ACCESSIBLE_LABELS[tecla]}
                accessibilityHint="Adiciona este dígito ao PIN oculto"
                accessibilityState={{ disabled: formularioValido }}
                disabled={formularioValido}
                onPress={() => handleDigitPress(tecla)}
                style={({ pressed }) => [
                  styles.keypadKey,
                  pressed && styles.keypadPressed,
                  formularioValido && styles.keypadDisabled,
                ]}
              >
                <Text style={styles.keypadText}>{tecla}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Continuar para confirmar"
            disabled={!formularioValido}
            fontFamily={fontFamilies.bodyBold}
            colors={[perfilCores.authAccentDark, perfilCores.authAccentDark]}
            disabledColors={[colors.authEntry.disabled, colors.authEntry.disabled]}
            textColor={colors.common.white}
            disabledTextColor={colors.authEntry.disabledText}
            onPress={handleContinuar}
          />
          <Text accessibilityLiveRegion="polite" style={styles.pinHint}>
            {formularioValido
              ? 'PIN completo. Toque para continuar quando estiver pronto.'
              : `Digite mais ${PIN_LENGTH - pinArray.length} número${PIN_LENGTH - pinArray.length === 1 ? '' : 's'} para continuar.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
