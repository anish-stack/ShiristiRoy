'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete,
} from '@/components/admin/AdminUI';

type Faq = {
  _id: string; question: string; answer: string;
  category: string; order: number; isActive: boolean;
};

const BLANK = { question: '', answer: '', category: 'general', order: 0, isActive: true };
const CATEGORIES = ['general', 'booking', 'pricing', 'therapy', 'online'];

export default function FaqsPage() {
  const [list, setList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [delTarget, setDelTarget] = useState<Faq | null>(null);
  const [form, setForm] = useState<typeof BLANK>({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<Faq[]>('/admin/faqs')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = catFilter === 'all' ? list : list.filter((f) => f.category === catFilter);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...BLANK, order: list.length + 1 });
    setOpen(true);
  };
  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order, isActive: faq.isActive });
    setOpen(true);
  };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) { toast('Question and answer required', 'error'); return; }
    try {
      if (editing) { await api.patch(`/admin/faqs/${editing._id}`, form); toast('Updated', 'success'); }
      else { await api.post('/admin/faqs', form); toast('Created', 'success'); }
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/faqs/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const toggleActive = async (faq: Faq) => {
    try {
      await api.patch(`/admin/faqs/${faq._id}`, { isActive: !faq.isActive });
      setList((p) => p.map((x) => x._id === faq._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast('Failed', 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  return (
    <AdminPage title="FAQs" subtitle={`${list.length} questions`}
      actions={<Btn variant="primary" onClick={openCreate}><Plus size={14} />Add FAQ</Btn>}>

      <Card>
        <CardHeader title="All FAQs" actions={
          <div className="flex items-center gap-2">
            {['all', ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${catFilter === c ? 'bg-brand-lavender text-white' : 'text-brand-ink/50 hover:text-brand-ink'}`}>
                {c}
              </button>
            ))}
          </div>
        } />

        <Table
          empty={loading ? 'Loading...' : 'No FAQs yet'}
          cols={[
            { key: 'ord', label: '#', width: '40px' },
            { key: 'q', label: 'Question' },
            { key: 'a', label: 'Answer' },
            { key: 'cat', label: 'Category', width: '100px' },
            { key: 'active', label: 'Active', width: '70px' },
            { key: 'actions', label: '', width: '90px' },
          ]}
          rows={filtered
            .sort((a, b) => a.order - b.order)
            .map((faq) => [
              <span key="o" className="text-xs text-brand-ink/30 font-mono">{faq.order}</span>,
              <p key="q" className="font-medium text-brand-ink text-sm">{faq.question}</p>,
              <p key="a" className="text-sm text-brand-ink/60 line-clamp-2 max-w-xs">{faq.answer}</p>,
              <Badge key="c" label={faq.category} variant="gray" />,
              <button key="ac" onClick={() => toggleActive(faq)}>
                <Badge label={faq.isActive ? 'yes' : 'no'} variant={faq.isActive ? 'green' : 'red'} />
              </button>,
              <div key="acts" className="flex gap-1">
                <Btn size="sm" variant="ghost" onClick={() => openEdit(faq)}><Pencil size={13} /></Btn>
                <Btn size="sm" variant="danger" onClick={() => setDelTarget(faq)}><Trash2 size={13} /></Btn>
              </div>,
            ])}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit FAQ' : 'New FAQ'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          <Field label="Question" required>
            <input className={inputCls} value={form.question} onChange={f('question')} placeholder="e.g. What therapy approach do you use?" />
          </Field>
          <Field label="Answer" required>
            <textarea className={inputCls} value={form.answer} onChange={f('answer') as any} rows={5} placeholder="Your answer..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={f('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </Field>
            <Field label="Display order">
              <input type="number" className={inputCls} value={form.order} onChange={f('order')} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-brand-lavender" checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active (visible on site)
          </label>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.question ?? ''} />
    </AdminPage>
  );
}
