'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Calendar, Clock, Heart, FileText,
  Star, HelpCircle, Globe, Settings, Mail, UserCheck, ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const nav = [
  { section: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    section: 'People',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/therapists', label: 'Therapists', icon: UserCheck },
    ],
  },
  {
    section: 'Bookings',
    items: [
      { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
      { href: '/admin/slots', label: 'Slots', icon: Clock },
    ],
  },
  {
    section: 'Content',
    items: [
      { href: '/admin/services', label: 'Services', icon: Heart },
      { href: '/admin/blogs', label: 'Blog', icon: FileText },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    ],
  },
  {
    section: 'Config',
    items: [
      { href: '/admin/seo', label: 'SEO', icon: Globe },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/messages', label: 'Messages', icon: Mail },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();


  return (
    <div className="flex min-h-screen bg-brand-ivory">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-brand-lavender/10 flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-brand-lavender/10">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-brand-ink text-base">Srishti Roy</span>
            <span className="text-[10px] text-brand-ink/40 uppercase tracking-widest">Admin Panel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {nav.map(({ section, items }) => (
            <div key={section} className="mb-3">
              <p className="text-[10px] uppercase tracking-widest text-brand-ink/30 px-3 py-2">{section}</p>
              {items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                return (
                  <Link key={href} href={href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-0.5',
                      active
                        ? 'bg-brand-lavender/10 text-brand-lavender'
                        : 'text-brand-ink/60 hover:text-brand-ink hover:bg-brand-ivory',
                    )}>
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-brand-lavender/10 space-y-1">
          <Link href="/" className="flex items-center gap-2 text-xs text-brand-ink/40 hover:text-brand-ink px-2 py-1.5">
            <ArrowLeft size={13} /> Back to site
          </Link>
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="flex items-center gap-2 text-xs text-brand-ink/40 hover:text-red-500 px-2 py-1.5 w-full">
            Logout
          </button>
        </div>
      </aside>

      {/* Main offset by sidebar */}
      <div className="ml-56 flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}