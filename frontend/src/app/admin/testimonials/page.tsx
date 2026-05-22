'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete,
} from '@/components/admin/AdminUI';

type Testimonial = {
  _id: string; authorName: string; rating: number; text: string;
  isPublished: boolean; isFeatured: boolean; order: number; createdAt: string;
};

const BLANK = { authorName: '', rating: 5, text: '', isPublished: false, isFeatured: false, order: 0 };

export default function TestimonialsPage() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [delTarget, setDelTarget] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<typeof BLANK>({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<Testimonial[]>('/admin/testimonials')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK }); setOpen(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ authorName: t.authorName, rating: t.rating, text: t.text, isPublished: t.isPublished, isFeatured: t.isFeatured, order: t.order });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (editing) { await api.patch(`/admin/testimonials/${editing._id}`, form); toast('Updated', 'success'); }
      else { await api.post('/admin/testimonials', form); toast('Created', 'success'); }
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/testimonials/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const toggle = async (t: Testimonial, field: 'isPublished' | 'isFeatured') => {
    try {
      await api.patch(`/admin/testimonials/${t._id}`, { [field]: !t[field] });
      setList((p) => p.map((x) => x._id === t._id ? { ...x, [field]: !x[field] } : x));
    } catch { toast('Failed', 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  const published = list.filter((t) => t.isPublished).length;
  const featured  = list.filter((t) => t.isFeatured).length;

  return (
    <AdminPage title="Testimonials" subtitle={`${list.length} total`}
      actions={<Btn variant="primary" onClick={openCreate}><Plus size={14} />Add testimonial</Btn>}>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-brand-lavender/10 rounded-2xl p-5">
          <p className="text-xs text-brand-ink/40 uppercase tracking-wide mb-1">Total</p>
          <p className="text-2xl font-serif text-brand-lavender">{list.length}</p>
        </div>
        <div className="bg-white border border-brand-lavender/10 rounded-2xl p-5">
          <p className="text-xs text-brand-ink/40 uppercase tracking-wide mb-1">Published</p>
          <p className="text-2xl font-serif text-brand-sage">{published}</p>
        </div>
        <div className="bg-white border border-brand-lavender/10 rounded-2xl p-5">
          <p className="text-xs text-brand-ink/40 uppercase tracking-wide mb-1">Featured</p>
          <p className="text-2xl font-serif text-brand-blue">{featured}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="All testimonials" />
        <Table
          empty={loading ? 'Loading...' : 'No testimonials yet'}
          cols={[
            { key: 'author', label: 'Author', width: '140px' },
            { key: 'rating', label: 'Rating', width: '90px' },
            { key: 'text', label: 'Quote' },
            { key: 'published', label: 'Published', width: '90px' },
            { key: 'featured', label: 'Featured', width: '80px' },
            { key: 'order', label: 'Order', width: '60px' },
            { key: 'actions', label: '', width: '100px' },
          ]}
          rows={list.map((t) => [
            <span key="a" className="font-medium text-brand-ink">{t.authorName}</span>,
            <div key="r" className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < t.rating ? 'fill-brand-lavender text-brand-lavender' : 'text-brand-ink/10'} />
              ))}
            </div>,
            <p key="t" className="text-sm text-brand-ink/60 line-clamp-2 max-w-xs italic">"{t.text}"</p>,
            <button key="p" onClick={() => toggle(t, 'isPublished')}>
              <Badge label={t.isPublished ? 'yes' : 'no'} variant={t.isPublished ? 'green' : 'red'} />
            </button>,
            <button key="ft" onClick={() => toggle(t, 'isFeatured')}>
              <Badge label={t.isFeatured ? 'yes' : 'no'} variant={t.isFeatured ? 'lavender' : 'gray'} />
            </button>,
            <span key="o" className="text-xs text-brand-ink/40">{t.order}</span>,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil size={13} /></Btn>
              <Btn size="sm" variant="danger" onClick={() => setDelTarget(t)}><Trash2 size={13} /></Btn>
            </div>,
          ])}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit testimonial' : 'New testimonial'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Author name" required>
              <input className={inputCls} value={form.authorName} onChange={f('authorName')} placeholder="e.g. A.S." />
            </Field>
            <Field label="Rating (1–5)">
              <input type="number" min={1} max={5} className={inputCls} value={form.rating} onChange={f('rating')} />
            </Field>
          </div>
          <Field label="Quote" required>
            <textarea className={inputCls} value={form.text} onChange={f('text') as any} rows={4} placeholder="Client's words..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Display order">
              <input type="number" className={inputCls} value={form.order} onChange={f('order')} />
            </Field>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="accent-brand-lavender" checked={form.isPublished}
                onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="accent-brand-lavender" checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
              Featured on homepage
            </label>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.authorName ?? ''} />
    </AdminPage>
  );
}
