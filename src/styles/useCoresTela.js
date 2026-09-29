import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

export function useCoresTela() {
  const escuro = useThemeStore((estado) => estado.isDark);
  const perfil = useAuthStore((estado) => estado.perfil);
  if (perfil === 'guardiao')
    return escuro
      ? {
          fundo: '#17151F',
          superficie: '#24212E',
          texto: '#F5F1FA',
          secundario: '#BDB5CA',
          borda: '#464153',
          destaque: '#8DCFE2',
          suave: '#243B45',
          perigo: '#FFA8B1',
          botao: '#4E899A',
        }
      : {
          fundo: '#F2F8F9',
          superficie: '#FFFFFF',
          texto: '#223A44',
          secundario: '#555555',
          borda: '#CFE3E7',
          destaque: '#4E899A',
          suave: '#EAF5F6',
          perigo: '#A82442',
          botao: '#4E899A',
        };
  return escuro
    ? {
        fundo: '#17151F',
        superficie: '#24212E',
        texto: '#F5F1FA',
        secundario: '#C9A8BC',
        borda: '#4A3340',
        destaque: '#FF9ED2',
        suave: '#4A2338',
        perigo: '#FFA8B1',
      }
    : {
        fundo: '#FFF5F8',
        superficie: '#FFFFFF',
        texto: '#4A1F38',
        secundario: '#8A6A78',
        borda: '#F5D3E4',
        destaque: '#CF2B9D',
        suave: '#FDE1F0',
        perigo: '#A82442',
      };
}
