import React, { memo } from 'react';

import { Text, TextInput, View } from 'react-native';

import { styles } from './styles';

const AppInput = memo(({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="rgba(255,255,255,0.85)"
        accessibilityLabel={label}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

AppInput.displayName = 'AppInput';

export default AppInput;
