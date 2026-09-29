import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';

import { colors } from '@/styles/tokens';

import { styles } from './styles';

import { useThemeStore } from '@/stores/theme.store';

const GuardianContactCard = ({ name, relation, phone, location, onCallPress, onDeletePress }) => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.avatar}>
        <Ionicons
          name="person-outline"

          size={34}

          color={colors.protegida.primaryDark}
        />
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isDark && styles.textDark]}>{name}</Text>

        <Text style={[styles.details, isDark && styles.subtextDark]}>
          {relation} - {phone}
        </Text>

        <Text style={[styles.location, isDark && styles.subtextDark]}>{location}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onCallPress}

          style={styles.actionButton}

          accessibilityRole="button"

          accessibilityLabel={`Ligar para ${name}`}
        >
          <Ionicons
            name="call-outline"

            size={29}

            color="#111111"
          />
        </Pressable>

        <Pressable
          onPress={onDeletePress}

          style={styles.actionButton}

          accessibilityRole="button"

          accessibilityLabel={`Excluir ${name}`}
        >
          <Ionicons
            name="trash-outline"

            size={30}

            color="#111111"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default GuardianContactCard;
