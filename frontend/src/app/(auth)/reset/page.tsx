'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';

export default function ResetPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get('token') ?? '';
    const emailFromUrl = searchParams.get('email') ?? '';

    const [form, setForm] = useState({
        email: emailFromUrl,
        token: tokenFromUrl,
        newPassword: '',
        confirm: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const pwStrength = (pw: string) => {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const strength = pwStrength(form.newPassword);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][strength];
    const strengthColor = ['', '#D9698A', '#E8A87C', '#D9C46A', '#7DA98D', '#4B7A8C'][strength];

    const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 8) return toast('Password must be at least 8 characters', 'error');
    if (form.newPassword !== form.confirm) return toast('Passwords do not match', 'error');
    if (!form.token) return toast('Reset token missing — use the link from your email', 'error');
    setLoading(true);
    try {
        await authApi.resetPassword({
            email: form.email,
            token: form.token,
            newPassword: form.newPassword,
        });
        setDone(true);
        toast('Password reset successfully', 'success');
    } catch (err: any) {
        toast(err?.message || 'Reset failed. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
};
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .float-label { position: relative; }
        .float-label input { padding: 22px 16px 8px; }
        .float-label label {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 13px; color: #8B7FA8; pointer-events: none;
          transition: all 0.2s ease;
        }
        .float-label input:focus ~ label,
        .float-label input:not(:placeholder-shown) ~ label {
          top: 12px; transform: none; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        .anim-up    { animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade  { animation: fadeIn 1s ease both; }
        .anim-scale { animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.12s; }
        .anim-d3 { animation-delay: 0.19s; }
        .anim-d4 { animation-delay: 0.26s; }
        .anim-d5 { animation-delay: 0.33s; }
        .anim-d6 { animation-delay: 0.40s; }
      `}</style>

            <div className="font-dm min-h-screen flex bg-[#F9F6F1]">

                {/* ── Left panel ── */}
                <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1C1629] flex-col justify-between p-12">
                    <div className="grain absolute inset-0 pointer-events-none" />
                    <div className="absolute top-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full bg-[#D9698A]/15 blur-[100px]" />
                    <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[#7B5EA7]/20 blur-[80px]" />

                    {/* Logo */}
                    <div className="relative z-10 anim-fade flex items-center gap-2">
                        <Sparkles size={14} className="text-[#C9B8E8]" />
                        <span className="font-cormorant text-[#C9B8E8] text-sm tracking-[0.2em] uppercase">Srishti Roy</span>
                    </div>

                    {/* Center */}
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
                        <blockquote className="font-cormorant text-4xl text-white/90 leading-[1.35] font-light italic">
                            "A new password, a renewed beginning."
                        </blockquote>
                        <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Almost there</p>

                        {/* Password tips */}
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                            <p className="text-[10px] text-[#9B7AD9] uppercase tracking-[0.2em] mb-4">Strong password tips</p>
                            <ul className="space-y-2.5">
                                {[
                                    'At least 8 characters long',
                                    'Mix uppercase & lowercase letters',
                                    'Include numbers or symbols',
                                    'Avoid common words or dates',
                                ].map((tip) => (
                                    <li key={tip} className="flex items-start gap-2.5 text-xs text-white/40">
                                        <span className="text-[#9B7AD9]/60 mt-0.5">✦</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 border-t border-white/10 pt-8">
                        <p className="text-xs text-white/20 leading-relaxed">
                            Reset tokens are single-use and expire in 30 minutes. Request a new link if yours has expired.
                        </p>
                    </div>
                </div>

                {/* ── Right: form ── */}
                <div className="flex-1 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24 overflow-y-auto">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10 anim-up">
                        <Link href="/" className="font-cormorant text-2xl text-[#1C1629]">Srishti Roy</Link>
                        <p className="text-[10px] text-[#8B7FA8] uppercase tracking-[0.22em] mt-1">Counselling Psychologist</p>
                    </div>

                    <div className="w-full max-w-sm mx-auto">

                        {!done ? (
                            <>
                                <Link href="/login" className="anim-up inline-flex items-center gap-1.5 text-xs text-[#8B7FA8] hover:text-[#9B7AD9] transition-colors mb-10">
                                    <ArrowLeft size={12} />
                                    Back to sign in
                                </Link>

                                <div className="mb-10 anim-up anim-d1">
                                    <p className="text-[10px] text-[#9B7AD9] uppercase tracking-[0.25em] mb-3 font-medium">New password</p>
                                    <h1 className="font-cormorant text-5xl text-[#1C1629] leading-tight font-light">
                                        Reset your <em>password</em>
                                    </h1>
                                    <p className="text-sm text-[#8B7FA8] mt-3 leading-relaxed">
                                        Choose a strong new password for your account.
                                    </p>
                                </div>

                                <form onSubmit={onSubmit} className="space-y-4">

                                    {/* Email (show if not pre-filled) */}
                                    {!emailFromUrl && (
                                        <div className="anim-up anim-d2">
                                            <div className="float-label">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder=" "
                                                    value={form.email}
                                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                                    required
                                                    className="w-full rounded-2xl border border-[#E2D9F3] bg-white text-sm text-[#1C1629] focus:outline-none focus:border-[#9B7AD9] transition-colors"
                                                />
                                                <label htmlFor="email">Email address</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Token (show if not pre-filled) */}
                                    {!tokenFromUrl && (
                                        <div className="anim-up anim-d2">
                                            <div className="float-label">
                                                <input
                                                    type="text"
                                                    id="token"
                                                    placeholder=" "
                                                    value={form.token}
                                                    onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))}
                                                    required
                                                    className="w-full rounded-2xl border border-[#E2D9F3] bg-white text-sm text-[#1C1629] focus:outline-none focus:border-[#9B7AD9] transition-colors font-mono tracking-widest"
                                                />
                                                <label htmlFor="token">Reset token (from email)</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* New password */}
                                    <div className="anim-up anim-d3">
                                        <div className="float-label relative">
                                            <input
                                                type={showPw ? 'text' : 'password'}
                                                id="newPassword"
                                                placeholder=" "
                                                value={form.newPassword}
                                                onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                                                required
                                                style={{ paddingRight: '48px' }}
                                                className="w-full rounded-2xl border border-[#E2D9F3] bg-white text-sm text-[#1C1629] focus:outline-none focus:border-[#9B7AD9] transition-colors"
                                            />
                                            <label htmlFor="newPassword">New password</label>
                                            <button type="button" onClick={() => setShowPw(!showPw)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0A4CC] hover:text-[#9B7AD9] transition-colors">
                                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>

                                        {/* Strength bar */}
                                        {form.newPassword && (
                                            <div className="mt-2.5 px-1">
                                                <div className="flex gap-1 mb-1.5">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <div
                                                            key={i}
                                                            className="h-1 flex-1 rounded-full transition-all duration-300"
                                                            style={{ backgroundColor: i <= strength ? strengthColor : '#E2D9F3' }}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-[11px]" style={{ color: strengthColor }}>{strengthLabel}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm password */}
                                    <div className="anim-up anim-d4">
                                        <div className="float-label relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                id="confirm"
                                                placeholder=" "
                                                value={form.confirm}
                                                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                                                required
                                                style={{ paddingRight: '48px' }}
                                                className={`w-full rounded-2xl border bg-white text-sm text-[#1C1629] focus:outline-none transition-colors ${form.confirm && form.confirm !== form.newPassword
                                                        ? 'border-[#D9698A] focus:border-[#D9698A]'
                                                        : 'border-[#E2D9F3] focus:border-[#9B7AD9]'
                                                    }`}
                                            />
                                            <label htmlFor="confirm">Confirm password</label>
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0A4CC] hover:text-[#9B7AD9] transition-colors">
                                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                        {form.confirm && form.confirm !== form.newPassword && (
                                            <p className="text-[11px] text-[#D9698A] mt-1.5 ml-1">Passwords do not match</p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <div className="anim-up anim-d5 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#1C1629] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#1C1629]/20 transition-all duration-300 hover:bg-[#2A2040] hover:shadow-xl disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <><Loader2 size={15} className="animate-spin" /> Resetting…</>
                                            ) : (
                                                <>
                                                    Reset password
                                                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* ── Success state ── */
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="anim-scale flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3ECFF] to-[#E8DDF9] shadow-lg shadow-[#9B7AD9]/15">
                                    <ShieldCheck size={32} className="text-[#9B7AD9]" />
                                </div>
                                <div className="anim-up anim-d1">
                                    <h2 className="font-cormorant text-4xl text-[#1C1629] font-light">
                                        Password <em>reset!</em>
                                    </h2>
                                    <p className="text-sm text-[#8B7FA8] mt-3 leading-relaxed">
                                        Your password has been updated successfully. You can now sign in with your new credentials.
                                    </p>
                                </div>
                                <div className="anim-up anim-d2 w-full">
                                    <Link
                                        href="/login"
                                        className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#1C1629] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#1C1629]/20 transition-all duration-300 hover:bg-[#2A2040] hover:shadow-xl"
                                    >
                                        Go to sign in
                                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}