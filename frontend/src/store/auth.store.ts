import { create } from 'zustand';
import type { User } from '@/lib/api';
import { authApi } from '@/lib/api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;

  setHydrated: (state: boolean) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (u: Partial<User>) => void;

  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  setHydrated: (state) => set({ hydrated: state }),

  setAuth: (user, accessToken, refreshToken) =>
    set({ user, accessToken, refreshToken }),

  clearAuth: () =>
    set({ user: null, accessToken: null, refreshToken: null }),

  updateUser: (u) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...u } : null,
    })),

  // 🔥 NEW: /me API loader
  fetchMe: async () => {
    try {
      const currentUser = get().user;

      // avoid duplicate calls
      if (currentUser) return;

      const res = await authApi.me(); // <-- /me API
      if (res) {
        set({ user: res });
      }
    } catch (err) {
      set({ user: null });
    }
  },
}));