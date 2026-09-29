import React from 'react';

import { Text, View } from 'react-native';

import { styles } from './styles';

import { useThemeStore } from '@/stores/theme.store';

const ChatMessage = ({ message, sender = 'attendant', time }) => {
  const isDark = useThemeStore((state) => state.isDark);

  const isUser = sender === 'user';

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View
        style={[
          styles.bubble,

          isUser
            ? styles.userBubble
            : [styles.attendantBubble, isDark && styles.attendantBubbleDark],
        ]}
      >
        <Text
          style={[
            styles.message,

            isUser
              ? styles.userMessage
              : [styles.attendantMessage, isDark && styles.attendantMessageDark],
          ]}
        >
          {message}
        </Text>

        {time ? <Text style={[styles.time, isUser && styles.userTime]}>{time}</Text> : null}
      </View>
    </View>
  );
};

export default ChatMessage;
