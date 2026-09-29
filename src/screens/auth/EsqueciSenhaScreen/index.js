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
import { requestPasswordReset } from '@/features/auth/api/auth.api';

import { styles } from './styles';

export default function EsqueciSenhaScreen() {
  const { perfil } = useLocalSearchParams();
  const isGuardiao = perfil === 'guardiao' || (Array.isArray(perfil) && perfil[0] === 'guardiao');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviar = async () => {
    const emailNormalizado = email.trim().toLowerCase();
    setMensagem('');

    if (!emailNormalizado) {
      setErro('Informe seu email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      setErro('Informe um email válido.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await requestPasswordReset({ email: emailNormalizado });
      router.push({
        pathname: '/(auth)/redefinir-senha',
        params: {
          email: emailNormalizado,
          perfil: isGuardiao ? 'guardiao' : 'protegida',
        },
      });
    } catch (error) {
      Alert.alert('Erro', error?.response?.data?.error ?? 'Não foi possível enviar o código.');
    } finally {
      setCarregando(false);
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
                  <Ionicons name="mail-outline" size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.titulo}>ESQUECI A SENHA</Text>
                <Text style={styles.subtitulo}>
                  Informe seu email e enviaremos um código para recuperar sua senha.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="rgba(255, 255, 255, 0.7)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        setErro('');
                        setMensagem('');
                      }}
                      placeholder="seuemail@exemplo.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {erro ? <Text style={styles.error}>{erro}</Text> : null}
                </View>

                {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}
              </View>

              <View style={styles.footerGroup}>
                <View style={styles.buttonContainer}>
                  <AppButton title="Enviar código" loading={carregando} onPress={handleEnviar} />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
