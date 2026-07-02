'use client';

import { useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/components/ui/Toaster';

// Loads Google Identity Services (GIS) client-side script — no npm package
// required. Renders Google's official button and exchanges the returned
// ID token with our backend at POST /auth/google.

declare global {
  interface Window {
    google?: any;
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let scriptPromise: Promise<void> | null = null;

function loadGis(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

interface Props {
  next?: string;
  onSuccess?: () => void;
  label?: 'signin' | 'signup';
}

export default function GoogleAuthButton({ next = '/dashboard', onSuccess, label = 'signin' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { setAuth } = useAuthStore();
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || clientId.includes('REPLACE_WITH')) return;
    let cancelled = false;

    loadGis()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !ref.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            try {
              const { user, accessToken, refreshToken } = await authApi.google(response.credential);
              setAuth(user, accessToken, refreshToken);
              toast('Welcome!', 'success');
              onSuccess?.();
              if (!onSuccess) window.location.href = next;
            } catch (e: any) {
              toast(e.message ?? 'Google sign-in failed', 'error');
            }
          },
        });

        window.google.accounts.id.renderButton(ref.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: label === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'pill',
        });

        setReady(true);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [clientId, next, onSuccess, label]);

  if (!clientId || clientId.includes('REPLACE_WITH')) return null;

  return (
    <div className="w-full flex justify-center">
      <div ref={ref} />
      {!ready && (
        <div className="w-full h-11 rounded-full border border-[#E2D9F3] animate-pulse" />
      )}
    </div>
  );
}
