import React, { memo } from 'react';

import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';

const AppButton = memo(
  ({
    title,
    loading = false,
    loadingLabel,
    colors = ['#FFD35A', '#FF914D'],
    disabledColors,
    textColor = '#FFFFFF',
    disabledTextColor = textColor,
    fontFamily,
    disabled = false,
    accessibilityHint,
    onPress,
  }) => {
    const isDisabled = disabled || loading;
    const buttonColors = isDisabled && disabledColors ? disabledColors : colors;

    return (
      <Pressable
        disabled={isDisabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={loading ? loadingLabel || `${title}...` : title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
          isDisabled && !disabledColors && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={buttonColors}
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
            loadingLabel ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator
                  color={isDisabled ? disabledTextColor : textColor}
                  size="small"
                />
                <Text
                  style={[
                    styles.text,
                    fontFamily && { fontFamily },
                    { color: isDisabled ? disabledTextColor : textColor },
                  ]}
                >
                  {loadingLabel}
                </Text>
              </View>
            ) : (
              <ActivityIndicator color={textColor} />
            )
          ) : (
            <Text
              style={[
                styles.text,
                fontFamily && { fontFamily },
                { color: isDisabled ? disabledTextColor : textColor },
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  },
);

AppButton.displayName = 'AppButton';

export default AppButton;
