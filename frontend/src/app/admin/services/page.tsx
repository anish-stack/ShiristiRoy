'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete,
} from '@/components/admin/AdminUI';

type Service = {
  _id: string; slug: string; name: string; shortDesc: string;
  durationMin: number; price: { amount: number; currency: string };
  modes: string[]; category: string; isActive: boolean; order: number;
};

const BLANK = {
  slug: '', name: '', shortDesc: '', description: '', durationMin: 50,
  feeAmount: 2500, feeCurrency: 'INR', modes: 'online', category: 'individual', order: 0,
};

export default function ServicesPage() {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [delTarget, setDelTarget] = useState<Service | null>(null);
  const [form, setForm] = useState({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<Service[]>('/services')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK }); setOpen(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ slug: s.slug, name: s.name, shortDesc: s.shortDesc, description: '', durationMin: s.durationMin, feeAmount: s.price.amount, feeCurrency: s.price.currency, modes: s.modes.join(','), category: s.category, order: s.order });
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = { ...form, price: { amount: Number(form.feeAmount), currency: form.feeCurrency }, modes: form.modes.split(',').map((m) => m.trim()) };
      if (editing) { await api.patch(`/admin/services/${editing._id}`, payload); toast('Updated', 'success'); }
      else { await api.post('/admin/services', payload); toast('Created', 'success'); }
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/services/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const toggleActive = async (s: Service) => {
    try {
      await api.patch(`/admin/services/${s._id}`, { isActive: !s.isActive });
      setList((p) => p.map((x) => x._id === s._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast('Failed', 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <AdminPage title="Services" subtitle={`${list.length} services`}
      actions={<Btn variant="primary" onClick={openCreate}><Plus size={14} />Add service</Btn>}>
      <Card>
        <CardHeader title="All services" />
        <Table
          empty={loading ? 'Loading...' : 'No services'}
          cols={[
            { key: 'name', label: 'Name' },
            { key: 'slug', label: 'Slug', width: '180px' },
            { key: 'cat', label: 'Category', width: '100px' },
            { key: 'dur', label: 'Duration', width: '80px' },
            { key: 'fee', label: 'Fee', width: '90px' },
            { key: 'modes', label: 'Modes', width: '120px' },
            { key: 'active', label: 'Active', width: '70px' },
            { key: 'ord', label: 'Order', width: '60px' },
            { key: 'actions', label: '', width: '90px' },
          ]}
          rows={list.map((s) => [
            <div key="n">
              <p className="font-medium text-brand-ink">{s.name}</p>
              <p className="text-xs text-brand-ink/40 line-clamp-1">{s.shortDesc}</p>
            </div>,
            <span key="sl" className="font-mono text-xs text-brand-ink/50">{s.slug}</span>,
            <Badge key="c" label={s.category} variant="lavender" />,
            <span key="d" className="text-sm text-brand-ink/60">{s.durationMin} min</span>,
            <span key="f" className="text-sm font-medium text-brand-sage">₹{s.price?.amount?.toLocaleString('en-IN')}</span>,
            <div key="m" className="flex gap-1 flex-wrap">
              {s.modes?.map((m) => <Badge key={m} label={m.replace('_', ' ')} variant="gray" />)}
            </div>,
            <button key="a" onClick={() => toggleActive(s)}>
              <Badge label={s.isActive ? 'yes' : 'no'} variant={s.isActive ? 'green' : 'red'} />
            </button>,
            <span key="o" className="text-xs text-brand-ink/40">{s.order}</span>,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={13} /></Btn>
              <Btn size="sm" variant="danger" onClick={() => setDelTarget(s)}><Trash2 size={13} /></Btn>
            </div>,
          ])}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit service' : 'New service'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" required><input className={inputCls} value={form.name} onChange={f('name')} /></Field>
            <Field label="Slug" required><input className={inputCls} value={form.slug} onChange={f('slug')} placeholder="individual-counselling" /></Field>
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={f('category')}>
                {['individual','family','couple','youth','group'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Duration (min)"><input type="number" className={inputCls} value={form.durationMin} onChange={f('durationMin')} /></Field>
            <Field label="Fee (INR)"><input type="number" className={inputCls} value={form.feeAmount} onChange={f('feeAmount')} /></Field>
            <Field label="Display order"><input type="number" className={inputCls} value={form.order} onChange={f('order')} /></Field>
          </div>
          <Field label="Modes (comma: online, in_person)">
            <input className={inputCls} value={form.modes} onChange={f('modes')} placeholder="online,in_person" />
          </Field>
          <Field label="Short description">
            <input className={inputCls} value={form.shortDesc} onChange={f('shortDesc')} />
          </Field>
          <Field label="Full description">
            <textarea className={inputCls} value={form.description} onChange={f('description') as any} rows={4} />
          </Field>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.name ?? ''} />
    </AdminPage>
  );
}
