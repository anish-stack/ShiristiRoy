'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Table, Badge, Btn,
  Modal, Field, inputCls, ConfirmDelete, SearchBar, Pagination,
} from '@/components/admin/AdminUI';

type Blog = {
  _id: string; slug: string; title: string; excerpt: string;
  status: 'draft' | 'published' | 'archived'; tags: string[];
  views: number; publishedAt?: string; createdAt: string;
  author?: { name: string };
};

const BLANK = {
  title: '', slug: '', excerpt: '', content: '', tags: '',
  category: 'general', status: 'draft', readingTimeMin: 3,
};

const STATUS_OPTS = ['all', 'draft', 'published', 'archived'];

export default function BlogPage() {
  const [list, setList] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [delTarget, setDelTarget] = useState<Blog | null>(null);
  const [form, setForm] = useState({ ...BLANK });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      // admin sees all statuses — query admin blogs endpoint
      const p = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) p.set('q', search);
      const data = await api.get<Blog[]>(`/admin/blogs?${p}`);
      setList(data);
      setTotal(data.length);
    } catch {
      // fallback: hit public endpoint (only published)
      try {
        const data = await api.get<{ items: Blog[]; total: number }>(`/blogs?page=${page}`);
        setList(data.items); setTotal(data.total);
      } catch { toast('Failed to load', 'error'); }
    }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = statusFilter === 'all' ? list : list.filter((b) => b.status === statusFilter);

  const openCreate = () => { setEditing(null); setForm({ ...BLANK }); setOpen(true); };
  const openEdit = (b: Blog) => {
    setEditing(b);
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: '', tags: b.tags?.join(', '), category: 'general', status: b.status, readingTimeMin: 3 });
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        publishedAt: form.status === 'published' ? new Date().toISOString() : undefined,
      };
      if (editing) { await api.patch(`/admin/blogs/${editing._id}`, payload); toast('Updated', 'success'); }
      else { await api.post('/admin/blogs', payload); toast('Created', 'success'); }
      setOpen(false); fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/blogs/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const toggleStatus = async (b: Blog) => {
    const next = b.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/admin/blogs/${b._id}`, { status: next, ...(next === 'published' ? { publishedAt: new Date().toISOString() } : {}) });
      setList((p) => p.map((x) => x._id === b._id ? { ...x, status: next as any } : x));
      toast(`Marked ${next}`, 'success');
    } catch { toast('Failed', 'error'); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const statusVariant: Record<string, 'green' | 'amber' | 'gray'> = { published: 'green', draft: 'amber', archived: 'gray' };

  return (
    <AdminPage title="Blog" subtitle={`${total} posts`}
      actions={<Btn variant="ghost" onClick={openCreate}><Plus size={14} />New post</Btn>}>
      <Card>
        <CardHeader title="All posts" actions={
          <div className="flex items-center gap-2">
            {STATUS_OPTS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${statusFilter === s ? 'bg-brand-lavender text-white' : 'text-brand-ink/50 hover:text-brand-ink'}`}>
                {s}
              </button>
            ))}
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search posts..." />
          </div>
        } />

        <Table
          empty={loading ? 'Loading...' : 'No posts yet'}
          cols={[
            { key: 'title', label: 'Title' },
            { key: 'tags', label: 'Tags', width: '160px' },
            { key: 'status', label: 'Status', width: '90px' },
            { key: 'views', label: 'Views', width: '70px' },
            { key: 'date', label: 'Published', width: '110px' },
            { key: 'actions', label: '', width: '100px' },
          ]}
          rows={filtered.map((b) => [
            <div key="t">
              <p className="font-medium text-brand-ink">{b.title}</p>
              <p className="text-xs text-brand-ink/40 line-clamp-1">{b.excerpt}</p>
            </div>,
            <div key="tg" className="flex flex-wrap gap-1">
              {b.tags?.slice(0, 3).map((t) => <Badge key={t} label={t} variant="gray" />)}
            </div>,
            <Badge key="s" label={b.status} variant={statusVariant[b.status] ?? 'gray'} />,
            <span key="v" className="text-sm text-brand-ink/50">{b.views ?? 0}</span>,
            <span key="d" className="text-xs text-brand-ink/40">
              {b.publishedAt ? formatDate(b.publishedAt, { day: 'numeric', month: 'short' }) : '—'}
            </span>,
            <div key="ac" className="flex gap-1">
              <Btn size="sm" variant={b.status === 'published' ? 'default' : 'ghost'} onClick={() => toggleStatus(b)}>
                {b.status === 'published' ? 'Unpublish' : 'Publish'}
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => openEdit(b)}><Pencil size={13} /></Btn>
              <Btn size="sm" variant="danger" onClick={() => setDelTarget(b)}><Trash2 size={13} /></Btn>
            </div>,
          ])}
        />
        <Pagination page={page} total={total} limit={15} onChange={setPage} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit post' : 'New post'}
        footer={<><Btn variant="default" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="ghost" onClick={save}>Save</Btn></>}>
        <div className="space-y-4">
          <Field label="Title" required>
            <input className={inputCls} value={form.title} onChange={f('title')} placeholder="Post title" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slug" required>
              <input className={inputCls} value={form.slug} onChange={f('slug')} placeholder="post-slug" />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={f('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>
          <Field label="Excerpt">
            <textarea className={inputCls} value={form.excerpt} onChange={f('excerpt') as any} rows={2} placeholder="Brief summary..." />
          </Field>
          <Field label="Content (Markdown / HTML)">
            <textarea className={inputCls} value={form.content} onChange={f('content') as any} rows={8} placeholder="Write your post..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tags (comma separated)">
              <input className={inputCls} value={form.tags} onChange={f('tags')} placeholder="anxiety, self-care" />
            </Field>
            <Field label="Reading time (min)">
              <input type="number" className={inputCls} value={form.readingTimeMin} onChange={f('readingTimeMin')} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.title ?? ''} />
    </AdminPage>
  );
}
