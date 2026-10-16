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
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema } from '@/features/auth/schemas/login.schema';
import { mensagemErroApi } from '@/services/api/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamilies } from '@/styles/tokens';

import { styles } from './styles';

function normalizarPerfil(perfil) {
  const value = Array.isArray(perfil) ? perfil[0] : perfil;
  return value === 'protegida' || value === 'guardiao' ? value : null;
}

function normalizarEmail(email) {
  return typeof email === 'string' ? email : Array.isArray(email) ? email[0] || '' : '';
}

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const perfilSelecionado = normalizarPerfil(params.perfil);
  const isProtegida = perfilSelecionado === 'protegida';
  const perfilNome = isProtegida ? 'Protegida' : 'Guardião';
  const perfilCores = isProtegida ? colors.protegida : colors.guardiao;
  const emailInicial = normalizarEmail(params.email);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [campoFocado, setCampoFocado] = useState(null);

  const signIn = useAuthStore((state) => state.signIn);
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setFocus,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailInicial,
      password: '',
    },
  });

  if (!perfilSelecionado) {
    return <Redirect href="/(auth)/perfil?intent=login" />;
  }

  const handleLogin = async (data) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
        profile: perfilSelecionado,
      });

      if (response.user.profile !== perfilSelecionado) {
        setError('password', {
          type: 'server',
          message:
            'Esta conta está cadastrada em outro perfil. Toque em “Trocar perfil” para entrar.',
        });
        return;
      }

      await signIn({
        token: response.accessToken,
        perfil: response.user.profile,
        userName: response.user.name,
        userId: response.user.id,
      });

      if (response.user.profile === 'protegida') {
        router.replace('/protegida');
      } else {
        router.replace('/guardiao');
      }
    } catch (error) {
      setError('password', {
        type: 'server',
        message: mensagemErroApi(error, 'Não foi possível entrar. Tente novamente.'),
      });
    }
  };

  const handleTrocarPerfil = () => {
    const emailAtual = getValues('email');
    router.push({
      pathname: '/(auth)/perfil',
      params: {
        intent: 'login',
        ...(emailAtual ? { email: emailAtual } : {}),
      },
    });
  };

  const handleCadastro = () => {
    router.push({
      pathname: '/(auth)/cadastro',
      params: { perfil: perfilSelecionado },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)');
    }
  };

  const getInputWrapperStyle = (name, hasError) => [
    styles.inputWrapper,
    campoFocado === name && [styles.inputWrapperFocused, { borderColor: perfilCores.authAccent }],
    hasError && styles.inputWrapperError,
  ];

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

          <View style={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              Que bom ter você por aqui.
            </Text>
            <Text style={styles.subtitle}>Entre para acessar sua conta Jaci.</Text>

            <View style={styles.profileContext}>
              <View>
                <Text style={styles.contextLabel}>Perfil de acesso</Text>
                <Text style={[styles.contextValue, { color: perfilCores.authAccentDark }]}>
                  {perfilNome}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Trocar perfil de acesso"
                onPress={handleTrocarPerfil}
                style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}
              >
                <Text style={[styles.textActionLabel, { color: perfilCores.authAccentDark }]}>
                  Trocar perfil
                </Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text nativeID="login-email-label" style={styles.label}>
                  E-mail
                </Text>
                <View style={getInputWrapperStyle('email', Boolean(errors.email))}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <TextInput
                        accessibilityLabel="E-mail"
                        accessibilityHint={errors.email?.message}
                        nativeID="login-email"
                        style={styles.input}
                        placeholder="seuemail@exemplo.com"
                        placeholderTextColor={colors.authEntry.placeholder}
                        value={field.value}
                        onChangeText={field.onChange}
                        onFocus={() => setCampoFocado('email')}
                        onBlur={() => {
                          field.onBlur();
                          setCampoFocado(null);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus('password')}
                      />
                    )}
                  />
                </View>
                {errors.email?.message ? (
                  <Text accessibilityRole="alert" style={styles.errorText}>
                    {errors.email.message}
                  </Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordLabelRow}>
                  <Text nativeID="login-password-label" style={styles.label}>
                    Senha
                  </Text>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Esqueci minha senha"
                    onPress={() =>
                      router.push({
                        pathname: '/(auth)/esqueci-senha',
                        params: { perfil: perfilSelecionado },
                      })
                    }
                    style={({ pressed }) => [styles.recoveryAction, pressed && styles.pressed]}
                  >
                    <Text style={[styles.textActionLabel, { color: perfilCores.authAccentDark }]}>
                      Esqueci minha senha
                    </Text>
                  </Pressable>
                </View>
                <View style={getInputWrapperStyle('password', Boolean(errors.password))}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <TextInput
                        accessibilityLabel="Senha"
                        accessibilityHint={errors.password?.message}
                        nativeID="login-password"
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor={colors.authEntry.placeholder}
                        value={field.value}
                        onChangeText={field.onChange}
                        secureTextEntry={!mostrarSenha}
                        onFocus={() => setCampoFocado('password')}
                        onBlur={() => {
                          field.onBlur();
                          setCampoFocado(null);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="current-password"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(handleLogin)}
                      />
                    )}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    accessibilityState={{ selected: mostrarSenha }}
                    onPress={() => setMostrarSenha((value) => !value)}
                    style={styles.eyeButton}
                    hitSlop={4}
                  >
                    <Ionicons
                      name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.authEntry.body}
                    />
                  </Pressable>
                </View>
                {errors.password?.message ? (
                  <Text accessibilityRole="alert" style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                ) : null}
              </View>

              <AppButton
                title="Entrar"
                loadingLabel="Entrando..."
                loading={loginMutation.isPending}
                fontFamily={fontFamilies.bodyBold}
                colors={[perfilCores.authAccentDark, perfilCores.authAccentDark]}
                textColor={colors.common.white}
                onPress={handleSubmit(handleLogin)}
              />
            </View>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>Ainda não tem conta?</Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Criar conta"
                onPress={handleCadastro}
                style={({ pressed }) => [styles.signupLinkButton, pressed && styles.pressed]}
              >
                <Text style={[styles.signupLink, { color: perfilCores.authAccentDark }]}>
                  Criar conta
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
