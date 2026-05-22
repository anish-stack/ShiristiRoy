import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '@/lib/api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  hydrated: boolean;

  setHydrated: (state: boolean) => void;

  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;

  clearAuth: () => void;

  updateUser: (u: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      hydrated: false,

      setHydrated: (state) => {
        set({ hydrated: state });
      },

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      updateUser: (u) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...u }
            : null,
        })),
    }),

    {
      name: 'auth',

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);