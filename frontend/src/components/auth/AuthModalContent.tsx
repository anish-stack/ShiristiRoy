// components/auth/AuthModal.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { authApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useAuthStore } from '@/store/auth.store';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    defaultMode?: AuthMode;
    redirectTo?: string;
    onSuccess?: () => void;
}

export default function AuthModalContent({
    open,
    onClose,
    defaultMode = 'login',
    redirectTo = '/dashboard',
    onSuccess,
}: AuthModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const next = searchParams.get('next') || redirectTo;

    const { setAuth } = useAuthStore();

    const [mode, setMode] = useState<AuthMode>(defaultMode);

    const [showPw, setShowPw] = useState(false);

    const [loading, setLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    if (!open) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { user, accessToken, refreshToken } =
                await authApi.login(loginForm);

            setAuth(user, accessToken, refreshToken);

            toast('Welcome back!', 'success');

            onClose();

            onSuccess?.();

            router.push(next);
        } catch (err: any) {
            toast(err.message ?? 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerForm.password.length < 8) {
            return toast(
                'Password must be at least 8 characters',
                'error'
            );
        }

        setLoading(true);

        try {
            await authApi.register(registerForm);

            toast(
                'Account created successfully!',
                'success'
            );

            setMode('login');
        } catch (err: any) {
            toast(err.message ?? 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full p-2 text-black/50 transition hover:bg-black/5 hover:text-black"
                >
                    <X size={18} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link
                            href="/"
                            className="font-serif text-2xl text-brand-ink"
                        >
                            Srishti Roy
                        </Link>

                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-brand-ink/40">
                            Counselling Psychologist
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8 flex rounded-2xl bg-brand-ivory p-1">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${mode === 'login'
                                    ? 'bg-white shadow-sm'
                                    : 'text-black/50'
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${mode === 'register'
                                    ? 'bg-white shadow-sm'
                                    : 'text-black/50'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* LOGIN */}
                    {mode === 'login' && (
                        <form
                            onSubmit={handleLogin}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1.5 block text-xs text-brand-ink/50">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={loginForm.email}
                                    onChange={(e) =>
                                        setLoginForm((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="you@email.com"
                                    className="w-full rounded-xl border border-brand-lavender/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-lavender"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs text-brand-ink/50">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm((p) => ({
                                                ...p,
                                                password: e.target.value,
                                            }))
                                        }
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-brand-lavender/20 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-brand-lavender"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-3.5 text-black/40"
                                    >
                                        {showPw ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex w-full justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    )}

                    {mode === 'login' && (
                        <div className="mt-4 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-px flex-1 bg-brand-lavender/15" />
                                <span className="text-[11px] text-brand-ink/40 uppercase tracking-wider">or</span>
                                <div className="h-px flex-1 bg-brand-lavender/15" />
                            </div>
                            <GoogleAuthButton
                                next={next}
                                label="signin"
                                onSuccess={() => { onClose(); onSuccess?.(); router.push(next); }}
                            />
                        </div>
                    )}

                    {/* REGISTER */}
                    {mode === 'register' && (
                        <form
                            onSubmit={handleRegister}
                            className="space-y-4"
                        >
                            {[
                                {
                                    name: 'name',
                                    label: 'Full name',
                                    type: 'text',
                                    placeholder: 'Your name',
                                },
                                {
                                    name: 'email',
                                    label: 'Email',
                                    type: 'email',
                                    placeholder: 'you@email.com',
                                },
                                {
                                    name: 'phone',
                                    label: 'Phone',
                                    type: 'tel',
                                    placeholder: '+91...',
                                },
                                {
                                    name: 'password',
                                    label: 'Password',
                                    type: showPw ? 'text' : 'password',
                                    placeholder: 'Min 8 characters',
                                },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="mb-1.5 block text-xs text-brand-ink/50">
                                        {field.label}
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={field.type}
                                            required={field.name !== 'phone'}
                                            value={
                                                (registerForm as any)[field.name]
                                            }
                                            onChange={(e) =>
                                                setRegisterForm((p) => ({
                                                    ...p,
                                                    [field.name]:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl border border-brand-lavender/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-lavender"
                                        />

                                        {field.name === 'password' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPw(!showPw)
                                                }
                                                className="absolute right-3 top-3.5 text-black/40"
                                            >
                                                {showPw ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex w-full justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        </form>
                    )}

                    {mode === 'register' && (
                        <div className="mt-4 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-px flex-1 bg-brand-lavender/15" />
                                <span className="text-[11px] text-brand-ink/40 uppercase tracking-wider">or</span>
                                <div className="h-px flex-1 bg-brand-lavender/15" />
                            </div>
                            <GoogleAuthButton
                                next={next}
                                label="signup"
                                onSuccess={() => { onClose(); onSuccess?.(); router.push(next); }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}