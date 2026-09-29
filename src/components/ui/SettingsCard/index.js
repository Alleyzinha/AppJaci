import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Switch, Text, View } from 'react-native';
import { useCoresTela } from '@/styles/useCoresTela';
import { styles } from './styles';

const SettingsCard = ({
  icon,
  title,
  description,
  type = 'navigation',
  value = false,
  onValueChange,
  onPress,
  iconBackground,
  iconColor,
}) => {
  const cores = useCoresTela();
  const content = (
    <View style={styles.content}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackground || cores.suave }]}>
        <Ionicons name={icon} size={22} color={iconColor || cores.destaque} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: cores.texto }]}>{title}</Text>
        <Text style={[styles.description, { color: cores.secundario }]}>{description}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: cores.borda, true: cores.destaque }}
          thumbColor={value ? '#FFFFFF' : cores.superficie}
          ios_backgroundColor={cores.borda}
          accessibilityLabel={title}
          accessibilityState={{ checked: value }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={cores.secundario} />
      )}
    </View>
  );

  if (type === 'navigation') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: cores.superficie,
            borderColor: cores.borda,
            opacity: pressed ? 0.76 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
    >
      {content}
    </View>
  );
};

export default SettingsCard;
