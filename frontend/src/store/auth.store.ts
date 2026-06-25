import { create } from 'zustand';
import { persist } from 'zustand/middleware';  // ← add karo
import type { User } from '@/lib/api';
import { authApi } from '@/lib/api';

// middleware.ts edge runtime localStorage nahi padh sakta — wo auth_token/auth_role
// cookie padhta hai. Isliye jab bhi auth set/clear ho, ye cookies mirror karo.
function syncAuthCookies(accessToken: string | null, role: string | null) {
  if (typeof document === 'undefined') return;
  const base = 'path=/; max-age=604800; SameSite=Lax';
  const clear = 'path=/; max-age=0; SameSite=Lax';
  document.cookie = accessToken ? `auth_token=${accessToken}; ${base}` : `auth_token=; ${clear}`;
  document.cookie = role ? `auth_role=${role}; ${base}` : `auth_role=; ${clear}`;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setHydrated: (state: boolean) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  updateUser: (u: Partial<User>) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(                          // ← wrap karo
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,

      setHydrated: (state) => set({ hydrated: state }),

      setAuth: (user, accessToken, refreshToken) => {
        syncAuthCookies(accessToken, user?.role ?? null);
        set({ user, accessToken, refreshToken });
      },

      clearAuth: () => {
        syncAuthCookies(null, null);
        set({ user: null, accessToken: null, refreshToken: null });
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) await authApi.logout(refreshToken);
        } catch {
          // backend down ya token already invalid — local logout phir bhi chalega
        }
        syncAuthCookies(null, null);
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateUser: (u) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...u } : null,
        })),

      fetchMe: async () => {
        try {
          if (get().user) return;
          const res = await authApi.me();
          if (res) set({ user: res });
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth',                 // ← localStorage key "auth" — getAccess() isi se padhta hai
      partialize: (state) => ({     // ← sirf ye fields persist karo
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // page reload ke baad localStorage se wapas aaya token — cookies dobara mirror karo
        state?.setHydrated(true);
        if (state?.accessToken) {
          syncAuthCookies(state.accessToken, state.user?.role ?? null);
        }
      },
    }
  )
);