'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Loader2, ChevronLeft, ChevronRight, Check,
  Calendar, Clock, Monitor, MapPin, Leaf, Wind, Waves
} from 'lucide-react';
import { serviceApi, slotApi, bookingApi, type Service, type Slot } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import Link from 'next/link';

/* If NEXT_PUBLIC_SERVICE_ID is set in env, that service is used and the
   service-selection step is skipped. The same applies if ?serviceId= is
   present in the URL query string.  When neither is present the user sees
   the service picker as the first step. */

type Step = 'service' | 'slot' | 'intake' | 'confirm' | 'done';

const THERAPIST_ID = process.env.NEXT_PUBLIC_THERAPIST_ID ?? '';
const ENV_SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID ?? '';

function groupByDate(slots: Slot[]) {
  const map: Record<string, Slot[]> = {};
  for (const s of slots) {
    const d = s.startAt.split('T')[0];
    if (!map[d]) map[d] = [];
    map[d].push(s);
  }
  return map;
}

/* ─── SVG illustrations ───────────────────────────────────────────── */
const LeafSVG = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" aria-hidden="true"
    style={{ position: 'absolute', right: -30, top: -20, opacity: 0.13, pointerEvents: 'none' }}>
    <path d="M90 160 C90 160 20 120 20 60 C20 20 60 10 90 40 C120 10 160 20 160 60 C160 120 90 160 90 160Z" fill="#7a9e7e" />
    <line x1="90" y1="160" x2="90" y2="40" stroke="#7a9e7e" strokeWidth="2" />
    <line x1="90" y1="100" x2="55" y2="70" stroke="#7a9e7e" strokeWidth="1.5" />
    <line x1="90" y1="120" x2="125" y2="90" stroke="#7a9e7e" strokeWidth="1.5" />
    <line x1="90" y1="80" x2="118" y2="60" stroke="#7a9e7e" strokeWidth="1.5" />
    <line x1="90" y1="80" x2="62" y2="62" stroke="#7a9e7e" strokeWidth="1.5" />
  </svg>
);

const WaveSVG = () => (
  <svg width="300" height="60" viewBox="0 0 300 60" fill="none" aria-hidden="true"
    style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.07, pointerEvents: 'none', width: '100%' }}>
    <path d="M0 40 Q37.5 10 75 40 Q112.5 70 150 40 Q187.5 10 225 40 Q262.5 70 300 40 L300 60 L0 60Z" fill="#7b96b2" />
  </svg>
);

const MindSVG = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="28" stroke="#9b8ec4" strokeWidth="1.5" fill="#ede8f8" />
    <path d="M22 28 Q24 22 32 22 Q40 22 42 28 Q44 35 38 40 Q35 43 32 44 Q29 43 26 40 Q20 35 22 28Z"
      stroke="#9b8ec4" strokeWidth="1.5" fill="none" />
    <path d="M32 22 Q32 18 30 16" stroke="#9b8ec4" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="27" cy="32" r="2" fill="#9b8ec4" />
    <circle cx="37" cy="32" r="2" fill="#9b8ec4" />
    <path d="M28 38 Q32 41 36 38" stroke="#9b8ec4" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

/* ─── progress bar ────────────────────────────────────────────────── */
const ALL_STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'service', label: 'Service', icon: '🌱' },
  { key: 'slot', label: 'Date & Time', icon: '🌿' },
  { key: 'intake', label: 'About You', icon: '🌸' },
  { key: 'confirm', label: 'Confirm', icon: '✨' },
];

function ProgressBar({ step, hasServiceStep }: { step: Step; hasServiceStep: boolean }) {
  const visibleSteps = hasServiceStep ? ALL_STEPS : ALL_STEPS.filter(s => s.key !== 'service');
  const idx = visibleSteps.findIndex(s => s.key === step);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {visibleSteps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 500,
                background: done ? '#7a9e7e' : active ? '#9b8ec4' : 'rgba(155,142,196,0.12)',
                color: done || active ? '#fff' : '#9ba0ae',
                border: active ? '2px solid #c4b8e8' : '2px solid transparent',
                transition: 'all 0.3s ease',
                boxShadow: active ? '0 0 0 4px rgba(155,142,196,0.15)' : 'none',
              }}>
                {done ? <Check size={15} /> : <span style={{ fontSize: 16 }}>{s.icon}</span>}
              </div>
              <span style={{
                fontSize: 11, letterSpacing: '0.04em', fontWeight: active ? 600 : 400,
                color: active ? '#6b5ea8' : '#9ba0ae', display: 'none',
              }} className="step-label">{s.label}</span>
            </div>
            {i < visibleSteps.length - 1 && (
              <div style={{
                width: 56, height: 2, margin: '0 4px 14px',
                background: i < idx ? 'linear-gradient(90deg,#7a9e7e,#9b8ec4)' : 'rgba(155,142,196,0.18)',
                borderRadius: 2, transition: 'background 0.4s',
              }} />
            )}
          </div>
        );
      })}
      <style>{`@media(min-width:480px){.step-label{display:block!important}}`}</style>
    </div>
  );
}

/* ─── shared UI pieces ────────────────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid rgba(155,142,196,0.15)', padding: '28px 28px',
      boxShadow: '0 4px 32px rgba(155,142,196,0.08)', position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 13, color: '#9ba0ae', background: 'none', border: 'none',
      cursor: 'pointer', marginBottom: 24, padding: '4px 0',
      fontFamily: 'inherit', transition: 'color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.color = '#9b8ec4')}
      onMouseLeave={e => (e.currentTarget.style.color = '#9ba0ae')}
    >
      <ChevronLeft size={15} /> Back
    </button>
  );
}

function PrimaryBtn({ onClick, disabled, loading, children }: {
  onClick?: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      width: '100%', padding: '14px 24px',
      background: disabled ? 'rgba(155,142,196,0.3)' : 'linear-gradient(135deg,#9b8ec4,#7b96b2)',
      color: '#fff', border: 'none', borderRadius: 14,
      fontSize: 15, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'inherit', letterSpacing: '0.02em', transition: 'all 0.25s ease',
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(155,142,196,0.35)',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading
        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Please wait…</>
        : children}
    </button>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid rgba(155,142,196,0.22)',
  borderRadius: 12, padding: '12px 16px', fontSize: 14,
  fontFamily: 'inherit', color: '#2d3142', background: '#faf7f2',
  outline: 'none', resize: 'none', transition: 'border-color 0.2s',
};

/* ─── main component ──────────────────────────────────────────────── */
export default function BookPage() {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Resolve serviceId: URL param > env var > null (show picker) */
  const queryServiceId = searchParams.get('serviceId') ?? '';
  const resolvedSvcId = queryServiceId || ENV_SERVICE_ID; // truthy = skip picker
  const hasServiceStep = !resolvedSvcId;                   // show picker when no id provided

  const [step, setStep] = useState<Step>(hasServiceStep ? 'service' : 'slot');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [intake, setIntake] = useState({ primaryConcern: '', prevTherapy: false, notes: '' });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [from] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString(); });
  const [to] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 15); return d.toISOString(); });

  /* load service list only when picker is needed */
  useEffect(() => {
    if (hasServiceStep) serviceApi.list().then(setServices).catch(() => { });
  }, [hasServiceStep]);

  /* fetch slots once we know the service */
  useEffect(() => {
    if (step !== 'slot' || !THERAPIST_ID) return;
    const svcId = resolvedSvcId || selectedService?._id;
    const mode = selectedService?.modes?.[0];
    setSlotsLoading(true);
    slotApi.list(THERAPIST_ID, from, to, mode, svcId || undefined)
      .then(setSlots).catch(() => { }).finally(() => setSlotsLoading(false));
  }, [step, resolvedSvcId, selectedService, from, to]);

  /* auth guard */
  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/login?next=/book');
  }, [hydrated, user, router]);

  /* check slot availability on selection */
  useEffect(() => {
    if (!selectedSlot) return;
    setLoading(true);
    slotApi.checkSlot({ slotId: selectedSlot._id, therapistId: THERAPIST_ID, service: resolvedSvcId || selectedService?._id, mode: selectedService?.modes?.[0] })
      .then(() => setLoading(false))
      .catch((e) => {
        setLoading(false);
        toast(e.message ?? 'Slot no longer available. Please choose another.', 'error');
        setSelectedSlot(null);
        setStep('slot');
      });
  }, [selectedSlot]);

  const grouped = groupByDate(slots);
  const days = Object.keys(grouped).sort();

  const confirm = async () => {
    if (!selectedSlot) { toast('Please select a slot', 'error'); return; }
    setLoading(true);
    try {
      const appt = await bookingApi.book({
        slotId: selectedSlot._id,
        serviceId: resolvedSvcId || selectedService?._id,
        intake,
      });
      setBooking(appt);
      setStep('done');
    } catch (e: any) {
      toast(e.message ?? 'Booking failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh', background: '#f5f0fa',
      backgroundImage: 'radial-gradient(circle at 15% 20%,rgba(155,142,196,0.08) 0%,transparent 55%),radial-gradient(circle at 85% 80%,rgba(122,158,126,0.08) 0%,transparent 55%)',
      paddingTop: 100, paddingBottom: 60, paddingLeft: 16, paddingRight: 16,
      fontFamily: "'Lora', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .body-font { font-family: 'DM Sans', sans-serif; }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(155,142,196,0.4)} 50%{box-shadow:0 0 0 8px rgba(155,142,196,0)} }
        .slot-btn:hover     { border-color:#9b8ec4 !important; background:rgba(155,142,196,0.08) !important; transform:translateY(-1px); }
        .slot-btn           { transition:all 0.18s ease; }
        .svc-card:hover     { border-color:rgba(155,142,196,0.5) !important; box-shadow:0 6px 28px rgba(155,142,196,0.14) !important; transform:translateY(-2px); }
        .svc-card           { transition:all 0.22s ease; }
        textarea:focus      { border-color:#9b8ec4 !important; box-shadow:0 0 0 3px rgba(155,142,196,0.12); }
        .step-anim          { animation:fadeUp 0.35s ease both; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <MindSVG />
          </div>
          <p className="body-font" style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', fontWeight: 500, marginBottom: 8 }}>
            Srishti Roy · Therapist
          </p>
          <h1 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 30, fontWeight: 400, color: '#2d3142', lineHeight: 1.3 }}>
            Book a session
          </h1>
          <p className="body-font" style={{ color: '#9ba0ae', fontSize: 14, marginTop: 8 }}>
            A safe, gentle space — just for you.
          </p>
        </div>

        {step !== 'done' && <ProgressBar step={step} hasServiceStep={hasServiceStep} />}

        {/* ── STEP: SERVICE ─────────────────────────────────────────── */}
        {step === 'service' && (
          <div className="step-anim">
            <Card>
              <LeafSVG />
              <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, fontWeight: 500, color: '#2d3142', marginBottom: 6 }}>
                Choose a service
              </h2>
              <p className="body-font" style={{ fontSize: 13, color: '#9ba0ae', marginBottom: 24 }}>
                Select the type of session that feels right for you.
              </p>

              {services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Loader2 size={26} style={{ color: '#9b8ec4', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {services.map(s => {
                    const active = selectedService?._id === s._id;
                    return (
                      <button key={s._id} className="svc-card body-font"
                        onClick={() => { setSelectedService(s); setStep('slot'); }}
                        style={{
                          textAlign: 'left', width: '100%', cursor: 'pointer',
                          background: active ? 'linear-gradient(135deg,rgba(155,142,196,0.07),rgba(122,158,126,0.07))' : '#fff',
                          border: active ? '2px solid #9b8ec4' : '1.5px solid rgba(155,142,196,0.18)',
                          borderRadius: 16, padding: '18px 20px', fontFamily: 'inherit',
                          boxShadow: active ? '0 4px 18px rgba(155,142,196,0.18)' : '0 2px 8px rgba(155,142,196,0.06)',
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 16, fontWeight: 500, color: '#2d3142', marginBottom: 4 }}>
                              {s.name}
                            </p>
                            <p style={{ fontSize: 13, color: '#9ba0ae', marginBottom: 10, lineHeight: 1.5 }}>
                              {s.shortDesc}
                            </p>
                            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#b0b8c4' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} /> {s.durationMin} min
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {s.modes?.includes('online') ? <Monitor size={11} /> : <MapPin size={11} />}
                                {s.modes?.join(' · ')}
                              </span>
                            </div>
                          </div>
                          {s.price?.amount > 0 && (
                            <span style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, color: '#6b5ea8', flexShrink: 0, fontWeight: 500 }}>
                              ₹{s.price.amount.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── STEP: SLOT ────────────────────────────────────────────── */}
        {step === 'slot' && (
          <div className="step-anim">
            {hasServiceStep && <Back onClick={() => setStep('service')} />}
            <Card>
              <LeafSVG />
              <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, fontWeight: 500, color: '#2d3142', marginBottom: 6 }}>
                Choose a date & time
              </h2>
              <p className="body-font" style={{ fontSize: 13, color: '#9ba0ae', marginBottom: 24 }}>
                All times shown in your local timezone · Next 14 days
              </p>

              {slotsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Loader2 size={28} style={{ color: '#9b8ec4', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                  <p className="body-font" style={{ color: '#9ba0ae', fontSize: 13, marginTop: 10 }}>Finding open slots…</p>
                </div>
              ) : days.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ba0ae' }}>
                  <Waves size={28} style={{ margin: '0 auto 12px', color: '#7b96b2', display: 'block' }} />
                  <p className="body-font" style={{ fontSize: 14 }}>No available slots in the next 14 days.<br />Please reach out directly.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {days.map(day => (
                    <div key={day}>
                      <p className="body-font" style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7a9e7e', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} /> {formatDate(day)}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {grouped[day].map(slot => {
                          const active = selectedSlot?._id === slot._id;
                          return (
                            <button key={slot._id} className="slot-btn body-font"
                              onClick={() => { setSelectedSlot(slot); setStep('intake'); }}
                              style={{
                                padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                                border: active ? '2px solid #9b8ec4' : '1.5px solid rgba(155,142,196,0.25)',
                                background: active ? 'linear-gradient(135deg,#ede8f8,#e4ecf4)' : '#fff',
                                color: active ? '#6b5ea8' : '#5a6070',
                                cursor: 'pointer', fontFamily: 'inherit',
                                boxShadow: active ? '0 2px 12px rgba(155,142,196,0.2)' : 'none',
                              }}>
                              <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 5, opacity: 0.6 }} />
                              {formatTime(slot.startAt)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── STEP: INTAKE ──────────────────────────────────────────── */}
        {step === 'intake' && (
          <div className="step-anim">
            <Back onClick={() => setStep('slot')} />
            <Card>
              <LeafSVG />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(122,158,126,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={18} style={{ color: '#7a9e7e' }} />
                </div>
                <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, fontWeight: 500, color: '#2d3142' }}>
                  A little about you
                </h2>
              </div>
              <p className="body-font" style={{ fontSize: 13, color: '#9ba0ae', marginBottom: 26, marginLeft: 50 }}>
                All information is strictly confidential.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="body-font" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#7a9e7e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    What brings you here?
                  </label>
                  <textarea rows={4} value={intake.primaryConcern}
                    onChange={e => setIntake(p => ({ ...p, primaryConcern: e.target.value }))}
                    placeholder="Share as much or as little as you'd like…"
                    style={{ ...fieldStyle }} />
                </div>

                <label className="body-font" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 16px', borderRadius: 12, border: '1.5px solid rgba(155,142,196,0.18)', background: intake.prevTherapy ? 'rgba(155,142,196,0.06)' : '#fff' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, border: '2px solid',
                    borderColor: intake.prevTherapy ? '#9b8ec4' : 'rgba(155,142,196,0.35)',
                    background: intake.prevTherapy ? '#9b8ec4' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s',
                  }}>
                    {intake.prevTherapy && <Check size={12} color="#fff" />}
                  </div>
                  <input type="checkbox" checked={intake.prevTherapy}
                    onChange={e => setIntake(p => ({ ...p, prevTherapy: e.target.checked }))}
                    style={{ display: 'none' }} />
                  <span style={{ fontSize: 14, color: '#5a6070' }}>I have been in therapy before</span>
                </label>

                <div>
                  <label className="body-font" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#7a9e7e', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Anything else? <span style={{ color: '#b0b8c4', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea rows={3} value={intake.notes}
                    onChange={e => setIntake(p => ({ ...p, notes: e.target.value }))}
                    placeholder="E.g. preferred language, accessibility needs…"
                    style={{ ...fieldStyle }} />
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                <PrimaryBtn onClick={() => { if (!user) return; setStep('confirm'); }} disabled={!user}>
                  Continue <ChevronRight size={16} />
                </PrimaryBtn>
                {!user && (
                  <p className="body-font" style={{ textAlign: 'center', fontSize: 13, color: '#9ba0ae', marginTop: 12 }}>
                    <Link href="/login?next=/book" style={{ color: '#9b8ec4', textDecoration: 'underline' }}>Login to continue</Link>
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ── STEP: CONFIRM ─────────────────────────────────────────── */}
        {step === 'confirm' && selectedSlot && (
          <div className="step-anim">
            <Back onClick={() => setStep('intake')} />
            <Card>
              <WaveSVG />
              <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, fontWeight: 500, color: '#2d3142', marginBottom: 24 }}>
                Review & confirm
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Therapist', value: 'Srishti Roy' },
                  ...(selectedService ? [{ label: 'Service', value: selectedService.name }] : []),
                  { label: 'Date', value: formatDate(selectedSlot.startAt) },
                  { label: 'Time', value: `${formatTime(selectedSlot.startAt)} · ${selectedSlot.durationMin} min` },
                  { label: 'Mode', value: selectedSlot.mode?.replace('_', ' ') },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(155,142,196,0.1)' : 'none',
                  }}>
                    <span className="body-font" style={{ fontSize: 13, color: '#9ba0ae' }}>{row.label}</span>
                    <span className="body-font" style={{ fontSize: 14, fontWeight: 500, color: '#2d3142', textTransform: 'capitalize' }}>{row.value}</span>
                  </div>
                ))}

                {(selectedService?.price?.amount ?? 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
                    <span className="body-font" style={{ fontSize: 13, color: '#9ba0ae' }}>Fee</span>
                    <span style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 20, color: '#6b5ea8', fontWeight: 500 }}>
                      ₹{selectedService?.price?.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: 20, padding: '14px 18px', borderRadius: 12,
                background: 'linear-gradient(135deg,rgba(155,142,196,0.08),rgba(122,158,126,0.08))',
                border: '1px solid rgba(155,142,196,0.15)',
              }}>
                <p className="body-font" style={{ fontSize: 12, color: '#9ba0ae', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Wind size={13} style={{ color: '#7b96b2' }} />
                  Payment will be collected at the start of your session.
                </p>
              </div>

              <div style={{ marginTop: 24 }}>
                <PrimaryBtn onClick={confirm} loading={loading}>
                  Confirm booking <Check size={16} />
                </PrimaryBtn>
              </div>
            </Card>
          </div>
        )}

        {/* ── STEP: DONE ────────────────────────────────────────────── */}
        {step === 'done' && booking && (
          <div className="step-anim">
            <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'linear-gradient(135deg,#7a9e7e,#9b8ec4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(122,158,126,0.25)',
                animation: 'pulse-ring 2s ease-in-out infinite',
              }}>
                <Check size={30} color="#fff" />
              </div>

              <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 28, fontWeight: 400, color: '#2d3142', marginBottom: 8 }}>
                You're all set 🌿
              </h2>
              <p className="body-font" style={{ color: '#9ba0ae', fontSize: 14, marginBottom: 6 }}>
                Booking code: <strong style={{ color: '#6b5ea8' }}>{booking.bookingCode}</strong>
              </p>
              <p className="body-font" style={{ color: '#b0b8c4', fontSize: 13, marginBottom: 32 }}>
                A confirmation email is on its way to your inbox.
              </p>

              <div style={{
                padding: '16px', borderRadius: 14,
                background: 'linear-gradient(135deg,rgba(155,142,196,0.07),rgba(122,158,126,0.07))',
                border: '1px solid rgba(155,142,196,0.12)', marginBottom: 28,
              }}>
                <p className="body-font" style={{ fontSize: 13, color: '#7a9e7e', lineHeight: 1.6 }}>
                  <em>"Take a gentle breath. You've taken a meaningful step today."</em>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/dashboard/appointments" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 22px', borderRadius: 12,
                  background: 'linear-gradient(135deg,#9b8ec4,#7b96b2)',
                  color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
                }}>
                  View appointments
                </Link>
                <Link href="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 22px', borderRadius: 12,
                  border: '1.5px solid rgba(155,142,196,0.3)',
                  color: '#6b5ea8', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  fontFamily: "'DM Sans',sans-serif", background: '#fff',
                }}>
                  Return home
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}