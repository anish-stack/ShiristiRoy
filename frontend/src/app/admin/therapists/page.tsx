'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, SearchBar,
} from '@/components/admin/AdminUI';

type Therapist = {
  _id: string; slug: string; title: string; yearsExperience: number;
  specializations: string[]; languages: string[]; isAcceptingClients: boolean; isFeatured: boolean;
  consultationFee: { amount: number; currency: string };
  user: { name: string; email: string };
};

const BLANK = {
  userId: '', slug: '', title: 'Counselling Psychologist', shortBio: '', bio: '',
  yearsExperience: 0, defaultSlotDurationMin: 50, bufferMin: 10,
  specializations: '', approaches: '', languages: 'en',
  feeAmount: 2500, feeCurrency: 'INR',
};

export default function TherapistsPage() {
  const [list, setList] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Therapist | null>(null);
  const [form, setForm] = useState({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Therapist[]>(`/therapists?${search ? `q=${search}` : ''}`);
      setList(data);
    } catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK }); setOpen(true); };
  const openEdit = (t: Therapist) => {
    setEditing(t);
    setForm({
      userId: '', slug: t.slug, title: t.title, shortBio: '', bio: '',
      yearsExperience: t.yearsExperience, defaultSlotDurationMin: 50, bufferMin: 10,
      specializations: t.specializations.join(', '), approaches: '', languages: t.languages.join(', '),
      feeAmount: t.consultationFee.amount, feeCurrency: t.consultationFee.currency,
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        specializations: form.specializations.split(',').map((s) => s.trim()).filter(Boolean),
        approaches: form.approaches.split(',').map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
        consultationFee: { amount: Number(form.feeAmount), currency: form.feeCurrency },
      };
      if (editing) {
        await api.patch(`/admin/therapists/${editing._id}`, payload);
        toast('Therapist updated', 'success');
      } else {
        await api.post('/admin/therapists', payload);
        toast('Therapist created', 'success');
      }
      setOpen(false);
      fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const toggleAccepting = async (t: Therapist) => {
    try {
      await api.patch(`/admin/therapists/${t._id}`, { isAcceptingClients: !t.isAcceptingClients });
      setList((p) => p.map((x) => x._id === t._id ? { ...x, isAcceptingClients: !x.isAcceptingClients } : x));
      toast('Updated', 'success');
    } catch { toast('Failed', 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <AdminPage title="Therapists" subtitle={`${list.length} profiles`}
      actions={<Btn variant="primary" onClick={openCreate}><Plus size={14} />Add therapist</Btn>}>

      <Card>
        <CardHeader title="All therapists" actions={<SearchBar value={search} onChange={setSearch} placeholder="Search..." />} />
        <Table
          empty={loading ? 'Loading...' : 'No therapists'}
          cols={[
            { key: 'name', label: 'Name' },
            { key: 'title', label: 'Title' },
            { key: 'spec', label: 'Specializations' },
            { key: 'fee', label: 'Fee', width: '90px' },
            { key: 'exp', label: 'Exp', width: '60px' },
            { key: 'status', label: 'Accepting', width: '90px' },
            { key: 'featured', label: 'Featured', width: '80px' },
            { key: 'actions', label: '', width: '120px' },
          ]}
          rows={list.map((t) => [
            <div key="n">
              <p className="font-medium text-brand-ink">{t.user?.name}</p>
              <p className="text-xs text-brand-ink/40">{t.slug}</p>
            </div>,
            <span key="ti" className="text-sm text-brand-ink/70">{t.title}</span>,
            <div key="sp" className="flex flex-wrap gap-1">
              {t.specializations.slice(0, 2).map((s) => (
                <Badge key={s} label={s} variant="lavender" />
              ))}
              {t.specializations.length > 2 && <span className="text-xs text-brand-ink/40">+{t.specializations.length - 2}</span>}
            </div>,
            <span key="f" className="text-sm text-brand-sage font-medium">
              {t.consultationFee?.currency} {t.consultationFee?.amount?.toLocaleString('en-IN')}
            </span>,
            <span key="e" className="text-sm text-brand-ink/60">{t.yearsExperience}y</span>,
            <Badge key="a" label={t.isAcceptingClients ? 'yes' : 'no'} variant={t.isAcceptingClients ? 'green' : 'red'} />,
            <Badge key="ft" label={t.isFeatured ? 'yes' : 'no'} variant={t.isFeatured ? 'lavender' : 'gray'} />,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant="default" onClick={() => openEdit(t)}>Edit</Btn>
              <Btn size="sm" variant={t.isAcceptingClients ? 'danger' : 'primary'} onClick={() => toggleAccepting(t)}>
                {t.isAcceptingClients ? 'Pause' : 'Open'}
              </Btn>
            </div>,
          ])}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit therapist' : 'Add therapist'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          {!editing && (
            <Field label="User ID (MongoDB _id)" required>
              <input className={inputCls} value={form.userId} onChange={f('userId')} placeholder="Paste user _id" />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug" required><input className={inputCls} value={form.slug} onChange={f('slug')} placeholder="srishti-roy" /></Field>
            <Field label="Title"><input className={inputCls} value={form.title} onChange={f('title')} /></Field>
            <Field label="Years exp"><input type="number" className={inputCls} value={form.yearsExperience} onChange={f('yearsExperience')} /></Field>
            <Field label="Slot duration (min)"><input type="number" className={inputCls} value={form.defaultSlotDurationMin} onChange={f('defaultSlotDurationMin')} /></Field>
            <Field label="Fee amount"><input type="number" className={inputCls} value={form.feeAmount} onChange={f('feeAmount')} /></Field>
            <Field label="Currency"><input className={inputCls} value={form.feeCurrency} onChange={f('feeCurrency')} /></Field>
          </div>
          <Field label="Specializations (comma separated)">
            <input className={inputCls} value={form.specializations} onChange={f('specializations')} placeholder="anxiety, self-esteem, relationships" />
          </Field>
          <Field label="Languages (comma separated)">
            <input className={inputCls} value={form.languages} onChange={f('languages')} placeholder="en, hi, bn, ur" />
          </Field>
          <Field label="Short bio">
            <textarea className={inputCls} value={form.shortBio} onChange={f('shortBio') as any} rows={2} />
          </Field>
          <Field label="Full bio">
            <textarea className={inputCls} value={form.bio} onChange={f('bio') as any} rows={4} />
          </Field>
        </div>
      </Modal>
    </AdminPage>
  );
}
