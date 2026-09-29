import React from 'react';
import { CabecalhoJaci } from '@/components/ui/IdentidadeJaci';

export default function ProtegidaHeader(props) {
  return <CabecalhoJaci perfil="protegida" {...props} />;
}
