import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router, useLocalSearchParams } from 'expo-router';

import { verifyEmail, resendEmail } from '@/features/auth/api/auth.api';

import { useCadastroStore } from '@/stores/cadastro.store';

import AppButton from '@/components/ui/AppButton';

import { authStyles as styles } from '../authStyles';

export default function ConfirmarEmailScreen() {
  const { email, perfil } = useLocalSearchParams();

  const isGuardiao = perfil === 'guardiao' || (Array.isArray(perfil) && perfil[0] === 'guardiao');

  const gradientColors = isGuardiao
    ? ['#8DCFE2', '#76B3C5', '#223A44']
    : ['#E95378', '#8B48C7', '#341E6D'];

  const emailExibido =
    typeof email === 'string' && email.length > 0 ? email : 'seuemail@exemplo.com';

  const [codigo, setCodigo] = useState('');

  const [reenviando, setReenviando] = useState(false);

  const [codigoEnviado, setCodigoEnviado] = useState(false);

  const formularioValido = codigo.trim().length === 6;

  const handleCodigoChange = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');

    setCodigo(onlyNumbers.slice(0, 6));
  };

  const handleConfirmar = async () => {
    if (!formularioValido) return;

    try {
      const resposta = await verifyEmail({
        email: emailExibido,
        code: codigo,
      });

      useCadastroStore.getState().definirAutorizacao(resposta.setupToken);
      router.push({
        pathname: '/(auth)/criarPin',
        params: {
          email: emailExibido,
          perfil: isGuardiao ? 'guardiao' : 'protegida',
        },
      });
    } catch (error) {
      Alert.alert(
        'Código inválido',
        error?.response?.data?.error ?? 'Não foi possível confirmar seu email.',
      );
    }
  };

  const handleReenviar = async () => {
    if (reenviando) return;
    setReenviando(true);
    setCodigoEnviado(false);
    try {
      await resendEmail({ email: emailExibido });
      setCodigoEnviado(true);
    } catch (error) {
      Alert.alert('Não foi possível reenviar', error?.response?.data?.error || 'Tente novamente.');
    } finally {
      setReenviando(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/perfil');
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}

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
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.scrollContent}

          showsVerticalScrollIndicator={false}

          keyboardShouldPersistTaps="handled"

          bounces={false}

          overScrollMode="never"

          style={{
            overscrollBehavior: 'none',
          }}
        >
          {/* BOTÃO DE VOLTAR */}

          <View style={styles.topNavigation}>
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}

              onPress={handleBack}

              hitSlop={8}
            >
              <Ionicons
                name="arrow-back"

                size={23}

                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <View style={styles.mainWrapper}>
            {/* INDICADOR DE PASSO */}

            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>PASSO 03 DE 03</Text>
              </View>

              <View style={styles.stepBarBackground}>
                <View style={styles.stepBarFillFull} />
              </View>
            </View>

            {/* CABEÇALHO */}

            <View style={styles.headerGroup}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail" size={32} color="#FFD000" />
              </View>

              <Text style={styles.titulo}>CONFIRME SEU E-MAIL</Text>

              <Text style={styles.subtitulo}>Enviamos um código de verificação para</Text>

              <Text style={styles.emailDestaque}>{emailExibido}</Text>
            </View>

            {/* CAMPO CÓDIGO */}

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CÓDIGO DE VERIFICAÇÃO</Text>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputCodigo}

                    placeholder="••••••"

                    placeholderTextColor="rgba(255, 255, 255, 0.4)"

                    value={codigo}

                    onChangeText={handleCodigoChange}

                    keyboardType="number-pad"

                    maxLength={6}
                  />
                </View>
              </View>

              {/* FEEDBACK DE REENVIO */}

              {codigoEnviado && (
                <View style={styles.feedbackContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFD000" />

                  <Text
                    style={[
                      styles.feedbackText,
                      {
                        color: '#FFD000',
                      },
                    ]}
                  >
                    Código reenviado com sucesso!
                  </Text>
                </View>
              )}
            </View>

            {/* BOTÕES */}

            <View style={styles.footerGroup}>
              <View style={styles.buttonContainer}>
                <AppButton
                  title="Confirmar"

                  disabled={!formularioValido}

                  onPress={handleConfirmar}
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.reenviarLink, pressed && styles.pressed]}

                onPress={handleReenviar}

                disabled={reenviando}
              >
                <Text style={styles.reenviarText}>
                  {reenviando ? 'Enviando...' : 'Não recebeu o código? '}

                  {!reenviando && <Text style={styles.reenviarBold}>Reenviar</Text>}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
