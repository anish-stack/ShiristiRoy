'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

import logo from '@/assets/logo.png';

import { cn } from '@/lib/utils';
import { serviceApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const links = [
  { href: '/about', label: 'About' },
  { href: '/therapists/srishti-roy', label: 'Therapist' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const icons: Record<string, string> = {
 
  'family-therapy': '🌿',
  'online-therapy': '💻',
  'young-adult-support': '✨',
};

export function Navbar() {
  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [serviceOpen, setServiceOpen] =
    useState(false);

  const [services, setServices] = useState<
    any[]
  >([]);

  const { user } = useAuthStore();

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > 20);

    window.addEventListener(
      'scroll',
      onScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      );
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res =
          await serviceApi.list();

        setServices(res ?? []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchServices();
  }, []);

  return (
    <header
      className={
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FFFDF8]/90 backdrop-blur-xl border-b border-[#E8DDD4]'}

    >
      <nav className="max-w-7xl mx-auto h-24 px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className=" flex items-center justify-center">
            <Image
              src={logo}
              alt="logo"
              width={110}
              height={110}
              priority
              className="object-contain"
            />
          </div>

          {/* <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold text-[#2E2A27] tracking-wide group-hover:text-[#A06D5F] transition-colors">
              Srishti Roy
            </span>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B6F68] mt-1">
              Counselling Psychologist
            </span>
          </div> */}
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {links.slice(0, 2).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-[#5F5651] hover:text-[#A06D5F] transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}

          <li
            className="relative"
            onMouseEnter={() =>
              setServiceOpen(true)
            }
            onMouseLeave={() =>
              setServiceOpen(false)
            }
          >
            <button className="flex items-center gap-1 text-sm font-medium text-[#5F5651] hover:text-[#A06D5F] transition-colors">
              Services

              <ChevronDown
                size={16}
                className={cn(
                  'transition-transform duration-200',
                  serviceOpen &&
                  'rotate-180'
                )}
              />
            </button>

            <div
              className={cn(
                'absolute top-12 left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-3xl shadow-2xl border border-[#EFE4DA] p-3 transition-all duration-200',
                serviceOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible translate-y-2'
              )}
            >
              {services.map((s) => (
                <Link
                  key={s._id}
                  href={`/services/${s.slug}`}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#FAF4EE] transition-all group"
                >
                

                  <div>
                    <h2 className="text-sm font-semibold text-[#2E2A27] group-hover:text-[#A06D5F] transition-colors">
                      {s.name}
                    </h2>

                    <p className="text-xs text-[#7B6F68] leading-relaxed mt-1 line-clamp-2">
                      {s.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                  href={`/services/workshops`}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#FAF4EE] transition-all group"
                >
                

                  <div>
                    <h2 className="text-sm font-semibold text-[#2E2A27] group-hover:text-[#A06D5F] transition-colors">
                      Workshops
                    </h2>
                  </div>
                </Link>
            </div>
          </li>

          {links.slice(2).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-[#5F5651] hover:text-[#A06D5F] transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#5F5651] hover:text-[#A06D5F] transition-colors"
            >
              Dashboard
            </Link>
          ):(
            <Link
              href="/login"
              className="text-sm font-medium text-[#5F5651] hover:text-[#A06D5F] transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            href="/book"
            className="h-11 px-6 rounded-full bg-[#A06D5F] hover:bg-[#8F5D50] text-white text-sm font-medium flex items-center justify-center transition-all shadow-lg shadow-[#A06D5F]/20"
          >
            Book Session
          </Link>
        </div>

        <button
          className="lg:hidden w-10 h-10 rounded-xl bg-[#F3EDE7] flex items-center justify-center text-[#2E2A27]"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </nav>

      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 bg-[#FFFDF8] border-t border-[#EFE4DA]',
          open
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() =>
                setOpen(false)
              }
              className="text-[15px] font-medium text-[#4E4641]"
            >
              {l.label}
            </Link>
          ))}

          <div className="border-t border-[#EFE4DA] pt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9B8C84] mb-4">
              Services
            </p>

            <div className="flex flex-col gap-2">
              {services.map((s) => (
                <Link
                  key={s._id}
                  href={`/services/${s.slug}`}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF4EE]"
                >
                  <div className="text-xl">
                    {icons[s.slug] ??
                      ''}
                  </div>

                  <span className="text-sm font-medium text-[#2E2A27]">
                    {s.name}
                  </span>
                </Link>
              ))}
              <Link
                  href={`/services/workshops`}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF4EE]"
                >
                  <div className="text-xl">
                    {icons['workshops'] ?? ''}
                  </div>

                  <span className="text-sm font-medium text-[#2E2A27]">
                    Workshops
                  </span>
                </Link>
            </div>
          </div>

          <div className="border-t border-[#EFE4DA] pt-5">
            {user && (
              <Link
                href="/dashboard"
                onClick={() =>
                  setOpen(false)
                }
                className="text-sm font-medium text-[#4E4641]"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/book"
              onClick={() =>
                setOpen(false)
              }
              className="mt-5 h-12 rounded-full bg-[#A06D5F] text-white text-sm font-medium flex items-center justify-center"
            >
              Book Session
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}