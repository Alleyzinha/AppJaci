import { create } from 'zustand';

// Dados temporários ficam apenas em memória, nunca na URL ou no armazenamento local.
export const useCadastroStore = create((set) => ({
  autorizacaoPin: null,
  pin: '',
  definirAutorizacao: (autorizacaoPin) => set({ autorizacaoPin, pin: '' }),
  definirPin: (pin) => set({ pin }),
  limpar: () => set({ autorizacaoPin: null, pin: '' }),
}));
