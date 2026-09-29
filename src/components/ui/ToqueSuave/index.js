import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Pressable } from 'react-native';

const Pressionavel = Animated.createAnimatedComponent(Pressable);

/** Feedback imediato, respeitando a preferência por menos movimento. */
export default function ToqueSuave({ style, onPressIn, onPressOut, ...props }) {
  const escala = useRef(new Animated.Value(1)).current;
  const reduzir = useRef(true);
  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => {
        if (ativo) reduzir.current = valor;
      })
      .catch(() => {});
    const evento = AccessibilityInfo.addEventListener('reduceMotionChanged', (valor) => {
      reduzir.current = valor;
      if (valor) {
        escala.stopAnimation();
        escala.setValue(1);
      }
    });
    return () => {
      ativo = false;
      evento.remove();
      escala.stopAnimation();
    };
  }, [escala]);
  function animar(valor) {
    if (reduzir.current) return;
    Animated.timing(escala, { toValue: valor, duration: 130, useNativeDriver: true }).start();
  }
  return (
    <Pressionavel
      {...props}
      onPressIn={(evento) => {
        animar(0.98);
        onPressIn?.(evento);
      }}
      onPressOut={(evento) => {
        animar(1);
        onPressOut?.(evento);
      }}
      style={[style, { transform: [{ scale: escala }] }]}
    />
  );
}
