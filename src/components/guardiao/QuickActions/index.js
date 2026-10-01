import React from 'react';
import { AcoesJaci } from '@/components/ui/IdentidadeJaci';

const actions = [
  { id: 'chat', title: 'Chat ao vivo', icon: 'chatbubbles-outline' },
  {
    id: 'configuracao',
    title: 'Configuração',
    icon: 'settings-outline',
  },
  {
    id: 'direitos',
    title: 'Guia de Direitos',
    icon: 'scale-outline',
  },
  {
    id: 'localizacao',
    title: 'Acompanhar Localização',
    icon: 'location-outline',
  },
];

export default function QuickActions(props) {
  return <AcoesJaci actions={actions} {...props} />;
}
