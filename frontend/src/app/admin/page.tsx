'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  BookOpen,
  MessageSquare,
  ArrowBigLeft,
  Settings,
  FileText,
  Star,
  ArrowLeft,
} from 'lucide-react';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: TrendingUp },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/therapists', label: 'Therapists', icon: Users },
  { href: '/admin/services', label: 'Services', icon: BookOpen },
  { href: '/admin/blogs', label: 'Blog', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/seo', label: 'SEO', icon: Settings },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/contact', label: 'Messages', icon: MessageSquare },
];

export default function AdminDashboard() {
  const { user, hydrated } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<{
    users?: number;
    appts?: number;
    pending?: number;
    revenue?: number;
  } | null>(null);


      useEffect(() => {

        if (!hydrated) return;

        if (!user) {
          console.log('NO USER');
          router.replace('/login');
          return;
        }



      }, [hydrated, user]);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!hydrated) return;

        // fetch dashboard stats
        try {
          const response = await api.get('/admin/dashboard');
          console.log("response", response)
          // depending on your api structure
          setStats(response?.data || response);
        } catch (error) {
          console.log('Dashboard stats error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, router, hydrated]);

  // loading screen
  if (loading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-lavender border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-brand-ink/60">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // prevent render while redirecting
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-brand-ivory">

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="label-tag mb-1">
            Overview
          </p>

          <h1 className="font-serif text-3xl text-brand-ink">
            Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              label: 'Total Users',
              val: stats?.users ?? 0,
              icon: Users,
              color:
                'text-brand-lavender bg-brand-lavender/10',
            },
            {
              label: 'Appointments',
              val: stats?.appts ?? 0,
              icon: Calendar,
              color:
                'text-brand-sage bg-brand-sage/10',
            },
            {
              label: 'Pending',
              val: stats?.pending ?? 0,
              icon: Clock,
              color:
                'text-amber-600 bg-amber-50',
            },
            {
              label: 'Revenue',
              val: stats?.revenue
                ? `₹${stats.revenue.toLocaleString('en-IN')}`
                : '₹0',
              icon: DollarSign,
              color:
                'text-brand-blue bg-brand-blue/10',
            },
          ].map(({ label, val, icon: Icon, color }) => (
            <div
              key={label}
              className="card-soft"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-brand-ink/50 uppercase tracking-wide">
                  {label}
                </p>

                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    color
                  )}
                >
                  <Icon size={18} />
                </div>
              </div>

              <p className="font-serif text-3xl text-brand-ink">
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-serif text-xl text-brand-ink mb-4">
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                href: '/admin/appointments',
                label: 'Manage Appointments',
                desc: 'View, confirm, or cancel bookings',
              },
              {
                href: '/admin/blogs',
                label: 'Publish Blog',
                desc: 'Create or edit blog articles',
              },
              {
                href: '/admin/services',
                label: 'Edit Services',
                desc: 'Update services and pricing',
              },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="card-soft hover:shadow-md hover:border-brand-lavender/20 transition-all"
              >
                <h3 className="font-medium text-brand-ink mb-1">
                  {label}
                </h3>

                <p className="text-sm text-brand-ink/50">
                  {desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}