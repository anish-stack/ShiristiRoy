'use client';
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Save, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';
import { Card, CardHeader, Btn, Field, inputCls } from '@/components/admin/AdminUI';

type ImgVal = { url: string; publicId?: string } | null;
type Slide = { image: ImgVal; title: string; desc: string };

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
const API_ORIGIN = BASE.replace(/\/api\/v1\/?$/, '');
const imgUrl = (p?: string) => (!p ? '' : p.startsWith('http') ? p : `${API_ORIGIN}${p}`);

function getToken() {
  try {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth)?.state?.accessToken ?? null : null;
  } catch { return null; }
}

async function apiGet(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed');
  return json.data;
}
async function apiPostJson(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed');
  return json.data;
}
async function apiUploadImage(key: string, file: File) {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('key', key);
  fd.append('group', 'brand');
  const res = await fetch(`${BASE}/admin/settings/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Upload failed');
  return json.data.value as ImgVal; // { url, publicId }
}

async function findOrCreateSetting(key: string, group: string, value: unknown) {
  // settings CRUD is keyed by _id, not key, so look it up first
  const all = await apiGet('/admin/settings');
  const existing = all.find((s: any) => s.key === key);
  if (existing) return existing;
  return apiPostJson('/admin/settings', { key, value, group });
}
async function saveSetting(id: string, value: unknown) {
  const res = await fetch(`${BASE}/admin/settings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ value }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Failed');
  return json.data;
}

export default function LogoHeroSettings() {
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<ImgVal>(null);
  const [logoSettingId, setLogoSettingId] = useState<string | null>(null);
  const [slides, setSlides] = useState<Slide[]>([
    { image: null, title: 'Individual Counselling', desc: 'A reflective and safe therapeutic space for emotional growth & self-awareness.' },
    { image: null, title: 'Family Therapy', desc: 'Helping families reconnect through understanding, communication & healing.' },
  ]);
  const [slidesSettingId, setSlidesSettingId] = useState<string | null>(null);
  const [savingLogo, setSavingLogo] = useState(false);
  const [savingSlides, setSavingSlides] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const slideInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    (async () => {
      try {
        const logoRow = await findOrCreateSetting('brand.logo', 'brand', null);
        console.log('Loaded logo setting', logoRow);
        setLogo(logoRow.value ?? null);
        setLogoSettingId(logoRow._id);

        const slidesRow = await findOrCreateSetting('brand.heroSlides', 'brand', slides);
        if (Array.isArray(slidesRow.value) && slidesRow.value.length) setSlides(slidesRow.value);
        setSlidesSettingId(slidesRow._id);
      } catch {
        toast('Failed to load logo/hero settings', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onPickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !logoSettingId) return;
    setSavingLogo(true);
    try {
      const value = await apiUploadImage('brand.logo', file);
      await saveSetting(logoSettingId, value);
      setLogo(value);
      toast('Logo updated — live on site now', 'success');
    } catch (err: any) { toast(err.message ?? 'Failed to upload logo', 'error'); }
    finally { setSavingLogo(false); }
  };

  const onPickSlideImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlide(idx);
    try {
      const value = await apiUploadImage(`brand.heroSlide.${idx}`, file);
      setSlides((p) => p.map((s, i) => i === idx ? { ...s, image: value } : s));
      toast('Slide image uploaded — click Save to publish', 'success');
    } catch (err: any) { toast(err.message ?? 'Failed to upload image', 'error'); }
    finally { setUploadingSlide(null); }
  };

  const saveSlides = async () => {
    if (!slidesSettingId) return;
    setSavingSlides(true);
    try {
      await saveSetting(slidesSettingId, slides);
      toast('Hero slides saved — live on site now', 'success');
    } catch (err: any) { toast(err.message ?? 'Failed to save', 'error'); }
    finally { setSavingSlides(false); }
  };

  const updateSlideText = (idx: number, key: 'title' | 'desc', val: string) =>
    setSlides((p) => p.map((s, i) => i === idx ? { ...s, [key]: val } : s));

  if (loading) return null;

  return (
    <Card>
      <CardHeader title="Logo & Homepage Hero" />
      <div className="p-5 space-y-8">

        {/* Logo */}
        <div>
          <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide mb-3">Site logo</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-brand-lavender/15 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
              {logo?.url ? <img src={imgUrl(logo.url)} alt="logo" className="max-w-full max-h-full object-contain" /> : <ImagePlus size={18} className="text-brand-ink/20" />}
            </div>
            <div>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={onPickLogo} className="hidden" />
              <Btn variant="default" size="sm" loading={savingLogo} onClick={() => logoInputRef.current?.click()}>
                <ImagePlus size={13} />{logo?.url ? 'Replace logo' : 'Upload logo'}
              </Btn>
              <p className="text-[11px] text-brand-ink/40 mt-1">Updates instantly across the site header.</p>
            </div>
          </div>
        </div>

        {/* Hero slides */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">Homepage hero slides</p>
            <Btn variant="primary" size="sm" loading={savingSlides} onClick={saveSlides}><Save size={13} />Save slides</Btn>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {slides.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-brand-lavender/15 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-brand-lavender/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {uploadingSlide === idx
                      ? <Loader2 size={16} className="animate-spin text-brand-lavender" />
                      : s.image?.url
                        ? <img src={imgUrl(s.image.url)} alt="" className="w-full h-full object-cover" />
                        : <ImagePlus size={16} className="text-brand-ink/20" />}
                  </div>
                  <div>
                    <input
                      ref={(el) => { slideInputRefs.current[idx] = el; }}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => onPickSlideImage(idx, e)}
                    />
                    <Btn size="sm" variant="default" onClick={() => slideInputRefs.current[idx]?.click()}>
                      <ImagePlus size={12} />Image
                    </Btn>
                  </div>
                </div>
                <Field label="Title">
                  <input className={inputCls} value={s.title} onChange={(e) => updateSlideText(idx, 'title', e.target.value)} />
                </Field>
                <Field label="Description">
                  <textarea className={inputCls} rows={2} value={s.desc} onChange={(e) => updateSlideText(idx, 'desc', e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
