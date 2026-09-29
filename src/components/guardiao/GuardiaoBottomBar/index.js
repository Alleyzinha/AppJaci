import React from 'react';
import { MenuJaci } from '@/components/ui/IdentidadeJaci';

const items = [
  {
    id: 'localizacao',
    label: 'Localização',
    icon: 'location-outline',
  },
  {
    id: 'sos',
    label: 'SOS',
    icon: 'alert-circle-outline',
  },
  {
    id: 'inicio',
    label: 'Início',
    icon: 'home',
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

export default function GuardiaoBottomBar(props) {
  return <MenuJaci items={items} {...props} />;
}
