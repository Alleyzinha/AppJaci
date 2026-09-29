import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  Alert,
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

import AppButton from '@/components/ui/AppButton';
import { resetPassword } from '@/features/auth/api/auth.api';
import { styles } from './styles';

export default function RedefinirSenhaScreen() {
  const { email, perfil } = useLocalSearchParams();
  const isGuardiao = perfil === 'guardiao' || (Array.isArray(perfil) && perfil[0] === 'guardiao');
  const emailValue = Array.isArray(email) ? email[0] : email || '';
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!/^\d{6}$/.test(code)) {
      setError('Informe o código de 6 dígitos recebido por email.');
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError('A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword({ email: emailValue, code, password });
      Alert.alert('Senha alterada', 'Sua senha foi alterada. Faça login novamente.', [
        {
          text: 'OK',
          onPress: () =>
            router.replace({
              pathname: '/(auth)/login',
              params: { perfil: isGuardiao ? 'guardiao' : 'protegida', email: emailValue },
            }),
        },
      ]);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isGuardiao ? ['#8DCFE2', '#76B3C5', '#223A44'] : ['#E95378', '#8B48C7', '#341E6D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.safeArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topNavigation}>
              <Pressable
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.mainWrapper}>
              <View style={styles.headerGroup}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-open-outline" size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.titulo}>ALTERAR SENHA</Text>
                <Text style={styles.subtitulo}>
                  Digite o código recebido e crie uma nova senha.
                </Text>
              </View>
              <View style={styles.formGroup}>
                <Field
                  label="CÓDIGO"
                  icon="key-outline"
                  value={code}
                  onChange={setCode}
                  placeholder="000000"
                  keyboardType="number-pad"
                  error={error && !/^\d{6}$/.test(code) ? error : ''}
                />
                <Field
                  label="NOVA SENHA"
                  icon="lock-closed-outline"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  error={error && password !== confirmPassword ? error : ''}
                />
                <Field
                  label="CONFIRMAR SENHA"
                  icon="lock-closed-outline"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  error={error && password === confirmPassword ? error : ''}
                />
              </View>
              <View style={styles.footerGroup}>
                <View style={styles.buttonContainer}>
                  <AppButton title="Salvar nova senha" loading={loading} onPress={handleReset} />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  keyboardType,
  secureTextEntry,
  error,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
