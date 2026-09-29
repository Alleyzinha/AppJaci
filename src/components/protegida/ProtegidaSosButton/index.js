import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles';

const ProtegidaSosButton = ({ onLongPress }) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onLongPress={onLongPress}

        delayLongPress={2000}

        style={({ pressed }) => [styles.outerButton, pressed && styles.outerButtonPressed]}

        accessibilityRole="button"

        accessibilityLabel="Ajuda. Segure por 2 segundos para acionar."
      >
        <View style={styles.innerButton}>
          <Ionicons
            name="heart"

            size={76}

            color="#FFFFFF"
          />

          <Text style={styles.title}>AJUDA</Text>

          <Text style={styles.subtitle}>Segure 2s</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ProtegidaSosButton;
