'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight, ArrowLeft, Sparkles, MailCheck } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email?.trim()) {
      toast('Please enter your email address', 'error');
      return;
    }
    try {
      setLoading(true);
      await authApi.forgotPassword(email);
      setSent(true);
      toast('Password reset email sent', 'success');
    } catch (err: any) {
      toast(err?.message || 'Something went wrong. Please try again.', 'error');
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
        .anim-up   { animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade { animation: fadeIn 1s ease both; }
        .anim-scale { animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.12s; }
        .anim-d3 { animation-delay: 0.19s; }
        .anim-d4 { animation-delay: 0.26s; }
      `}</style>

      <div className="font-dm min-h-screen flex bg-[#F9F6F1]">

        {/* ── Left decorative panel ── */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1C1629] flex-col justify-between p-12">
          <div className="grain absolute inset-0 pointer-events-none" />
          <div className="absolute top-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full bg-[#7B5EA7]/20 blur-[100px]" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full bg-[#D9698A]/15 blur-[80px]" />

          <div className="relative z-10 anim-fade flex items-center gap-2">
            <Sparkles size={14} className="text-[#C9B8E8]" />
            <span className="font-cormorant text-[#C9B8E8] text-sm tracking-[0.2em] uppercase">Srishti Roy</span>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
            <blockquote className="font-cormorant text-4xl text-white/90 leading-[1.35] font-light italic">
              "Every setback is just a setup for a stronger comeback."
            </blockquote>
            <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Reset & start fresh</p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-8">
            <p className="text-xs text-white/20 leading-relaxed">
              Reset links expire in 30 minutes for your security. Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">

          <div className="lg:hidden text-center mb-10 anim-up">
            <Link href="/" className="font-cormorant text-2xl text-[#1C1629]">Srishti Roy</Link>
            <p className="text-[10px] text-[#8B7FA8] uppercase tracking-[0.22em] mt-1">Counselling Psychologist</p>
          </div>

          <div className="w-full max-w-sm mx-auto">

            {!sent ? (
              <>
                <Link href="/login" className="anim-up inline-flex items-center gap-1.5 text-xs text-[#8B7FA8] hover:text-[#9B7AD9] transition-colors mb-10">
                  <ArrowLeft size={12} />
                  Back to sign in
                </Link>

                <div className="mb-10 anim-up anim-d1">
                  <p className="text-[10px] text-[#9B7AD9] uppercase tracking-[0.25em] mb-3 font-medium">Password reset</p>
                  <h1 className="font-cormorant text-5xl text-[#1C1629] leading-tight font-light">
                    Forgot your <em>password?</em>
                  </h1>
                  <p className="text-sm text-[#8B7FA8] mt-3 leading-relaxed">
                    No worries. Enter your email and we'll send you a reset link right away.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="anim-up anim-d2">
                    <div className="float-label">
                      <input
                        type="email"
                        id="email"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#E2D9F3] bg-white text-sm text-[#1C1629] focus:outline-none focus:border-[#9B7AD9] transition-colors"
                      />
                      <label htmlFor="email">Email address</label>
                    </div>
                  </div>

                  <div className="anim-up anim-d3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#1C1629] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#1C1629]/20 transition-all duration-300 hover:bg-[#2A2040] hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 size={15} className="animate-spin" /> Sending link…</>
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="anim-up anim-d4 text-center text-sm text-[#8B7FA8] mt-8">
                  Remembered it?{' '}
                  <Link href="/login" className="text-[#1C1629] font-medium hover:text-[#9B7AD9] transition-colors underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-6">
                <div className="anim-scale flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3ECFF] to-[#E8DDF9] shadow-lg shadow-[#9B7AD9]/15">
                  <MailCheck size={32} className="text-[#9B7AD9]" />
                </div>
                <div className="anim-up anim-d1">
                  <h2 className="font-cormorant text-4xl text-[#1C1629] font-light">
                    Check your <em>inbox</em>
                  </h2>
                  <p className="text-sm text-[#8B7FA8] mt-3 leading-relaxed">
                    We've sent a password reset link to{' '}
                    <span className="text-[#1C1629] font-medium">{email}</span>.
                    The link expires in 30 minutes.
                  </p>
                </div>
                <div className="anim-up anim-d2 w-full rounded-2xl border border-[#E2D9F3] bg-white/70 p-5 text-left">
                  <p className="text-xs text-[#B0A4CC] uppercase tracking-wider mb-3">Didn't get it?</p>
                  <ul className="space-y-2 text-sm text-[#6B6578]">
                    <li className="flex items-start gap-2"><span className="text-[#9B7AD9] mt-0.5">✦</span> Check your spam or junk folder</li>
                    <li className="flex items-start gap-2"><span className="text-[#9B7AD9] mt-0.5">✦</span> Make sure you used the right email</li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#9B7AD9] mt-0.5">✦</span>
                      <span>
                        <button onClick={() => setSent(false)} className="underline underline-offset-4 hover:text-[#9B7AD9] transition-colors">
                          Try again
                        </button>{' '}with a different address
                      </span>
                    </li>
                  </ul>
                </div>
                <Link href="/login" className="anim-up anim-d3 inline-flex items-center gap-1.5 text-xs text-[#8B7FA8] hover:text-[#9B7AD9] transition-colors">
                  <ArrowLeft size={12} />
                  Back to sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}