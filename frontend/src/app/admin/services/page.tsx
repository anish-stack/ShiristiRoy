'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, ImagePlus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import RichEditor from '@/components/admin/RichEditor';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete,
} from '@/components/admin/AdminUI';

type Service = {
  _id: string; slug: string; name: string; shortDesc: string; description?: string;
  durationMin: number; price: { amount: number; currency: string };
  modes: string[]; category: string; isActive: boolean; order: number;
  coverImage?: { url: string; publicId?: string };
};

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v1\/?$/, '');
const imgUrl = (p?: string) => (!p ? '' : p.startsWith('http') ? p : `${API_ORIGIN}${p}`);

const BLANK = {
  slug: '', name: '', shortDesc: '', description: '', durationMin: 50,
  feeAmount: 2500, feeCurrency: 'INR', modes: 'online', category: 'individual', order: 0,
};

export default function ServicesPage() {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [delTarget, setDelTarget] = useState<Service | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<Service[]>('/services')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditing(null); setForm({ ...BLANK }); setImageFile(null); setImagePreview(''); setOpen(true);
  };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      slug: s.slug, name: s.name, shortDesc: s.shortDesc, description: s.description ?? '',
      durationMin: s.durationMin, feeAmount: s.price.amount, feeCurrency: s.price.currency,
      modes: s.modes.join(','), category: s.category, order: s.order,
    });
    setImageFile(null);
    setImagePreview(imgUrl(s.coverImage?.url));
    setOpen(true);
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('slug', form.slug);
      fd.append('name', form.name);
      fd.append('shortDesc', form.shortDesc);
      fd.append('description', form.description);
      fd.append('durationMin', String(form.durationMin));
      fd.append('price', JSON.stringify({ amount: Number(form.feeAmount), currency: form.feeCurrency }));
      fd.append('modes', JSON.stringify(form.modes.split(',').map((m) => m.trim())));
      fd.append('category', form.category);
      fd.append('order', String(form.order));
      if (imageFile) fd.append('image', imageFile);

      const url = editing ? `/admin/services/${editing._id}` : '/admin/services';
      const method = editing ? 'PATCH' : 'POST';

      await apiFormRequest(url, method, fd);

      toast(editing ? 'Updated' : 'Created', 'success');
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message ?? 'Failed to save', 'error'); }
    finally { setSaving(false); }
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
            { key: 'img', label: '', width: '56px' },
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
            <div key="img" className="w-10 h-10 rounded-lg overflow-hidden bg-brand-lavender/10 flex items-center justify-center">
              {s.coverImage?.url
                ? <img src={imgUrl(s.coverImage.url)} alt={s.name} className="w-full h-full object-cover" />
                : <ImagePlus size={14} className="text-brand-ink/20" />}
            </div>,
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

      <Modal size={"3xl"} open={open} onClose={() => setOpen(false)} title={editing ? 'Edit service' : 'New service'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" loading={saving} onClick={save}>Save</Btn></>}>
        <div className="space-y-4">

          <Field label="Cover image">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-lavender/10 flex items-center justify-center flex-shrink-0">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  : <ImagePlus size={20} className="text-brand-ink/20" />}
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" id="service-image-input" />
                <Btn variant="default" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={13} />{imagePreview ? 'Change image' : 'Upload image'}
                </Btn>
                <p className="text-[11px] text-brand-ink/40 mt-1">JPG/PNG/WebP, auto-optimised on upload</p>
              </div>
            </div>
          </Field>

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
          <Field label="Full description (rich text — shown on the service page)">
            <RichEditor
              value={form.description}
              onChange={(val) => setForm((p) => ({ ...p, description: val }))}
              height={300}
              placeholder="Describe this service in detail..."
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.name ?? ''} />
    </AdminPage>
  );
}

// Multipart helper — api.ts's request() always JSON.stringifies the body and
// sets Content-Type: application/json, which breaks file uploads. This talks
// to the same base URL + auth token but leaves Content-Type to the browser
// (so it can set the correct multipart boundary) and skips JSON.stringify.
async function apiFormRequest(path: string, method: string, form: FormData) {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
  let token: string | null = null;
  try {
    const auth = localStorage.getItem('auth');
    token = auth ? JSON.parse(auth)?.state?.accessToken ?? null : null;
  } catch {}

  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  let json: any = null;
  try { json = await res.json(); } catch { json = { success: false, message: res.statusText }; }
  if (!res.ok) throw new Error(json?.message || 'Request failed');
  return json.data;
}
