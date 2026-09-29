import { create } from 'zustand';

type ThemeState = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

/**
 * Estado global do tema. Os componentes usam esta store para que a troca
 * entre os modos claro e escuro seja refletida em todas as telas abertas.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
}));
