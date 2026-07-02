'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, ArrowRight, Sparkles, Check } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

const fields = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: ' ', required: true },
  { name: 'email', label: 'Email address', type: 'email', placeholder: ' ', required: true },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: ' ', required: false },
  { name: 'password', label: 'Password', type: 'password', placeholder: ' ', required: true },
];

const perks = [
  'Easy online appointment booking',
  'Secure & confidential records',
  'Session reminders & follow-ups',
  'Progress tracking over time',
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return toast('Password must be at least 8 characters', 'error');
    setLoading(true);
    try {
      await authApi.register(form);
      toast('Account created! Please check your email to verify.', 'success');
      router.push('/login');
    } catch (err: any) {
      toast(err.message ?? 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
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
        .anim-up   { animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade { animation: fadeIn 1s ease both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.12s; }
        .anim-d3 { animation-delay: 0.19s; }
        .anim-d4 { animation-delay: 0.26s; }
        .anim-d5 { animation-delay: 0.33s; }
        .anim-d6 { animation-delay: 0.40s; }
        .anim-d7 { animation-delay: 0.47s; }
      `}</style>

      <div className="font-dm min-h-screen flex bg-[#F9F6F1]">

        {/* ── Left panel ── */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1C1629] flex-col justify-between p-12">
          <div className="grain absolute inset-0 pointer-events-none" />
          <div className="absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full bg-[#D9698A]/15 blur-[100px]" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[350px] h-[350px] rounded-full bg-[#7B5EA7]/20 blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-[#9B7AD9]/10 blur-[100px]" />

          {/* Logo */}
          <div className="relative z-10 anim-fade flex items-center gap-2">
            <Sparkles size={14} className="text-[#C9B8E8]" />
            <span className="font-cormorant text-[#C9B8E8] text-sm tracking-[0.2em] uppercase">Srishti Roy</span>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col gap-8">
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
            <div>
              <p className="text-[10px] text-[#9B7AD9] uppercase tracking-[0.25em] mb-4">What you get</p>
              <h2 className="font-cormorant text-3xl text-white/90 font-light leading-snug mb-8 italic">
                Everything you need for your wellness journey
              </h2>
              <div className="flex flex-col gap-4">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border border-[#9B7AD9]/50 flex items-center justify-center">
                      <Check size={10} className="text-[#9B7AD9]" />
                    </div>
                    <span className="text-sm text-white/60 leading-relaxed">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 border-t border-white/10 pt-8">
            <p className="text-xs text-white/20 leading-relaxed">
              Your data is secure and confidential. We follow strict privacy standards so you can focus on what matters — your wellbeing.
            </p>
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16 xl:px-20 overflow-y-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10 anim-up">
            <Link href="/" className="font-cormorant text-2xl text-[#1C1629]">Srishti Roy</Link>
            <p className="text-[10px] text-[#8B7FA8] uppercase tracking-[0.22em] mt-1">Counselling Psychologist</p>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <div className="mb-10 anim-up anim-d1">
              <p className="text-[10px] text-[#9B7AD9] uppercase tracking-[0.25em] mb-3 font-medium">Get started</p>
              <h1 className="font-cormorant text-5xl text-[#1C1629] leading-tight font-light">
                Create an <em>account</em>
              </h1>
              <p className="text-sm text-[#8B7FA8] mt-2 leading-relaxed">
                Book and manage your sessions with ease.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.name} className={`anim-up anim-d${i + 2}`}>
                  <div className="float-label relative">
                    <input
                      type={f.name === 'password' && showPw ? 'text' : f.type}
                      id={f.name}
                      placeholder={f.placeholder}
                      value={(form as any)[f.name]}
                      required={f.required}
                      onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      className="w-full rounded-2xl border border-[#E2D9F3] bg-white text-sm text-[#1C1629] focus:outline-none focus:border-[#9B7AD9] transition-colors"
                      style={f.name === 'password' ? { paddingRight: '48px' } : {}}
                    />
                    <label htmlFor={f.name}>{f.label}</label>
                    {f.name === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0A4CC] hover:text-[#9B7AD9] transition-colors"
                      >
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                  {f.name === 'password' && (
                    <p className="text-[11px] text-[#B0A4CC] mt-1.5 ml-1">Minimum 8 characters</p>
                  )}
                </div>
              ))}

              {/* Submit */}
              <div className="anim-up anim-d6 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-[#1C1629] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#1C1629]/20 transition-all duration-300 hover:bg-[#2A2040] hover:shadow-xl hover:shadow-[#1C1629]/25 disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <p className="anim-up anim-d6 text-[11px] text-[#B0A4CC] text-center leading-relaxed pt-1">
                By registering, you agree to our{' '}
                <Link href="/privacy" className="underline hover:text-[#9B7AD9]">Privacy Policy</Link>
              </p>
            </form>

            {/* Divider */}
            <div className="anim-up anim-d7 flex items-center gap-4 my-7">
              <div className="h-px flex-1 bg-[#E2D9F3]" />
              <span className="text-[11px] text-[#B0A4CC] uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-[#E2D9F3]" />
            </div>

            <div className="anim-up anim-d7 mb-7">
              <GoogleAuthButton next="/dashboard" label="signup" />
            </div>

            <p className="anim-up anim-d7 text-center text-sm text-[#8B7FA8]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1C1629] font-medium hover:text-[#9B7AD9] transition-colors underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}