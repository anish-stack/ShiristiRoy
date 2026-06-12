'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2, Calendar, Clock3, Video, MapPin,
  ArrowRight, LayoutDashboard, Sparkles, LogOut,
  AlertCircle, BookHeart, ChevronRight, CheckCircle2,
  XCircle, AlertTriangle,
} from 'lucide-react';
import { bookingApi, type Appointment } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';

/* ─── helpers ──────────────────────────────────────────────────── */

const STATUS_PILL: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: '#FEF9EC', text: '#B45309', dot: '#F59E0B' },
  confirmed: { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' },
  completed: { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  cancelled: { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444' },
  no_show:   { bg: '#F4F4F5', text: '#52525B', dot: '#A1A1AA' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_PILL[status] ?? STATUS_PILL.no_show;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: s.bg, color: s.text,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {status.replace('_', ' ')}
    </span>
  );
}

function formsMissing(a: any) {
  return (
    ['pending', 'confirmed'].includes(a.status) &&
    (!a.payment?.intakeForm || !a.payment?.consent)
  );
}

/* ─── component ─────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, clearAuth, fetchMe } = useAuthStore();
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMe(); }, []);

  useEffect(() => {
    if (!user) { router.push('/login?next=/dashboard'); return; }
    bookingApi.myAppointments()
      .then((res: any) => setAppointments(res || []))
      .catch(() => toast('Failed to load appointments', 'error'))
      .finally(() => setLoading(false));
  }, [user, router]);

  const upcoming = useMemo(() =>
    appointments.filter(a => ['pending', 'confirmed'].includes(a.status)), [appointments]);
  const past = useMemo(() =>
    appointments.filter(a => !['pending', 'confirmed'].includes(a.status)), [appointments]);

  const formsAlerts = upcoming.filter(formsMissing);

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} style={{ color: '#9b8ec4', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#F8F5F2',
      backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(155,142,196,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(122,158,126,0.07) 0%, transparent 50%)',
      paddingTop: 96, paddingBottom: 64, paddingLeft: 16, paddingRight: 16,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .appt-row:hover { box-shadow: 0 8px 32px rgba(155,142,196,0.13) !important; transform: translateY(-1px); }
        .appt-row { transition: all 0.2s ease; }
        .quick-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,0.07) !important; transform: translateY(-2px); }
        .quick-card { transition: all 0.22s ease; }
        .fade-in { animation: fadeUp 0.35s ease both; }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── header ──────────────────────────────────────────── */}
        <div className="fade-in" style={{
          borderRadius: 28, marginBottom: 28, padding: '32px 36px',
          background: 'linear-gradient(135deg, #2D2A26 0%, #3f3729 60%, #4a3f55 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 99,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              <Sparkles size={11} /> Wellness Dashboard
            </div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: 30, fontWeight: 500, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
              Welcome back, <span style={{ color: '#E9D7C3' }}>{user.name.split(' ')[0]}</span>
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Your therapy sessions and wellness journey in one place.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {user?.role === 'admin' && (
              <Link href="/admin" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 12,
                background: '#E9D7C3', color: '#2D2A26',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
                <LayoutDashboard size={15} /> Admin
              </Link>
            )}
            <button onClick={() => { clearAuth(); router.push('/'); }} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 12,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        {/* ── forms alert banner ───────────────────────────────── */}
        {formsAlerts.length > 0 && (
          <div className="fade-in" style={{
            borderRadius: 16, marginBottom: 24, padding: '14px 18px',
            background: '#FFFBEB', border: '1.5px solid #FCD34D',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E', margin: '0 0 2px' }}>
                Action required — forms not uploaded
              </p>
              <p style={{ fontSize: 12, color: '#B45309', margin: 0, lineHeight: 1.5 }}>
                {formsAlerts.length === 1
                  ? `Booking ${formsAlerts[0].bookingCode} is missing intake / consent forms.`
                  : `${formsAlerts.length} upcoming sessions are missing intake / consent forms.`
                } Upload at least 24 hrs before your session.
              </p>
            </div>
            <Link href={`/dashboard/appointments/${formsAlerts[0]._id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 12px', borderRadius: 8,
              background: '#FEF3C7', border: '1px solid #FCD34D',
              color: '#92400E', fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0,
            }}>
              Upload <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* ── quick actions ────────────────────────────────────── */}
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 36 }}>
          {[
            { href: '/book', label: 'Book a session', desc: 'Schedule your next appointment.', icon: Calendar, accent: '#9b8ec4', bg: 'rgba(155,142,196,0.08)' },
            { href: '/services', label: 'Explore services', desc: 'Discover therapy options.', icon: BookHeart, accent: '#7a9e7e', bg: 'rgba(122,158,126,0.08)' },
            { href: '/contact', label: 'Need support?', desc: 'Reach out for guidance.', icon: AlertCircle, accent: '#c48e7a', bg: 'rgba(196,142,122,0.08)' },
          ].map(({ href, label, desc, icon: Icon, accent, bg }) => (
            <Link key={href} href={href} className="quick-card" style={{
              padding: '20px', borderRadius: 18,
              background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
              textDecoration: 'none', display: 'block',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2d3142', margin: '0 0 3px' }}>{label}</p>
              <p style={{ fontSize: 12, color: '#9ba0ae', margin: 0 }}>{desc}</p>
            </Link>
          ))}
        </div>

        {/* ── appointments ─────────────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Loader2 size={30} style={{ color: '#9b8ec4', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
          </div>
        ) : (
          <>
            {/* upcoming */}
            <section style={{ marginBottom: 40 }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ba0ae', fontWeight: 600, marginBottom: 4 }}>Appointments</p>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: '#2d3142', margin: 0 }}>Upcoming sessions</h2>
              </div>

              {upcoming.length === 0 ? (
                <div style={{ borderRadius: 20, background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '48px 24px', textAlign: 'center' }}>
                  <Calendar size={30} style={{ color: '#c4bfb8', display: 'block', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 15, fontWeight: 500, color: '#2d3142', marginBottom: 4 }}>No upcoming sessions</p>
                  <p style={{ fontSize: 13, color: '#9ba0ae', marginBottom: 20 }}>Start your wellness journey today.</p>
                  <Link href="/book" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 10,
                    background: 'linear-gradient(135deg,#9b8ec4,#7b96b2)',
                    color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  }}>
                    Book now <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {upcoming.map(a => (
                    <AppointmentRow key={a._id} a={a} showAlert={formsMissing(a)} />
                  ))}
                </div>
              )}
            </section>

            {/* past */}
            {past.length > 0 && (
              <section>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ba0ae', fontWeight: 600, marginBottom: 4 }}>History</p>
                  <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: '#2d3142', margin: 0 }}>Past sessions</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {past.map(a => (
                    <AppointmentRow key={a._id} a={a} showAlert={false} muted />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── appointment row ───────────────────────────────────────────── */

function AppointmentRow({ a, showAlert, muted }: { a: any; showAlert: boolean; muted?: boolean }) {
  return (
    <Link href={`/dashboard/appointments/${a._id}`} className="appt-row" style={{
      display: 'block', textDecoration: 'none',
      borderRadius: 18, background: '#fff',
      border: `1px solid ${showAlert ? '#FCD34D' : 'rgba(0,0,0,0.06)'}`,
      padding: '18px 22px',
      opacity: muted ? 0.75 : 1,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StatusPill status={a.status} />
            {showAlert && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 99,
                background: '#FFFBEB', border: '1px solid #FCD34D',
                fontSize: 10, color: '#92400E', fontWeight: 600,
              }}>
                <AlertTriangle size={9} /> Forms missing
              </span>
            )}
            <span style={{ fontSize: 11, color: '#b0b8c4', fontFamily: 'monospace' }}>{a.bookingCode}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#2d3142', margin: '0 0 6px' }}>
            {a.service?.name || 'Therapy Session'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: '#9ba0ae' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} style={{ color: '#9b8ec4' }} /> {formatDate(a.startAt)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock3 size={12} style={{ color: '#9b8ec4' }} /> {formatTime(a.startAt)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, textTransform: 'capitalize' }}>
              {a.mode === 'online'
                ? <Video size={12} style={{ color: '#7a9e7e' }} />
                : <MapPin size={12} style={{ color: '#7a9e7e' }} />}
              {a.mode?.replace('_', ' ')}
            </span>
            {a.payment?.amount && (
              <span style={{ fontWeight: 600, color: '#6b5ea8' }}>
                ₹{a.payment.amount.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <ChevronRight size={16} style={{ color: '#c4bfb8', flexShrink: 0 }} />
      </div>
    </Link>
  );
}