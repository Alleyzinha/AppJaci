import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/styles/tokens';

import { styles } from './styles';

const ChatInput = ({ value, onChangeText, onSend }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}

        onChangeText={onChangeText}

        placeholder="Digite sua mensagem..."

        placeholderTextColor="#777777"

        multiline

        style={styles.input}

        accessibilityLabel="Mensagem"
      />

      <Pressable
        onPress={onSend}

        style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]}

        accessibilityRole="button"

        accessibilityLabel="Enviar mensagem"
      >
        <Ionicons
          name="send"

          size={22}

          color={colors.common.white}
        />
      </Pressable>
    </View>
  );
};

export default ChatInput;
