'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
let _id = 0;
const listeners = new Set<(t: Toast) => void>();

export function toast(message: string, type: Toast['type'] = 'info') {
  listeners.forEach((fn) => fn({ id: ++_id, message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const add = (t: Toast) => {
      setToasts((p) => [...p, t]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), 4000);
    };
    listeners.add(add);
    return () => { listeners.delete(add); };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={cn(
          'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm text-white max-w-xs animate-fade-up',
          t.type === 'success' && 'bg-brand-sage', t.type === 'error' && 'bg-red-500', t.type === 'info' && 'bg-brand-lavender',
        )}>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
