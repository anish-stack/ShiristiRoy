'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import {
  Loader2,
  Calendar,
  Clock3,
  Video,
  MapPin,
  XCircle,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  LogOut,
  AlertCircle,
  BookHeart,
} from 'lucide-react';

import {
  bookingApi,
  type Appointment,
} from '@/lib/api';

import {
  useAuthStore,
} from '@/store/auth.store';

import {
  formatDate,
  formatTime,
  cn,
} from '@/lib/utils';

import {
  toast,
} from '@/components/ui/Toaster';

const statusStyle: Record<
  string,
  string
> = {
  pending:
    'bg-amber-50 text-amber-700 border-amber-200',

  confirmed:
    'bg-emerald-50 text-emerald-700 border-emerald-200',

  completed:
    'bg-sky-50 text-sky-700 border-sky-200',

  cancelled:
    'bg-red-50 text-red-600 border-red-200',

  no_show:
    'bg-zinc-100 text-zinc-500 border-zinc-200',
};

export default function DashboardPage() {
  const {
    user,
    clearAuth,
  } = useAuthStore();

  const router = useRouter();

  const [
    appointments,
    setAppointments,
  ] = useState<
    Appointment[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(
        '/login?next=/dashboard'
      );

      return;
    }

    bookingApi
      .myAppointments()
      .then((res: any) => {
        setAppointments(
          res?.data || []
        );
      })
      .catch(() => {
        toast(
          'Failed to load appointments',
          'error'
        );
      })
      .finally(() =>
        setLoading(false)
      );
  }, [user, router]);

  const cancel =
    async (id: string) => {
      const confirmed =
        confirm(
          'Cancel this appointment?'
        );

      if (!confirmed) return;

      try {
        await bookingApi.cancel(
          id,
          'Cancelled by client'
        );

        setAppointments((prev) =>
          prev.map((a) =>
            a._id === id
              ? {
                  ...a,
                  status:
                    'cancelled',
                }
              : a
          )
        );

        toast(
          'Appointment cancelled',
          'success'
        );
      } catch (e: any) {
        toast(
          e.message ||
            'Could not cancel appointment',
          'error'
        );
      }
    };

  const upcoming =
    useMemo(
      () =>
        appointments.filter((a) =>
          [
            'pending',
            'confirmed',
          ].includes(a.status)
        ),
      [appointments]
    );

  const past = useMemo(
    () =>
      appointments.filter(
        (a) =>
          ![
            'pending',
            'confirmed',
          ].includes(a.status)
      ),
    [appointments]
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-20 px-4 overflow-hidden">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#CBB8D7]/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D8C7B5]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#2D2A26] via-[#3A342D] to-[#4A433A] p-8 md:p-12 mb-10 text-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#fff,transparent_35%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-white/80 mb-5 backdrop-blur">
                <Sparkles
                  size={16}
                />

                Wellness Dashboard
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Welcome back,
                <br />

                <span className="text-[#E9D7C3]">
                  {
                    user.name.split(
                      ' '
                    )[0]
                  }
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-white/70 text-lg leading-8">
                Manage your
                therapy sessions,
                appointments, and
                wellness journey
                from one calm and
                secure space.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {user?.role ===
                'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E9D7C3] hover:bg-white text-[#2D2A26] font-semibold transition-all duration-300 shadow-lg"
                >
                  <LayoutDashboard
                    size={18}
                  />

                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  clearAuth();

                  router.push(
                    '/'
                  );
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300"
              >
                <LogOut
                  size={18}
                />

                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            {
              href: '/book',
              label:
                'Book Session',
              desc: 'Schedule your next therapy appointment.',
              icon: Calendar,
              bg: 'bg-[#F1E9FF]',
              iconColor:
                'text-[#8A63D2]',
            },

            {
              href: '/services',
              label:
                'Explore Services',
              desc: 'Discover therapy and counselling options.',
              icon: BookHeart,
              bg: 'bg-[#EAF8F1]',
              iconColor:
                'text-[#4D9B72]',
            },

            {
              href: '/contact',
              label:
                'Need Support?',
              desc: 'Reach out for guidance and help.',
              icon: AlertCircle,
              bg: 'bg-[#FFF4EA]',
              iconColor:
                'text-[#D18442]',
            },
          ].map(
            ({
              href,
              label,
              desc,
              icon: Icon,
              bg,
              iconColor,
            }) => (
              <Link
                key={href}
                href={href}
                className="group relative overflow-hidden rounded-[28px] bg-white border border-[#ECE6DC] p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-5',
                    bg
                  )}
                >
                  <Icon
                    size={24}
                    className={
                      iconColor
                    }
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#2D2A26] mb-2">
                  {label}
                </h3>

                <p className="text-[#6E665D] leading-7 text-sm">
                  {desc}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-[#8A63D2] font-medium">
                  Explore

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </Link>
            )
          )}
        </div>

        {/* LOADER */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2
              size={34}
              className="animate-spin text-[#8A63D2]"
            />
          </div>
        ) : (
          <>
            {/* UPCOMING */}
            <section className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-[#9A8F80] mb-2">
                    Appointments
                  </p>

                  <h2 className="text-3xl font-bold text-[#2D2A26]">
                    Upcoming
                    Sessions
                  </h2>
                </div>
              </div>

              {upcoming.length ===
              0 ? (
                <div className="rounded-[32px] bg-white border border-[#ECE6DC] p-14 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#F5EFE7] flex items-center justify-center mx-auto mb-6">
                    <Calendar
                      size={32}
                      className="text-[#8D7A68]"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-[#2D2A26] mb-3">
                    No Upcoming
                    Sessions
                  </h3>

                  <p className="text-[#6E665D] max-w-md mx-auto leading-8 mb-8">
                    Start your
                    wellness journey
                    by booking a
                    therapy session
                    today.
                  </p>

                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#8D7A68] hover:bg-[#7A6858] text-white font-medium transition-all duration-300"
                  >
                    Book Now

                    <ArrowRight
                      size={18}
                    />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {upcoming.map(
                    (a) => (
                      <div
                        key={
                          a._id
                        }
                        className="rounded-[30px] bg-white border border-[#ECE6DC] p-6 md:p-8 hover:shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <span
                                className={cn(
                                  'px-3 py-1 rounded-full border text-xs font-semibold capitalize',
                                  statusStyle[
                                    a
                                      .status
                                  ]
                                )}
                              >
                                {
                                  a.status
                                }
                              </span>

                              <span className="text-xs font-mono text-[#9A8F80]">
                                {
                                  a.bookingCode
                                }
                              </span>
                            </div>

                            <h3 className="text-2xl font-semibold text-[#2D2A26] mb-5">
                              {(a.service as any)
                                ?.name ||
                                'Therapy Session'}
                            </h3>

                            <div className="flex flex-wrap gap-5 text-sm text-[#6E665D]">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={
                                    16
                                  }
                                  className="text-[#8A63D2]"
                                />

                                {formatDate(
                                  a.startAt
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock3
                                  size={
                                    16
                                  }
                                  className="text-[#8A63D2]"
                                />

                                {formatTime(
                                  a.startAt
                                )}
                              </div>

                              <div className="flex items-center gap-2 capitalize">
                                {a.mode ===
                                'online' ? (
                                  <Video
                                    size={
                                      16
                                    }
                                    className="text-[#4D9B72]"
                                  />
                                ) : (
                                  <MapPin
                                    size={
                                      16
                                    }
                                    className="text-[#4D9B72]"
                                  />
                                )}

                                {a.mode?.replace(
                                  '_',
                                  ' '
                                )}
                              </div>
                            </div>
                          </div>

                          {a.status !==
                            'cancelled' && (
                            <button
                              onClick={() =>
                                cancel(
                                  a._id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300"
                            >
                              <XCircle
                                size={
                                  18
                                }
                              />

                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* PAST */}
            {past.length > 0 && (
              <section>
                <div className="mb-6">
                  <p className="uppercase tracking-[0.3em] text-xs text-[#9A8F80] mb-2">
                    History
                  </p>

                  <h2 className="text-3xl font-bold text-[#2D2A26]">
                    Past Sessions
                  </h2>
                </div>

                <div className="space-y-4">
                  {past.map((a) => (
                    <div
                      key={a._id}
                      className="rounded-[26px] bg-white border border-[#ECE6DC] p-5 opacity-80 hover:opacity-100 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={cn(
                                'px-3 py-1 rounded-full border text-xs font-semibold capitalize',
                                statusStyle[
                                  a
                                    .status
                                ]
                              )}
                            >
                              {
                                a.status
                              }
                            </span>
                          </div>

                          <h3 className="font-semibold text-[#2D2A26]">
                            {(a.service as any)
                              ?.name ||
                              'Session'}
                          </h3>
                        </div>

                        <p className="text-sm text-[#8D8478]">
                          {formatDate(
                            a.startAt
                          )}{' '}
                          •{' '}
                          {formatTime(
                            a.startAt
                          )}
                        </p>
                      </div>
                    </div>
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