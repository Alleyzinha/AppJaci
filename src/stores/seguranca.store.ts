import { create } from 'zustand';
import { lerLocal, salvarLocal } from '@/services/storage/dadosLocais';

type SegurancaState = {
  /** Modo camuflagem: esconde a identidade "Jaci" das telas do Protegida. */
  camuflagem: boolean;
  carregar: () => Promise<void>;
  alternarCamuflagem: () => Promise<void>;
};

export const useSegurancaStore = create<SegurancaState>((set, get) => ({
  camuflagem: false,
  carregar: async () => {
    const valor = await lerLocal('camuflagem');
    set({ camuflagem: valor === '1' });
  },
  alternarCamuflagem: async () => {
    const proximo = !get().camuflagem;
    set({ camuflagem: proximo });
    await salvarLocal('camuflagem', proximo ? '1' : '0');
  },
}));
