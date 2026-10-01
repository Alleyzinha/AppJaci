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

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router, useLocalSearchParams } from 'expo-router';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import AppButton from '@/components/ui/AppButton';

import { useLogin } from '@/features/auth/hooks/useLogin';

import { loginSchema } from '@/features/auth/schemas/login.schema';

import { useAuthStore } from '@/stores/auth.store';
import { mensagemErroApi } from '@/services/api/api';

import { styles } from './styles';

export default function LoginScreen() {
  /*
   * Recupera o perfil enviado pela
   * tela de escolha de perfil.
   */

  const { perfil } = useLocalSearchParams();

  const perfilSelecionado = Array.isArray(perfil) ? perfil[0] : perfil;

  const isProtegida = perfilSelecionado === 'protegida';

  /*
   * Textos e ícone por perfil.
   */

  const titulo = isProtegida ? 'BEM-VINDA PROTEGIDA' : 'BEM-VINDO GUARDIÃO';

  const subtitulo = isProtegida
    ? 'Faça login para acessar sua conta'
    : 'Faça login para acessar sua conta';

  const headerIcon = isProtegida ? 'shield-checkmark' : 'people-circle';

  const gradientColors = isProtegida
    ? ['#E95378', '#8B48C7', '#341E6D']
    : ['#8DCFE2', '#76B3C5', '#223A44'];

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);

  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const password = watch('password');

  const handleLogin = async (data) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      // Salva a sessão
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

  /*
   * Cadastro deve preservar
   * o perfil selecionado.
   */

  const handleCadastro = () => {
    router.push({
      pathname: '/(auth)/cadastro',

      params: {
        perfil: isProtegida ? 'protegida' : 'guardiao',
      },
    });
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
        <KeyboardAvoidingView
          style={styles.safeArea}

          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
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
              {/* CABEÇALHO */}

              <View style={styles.headerGroup}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={headerIcon}

                    size={34}

                    color="#FFD000"
                  />
                </View>

                <Text style={styles.titulo}>{titulo}</Text>

                <Text style={styles.subtitulo}>{subtitulo}</Text>
              </View>

              {/* FORMULÁRIO */}

              <View style={styles.formGroup}>
                {/* CAMPO EMAIL */}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>E-MAIL</Text>

                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"

                      size={20}

                      color="rgba(255, 255, 255, 0.7)"

                      style={styles.inputIcon}
                    />

                    <Controller
                      control={control}

                      name="email"

                      render={({ field }) => (
                        <TextInput
                          style={styles.input}

                          placeholder="seuemail@exemplo.com"

                          placeholderTextColor="rgba(255, 255, 255, 0.4)"

                          value={field.value}

                          onChangeText={field.onChange}

                          keyboardType="email-address"

                          autoCapitalize="none"

                          autoCorrect={false}
                        />
                      )}
                    />
                  </View>

                  {errors.email?.message && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>

                {/* CAMPO SENHA */}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>SENHA</Text>

                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"

                      size={20}

                      color="rgba(255, 255, 255, 0.7)"

                      style={styles.inputIcon}
                    />

                    <Controller
                      control={control}

                      name="password"

                      render={({ field }) => (
                        <TextInput
                          style={styles.input}

                          placeholder="••••••••"

                          placeholderTextColor="rgba(255, 255, 255, 0.4)"

                          value={field.value}

                          onChangeText={field.onChange}

                          secureTextEntry={!mostrarSenha}

                          autoCapitalize="none"

                          autoCorrect={false}
                        />
                      )}
                    />

                    <Pressable
                      onPress={() => setMostrarSenha(!mostrarSenha)}

                      style={styles.eyeIcon}

                      hitSlop={8}
                    >
                      <Ionicons
                        name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}

                        size={20}

                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </Pressable>
                  </View>

                  {errors.password?.message && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [styles.cadastroLink, pressed && styles.pressed]}
                  onPress={() =>
                    router.push({
                      pathname: '/(auth)/esqueci-senha',
                      params: {
                        perfil: isProtegida ? 'protegida' : 'guardiao',
                      },
                    })
                  }
                >
                  <Text style={styles.cadastroBold}>Esqueci minha senha</Text>
                </Pressable>
              </View>

              {/* BOTÃO ENTRAR */}

              <View style={styles.footerGroup}>
                <View style={styles.buttonContainer}>
                  <AppButton
                    title="Entrar"

                    loading={loginMutation.isPending}

                    onPress={handleSubmit(handleLogin)}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.cadastroLink, pressed && styles.pressed]}

                  onPress={handleCadastro}
                >
                  <Text style={styles.cadastroText}>
                    Não tem uma conta? <Text style={styles.cadastroBold}>Criar</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
