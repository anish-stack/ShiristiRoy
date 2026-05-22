'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, StatCard, Card, CardHeader, SearchBar, Table,
  Badge, Btn, Modal, Pagination,
} from '@/components/admin/AdminUI';

type Appt = {
  _id: string; bookingCode: string; status: string; startAt: string; endAt: string; mode: string;
  user: { name: string; email: string };
  therapist: { slug: string };
  service?: { name: string };
};

const STATUS_OPTS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

const statusVariant: Record<string, 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'lavender'> = {
  pending: 'amber', confirmed: 'green', completed: 'blue', cancelled: 'red', no_show: 'gray',
};

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Appt | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: String(page), limit: '15' });
      if (status !== 'all') p.set('status', status);
      const data = await api.get<{ items: Appt[]; total: number }>(`/admin/appointments?${p}`);
      setAppts(data.items);
      setTotal(data.total);
    } catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { fetch(); }, [fetch]);

  const counts = (s: string) => appts.filter((a) => a.status === s).length;

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      if (newStatus === 'cancelled') await api.patch(`/bookings/${id}/cancel`, { reason: 'Admin cancelled' });
      setAppts((p) => p.map((a) => a._id === id ? { ...a, status: newStatus } : a));
      toast('Updated', 'success');
      setDetail(null);
    } catch (e: any) { toast(e.message, 'error'); }
  };

  return (
    <AdminPage title="Appointments" subtitle={`${total} total`}>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={total} color="lavender" />
        <StatCard label="Pending" value={counts('pending')} color="amber" />
        <StatCard label="Confirmed" value={counts('confirmed')} color="sage" />
        <StatCard label="Completed" value={counts('completed')} color="blue" />
        <StatCard label="Cancelled" value={counts('cancelled')} color="red" />
      </div>

      <Card>
        <CardHeader title="All appointments" actions={
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_OPTS.map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${status === s ? 'bg-brand-lavender text-white' : 'text-brand-ink/50 hover:text-brand-ink'}`}>
                {s}
              </button>
            ))}
          </div>
        } />

        <Table
          empty={loading ? 'Loading...' : 'No appointments'}
          cols={[
            { key: 'code', label: 'Booking code', width: '120px' },
            { key: 'client', label: 'Client' },
            { key: 'service', label: 'Service' },
            { key: 'date', label: 'Date', width: '110px' },
            { key: 'time', label: 'Time', width: '90px' },
            { key: 'mode', label: 'Mode', width: '80px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'actions', label: '', width: '70px' },
          ]}
          rows={appts.map((a) => [
            <span key="c" className="font-mono text-xs text-brand-lavender">{a.bookingCode}</span>,
            <div key="u">
              <p className="font-medium text-brand-ink text-sm">{a.user?.name ?? '—'}</p>
              <p className="text-xs text-brand-ink/40">{a.user?.email}</p>
            </div>,
            <span key="s" className="text-sm text-brand-ink/70">{a.service?.name ?? 'Session'}</span>,
            <span key="d" className="text-xs text-brand-ink/60">{formatDate(a.startAt, { day: 'numeric', month: 'short' })}</span>,
            <span key="t" className="text-xs text-brand-ink/60">{formatTime(a.startAt)}</span>,
            <Badge key="m" label={a.mode?.replace('_', ' ')} variant="gray" />,
            <Badge key="st" label={a.status} variant={statusVariant[a.status] ?? 'gray'} />,
            <Btn key="v" size="sm" variant="ghost" onClick={() => setDetail(a)}>View</Btn>,
          ])}
        />
        <Pagination page={page} total={total} limit={15} onChange={setPage} />
      </Card>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Appointment detail"
        footer={
          detail && (
            <div className="flex gap-2">
              {detail.status === 'pending' && (
                <Btn variant="primary" onClick={() => updateStatus(detail._id, 'confirmed')}>Confirm</Btn>
              )}
              {['pending', 'confirmed'].includes(detail.status) && (
                <Btn variant="danger" onClick={() => updateStatus(detail._id, 'cancelled')}>Cancel</Btn>
              )}
              {detail.status === 'confirmed' && (
                <Btn variant="default" onClick={() => updateStatus(detail._id, 'completed')}>Mark completed</Btn>
              )}
            </div>
          )
        }>
        {detail && (
          <div className="space-y-3 text-sm">
            {[
              ['Booking code', detail.bookingCode],
              ['Client', `${detail.user?.name} (${detail.user?.email})`],
              ['Service', detail.service?.name ?? 'General session'],
              ['Date', formatDate(detail.startAt)],
              ['Time', `${formatTime(detail.startAt)} – ${formatTime(detail.endAt)}`],
              ['Mode', detail.mode?.replace('_', ' ')],
              ['Status', detail.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-brand-lavender/10 pb-2">
                <span className="text-brand-ink/40">{k}</span>
                <span className="font-medium text-brand-ink capitalize">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </AdminPage>
  );
}
