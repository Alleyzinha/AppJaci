import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';

import { colors } from '@/styles/tokens';

import { styles } from './styles';

const actions = [
  {
    id: '180',
    icon: 'call',
    title: 'Ligar 180',
    subtitle: '24 horas',
    backgroundColor: '#FF69B4',
  },

  {
    id: 'delegacias',
    icon: 'business',
    title: 'Delegacias',
    subtitle: 'Próximas',
    backgroundColor: '#F05EA9',
  },

  {
    id: 'chat',
    icon: 'chatbubble-ellipses',
    title: 'Chat',
    subtitle: 'Ao vivo',
    backgroundColor: '#A989FF',
  },
];

const ProtegidaSosQuickActions = ({ onActionPress }) => {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}

          onPress={() => onActionPress?.(action.id)}

          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View
            style={[
              styles.iconContainer,

              {
                backgroundColor: action.backgroundColor,
              },
            ]}
          >
            <Ionicons
              name={action.icon}

              size={38}

              color={colors.common.white}
            />
          </View>

          <Text style={styles.title}>{action.title}</Text>

          <Text style={styles.subtitle}>{action.subtitle}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ProtegidaSosQuickActions;
