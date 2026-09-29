import React from 'react';

import { Slot } from 'expo-router';

import AuthGuard from '@/components/auth/AuthGuard';

export default function GuardiaoLayout() {
  return (
    <AuthGuard>
      <Slot />
    </AuthGuard>
  );
}
