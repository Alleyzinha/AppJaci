import { queryClient } from '@/services/query/queryClient';
import { create } from 'zustand';
import { clearSession, getSession, saveSession } from '@/services/storage/secureStorage';
import { pararCompartilhamento } from '@/services/localizacao/compartilhamento';

type Perfil = 'protegida' | 'guardiao' | null;

type AuthState = {
  token: string | null;
  perfil: Perfil;
  userName: string | null;
  userId: string | null;
  isLoading: boolean;
  loadSession: () => Promise<boolean>;
  signIn: (data: {
    token: string;
    perfil: 'protegida' | 'guardiao';
    userName?: string;
    userId?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  perfil: null,
  userName: null,
  userId: null,
  isLoading: true,

  loadSession: async () => {
    try {
      const session = await getSession();
      if (session?.token) {
        set({
          token: session.token,
          perfil: session.perfil as Perfil,
          userName: session.userName ?? null,
          userId: session.userId ?? null,
          isLoading: false,
        });
        return true;
      }
      set({ token: null, perfil: null, userName: null, userId: null, isLoading: false });
      return false;
    } catch {
      set({ token: null, perfil: null, userName: null, userId: null, isLoading: false });
      return false;
    }
  },

  signIn: async (data) => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await saveSession({
      token: data.token,
      perfil: data.perfil,
      userName: data.userName,
      userId: data.userId,
    });
    set({
      token: data.token,
      perfil: data.perfil,
      userName: data.userName ?? null,
      userId: data.userId ?? null,
      isLoading: false,
    });
  },

  signOut: async () => {
    // Revoga o envio antes de apagar as credenciais usadas para removê-lo.
    await pararCompartilhamento().catch(() => {});
    await queryClient.cancelQueries();
    queryClient.clear();
    await clearSession();
    set({ token: null, perfil: null, userName: null, userId: null, isLoading: false });
  },
}));
