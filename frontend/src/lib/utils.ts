import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(d: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', ...opts,
  }).format(new Date(d));
}

export function formatTime(d: string | Date) {
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(d));
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Backend uploads (coverImage.url, blog coverImage, consent/intake docs, etc.)
// are stored as relative paths like "/uploads/xyz.webp". Prefix with the API
// origin so they resolve correctly wherever the frontend is hosted.
export function resolveMediaUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v1\/?$/, '');
  return `${origin}${url}`;
}
