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

import { useRegister } from '@/features/auth/hooks/useRegister';

import { registerSchema } from '@/features/auth/schemas/register.schema';
import { mensagemErroApi } from '@/services/api/api';

import { styles } from './styles';

export default function CadastroScreen() {
  /*
   * Recupera o perfil enviado
   * pela tela de escolha de perfil.
   */

  const { perfil } = useLocalSearchParams();

  const perfilSelecionado = Array.isArray(perfil) ? perfil[0] : perfil;

  const isProtegida = perfilSelecionado === 'protegida';

  const headerIcon = isProtegida ? 'shield-checkmark' : 'people-circle';

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');

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

  const name = watch('name');
  const email = watch('email');
  const phone = watch('phone');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const senhasCoincidem = confirmPassword.length > 0 && password === confirmPassword;

  const handleCadastrar = async (data) => {
    setErroCadastro('');
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        profile: isProtegida ? 'protegida' : 'guardiao',
      });

      /*
       * Segue para a confirmação
       * de e-mail (PASSO 03).
       */

      router.push({
        pathname: '/(auth)/confirmar-email',

        params: {
          email: data.email,

          perfil: isProtegida ? 'protegida' : 'guardiao',
        },
      });
    } catch (error) {
      setErroCadastro(mensagemErroApi(error, 'Não foi possível realizar o cadastro.'));
    }
  };

  const handleLogin = () => {
    router.push({
      pathname: '/(auth)/login',

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

  const renderCampo = (label, name, iconName, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          name === 'confirmPassword' &&
            confirmPassword.length > 0 &&
            !senhasCoincidem &&
            styles.inputError,
        ]}
      >
        <Ionicons
          name={iconName}

          size={20}

          color="rgba(255, 255, 255, 0.7)"

          style={styles.inputIcon}
        />

        <Controller
          control={control}

          name={name}

          render={({ field }) => (
            <TextInput
              style={styles.input}

              value={field.value}

              onChangeText={field.onChange}

              {...options}
            />
          )}
        />

        {options.secureTextEntry !== undefined && (
          <Pressable
            onPress={() =>
              name === 'password'
                ? setMostrarSenha(!mostrarSenha)
                : setMostrarConfirmarSenha(!mostrarConfirmarSenha)
            }

            style={styles.eyeIcon}

            hitSlop={8}
          >
            <Ionicons
              name={
                (name === 'password' ? mostrarSenha : mostrarConfirmarSenha)
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }

              size={20}

              color="rgba(255, 255, 255, 0.7)"
            />
          </Pressable>
        )}
      </View>

      {name === 'confirmPassword' && confirmPassword.length > 0 && (
        <Text
          style={[styles.feedbackText, senhasCoincidem ? styles.validText : styles.invalidText]}
        >
          {senhasCoincidem ? 'As senhas coincidem' : 'As senhas não coincidem'}
        </Text>
      )}

      {errors[name]?.message && <Text style={styles.invalidText}>{errors[name].message}</Text>}
    </View>
  );

  return (
    <LinearGradient
      colors={isProtegida ? ['#E95378', '#8B48C7', '#341E6D'] : ['#8DCFE2', '#76B3C5', '#223A44']}

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
          style={styles.keyboard}

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
              {/* INDICADOR DE PASSO */}

              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>PASSO 02 DE 03</Text>
                </View>

                <View style={styles.stepBarBackground}>
                  <View
                    style={[
                      styles.stepBarFill,
                      {
                        width: '66%',
                      },
                    ]}
                  />
                </View>
              </View>

              {/* CABEÇALHO */}

              <View style={styles.headerGroup}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={headerIcon}

                    size={34}

                    color="#FFD000"
                  />
                </View>

                <Text style={styles.titulo}>
                  {isProtegida ? 'CADASTRO PROTEGIDA' : 'CADASTRO GUARDIÃO'}
                </Text>

                <Text style={styles.subtitulo}>
                  Crie sua conta de forma segura para acessar a plataforma Jaci
                </Text>
              </View>

              {/* FORMULÁRIO */}

              <View style={styles.formGroup}>
                {renderCampo('NOME COMPLETO', 'name', 'person-outline', {
                  placeholder: 'Digite seu nome',
                  placeholderTextColor: 'rgba(255, 255, 255, 0.4)',
                  autoCapitalize: 'words',
                })}

                {renderCampo('E-MAIL', 'email', 'mail-outline', {
                  placeholder: 'seuemail@exemplo.com',
                  placeholderTextColor: 'rgba(255, 255, 255, 0.4)',
                  keyboardType: 'email-address',
                  autoCapitalize: 'none',
                  autoCorrect: false,
                })}

                {renderCampo('TELEFONE', 'phone', 'call-outline', {
                  placeholder: '11 91234-5678',
                  placeholderTextColor: 'rgba(255, 255, 255, 0.4)',
                  keyboardType: 'phone-pad',
                })}

                {renderCampo('SENHA', 'password', 'lock-closed-outline', {
                  placeholder: '••••••••',
                  placeholderTextColor: 'rgba(255, 255, 255, 0.4)',
                  secureTextEntry: !mostrarSenha,
                  autoCapitalize: 'none',
                })}

                {renderCampo('CONFIRMAR SENHA', 'confirmPassword', 'lock-closed-outline', {
                  placeholder: '••••••••',
                  placeholderTextColor: 'rgba(255, 255, 255, 0.4)',
                  secureTextEntry: !mostrarConfirmarSenha,
                  autoCapitalize: 'none',
                })}
              </View>

              {/* BOTÃO CADASTRAR */}

              <View style={styles.footerGroup}>
                {erroCadastro ? (
                  <Text accessibilityRole="alert" style={styles.invalidText}>
                    {erroCadastro}
                  </Text>
                ) : null}
                <View style={styles.buttonContainer}>
                  <AppButton
                    title="Continuar"

                    loading={registerMutation.isPending}

                    onPress={handleSubmit(handleCadastrar)}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.cadastroLink, pressed && styles.pressed]}

                  onPress={handleLogin}
                >
                  <Text style={styles.cadastroText}>
                    Já tem uma conta? <Text style={styles.cadastroBold}>Entrar</Text>
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
