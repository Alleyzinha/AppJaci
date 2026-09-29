import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';

import { colors } from '@/styles/tokens';

import { styles } from './styles';

const AppCard = ({
  icon,
  category,
  title,
  description,
  onPress,
  iconBackground,
  accentColor = colors.guardiao.primary,

  variant = 'default',

  selected = false,
}) => {
  const isProfile = variant === 'profile';

  if (isProfile) {
    return (
      <Pressable
        onPress={onPress}

        style={({ pressed }) => [
          styles.profileContainer,

          selected && styles.profileContainerSelected,

          pressed && styles.profileContainerPressed,
        ]}

        accessibilityRole="button"

        accessibilityState={{
          selected,
        }}

        accessibilityLabel={`Perfil ${title}`}
      >
        <View
          style={[
            styles.profileIconContainer,

            iconBackground && {
              backgroundColor: iconBackground,
            },
          ]}
        >
          <Ionicons
            name={icon}

            size={46}

            color={colors.common.white}
          />
        </View>

        <Text style={styles.profileTitle}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}

      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}

      accessibilityRole="button"

      accessibilityLabel={title}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,

            iconBackground && {
              backgroundColor: iconBackground,
            },
          ]}
        >
          <Ionicons
            name={icon}

            size={32}

            color={colors.common.white}
          />
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.category,

              {
                color: accentColor,
              },
            ]}
          >
            {category}
          </Text>

          <Text style={styles.title}>{title}</Text>
        </View>

        <Ionicons
          name="chevron-forward"

          size={31}

          color="#666666"

          style={styles.arrow}
        />
      </View>

      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
};

export default AppCard;
