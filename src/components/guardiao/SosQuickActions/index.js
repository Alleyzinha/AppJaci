import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCoresTela } from '@/styles/useCoresTela';
import { styles } from './styles';

const actions = [
  {
    id: '180',
    icon: 'phone-outline',
    title: 'Ligar 180',
    subtitle: 'Orientação e denúncia · 24 horas',
  },
  {
    id: 'delegacias',
    icon: 'office-building-marker-outline',
    title: 'Encontrar delegacias',
    subtitle: 'Abrir busca por unidades próximas',
  },
  {
    id: 'localizacao',
    icon: 'map-marker-radius-outline',
    title: 'Acompanhar localização',
    subtitle: 'Ver locais compartilhados pela rede',
  },
];

const SosQuickActions = ({ onActionPress }) => {
  const cores = useCoresTela();

  return (
    <View
      style={[styles.container, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
    >
      <View style={styles.header}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={[styles.heading, { color: cores.texto }]}>
            Outras formas de ajuda
          </Text>
          <Text style={[styles.headingDescription, { color: cores.secundario }]}>
            Recursos rápidos para apoiar sua rede.
          </Text>
        </View>
        <Image
          source={require('../../../assets/images/guardiao-sos-support.jpg')}
          accessibilityLabel="Telefone conectado a uma rota de apoio"
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.actionList}>
        {actions.map((action, index) => (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            accessibilityHint={action.subtitle}
            onPress={() => onActionPress?.(action.id)}
            style={({ pressed }) => [
              styles.action,
              index < actions.length - 1 && {
                borderBottomColor: cores.borda,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
              pressed && { backgroundColor: cores.suave, opacity: 0.86 },
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: cores.suave }]}>
              <MaterialCommunityIcons name={action.icon} size={21} color={cores.destaque} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={[styles.actionTitle, { color: cores.texto }]} numberOfLines={1}>
                {action.title}
              </Text>
              <Text style={[styles.actionSubtitle, { color: cores.secundario }]} numberOfLines={2}>
                {action.subtitle}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={21} color={cores.secundario} />
          </Pressable>
        ))}
      </View>

      <View style={[styles.guidance, { backgroundColor: cores.suave }]}>
        <MaterialCommunityIcons name="account-heart-outline" size={21} color={cores.destaque} />
        <View style={styles.guidanceCopy}>
          <Text style={[styles.guidanceTitle, { color: cores.texto }]}>Apoie com cuidado</Text>
          <Text style={[styles.guidanceDescription, { color: cores.secundario }]}>
            Confirme se é um bom momento para conversar e respeite as escolhas da pessoa protegida.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SosQuickActions;
