import React from 'react';
import { MenuJaci } from '@/components/ui/IdentidadeJaci';

const items = [
  {
    id: 'diario',
    label: 'Diário',
    icon: 'book-outline',
  },

  {
    id: 'chat',
    label: 'Chat',
    icon: 'chatbubble-ellipses-outline',
  },

  {
    id: 'inicio',
    label: 'Início',
    icon: 'home-outline',
  },

  {
    id: 'sos',
    label: 'SOS',
    icon: 'alert-circle-outline',
  },

  {
    id: 'direitos',
    label: 'Direitos',
    icon: 'scale-outline',
  },

  {
    id: 'ajustes',
    label: 'Ajustes',
    icon: 'settings-outline',
  },
];

export default function ProtegidaBottomBar(props) {
  return <MenuJaci items={items} {...props} />;
}
