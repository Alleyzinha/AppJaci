import { SafeAreaView } from 'react-native-safe-area-context';
import { useCadastroStore } from '@/stores/cadastro.store';
import React, { useState, useRef, useEffect } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router, useLocalSearchParams } from 'expo-router';

import { styles } from './styles';

import { setupPin } from '@/features/auth/api/auth.api';

export default function ConfirmarPinScreen() {
  const { email, perfil } = useLocalSearchParams();

  const pinCriado = useCadastroStore((estado) => estado.pin);
  const autorizacao = useCadastroStore((estado) => estado.autorizacaoPin);
  const isGuardiao = perfil === 'guardiao' || (Array.isArray(perfil) && perfil[0] === 'guardiao');

  const gradientColors = isGuardiao
    ? ['#8DCFE2', '#76B3C5', '#223A44']
    : ['#E95378', '#8B48C7', '#341E6D'];

  const [pinArray, setPinArray] = useState([]);
  const [pinIncorreto, setPinIncorreto] = useState(false);

  const scrollRef = useRef(null);

  const PIN_LENGTH = 4;
  const formularioValido = pinArray.length === PIN_LENGTH;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';

    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {});

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleDigitPress = (digit) => {
    if (pinArray.length < PIN_LENGTH) {
      const novoPin = [...pinArray, digit];
      setPinArray(novoPin);
      setPinIncorreto(false);
    }
  };

  const handleDeletePress = () => {
    const novoPin = pinArray.slice(0, -1);
    setPinArray(novoPin);
    setPinIncorreto(false);
  };

  const handleConfirmar = async () => {
    if (formularioValido) {
      const pinDigitado = pinArray.join('');
      if (pinDigitado === pinCriado) {
        try {
          await setupPin({ setupToken: autorizacao, pin: pinCriado });
          useCadastroStore.getState().limpar();
          router.replace({
            pathname: '/(auth)/login',
            params: {
              perfil: isGuardiao ? 'guardiao' : 'protegida',
              email: email || '',
            },
          });
        } catch (error) {
          setPinIncorreto(true);
        }
      } else {
        setPinIncorreto(true);
        setPinArray([]);
      }
    }
  };

  const renderPinCircles = () => {
    return Array.from({ length: PIN_LENGTH }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.pinCircle,
          index < pinArray.length && styles.pinCirclePreenchido,
          pinIncorreto && styles.pinCircleErro,
        ]}
      >
        {index < pinArray.length && <View style={styles.pinDot} />}
      </View>
    ));
  };

  const renderKeypad = () => {
    const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    return teclas.map((tecla, index) => {
      if (tecla === '') {
        return <View key={index} style={styles.keypadKeyVazio} />;
      }
      if (tecla === 'del') {
        return (
          <Pressable
            key={index}
            style={({ pressed }) => [styles.keypadKey, pressed && styles.keypadKeyPressionado]}
            onPress={handleDeletePress}
          >
            <Text style={styles.keypadDelete}>⌫</Text>
          </Pressable>
        );
      }
      return (
        <Pressable
          key={index}
          style={({ pressed }) => [styles.keypadKey, pressed && styles.keypadKeyPressionado]}
          onPress={() => handleDigitPress(tecla)}
        >
          <Text style={styles.keypadText}>{tecla}</Text>
        </Pressable>
      );
    });
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
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
            style={{
              overscrollBehavior: 'none',
            }}
          >
            <View style={styles.mainWrapper}>
              {/* BOTÃO DE VOLTAR */}
              <View style={styles.topNavigation}>
                <Pressable
                  style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                  onPress={() => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace('/(auth)/criar-pin');
                    }
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* CABEÇALHO */}
              <View style={styles.headerGroup}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed" size={36} color="#FFFFFF" />
                </View>

                <Text style={styles.titulo}>CONFIRME SEU PIN</Text>

                <Text style={styles.subtitulo}>Digite novamente o PIN de 4 dígitos</Text>

                {pinIncorreto && (
                  <View style={styles.erroContainer}>
                    <Text style={styles.erroText}>PIN incorreto. Tente novamente.</Text>
                  </View>
                )}
              </View>

              {/* CIRCULOS DO PIN */}
              <View style={styles.pinContainer}>{renderPinCircles()}</View>

              {/* TECLADO NUMÉRICO */}
              <View style={styles.keypadContainer}>{renderKeypad()}</View>

              {/* BOTÃO CONFIRMAR */}
              <View style={styles.footerGroup}>
                <Pressable
                  onPress={handleConfirmar}
                  disabled={!formularioValido}
                  style={({ pressed }) => [
                    {
                      width: '100%',
                      height: 54,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: formularioValido
                        ? isGuardiao
                          ? '#76B3C5'
                          : '#FFD000'
                        : 'rgba(255, 255, 255, 0.2)',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: formularioValido
                        ? isGuardiao
                          ? '#FFFFFF'
                          : '#341E6D'
                        : 'rgba(255, 255, 255, 0.4)',
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    Confirmar
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
