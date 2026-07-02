'use client';
import { useEffect, useState, useCallback } from 'react';
import { FileText, ShieldCheck, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, StatCard, Card, CardHeader, Table, Badge, Btn, Modal, Pagination, inputCls,
} from '@/components/admin/AdminUI';

type Appt = {
  _id: string; bookingCode: string; status: string; startAt: string; endAt: string; mode: string;
  user: { name: string; email: string; phone?: string };
  therapist: { slug: string; title?: string };
  service?: { name: string };
};

type ApptDetail = Appt & {
  intake?: { primaryConcern?: string; prevTherapy?: boolean; notes?: string; emergencyContact?: { name?: string; phone?: string; relation?: string } };
  meeting?: { url?: string; provider?: string };
  cancellation?: { at?: string; reason?: string; by?: { name?: string; email?: string } };
  payment?: {
    _id: string; status: string; amount: number; currency: string; providerPaymentId?: string;
    intakeForm?: string; consentDone?: boolean | string; consentStatus?: string; consentRejectReason?: string;
  };
};

const STATUS_OPTS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

const statusVariant: Record<string, 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'lavender'> = {
  pending: 'amber', confirmed: 'green', completed: 'blue', cancelled: 'red', no_show: 'gray',
};

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v1\/?$/, '');
const fileUrl = (p?: string) => (!p ? '' : p.startsWith('http') ? p : `${API_ORIGIN}${p}`);

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<ApptDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState<null | 'booking' | 'consent'>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ notes: '', meetingUrl: '' });

  const fetch_ = useCallback(async () => {
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

  useEffect(() => { fetch_(); }, [fetch_]);

  const counts = (s: string) => appts.filter((a) => a.status === s).length;

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    setEditing(false);
    try {
      const d = await api.get<ApptDetail>(`/admin/appointments/${id}`);
      setDetail(d);
      setEditForm({ notes: d.intake?.notes ?? '', meetingUrl: d.meeting?.url ?? '' });
    } catch { toast('Failed to load appointment', 'error'); }
    finally { setDetailLoading(false); }
  };

  const setApptStatus = async (newStatus: string, reason?: string) => {
    if (!detail) return;
    setBusy(true);
    try {
      const updated = await api.patch<ApptDetail>(`/admin/appointments/${detail._id}/status`, { status: newStatus, reason });
      setDetail(updated);
      setAppts((p) => p.map((a) => a._id === detail._id ? { ...a, status: updated.status } : a));
      toast(`Appointment ${newStatus}`, 'success');
      setShowReject(null);
      setRejectReason('');
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  };

  const reviewConsent = async (action: 'approve' | 'reject', reason?: string) => {
    if (!detail) return;
    setBusy(true);
    try {
      const txn = await api.patch<ApptDetail['payment']>(`/admin/appointments/${detail._id}/consent`, { action, reason });
      setDetail((d) => d ? { ...d, payment: { ...d.payment!, ...txn } } : d);
      toast(`Consent ${action}d`, 'success');
      setShowReject(null);
      setRejectReason('');
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  };

  const saveEdits = async () => {
    if (!detail) return;
    setBusy(true);
    try {
      const updated = await api.patch<ApptDetail>(`/admin/appointments/${detail._id}`, {
        intake: { ...detail.intake, notes: editForm.notes },
        meeting: { ...detail.meeting, url: editForm.meetingUrl },
      });
      setDetail(updated);
      setEditing(false);
      toast('Saved', 'success');
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setBusy(false); }
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
            <Btn key="v" size="sm" variant="ghost" onClick={() => openDetail(a._id)}>View</Btn>,
          ])}
        />
        <Pagination page={page} total={total} limit={15} onChange={setPage} />
      </Card>

      {/* Detail modal */}
      <Modal size={"3xl"} open={!!detail || detailLoading} onClose={() => { setDetail(null); setShowReject(null); }} title="Appointment detail"
        footer={
          detail && (
            <div className="flex gap-2 flex-wrap">
              {editing ? (
                <>
                  <Btn variant="default" onClick={() => setEditing(false)}>Cancel edit</Btn>
                  <Btn variant="primary" loading={busy} onClick={saveEdits}>Save changes</Btn>
                </>
              ) : (
                <>
                  {detail.status === 'pending' && (
                    <Btn variant="primary" loading={busy} onClick={() => setApptStatus('confirmed')}>Confirm</Btn>
                  )}
                  {['pending', 'confirmed'].includes(detail.status) && (
                    <Btn variant="danger" onClick={() => setShowReject('booking')}>Reject / Cancel</Btn>
                  )}
                  {detail.status === 'confirmed' && (
                    <Btn variant="default" loading={busy} onClick={() => setApptStatus('completed')}>Mark completed</Btn>
                  )}
                  {detail.status === 'confirmed' && (
                    <Btn variant="default" loading={busy} onClick={() => setApptStatus('no_show')}>Mark no-show</Btn>
                  )}
                  <Btn variant="ghost" onClick={() => setEditing(true)}>Edit details</Btn>
                </>
              )}
            </div>
          )
        }>
        {detailLoading && <p className="text-center py-10 text-brand-ink/40 text-sm">Loading…</p>}
        {detail && (
          <div className="space-y-5 text-sm">

            {showReject === 'booking' && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 space-y-2">
                <p className="text-red-700 text-xs font-medium">Reason for rejecting/cancelling (sent to client by email)</p>
                <textarea className={inputCls} rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Therapist unavailable, please rebook" />
                <div className="flex gap-2 justify-end">
                  <Btn size="sm" variant="default" onClick={() => setShowReject(null)}>Cancel</Btn>
                  <Btn size="sm" variant="danger" loading={busy} onClick={() => setApptStatus('rejected', rejectReason)}>Send rejection email</Btn>
                </div>
              </div>
            )}

            {/* Core info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Booking code', detail.bookingCode],
                ['Status', detail.status],
                ['Client', `${detail.user?.name} (${detail.user?.email})`],
                ['Phone', detail.user?.phone || '—'],
                ['Service', detail.service?.name ?? 'General session'],
                ['Therapist', detail.therapist?.title ?? detail.therapist?.slug],
                ['Date', formatDate(detail.startAt)],
                ['Time', `${formatTime(detail.startAt)} – ${formatTime(detail.endAt)}`],
                ['Mode', detail.mode?.replace('_', ' ')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-brand-lavender/10 pb-2 gap-2">
                  <span className="text-brand-ink/40 flex-shrink-0">{k}</span>
                  <span className="font-medium text-brand-ink capitalize text-right">{v}</span>
                </div>
              ))}
            </div>

            {/* Meeting link */}
            <div>
              <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide mb-2">Meeting link</p>
              {editing ? (
                <input className={inputCls} value={editForm.meetingUrl} onChange={(e) => setEditForm((p) => ({ ...p, meetingUrl: e.target.value }))} placeholder="https://meet.google.com/..." />
              ) : (
                detail.meeting?.url
                  ? <a href={detail.meeting.url} target="_blank" className="text-brand-lavender underline break-all">{detail.meeting.url}</a>
                  : <p className="text-brand-ink/30">Not set</p>
              )}
            </div>

            {/* Intake */}
            <div>
              <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide mb-2">Intake</p>
              <div className="rounded-xl bg-brand-lavender/5 p-3 space-y-1">
                <p><span className="text-brand-ink/40">Primary concern: </span>{detail.intake?.primaryConcern || '—'}</p>
                <p><span className="text-brand-ink/40">Previous therapy: </span>{detail.intake?.prevTherapy ? 'Yes' : 'No'}</p>
                <p>
                  <span className="text-brand-ink/40">Admin notes: </span>
                  {editing
                    ? <textarea className={`${inputCls} mt-1`} rows={2} value={editForm.notes} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} />
                    : (detail.intake?.notes || '—')}
                </p>
                {detail.intake?.emergencyContact?.name && (
                  <p><span className="text-brand-ink/40">Emergency contact: </span>{detail.intake.emergencyContact.name} ({detail.intake.emergencyContact.phone}, {detail.intake.emergencyContact.relation})</p>
                )}
              </div>
            </div>

            {/* Payment + documents */}
            <div>
              <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide mb-2">Payment &amp; documents</p>
              {detail.payment ? (
                <div className="rounded-xl bg-brand-lavender/5 p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-ink/40">Payment status</span>
                    <Badge label={detail.payment.status} variant={detail.payment.status === 'paid' ? 'green' : detail.payment.status === 'failed' ? 'red' : 'amber'} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-ink/40">Amount</span>
                    <span className="font-medium">₹{detail.payment.amount} {detail.payment.currency}</span>
                  </div>
                  {detail.payment.providerPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-brand-ink/40">Payment ref</span>
                      <span className="font-mono text-xs">{detail.payment.providerPaymentId}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-brand-lavender/10">
                    <span className="text-brand-ink/40 flex items-center gap-1"><FileText size={13} /> Intake form</span>
                    {detail.payment.intakeForm
                      ? <a href={fileUrl(detail.payment.intakeForm)} target="_blank" className="text-brand-lavender flex items-center gap-1 underline"><Download size={12} />View file</a>
                      : <span className="text-brand-ink/30">Not uploaded</span>}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-brand-ink/40 flex items-center gap-1"><ShieldCheck size={13} /> Consent form</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        label={detail.payment.consentStatus || (detail.payment.consentDone ? 'approved' : 'pending')}
                        variant={detail.payment.consentStatus === 'rejected' ? 'red' : (detail.payment.consentDone ? 'green' : 'amber')}
                      />
                    </div>
                  </div>

                  {detail.payment.consentRejectReason && detail.payment.consentStatus === 'rejected' && (
                    <p className="text-xs text-red-500">Rejection reason: {detail.payment.consentRejectReason}</p>
                  )}

                  {showReject === 'consent' ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-2 space-y-2">
                      <textarea className={inputCls} rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Why is the consent form being rejected? Client will be asked to re-upload." />
                      <div className="flex gap-2 justify-end">
                        <Btn size="sm" variant="default" onClick={() => setShowReject(null)}>Cancel</Btn>
                        <Btn size="sm" variant="danger" loading={busy} onClick={() => reviewConsent('reject', rejectReason)}>Reject &amp; ask re-upload</Btn>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end pt-1">
                      <Btn size="sm" variant="primary" loading={busy} onClick={() => reviewConsent('approve')}>Approve consent</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setShowReject('consent')}>Reject consent</Btn>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-brand-ink/30">No payment record</p>
              )}
            </div>

            {detail.cancellation?.at && (
              <div>
                <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide mb-2">Cancellation</p>
                <div className="rounded-xl bg-red-50 p-3 space-y-1">
                  <p><span className="text-brand-ink/40">At: </span>{formatDate(detail.cancellation.at)}</p>
                  <p><span className="text-brand-ink/40">By: </span>{detail.cancellation.by?.name || 'Admin'}</p>
                  <p><span className="text-brand-ink/40">Reason: </span>{detail.cancellation.reason || '—'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminPage>
  );
}
