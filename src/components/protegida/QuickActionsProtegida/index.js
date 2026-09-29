import React from 'react';
import { AcoesJaci } from '@/components/ui/IdentidadeJaci';

const actions = [
  {
    id: 'configuracao',
    icon: 'settings-outline',
    label: 'Configuração',
  },

  {
    id: 'guardioes',
    icon: 'shield-outline',
    label: 'Guardiões',
  },

  {
    id: 'chat',
    icon: 'chatbubble-ellipses-outline',
    label: 'Acolhimento',
  },

  {
    id: 'diario',
    icon: 'book-outline',
    label: 'Diário Seguro',
  },

  {
    id: 'direitos',
    icon: 'scale-outline',
    label: 'Guia de Direitos',
  },

  {
    id: 'seguranca',
    icon: 'shield-checkmark-outline',
    label: 'Segurança',
  },

  {
    id: 'localizacao',
    icon: 'location-outline',
    label: 'Enviar Localização',
  },
];

export default function QuickActionsProtegida(props) {
  return <AcoesJaci actions={actions} {...props} />;
}
