'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, ArrowRight, TrendingUp, MessageSquare, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { AdminPage, StatCard, Card, CardHeader, Badge } from '@/components/admin/AdminUI';
import { formatDate, formatTime } from '@/lib/utils';

type Stats = { users: number; appts: number; revenue: number; pending: number };
type RecentAppt = { _id: string; bookingCode: string; status: string; startAt: string; user: { name: string }; service?: { name: string } };

const statusVariant: Record<string, 'amber' | 'green' | 'blue' | 'red' | 'gray'> = {
  pending: 'amber', confirmed: 'green', completed: 'blue', cancelled: 'red', no_show: 'gray',
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppts, setRecentAppts] = useState<RecentAppt[]>([]);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/dashboard'); return; }
    api.get<Stats>('/admin/dashboard').then(setStats).catch(() => {});
    api.get<{ items: RecentAppt[] }>('/admin/appointments?limit=5&page=1')
      .then((d) => setRecentAppts(d.items ?? [])).catch(() => {});
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <AdminPage title="Dashboard" subtitle={`Welcome back, ${user.name.split(' ')[0]}`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total users" value={stats?.users ?? '…'} delta="Registered clients" color="lavender" />
        <StatCard label="Total appointments" value={stats?.appts ?? '…'} delta="All time" color="sage" />
        <StatCard label="Pending" value={stats?.pending ?? '…'} delta="Need action" color="amber" />
        <StatCard label="Revenue" value={stats?.revenue ? `₹${stats.revenue.toLocaleString('en-IN')}` : '…'} delta="Paid bookings" color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent appointments" actions={
              <Link href="/admin/appointments" className="text-xs text-brand-lavender hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
            } />
            {recentAppts.length === 0 ? (
              <p className="text-center py-10 text-brand-ink/30 text-sm">No appointments yet</p>
            ) : (
              <div className="divide-y divide-brand-lavender/5">
                {recentAppts.map((a) => (
                  <div key={a._id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand-ink">{a.user?.name ?? '—'}</p>
                      <p className="text-xs text-brand-ink/40">{a.service?.name ?? 'Session'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-brand-ink/60">{formatDate(a.startAt, { day: 'numeric', month: 'short' })} · {formatTime(a.startAt)}</p>
                      <div className="mt-1 flex justify-end"><Badge label={a.status} variant={statusVariant[a.status] ?? 'gray'} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <CardHeader title="Quick actions" />
            <div className="p-3 space-y-2">
              {[
                { href: '/admin/appointments', icon: Calendar, label: 'Manage appointments', desc: 'Confirm or cancel bookings' },
                { href: '/admin/blogs', icon: FileText, label: 'Write a blog post', desc: 'Publish new content' },
                { href: '/admin/messages', icon: MessageSquare, label: 'Check messages', desc: 'Contact form inbox' },
                { href: '/admin/slots', icon: Clock, label: 'Generate slots', desc: 'Create availability' },
                { href: '/admin/seo', icon: TrendingUp, label: 'Update SEO', desc: 'Page metadata' },
              ].map(({ href, icon: Icon, label, desc }) => (
                <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-ivory transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-brand-lavender/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-lavender/20 transition-colors">
                    <Icon size={15} className="text-brand-lavender" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-ink truncate">{label}</p>
                    <p className="text-xs text-brand-ink/40 truncate">{desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-brand-ink/20 flex-shrink-0 ml-auto" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminPage>
  );
}
