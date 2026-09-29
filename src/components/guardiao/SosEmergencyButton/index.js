import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const SosEmergencyButton = ({ onPress, onLongPress }) => {
  const [pressionado, setPressionado] = useState(false);
  const acionado = useRef(false);

  const handlePress = () => {
    if (!acionado.current) onPress?.();
  };

  const handleLongPress = () => {
    acionado.current = true;
    if (onLongPress) onLongPress();
    else onPress?.();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.outerRing}>
        <View style={styles.middleRing}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ligar para a Polícia Militar, 190. Segure por dois segundos."
            delayLongPress={2000}
            onPressIn={() => {
              acionado.current = false;
              setPressionado(true);
            }}
            onPressOut={() => setPressionado(false)}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={({ pressed }) => [
              styles.outerButton,
              (pressed || pressionado) && styles.outerButtonPressed,
            ]}
          >
            <LinearGradient
              colors={['#3A7E94', '#1F5366', '#143845']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.innerButton}
            >
              <Ionicons name="call" size={38} color="#FFFFFF" />
              <Text style={styles.title} numberOfLines={1}>
                POLÍCIA
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pressionado ? 'MANTENHA...' : 'LIGAR 190'}</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SosEmergencyButton;
