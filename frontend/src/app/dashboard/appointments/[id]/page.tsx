'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    Loader2, ChevronLeft, Calendar, Clock3, Video, MapPin,
    CreditCard, FileText, Download, Upload, CheckCircle2,
    AlertTriangle, XCircle, ShieldCheck, BookOpen,
    User, Tag, Hash,
} from 'lucide-react';
import { api, bookingApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatDate, formatTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
/* ─── constants ─────────────────────────────────────────────────── */


// Intake + consent form PDF URL — replace with real hosted URL
const INTAKE_FORM_URL = '/assets/IntakeForm.docx';
const CONSENT_FORM_URL = '/PsychotherapyInformedConsent-S.Roy.docx';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    completed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    no_show: 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200',
};

const STATUS_DOT: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
    no_show: 'bg-zinc-400',
};

/* ─── helpers ───────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.no_show;
    const dot = STATUS_DOT[status] ?? STATUS_DOT.no_show;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${style}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {status.replace('_', ' ')}
        </span>
    );
}

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-b-0">
            <span className="flex items-center gap-2 text-xs text-slate-400">
                {icon} {label}
            </span>
            <span className="text-right text-sm font-medium text-slate-700">{value}</span>
        </div>
    );
}

function Card({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
    return (
        <div className={`rounded-2xl border bg-white p-5 sm:p-6 ${highlight ? 'border-amber-300' : 'border-black/[0.06]'} mb-4`}>
            {children}
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
        <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                {icon}
            </div>
            <h3 className="font-serif text-base font-medium text-slate-800">{title}</h3>
        </div>
    );
}

/* ─── component ─────────────────────────────────────────────────── */

export default function AppointmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();

    const [appt, setAppt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const [uploadingIntake, setUploadingIntake] = useState(false);
    const [uploadingConsent, setUploadingConsent] = useState(false);
    const intakeRef = useRef<HTMLInputElement>(null);
    const consentRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) { router.push('/login?next=/dashboard'); return; }
        bookingApi.myAppointments()
            .then((res: any) => {
                const found = (res || []).find((a: any) => a._id === id);
                if (!found) { router.push('/dashboard'); return; }
                setAppt(found);
            })
            .catch(() => toast('Failed to load appointment', 'error'))
            .finally(() => setLoading(false));
    }, [user, id, router]);

    const handleCancel = async () => {
        const hrs = (new Date(appt.startAt).getTime() - Date.now()) / 3_600_000;
        if (hrs < 4) {
            toast('Cancellation is not allowed within 4 hours of the session', 'error');
            return;
        }
        if (!confirm('Cancel this appointment?')) return;
        setCancelling(true);
        try {
            await bookingApi.cancel(id, 'Cancelled by client');
            setAppt((p: any) => ({ ...p, status: 'cancelled' }));
            toast('Appointment cancelled', 'success');
        } catch (e: any) {
            toast(e.message || 'Could not cancel', 'error');
        } finally {
            setCancelling(false);
        }
    };

    const handleUpload = async (file: File, type: 'intake' | 'consent') => {
        const setUploading = type === 'intake' ? setUploadingIntake : setUploadingConsent;
        setUploading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('type', type);
            const res = await api.post(
                `/bookings/me/${id}/documents`,
                form
               
            );
            console.log(res)
            if (!res.ok) throw new Error('Upload failed');
            const json = await res.json();
            setAppt((p: any) => ({
                ...p,
                payment: {
                    ...p.payment,
                    ...(type === 'intake' ? { intakeForm: json.data?.url || 'uploaded' } : {}),
                    ...(type === 'consent' ? { consent: json.data?.url || 'uploaded' } : {}),
                },
            }));
            toast(`${type === 'intake' ? 'Intake' : 'Consent'} form uploaded`, 'success');
        } catch (e: any) {
            toast(e.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    function getToken() {
        try {
            const auth = localStorage.getItem('auth');
            if (!auth) return '';
            return JSON.parse(auth)?.state?.accessToken ?? '';
        } catch { return ''; }
    }

    const isUpcoming = appt && ['pending', 'confirmed'].includes(appt.status);
    const hoursToStart = appt ? (new Date(appt.startAt).getTime() - Date.now()) / 3_600_000 : 0;
    const canCancel = isUpcoming && appt.status !== 'cancelled' && hoursToStart >= 4;
    const intakeDone = !!appt?.payment?.intakeForm;
    const consentDone = !!appt?.payment?.consent;
    const formsMissing = isUpcoming && (!intakeDone || !consentDone);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F5F2]">
                <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
            </div>
        );
    }

    if (!appt) return null;

    const forms = [
        {
            key: 'intake' as const,
            label: 'Intake Form',
            desc: 'Background information about you and your concerns.',
            downloadUrl: INTAKE_FORM_URL,
            done: intakeDone,
            uploading: uploadingIntake,
            ref: intakeRef,
            icon: <BookOpen className="h-4 w-4 text-violet-500" />,
        },
        {
            key: 'consent' as const,
            label: 'Consent Form',
            desc: 'Informed consent covering confidentiality and session policies.',
            downloadUrl: CONSENT_FORM_URL,
            done: consentDone,
            uploading: uploadingConsent,
            ref: consentRef,
            icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F5F2] px-4 pb-16 pt-24 font-sans sm:px-6">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Lora', serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeUp 0.32s ease both; }
        .upload-zone:hover { border-color: #9b8ec4 !important; background: rgba(155,142,196,0.06) !important; }
      `}</style>

            <div className="mx-auto max-w-7xl">

                {/* back */}
                <Link
                    href="/dashboard"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-violet-400"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to dashboard
                </Link>

                {/* forms alert */}
                {formsMissing && (
                    <div className="fade-in mb-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                        <div>
                            <p className="mb-1 text-sm font-semibold text-amber-800">
                                Upload required forms before your session
                            </p>
                            <p className="text-xs leading-relaxed text-amber-700">
                                Download, fill in, and upload both the intake and consent forms at least 24 hours before your appointment.
                            </p>
                        </div>
                    </div>
                )}

                {/* header card */}
                <div className="fade-in mb-4 rounded-3xl bg-gradient-to-br from-[#2D2A26] to-[#4a3f55] p-6 text-white shadow-xl shadow-black/10 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <StatusBadge status={appt.status} />
                            <h2 className="mt-3 font-serif text-2xl font-medium text-white">
                                {appt.service?.name || 'Therapy Session'}
                            </h2>
                            <p className="mt-1 font-mono text-xs tracking-wider text-white/40">
                                {appt.bookingCode}
                            </p>
                        </div>
                        {appt.payment?.amount && (
                            <div className="text-right">
                                <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">Fee paid</p>
                                <p className="font-serif text-2xl font-medium text-[#E9D7C3]">
                                    ₹{appt.payment.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* date/time strip */}
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-sm text-white/75">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-[#c4b8e8]" /> {formatDate(appt.startAt)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5 text-[#c4b8e8]" /> {formatTime(appt.startAt)} – {formatTime(appt.endAt)}
                        </span>
                        <span className="flex items-center gap-2 capitalize">
                            {appt.mode === 'online'
                                ? <Video className="h-3.5 w-3.5 text-[#a8d5b5]" />
                                : <MapPin className="h-3.5 w-3.5 text-[#a8d5b5]" />}
                            {appt.mode?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-5 '>
                    {/* details card */}
                    <Card>
                        <SectionHeader title="Session details" icon={<Tag className="h-4 w-4 text-violet-500" />} />
                        <InfoRow label="Therapist" value={appt.therapist?.title || 'Srishti Roy'} icon={<User className="h-3 w-3" />} />
                        <InfoRow label="Service" value={appt.service?.name || '—'} icon={<BookOpen className="h-3 w-3" />} />
                        <InfoRow
                            label="Mode"
                            value={<span className="capitalize">{appt.mode?.replace('_', ' ')}</span>}
                            icon={appt.mode === 'online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        />
                        <InfoRow label="Booked on" value={formatDate(appt.createdAt)} icon={<Hash className="h-3 w-3" />} />
                    </Card>

                    {/* payment card */}
                    {appt.payment && (
                        <Card>
                            <SectionHeader title="Payment" icon={<CreditCard className="h-4 w-4 text-violet-500" />} />
                            <InfoRow label="Amount" value={`₹${appt.payment.amount?.toLocaleString('en-IN')}`} />
                            <InfoRow
                                label="Status"
                                value={
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${appt.payment.status === 'paid' ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {appt.payment.status === 'paid'
                                            ? <><CheckCircle2 className="h-3 w-3" /> Paid</>
                                            : <><XCircle className="h-3 w-3" /> {appt.payment.status}</>}
                                    </span>
                                }
                            />
                            {appt.payment.providerPaymentId && (
                                <InfoRow
                                    label="Payment ID"
                                    value={<span className="font-mono text-xs">{appt.payment.providerPaymentId}</span>}
                                />
                            )}
                            {appt.payment.status === 'refunded' && appt.payment.refund && (
                                <InfoRow
                                    label="Refund"
                                    value={`₹${appt.payment.refund.amount?.toLocaleString('en-IN')} — ${formatDate(appt.payment.refund.at)}`}
                                />
                            )}
                        </Card>
                    )}
                </div>

                {/* intake notes */}
                {/* {(appt.intake?.primaryConcern || appt.intake?.notes) && (
          <Card>
            <SectionHeader title="Your intake notes" icon={<BookOpen className="h-4 w-4 text-emerald-500" />} />
            {appt.intake.primaryConcern && (
              <div className="mb-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Primary concern</p>
                <p className="text-sm leading-relaxed text-slate-600">{appt.intake.primaryConcern}</p>
              </div>
            )}
            {appt.intake.notes && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Additional notes</p>
                <p className="text-sm leading-relaxed text-slate-600">{appt.intake.notes}</p>
              </div>
            )}
            {appt.intake.prevTherapy && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> Has had therapy before
              </p>
            )}
          </Card>
        )} */}

                {/* forms card */}
                <Card highlight={formsMissing}>
                    <SectionHeader title="Required forms" icon={<FileText className="h-4 w-4 text-sky-500" />} />

                    <div className="space-y-3">
                        {forms.map(f => (
                            <div
                                key={f.key}
                                className={`rounded-xl border p-4 ${f.done ? 'border-emerald-200 bg-emerald-50/40' : 'border-violet-200/60 bg-[#FDFCFB]'}`}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/[0.07] bg-white">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{f.label}</p>
                                            <p className="text-xs text-slate-400">{f.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-shrink-0 items-center gap-2">
                                        {f.done ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                <CheckCircle2 className="h-3 w-3" /> Uploaded
                                            </span>
                                        ) : (
                                            <a
                                                href={f.downloadUrl}
                                                download
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50"
                                            >
                                                <Download className="h-3 w-3" /> Download
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {!f.done && isUpcoming && (
                                    <>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            ref={f.ref}
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpload(file, f.key);
                                                e.target.value = '';
                                            }}
                                        />
                                        <div
                                            className="upload-zone mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50/30 p-3 transition-colors"
                                            onClick={() => f.ref.current?.click()}
                                        >
                                            {f.uploading ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
                                                    <span className="text-xs text-violet-400">Uploading…</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-3.5 w-3.5 text-violet-400" />
                                                    <span className="text-xs font-medium text-violet-400">Click to upload filled PDF</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* cancel card */}
                {isUpcoming && (
                    <Card>
                        <div className="mb-4">
                            <h3 className="mb-1 font-serif text-base font-medium text-slate-800">Cancel appointment</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Free cancellation 24+ hrs before session. No refund within 24 hrs. Cancellation blocked within 4 hrs.
                            </p>
                        </div>

                        {!canCancel && appt.status !== 'cancelled' && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                Cancellation not allowed — session starts in less than 4 hours.
                            </div>
                        )}

                        {appt.status === 'cancelled' ? (
                            <div className="flex items-center gap-2 py-2 text-sm text-red-700">
                                <XCircle className="h-4 w-4" /> This appointment has been cancelled.
                                {appt.cancellation?.refundEligible && (
                                    <span className="ml-2 font-semibold text-emerald-700">Refund initiated.</span>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleCancel}
                                disabled={!canCancel || cancelling}
                                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${canCancel
                                        ? 'cursor-pointer border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                        : 'cursor-not-allowed border-black/[0.08] bg-zinc-100 text-zinc-400'
                                    }`}
                            >
                                {cancelling ? (
                                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Cancelling…</>
                                ) : (
                                    <><XCircle className="h-3.5 w-3.5" /> Cancel appointment</>
                                )}
                            </button>
                        )}
                    </Card>
                )}

            </div>
        </div>
    );
}