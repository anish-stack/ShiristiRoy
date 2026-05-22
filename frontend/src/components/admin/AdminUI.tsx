'use client';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

/* ── Page shell ─────────────────────────────────── */
export function AdminPage({
  title, subtitle, actions, children,
}: { title: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-brand-lavender/10 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-brand-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-brand-ink/40 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ── Stat card ──────────────────────────────────── */
export function StatCard({ label, value, delta, color = 'lavender' }: { label: string; value: string | number; delta?: string; color?: string }) {
  const colors: Record<string, string> = {
    lavender: 'bg-brand-lavender/10 text-brand-lavender',
    sage: 'bg-brand-sage/10 text-brand-sage',
    blue: 'bg-brand-blue/10 text-brand-blue',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <div className="bg-white border border-brand-lavender/10 rounded-2xl p-5">
      <p className="text-xs text-brand-ink/40 uppercase tracking-wide mb-1">{label}</p>
      <p className={cn('text-2xl font-serif', colors[color]?.split(' ')[1] ?? 'text-brand-ink')}>{value}</p>
      {delta && <p className="text-xs text-brand-ink/40 mt-1">{delta}</p>}
    </div>
  );
}

/* ── Card wrapper ───────────────────────────────── */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white border border-brand-lavender/10 rounded-2xl overflow-hidden', className)}>
      {children}
    </div>
  );
}

/* ── Card header ────────────────────────────────── */
export function CardHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-brand-lavender/10">
      <p className="text-sm font-medium text-brand-ink">{title}</p>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── Search bar ─────────────────────────────────── */
export function SearchBar({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/30" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="pl-8 pr-3 py-2 text-sm border border-brand-lavender/20 rounded-xl bg-brand-ivory w-56 focus:outline-none focus:border-brand-lavender" />
    </div>
  );
}

/* ── Table ──────────────────────────────────────── */
export function Table({ cols, rows, empty = 'No data' }: {
  cols: { key: string; label: string; width?: string }[];
  rows: (React.ReactNode[])[];
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-lavender/10">
            {cols.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : {}}
                className="text-left text-xs font-medium text-brand-ink/40 uppercase tracking-wide px-5 py-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} className="text-center py-12 text-brand-ink/30 text-sm">{empty}</td></tr>
            : rows.map((row, i) => (
              <tr key={i} className="border-b border-brand-lavender/5 hover:bg-brand-ivory/60 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 text-brand-ink/80">{cell}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* ── Badge ──────────────────────────────────────── */
export function Badge({ label, variant = 'gray' }: { label: string; variant?: 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'lavender' }) {
  const v = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-brand-sage/10 text-brand-sage',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-500',
    blue: 'bg-brand-blue/10 text-brand-blue',
    lavender: 'bg-brand-lavender/10 text-brand-lavender',
  };
  return <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', v[variant])}>{label}</span>;
}

/* ── Action button ──────────────────────────────── */
export function Btn({ onClick, variant = 'default', size = 'md', disabled, loading, children }: {
  onClick?: () => void; variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; disabled?: boolean; loading?: boolean; children: React.ReactNode;
}) {
  const v = {
    default: 'border border-brand-lavender/20 text-brand-ink hover:bg-brand-ivory',
    primary: 'bg-brand-lavender text-white hover:bg-brand-lavender/90',
    danger: 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100',
    ghost: 'text-brand-ink/50 hover:text-brand-ink hover:bg-brand-ivory',
  };
  const s = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={cn('inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors disabled:opacity-50', v[variant], s[size])}>
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

/* ── Modal ──────────────────────────────────────── */
export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-lavender/10">
          <h2 className="font-serif text-lg text-brand-ink">{title}</h2>
          <button onClick={onClose} className="text-brand-ink/30 hover:text-brand-ink"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-brand-lavender/10 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Form field ─────────────────────────────────── */
export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-brand-ink/50">{label}{required && <span className="text-brand-lavender ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export const inputCls = 'border border-brand-lavender/20 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-lavender transition-colors';

/* ── Confirm delete dialog ──────────────────────── */
export function ConfirmDelete({ open, onClose, onConfirm, label }: {
  open: boolean; onClose: () => void; onConfirm: () => void; label: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm delete"
      footer={<><Btn variant="default" onClick={onClose}>Cancel</Btn><Btn variant="danger" onClick={() => { onConfirm(); onClose(); }}>Delete</Btn></>}>
      <p className="text-sm text-brand-ink/70">Delete <strong>{label}</strong>? This cannot be undone.</p>
    </Modal>
  );
}

/* ── Pagination ─────────────────────────────────── */
export function Pagination({ page, total, limit, onChange }: { page: number; total: number; limit: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-brand-lavender/10 text-xs text-brand-ink/50">
      <span>Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-1 rounded hover:bg-brand-ivory disabled:opacity-30"><ChevronLeft size={14} /></button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className={cn('w-6 h-6 rounded text-xs', p === page ? 'bg-brand-lavender text-white' : 'hover:bg-brand-ivory')}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} className="p-1 rounded hover:bg-brand-ivory disabled:opacity-30"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
