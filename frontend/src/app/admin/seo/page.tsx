'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Globe, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete,
} from '@/components/admin/AdminUI';

type SeoMeta = {
  _id: string; pageKey: string; title: string; description: string;
  keywords: string[]; ogImage?: string; canonicalUrl?: string;
  noindex: boolean; jsonLd?: object;
};

const BLANK = {
  pageKey: '', title: '', description: '', keywords: '',
  ogImage: '', canonicalUrl: '', noindex: false, jsonLdRaw: '',
};

const PAGE_KEYS = ['home', 'about', 'services', 'contact', 'blog', 'book'];

export default function SeoPage() {
  const [list, setList] = useState<SeoMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SeoMeta | null>(null);
  const [delTarget, setDelTarget] = useState<SeoMeta | null>(null);
  const [jsonErr, setJsonErr] = useState('');
  const [form, setForm] = useState({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setList(await api.get<SeoMeta[]>('/admin/seo')); }
    catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK }); setJsonErr(''); setOpen(true); };
  const openEdit = (s: SeoMeta) => {
    setEditing(s);
    setForm({
      pageKey: s.pageKey, title: s.title, description: s.description,
      keywords: s.keywords?.join(', ') ?? '', ogImage: s.ogImage ?? '',
      canonicalUrl: s.canonicalUrl ?? '', noindex: s.noindex,
      jsonLdRaw: s.jsonLd ? JSON.stringify(s.jsonLd, null, 2) : '',
    });
    setJsonErr('');
    setOpen(true);
  };

  const save = async () => {
    let jsonLd: object | undefined;
    if (form.jsonLdRaw.trim()) {
      try { jsonLd = JSON.parse(form.jsonLdRaw); setJsonErr(''); }
      catch { setJsonErr('Invalid JSON-LD — fix before saving'); return; }
    }
    try {
      const payload = {
        pageKey: form.pageKey, title: form.title, description: form.description,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        ogImage: form.ogImage || undefined,
        canonicalUrl: form.canonicalUrl || undefined,
        noindex: form.noindex,
        jsonLd,
      };
      if (editing) { await api.patch(`/admin/seo/${editing._id}`, payload); toast('Updated', 'success'); }
      else { await api.post('/admin/seo', payload); toast('Created', 'success'); }
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/seo/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  // Pages without SEO entries yet
  const missing = PAGE_KEYS.filter((k) => !list.find((s) => s.pageKey === k));

  return (
    <AdminPage title="SEO Metadata" subtitle="Per-page titles, descriptions, OG tags &amp; JSON-LD"
      actions={<Btn variant="primary" onClick={openCreate}><Plus size={14} />Add page SEO</Btn>}>

      {/* Missing pages alert */}
      {missing.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <Globe size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700">Missing SEO for: {missing.join(', ')}</p>
            <p className="text-xs text-amber-600 mt-0.5">Add metadata for these pages to improve search visibility.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader title="All SEO pages" />
        <Table
          empty={loading ? 'Loading...' : 'No SEO entries yet'}
          cols={[
            { key: 'page', label: 'Page', width: '100px' },
            { key: 'title', label: 'Meta title' },
            { key: 'desc', label: 'Meta description' },
            { key: 'kw', label: 'Keywords', width: '100px' },
            { key: 'og', label: 'OG image', width: '70px' },
            { key: 'noindex', label: 'Noindex', width: '70px' },
            { key: 'jsonld', label: 'JSON-LD', width: '70px' },
            { key: 'actions', label: '', width: '80px' },
          ]}
          rows={list.map((s) => [
            <Badge key="p" label={s.pageKey} variant="lavender" />,
            <div key="t">
              <p className="text-sm font-medium text-brand-ink line-clamp-1">{s.title}</p>
            </div>,
            <p key="d" className="text-xs text-brand-ink/60 line-clamp-2 max-w-xs">{s.description}</p>,
            <span key="k" className="text-xs text-brand-ink/40">{s.keywords?.length ?? 0} tags</span>,
            s.ogImage
              ? <Badge key="og" label="set" variant="green" />
              : <Badge key="og" label="none" variant="gray" />,
            <Badge key="ni" label={s.noindex ? 'yes' : 'no'} variant={s.noindex ? 'amber' : 'green'} />,
            s.jsonLd
              ? <Badge key="jl" label="set" variant="green" />
              : <Badge key="jl" label="none" variant="gray" />,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil size={13} /></Btn>
              <Btn size="sm" variant="danger" onClick={() => setDelTarget(s)}><Trash2 size={13} /></Btn>
            </div>,
          ])}
        />
      </Card>

      {/* SEO score hint */}
      <div className="mt-4 bg-brand-lavender/5 border border-brand-lavender/15 rounded-2xl p-5">
        <p className="text-sm font-medium text-brand-ink mb-2">SEO checklist</p>
        <ul className="text-xs text-brand-ink/60 space-y-1 list-disc list-inside">
          <li>Meta titles: 50–60 characters ideal</li>
          <li>Meta descriptions: 150–160 characters ideal</li>
          <li>OG image: 1200×630px recommended</li>
          <li>JSON-LD: Person schema already on root layout — add Service schema per service page</li>
          <li>Sitemap auto-generated at <code className="bg-brand-lavender/10 px-1 rounded">/sitemap.xml</code></li>
          <li>Robots.txt auto-generated at <code className="bg-brand-lavender/10 px-1 rounded">/robots.txt</code></li>
        </ul>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit SEO: ${editing.pageKey}` : 'New page SEO'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          <Field label="Page key" required>
            {editing ? (
              <input className={inputCls} value={form.pageKey} disabled />
            ) : (
              <select className={inputCls} value={form.pageKey} onChange={f('pageKey')}>
                <option value="">— select page —</option>
                {PAGE_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                <option value="custom">custom</option>
              </select>
            )}
            {form.pageKey === 'custom' && !editing && (
              <input className={`${inputCls} mt-2`} placeholder="e.g. services/individual-counselling" onChange={f('pageKey')} />
            )}
          </Field>
          <Field label="Meta title">
            <input className={inputCls} value={form.title} onChange={f('title')} placeholder="Page title — 50-60 chars" />
            <span className={`text-xs mt-1 ${form.title.length > 60 ? 'text-red-400' : 'text-brand-ink/30'}`}>{form.title.length} / 60</span>
          </Field>
          <Field label="Meta description">
            <textarea className={inputCls} value={form.description} onChange={f('description') as any} rows={3} placeholder="Description — 150-160 chars" />
            <span className={`text-xs mt-1 ${form.description.length > 160 ? 'text-red-400' : 'text-brand-ink/30'}`}>{form.description.length} / 160</span>
          </Field>
          <Field label="Keywords (comma separated)">
            <input className={inputCls} value={form.keywords} onChange={f('keywords')} placeholder="therapy, counselling, anxiety" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="OG image URL">
              <input className={inputCls} value={form.ogImage} onChange={f('ogImage')} placeholder="https://..." />
            </Field>
            <Field label="Canonical URL (optional)">
              <input className={inputCls} value={form.canonicalUrl} onChange={f('canonicalUrl')} placeholder="https://..." />
            </Field>
          </div>
          <Field label="JSON-LD (raw JSON, optional)">
            <textarea className={`${inputCls} font-mono text-xs`} value={form.jsonLdRaw} onChange={f('jsonLdRaw') as any} rows={6}
              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Service"\n}'} />
            {jsonErr && <p className="text-xs text-red-400 mt-1">{jsonErr}</p>}
          </Field>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-brand-lavender" checked={form.noindex}
              onChange={(e) => setForm((p) => ({ ...p, noindex: e.target.checked }))} />
            Noindex this page (hides from search engines)
          </label>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.pageKey ?? ''} />
    </AdminPage>
  );
}
