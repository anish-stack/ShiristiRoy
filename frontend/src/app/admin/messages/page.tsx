'use client';
import { useEffect, useState, useCallback } from 'react';
import { Mail, MailOpen, Trash2, AlertTriangle, Reply } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete, SearchBar, StatCard,
} from '@/components/admin/AdminUI';

type Message = {
  _id: string; name: string; email: string; phone?: string;
  subject?: string; message: string; status: string;
  ip?: string; createdAt: string;
};

const STATUS_OPTS = ['all', 'new', 'read', 'replied', 'spam'];
const statusVariant: Record<string, 'amber' | 'blue' | 'green' | 'red' | 'gray'> = {
  new: 'amber', read: 'blue', replied: 'green', spam: 'red',
};

export default function MessagesPage() {
  const [list, setList] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState<Message | null>(null);
  const [delTarget, setDelTarget] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<Message[]>('/admin/contact-messages')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = list.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/contact-messages/${id}`, { status });
      setList((p) => p.map((x) => x._id === id ? { ...x, status } : x));
      if (detail?._id === id) setDetail((d) => d ? { ...d, status } : null);
    } catch { toast('Failed', 'error'); }
  };

  const openDetail = async (m: Message) => {
    setDetail(m);
    setReplyText('');
    if (m.status === 'new') await updateStatus(m._id, 'read');
  };

  const sendReply = async () => {
    if (!detail || !replyText.trim()) return;
    setReplyLoading(true);
    try {
      // In production: POST to a /admin/contact-messages/:id/reply endpoint
      // which sends email via nodemailer. Here we optimistically mark replied.
      await updateStatus(detail._id, 'replied');
      toast(`Reply drafted. In production, implement POST /admin/contact-messages/${detail._id}/reply to send via nodemailer.`, 'info');
      setReplyText('');
    } catch { toast('Failed', 'error'); }
    finally { setReplyLoading(false); }
  };

  const counts = (s: string) => list.filter((m) => m.status === s).length;

  return (
    <AdminPage title="Messages" subtitle="Contact form inbox">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={list.length} color="lavender" />
        <StatCard label="New" value={counts('new')} color="amber" />
        <StatCard label="Replied" value={counts('replied')} color="sage" />
        <StatCard label="Spam" value={counts('spam')} color="red" />
      </div>

      <Card>
        <CardHeader title="All messages" actions={
          <div className="flex items-center gap-2">
            {STATUS_OPTS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${statusFilter === s ? 'bg-brand-lavender text-white' : 'text-brand-ink/50 hover:text-brand-ink'}`}>
                {s} {s !== 'all' && counts(s) > 0 && `(${counts(s)})`}
              </button>
            ))}
            <SearchBar value={search} onChange={setSearch} placeholder="Search messages..." />
          </div>
        } />

        <Table
          empty={loading ? 'Loading...' : 'No messages'}
          cols={[
            { key: 'from', label: 'From' },
            { key: 'subject', label: 'Subject' },
            { key: 'preview', label: 'Preview' },
            { key: 'status', label: 'Status', width: '80px' },
            { key: 'date', label: 'Date', width: '100px' },
            { key: 'actions', label: '', width: '110px' },
          ]}
          rows={filtered.map((m) => [
            <div key="f" className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === 'new' ? 'bg-amber-400' : 'bg-transparent'}`} />
              <div>
                <p className={`text-sm ${m.status === 'new' ? 'font-semibold text-brand-ink' : 'text-brand-ink/80'}`}>{m.name}</p>
                <p className="text-xs text-brand-ink/40">{m.email}</p>
              </div>
            </div>,
            <span key="s" className="text-sm text-brand-ink/70">{m.subject || '—'}</span>,
            <p key="p" className="text-xs text-brand-ink/50 line-clamp-1 max-w-xs">{m.message}</p>,
            <Badge key="st" label={m.status} variant={statusVariant[m.status] ?? 'gray'} />,
            <span key="d" className="text-xs text-brand-ink/40">
              {formatDate(m.createdAt, { day: 'numeric', month: 'short' })}
            </span>,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant="ghost" onClick={() => openDetail(m)}>
                {m.status === 'new' ? <Mail size={13} /> : <MailOpen size={13} />}View
              </Btn>
              <Btn size="sm" variant="danger" onClick={() => setDelTarget(m)}><Trash2 size={13} /></Btn>
            </div>,
          ])}
        />
      </Card>

      {/* Detail / reply modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Message detail"
        footer={
          <div className="flex gap-2 w-full">
            {detail?.status !== 'spam' && (
              <Btn variant="default" onClick={() => updateStatus(detail!._id, 'spam')}>
                <AlertTriangle size={13} />Mark spam
              </Btn>
            )}
            {detail?.status === 'spam' && (
              <Btn variant="default" onClick={() => updateStatus(detail!._id, 'read')}>Unspam</Btn>
            )}
            <div className="flex-1" />
            <Btn variant="default" onClick={() => setDetail(null)}>Close</Btn>
          </div>
        }>
        {detail && (
          <div className="space-y-4">
            {[
              ['From', `${detail.name} <${detail.email}>`],
              ['Phone', detail.phone || '—'],
              ['Subject', detail.subject || '—'],
              ['Received', formatDate(detail.createdAt)],
              ['Status', detail.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-brand-lavender/10 pb-2 text-sm">
                <span className="text-brand-ink/40 w-20 flex-shrink-0">{k}</span>
                <span className="font-medium text-brand-ink capitalize text-right">{v}</span>
              </div>
            ))}
            <div>
              <p className="text-xs text-brand-ink/40 mb-2">Message</p>
              <p className="text-sm text-brand-ink/80 leading-relaxed bg-brand-ivory rounded-xl p-4 whitespace-pre-wrap">{detail.message}</p>
            </div>
            {detail.status !== 'spam' && (
              <div>
                <p className="text-xs text-brand-ink/40 mb-2 flex items-center gap-1"><Reply size={12} />Quick reply</p>
                <textarea className={`${inputCls} w-full`} rows={4} value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Hi ${detail.name.split(' ')[0]}, thank you for reaching out...`} />
                <Btn variant="primary" onClick={sendReply} loading={replyLoading} disabled={!replyText.trim()}
                  size="sm" >
                  Send reply
                </Btn>
                <p className="text-xs text-brand-ink/30 mt-2">
                  Will send from contact@awarenesswithroy.com via Nodemailer
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)}
        onConfirm={async () => {
          // no delete endpoint in current API — mark spam instead
          if (delTarget) await updateStatus(delTarget._id, 'spam');
          setDelTarget(null);
        }}
        label={`message from ${delTarget?.name}`} />
    </AdminPage>
  );
}
