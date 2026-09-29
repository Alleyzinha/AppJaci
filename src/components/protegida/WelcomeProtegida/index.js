import React from 'react';
import { BoasVindasJaci } from '@/components/ui/IdentidadeJaci';

export default function WelcomeProtegida(props) {
  return <BoasVindasJaci perfil="protegida" {...props} />;
}
