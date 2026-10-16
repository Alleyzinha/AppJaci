import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { colors, fontFamilies } from '@/styles/tokens';

import { Ionicons } from '@expo/vector-icons';

import { router, useLocalSearchParams } from 'expo-router';

import { verifyEmail, resendEmail } from '@/features/auth/api/auth.api';
import { mensagemErroApi } from '@/services/api/api';

import { useCadastroStore } from '@/stores/cadastro.store';

import AppButton from '@/components/ui/AppButton';

import { styles } from './styles';

export default function ConfirmarEmailScreen() {
  const { email, perfil, developmentCode } = useLocalSearchParams();

  const isGuardiao = perfil === 'guardiao' || (Array.isArray(perfil) && perfil[0] === 'guardiao');

  const perfilCores = isGuardiao ? colors.guardiao : colors.protegida;
  const perfilNome = isGuardiao ? 'Guardião' : 'Protegida';
  const emailExibido = typeof email === 'string' ? email : '';

  const codigoInicial = Array.isArray(developmentCode) ? developmentCode[0] : developmentCode;
  const [codigo, setCodigo] = useState(codigoInicial || '');
  const [codigoDesenvolvimento, setCodigoDesenvolvimento] = useState(codigoInicial || '');

  const [reenviando, setReenviando] = useState(false);

  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  const [confirmando, setConfirmando] = useState(false);

  const formularioValido = codigo.trim().length === 6;

  const handleCodigoChange = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');

    setCodigo(onlyNumbers.slice(0, 6));
  };

  const handleConfirmar = async () => {
    if (!formularioValido || confirmando) return;
    setConfirmando(true);
    setErroConfirmacao('');

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
      setErroConfirmacao(mensagemErroApi(error, 'Não foi possível confirmar seu e-mail.'));
    } finally {
      setConfirmando(false);
    }
  };

  const handleReenviar = async () => {
    if (reenviando) return;
    setReenviando(true);
    setCodigoEnviado(false);
    setErroConfirmacao('');
    try {
      const resposta = await resendEmail({ email: emailExibido });
      const codigoLocal = resposta.developmentCode || '';
      setCodigoDesenvolvimento(codigoLocal);
      if (codigoLocal) setCodigo(codigoLocal);
      setCodigoEnviado(true);
    } catch (error) {
      setErroConfirmacao(mensagemErroApi(error, 'Não foi possível reenviar o código.'));
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            Confirme seu e-mail
          </Text>
          <Text style={styles.subtitle}>Enviamos um código de verificação para</Text>
          <Text style={[styles.email, { color: perfilCores.authAccentDark }]}>{emailExibido}</Text>
        </View>
        <Text
          style={[
            styles.confirmationHint,
            { backgroundColor: perfilCores.authSurface, color: perfilCores.authAccentDark },
          ]}
        >
          Digite o código de seis números recebido por e-mail para continuar seu cadastro.
        </Text>
        {codigoDesenvolvimento ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.confirmationHint,
              { backgroundColor: perfilCores.authSurface, color: perfilCores.authAccentDark },
            ]}
          >
            Código local de desenvolvimento: {codigoDesenvolvimento}
          </Text>
        ) : null}
        <View style={styles.codeSection}>
          <Text style={styles.pinLabel}>Código de verificação</Text>
          <TextInput
            accessibilityLabel="Código de verificação de seis dígitos"
            style={[styles.codeInput, { borderColor: perfilCores.authAccent }]}
            placeholder="000000"
            placeholderTextColor={colors.authEntry.placeholder}
            value={codigo}
            onChangeText={handleCodigoChange}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            editable={!confirmando}
            onSubmitEditing={handleConfirmar}
          />
          {codigoEnviado ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.feedback, { color: perfilCores.authAccentDark }]}
            >
              Código reenviado com sucesso!
            </Text>
          ) : null}
          {erroConfirmacao ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {erroConfirmacao}
            </Text>
          ) : null}
        </View>
        <View style={styles.footer}>
          <AppButton
            title="Confirmar e-mail"
            loading={confirmando}
            disabled={!formularioValido}
            fontFamily={fontFamilies.bodyBold}
            colors={[perfilCores.authAccentDark, perfilCores.authAccentDark]}
            disabledColors={[colors.authEntry.disabled, colors.authEntry.disabled]}
            textColor={colors.common.white}
            disabledTextColor={colors.authEntry.disabledText}
            onPress={handleConfirmar}
          />
          <Pressable
            accessibilityRole="button"
            disabled={reenviando || confirmando}
            onPress={handleReenviar}
            style={({ pressed }) => [styles.resend, pressed && styles.pressed]}
          >
            <Text style={styles.resendText}>
              {reenviando ? 'Enviando...' : 'Não recebeu o código? '}
              {!reenviando ? (
                <Text style={[styles.resendEmphasis, { color: perfilCores.authAccentDark }]}>
                  Reenviar
                </Text>
              ) : null}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
