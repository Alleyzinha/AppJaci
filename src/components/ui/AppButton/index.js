import React, { memo } from 'react';

import { ActivityIndicator, Pressable, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';

const AppButton = memo(
  ({ title, loading = false, colors = ['#FFD35A', '#FF914D'], disabled = false, onPress }) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        disabled={isDisabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [
          styles.container,

          pressed && styles.pressed,

          isDisabled && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 0,
          }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  },
);

AppButton.displayName = 'AppButton';

export default AppButton;
