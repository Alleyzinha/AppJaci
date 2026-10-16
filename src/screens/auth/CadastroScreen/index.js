import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AppButton from '@/components/ui/AppButton';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema } from '@/features/auth/schemas/register.schema';
import { mensagemErroApi } from '@/services/api/api';
import { colors, fontFamilies, spacing } from '@/styles/tokens';

import { styles } from './styles';

function normalizarPerfil(perfil) {
  const value = Array.isArray(perfil) ? perfil[0] : perfil;
  return value === 'protegida' || value === 'guardiao' ? value : null;
}

const REGRAS_SENHA = [
  { id: 'length', label: 'Pelo menos 8 caracteres', test: (value) => value.length >= 8 },
  { id: 'upper', label: 'Uma letra maiúscula', test: (value) => /[A-Z]/.test(value) },
  { id: 'lower', label: 'Uma letra minúscula', test: (value) => /[a-z]/.test(value) },
  { id: 'number', label: 'Um número', test: (value) => /[0-9]/.test(value) },
  { id: 'symbol', label: 'Um símbolo', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export default function CadastroScreen() {
  const { perfil } = useLocalSearchParams();
  const perfilSelecionado = normalizarPerfil(perfil);
  const isProtegida = perfilSelecionado === 'protegida';
  const perfilNome = isProtegida ? 'Protegida' : 'Guardião';
  const perfilCores = isProtegida ? colors.protegida : colors.guardiao;
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');
  const [campoFocado, setCampoFocado] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useRegister();
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const senhasCoincidem = confirmPassword.length > 0 && password === confirmPassword;
  const senhaTemDiferenca = confirmPassword.length > 0 && password !== confirmPassword;

  if (!perfilSelecionado) {
    return <Redirect href="/(auth)/perfil?intent=signup" />;
  }

  const handleCadastrar = async (data) => {
    setErroCadastro('');

    try {
      const resposta = await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        profile: isProtegida ? 'protegida' : 'guardiao',
      });

      router.push({
        pathname: '/(auth)/confirmar-email',
        params: {
          email: data.email,
          perfil: isProtegida ? 'protegida' : 'guardiao',
          ...(resposta.developmentCode ? { developmentCode: resposta.developmentCode } : {}),
        },
      });
    } catch (error) {
      setErroCadastro(mensagemErroApi(error, 'Não foi possível realizar o cadastro.'));
    }
  };

  const handleLogin = () => {
    router.push({
      pathname: '/(auth)/login',
      params: { perfil: isProtegida ? 'protegida' : 'guardiao' },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(auth)/perfil?intent=signup');
  };

  const renderCampo = (label, name, options = {}) => {
    const erro = errors[name]?.message;
    const focado = campoFocado === name;
    const passwordField = name === 'password' || name === 'confirmPassword';
    const isPasswordVisible = name === 'password' ? mostrarSenha : mostrarConfirmarSenha;

    return (
      <View style={styles.inputContainer} key={name}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            focado && { borderColor: perfilCores.authAccent, borderWidth: 2 },
            erro && styles.inputWrapperError,
            name === 'confirmPassword' && senhaTemDiferenca && styles.inputWrapperError,
          ]}
        >
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <TextInput
                accessibilityLabel={label}
                accessibilityHint={erro}
                nativeID={`cadastro-${name}`}
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                onFocus={() => setCampoFocado(name)}
                onBlur={() => {
                  field.onBlur();
                  setCampoFocado(null);
                }}
                {...options}
                secureTextEntry={
                  name === 'password'
                    ? !mostrarSenha
                    : name === 'confirmPassword'
                      ? !mostrarConfirmarSenha
                      : options.secureTextEntry
                }
              />
            )}
          />
          {passwordField && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible
                  ? `Ocultar ${label.toLowerCase()}`
                  : `Mostrar ${label.toLowerCase()}`
              }
              accessibilityState={{ selected: isPasswordVisible }}
              onPress={() =>
                name === 'password'
                  ? setMostrarSenha((value) => !value)
                  : setMostrarConfirmarSenha((value) => !value)
              }
              style={styles.eyeButton}
              hitSlop={4}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.authEntry.body}
              />
            </Pressable>
          )}
        </View>
        {erro ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            {erro}
          </Text>
        ) : null}
        {name === 'confirmPassword' && !erro && senhaTemDiferenca ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            As senhas não coincidem
          </Text>
        ) : null}
        {name === 'confirmPassword' && senhasCoincidem ? (
          <Text style={styles.successText}>As senhas coincidem</Text>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
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
          </View>

          <View style={styles.intro}>
            <Text style={[styles.profileLabel, { color: perfilCores.authAccentDark }]}>
              Conta {perfilNome}
            </Text>
            <Text accessibilityRole="header" style={styles.title}>
              Crie sua conta
            </Text>
            <Text style={styles.description}>
              Um espaço de acolhimento, proteção e cuidado. No seu tempo.
            </Text>
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>Já tem uma conta?</Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Entrar na sua conta"
                onPress={handleLogin}
                style={({ pressed }) => [styles.loginLinkButton, pressed && styles.pressed]}
              >
                <Text style={[styles.loginLink, { color: perfilCores.authAccentDark }]}>
                  Entrar
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.contactGroup}>
              <Text style={styles.groupTitle}>Seus dados</Text>
              {renderCampo('Nome completo', 'name', {
                placeholder: 'Ex.: Ana Silva',
                placeholderTextColor: colors.authEntry.placeholder,
                autoCapitalize: 'words',
                autoComplete: 'name',
                textContentType: 'name',
                returnKeyType: 'next',
              })}
              {renderCampo('E-mail', 'email', {
                placeholder: 'seuemail@exemplo.com',
                placeholderTextColor: colors.authEntry.placeholder,
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                autoCorrect: false,
                autoComplete: 'email',
                textContentType: 'emailAddress',
                returnKeyType: 'next',
              })}
              {renderCampo('Telefone', 'phone', {
                placeholder: '(11) 91234-5678',
                placeholderTextColor: colors.authEntry.placeholder,
                keyboardType: 'phone-pad',
                autoComplete: 'tel',
                textContentType: 'telephoneNumber',
                returnKeyType: 'next',
              })}
            </View>

            <View style={styles.passwordGroup}>
              <Text style={styles.groupTitle}>Crie uma senha</Text>
              {renderCampo('Senha', 'password', {
                placeholder: 'Digite sua senha',
                placeholderTextColor: colors.authEntry.placeholder,
                autoCapitalize: 'none',
                autoCorrect: false,
                autoComplete: 'new-password',
                textContentType: 'newPassword',
                returnKeyType: 'next',
              })}

              <View
                style={[styles.passwordRequirements, { backgroundColor: perfilCores.authSurface }]}
                accessibilityLabel="Sua senha precisa ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo."
              >
                <Text style={styles.passwordRequirementsTitle}>Sua senha precisa ter:</Text>
                <View style={styles.passwordRequirementsList}>
                  {REGRAS_SENHA.map((regra) => {
                    const atendida = regra.test(password);
                    return (
                      <View key={regra.id} style={styles.passwordRule}>
                        <Ionicons
                          name={atendida ? 'checkmark-circle' : 'ellipse-outline'}
                          size={15}
                          color={atendida ? colors.common.success : perfilCores.authAccentDark}
                        />
                        <Text
                          style={[styles.passwordRuleText, atendida && styles.passwordRuleTextMet]}
                        >
                          {regra.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {renderCampo('Confirmar senha', 'confirmPassword', {
                placeholder: 'Digite a senha novamente',
                placeholderTextColor: colors.authEntry.placeholder,
                autoCapitalize: 'none',
                autoCorrect: false,
                autoComplete: 'new-password',
                textContentType: 'newPassword',
                returnKeyType: 'done',
                onSubmitEditing: handleSubmit(handleCadastrar),
              })}
            </View>

            {erroCadastro ? (
              <Text accessibilityRole="alert" style={styles.serverError}>
                {erroCadastro}
              </Text>
            ) : null}

            <AppButton
              title="Cadastrar e verificar e-mail"
              loading={registerMutation.isPending}
              loadingLabel="Enviando cadastro..."
              fontFamily={fontFamilies.bodyBold}
              colors={[perfilCores.authAccentDark, perfilCores.authAccentDark]}
              textColor={colors.common.white}
              onPress={handleSubmit(handleCadastrar)}
            />
            <Text style={styles.nextStep}>Próxima etapa: confirmar seu e-mail.</Text>
          </View>

          <Text style={styles.footer}>Cuidado que conecta</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
