'use client';
import { useEffect, useState, useCallback } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import {
  AdminPage, Card, CardHeader, Btn, Field, inputCls, Modal, ConfirmDelete,
} from '@/components/admin/AdminUI';
import LogoHeroSettings from '@/components/admin/LogoHeroSettings';

type Setting = { _id: string; key: string; value: unknown; group: string };

const GROUPS = ['brand', 'contact', 'social', 'theme', 'business', 'other'];

const BLANK = { key: '', value: '', group: 'brand' };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState('brand');
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Setting | null>(null);
  const [newForm, setNewForm] = useState({ ...BLANK });
  // local edits before save
  const [edits, setEdits] = useState<Record<string, string>>({});

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Setting[]>('/admin/settings');
      setSettings(data);
      const init: Record<string, string> = {};
      for (const s of data) init[s._id] = typeof s.value === 'object' ? JSON.stringify(s.value, null, 2) : String(s.value ?? '');
      setEdits(init);
    } catch { toast('Failed to load settings', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const grouped = GROUPS.reduce<Record<string, Setting[]>>((acc, g) => {
    acc[g] = settings.filter((s) => s.group === g && s.key !== 'brand.logo' && s.key !== 'brand.heroSlides');
    return acc;
  }, {});

  const save = async (s: Setting) => {
    setSaving(s._id);
    try {
      let value: unknown = edits[s._id] ?? '';
      // try parse as JSON for object values
      try { value = JSON.parse(value as string); } catch { /* keep as string */ }
      await api.patch(`/admin/settings/${s._id}`, { value });
      setSettings((p) => p.map((x) => x._id === s._id ? { ...x, value } : x));
      toast('Saved', 'success');
    } catch (e: any) { toast(e.message, 'error'); }
    finally { setSaving(null); }
  };

  const add = async () => {
    if (!newForm.key.trim()) { toast('Key required', 'error'); return; }
    try {
      let value: unknown = newForm.value;
      try { value = JSON.parse(newForm.value); } catch { /* string */ }
      await api.post('/admin/settings', { key: newForm.key.trim(), value, group: newForm.group });
      toast('Setting added', 'success');
      setAddOpen(false);
      setNewForm({ ...BLANK });
      fetch();
    } catch (e: any) { toast(e.message, 'error'); }
  };

  const del = async () => {
    if (!delTarget) return;
    try { await api.delete(`/admin/settings/${delTarget._id}`); toast('Deleted', 'success'); fetch(); }
    catch (e: any) { toast(e.message, 'error'); }
  };

  const colourKeys = settings.filter((s) => s.key === 'brand.colors');

  return (
    <AdminPage title="Settings" subtitle="Brand, contact, social &amp; theme configuration"
      actions={<Btn variant="primary" onClick={() => setAddOpen(true)}><Plus size={14} />Add setting</Btn>}>

      {/* Group tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {GROUPS.map((g) => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${activeGroup === g ? 'bg-brand-lavender text-white' : 'bg-white border border-brand-lavender/15 text-brand-ink/60 hover:text-brand-ink'}`}>
            {g}
            {grouped[g]?.length > 0 && (
              <span className={`ml-1.5 text-xs ${activeGroup === g ? 'opacity-60' : 'text-brand-ink/30'}`}>({grouped[g].length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Settings for active group */}
      {activeGroup === 'brand' && <div className="mb-6"><LogoHeroSettings /></div>}
      <Card>
        <CardHeader title={`${activeGroup} settings`} />
        <div className="divide-y divide-brand-lavender/5">
          {(grouped[activeGroup] ?? []).length === 0 ? (
            <p className="text-center py-12 text-brand-ink/30 text-sm">No {activeGroup} settings yet</p>
          ) : (
            (grouped[activeGroup] ?? []).map((s) => {
              const isObj = typeof s.value === 'object' && s.value !== null;
              return (
                <div key={s._id} className="px-5 py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-brand-lavender/8 text-brand-lavender px-2 py-0.5 rounded font-mono">{s.key}</code>
                      <span className="text-xs text-brand-ink/30 capitalize">{s.group}</span>
                    </div>
                    {isObj ? (
                      <textarea
                        className={`${inputCls} font-mono text-xs w-full min-h-[80px]`}
                        value={edits[s._id] ?? ''}
                        onChange={(e) => setEdits((p) => ({ ...p, [s._id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        className={`${inputCls} w-full`}
                        value={edits[s._id] ?? ''}
                        onChange={(e) => setEdits((p) => ({ ...p, [s._id]: e.target.value }))}
                      />
                    )}
                  </div>
                  <div className="flex gap-1 pt-7 flex-shrink-0">
                    <Btn size="sm" variant="primary" loading={saving === s._id} onClick={() => save(s)}>
                      <Save size={13} />Save
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDelTarget(s)}><Trash2 size={13} /></Btn>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Colour preview if brand.colors exists */}
      {colourKeys.length > 0 && activeGroup === 'brand' && (() => {
        let cols: Record<string, string> = {};
        try { cols = typeof colourKeys[0].value === 'object' ? (colourKeys[0].value as any) : JSON.parse(String(colourKeys[0].value)); } catch {}
        return Object.keys(cols).length > 0 ? (
          <div className="mt-5 bg-white border border-brand-lavender/10 rounded-2xl p-5">
            <p className="text-sm font-medium text-brand-ink mb-3">Colour preview</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(cols).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg border border-brand-lavender/10 shadow-sm flex-shrink-0" style={{ background: v as string }} />
                  <div>
                    <p className="text-xs font-medium text-brand-ink">{k}</p>
                    <p className="text-xs text-brand-ink/40 font-mono">{v as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Add modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add setting"
        footer={<><Btn variant="default" onClick={() => setAddOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={add}>Add</Btn></>}>
        <div className="space-y-4">
          <Field label="Key" required>
            <input className={inputCls} value={newForm.key} placeholder="brand.tagline" onChange={(e) => setNewForm((p) => ({ ...p, key: e.target.value }))} />
          </Field>
          <Field label="Group">
            <select className={inputCls} value={newForm.group} onChange={(e) => setNewForm((p) => ({ ...p, group: e.target.value }))}>
              {GROUPS.map((g) => <option key={g} value={g} className="capitalize">{g}</option>)}
            </select>
          </Field>
          <Field label="Value (string or JSON)">
            <textarea className={`${inputCls} font-mono text-xs`} rows={4} value={newForm.value}
              onChange={(e) => setNewForm((p) => ({ ...p, value: e.target.value }))}
              placeholder='e.g.  "some text"  or  {"primary":"#7C6AA8"}' />
          </Field>
        </div>
      </Modal>

      <ConfirmDelete open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={del} label={delTarget?.key ?? ''} />
    </AdminPage>
  );
}
