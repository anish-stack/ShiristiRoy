'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

import { serviceApi } from '@/lib/api';

interface Service {
  _id: string;
  slug: string;
  name: string;
}

export function Footer() {
  const [services, setServices] = useState<
    Service[]
  >([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res =
          await serviceApi.list();

        setServices(
          res
        );
      } catch (error) {
        console.error(
          'Footer services error:',
          error
        );
      }
    };

    loadServices();
  }, []);

  const quickLinks = [
    {
      href: '/',
      label: 'Home',
    },

    {
      href: '/about',
      label: 'About',
    },

    // {
    //   href: '/therapists',
    //   label: 'Therapists',
    // },

    {
      href: '/services',
      label: 'Therapies',
    },

    {
      href: '/blog  ',
      label: 'Blogs',
    },

    {
      href: '/contact',
      label: 'Contact',
    },

    {
      href: '/book',
      label: 'Book Session',
    },
  ];

  const policies = [
    {
      href: '/privacy-policy',
      label: 'Privacy Policy',
    },

    {
      href: '/terms-and-conditions',
      label: 'Terms & Conditions',
    },

    {
      href: '/refund-policy',
      label: 'Refund Policy',
    },

    {
      href: '/cookie-policy',
      label: 'Cookie Policy',
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0D0C12] text-white">
      {/* Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#8B5CF6,transparent_30%),radial-gradient(circle_at_bottom_left,#C4B5FD,transparent_25%)]" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 pt-20 pb-10">
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-14 border-b border-white/10 pb-16">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Srishti Roy
              </h2>

              <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#B7A7D8]">
                Counselling
                Psychologist
              </p>
            </Link>

            <p className="mt-6 max-w-md text-[15px] leading-8 text-white/60">
              Healing through
              awareness,
              reflection, and
              self-understanding.
              Integrative therapy
              focused on emotional
              wellness, anxiety,
              relationships, and
              personal growth.
            </p>

            {/* CONTACT */}
            <div className="mt-8 space-y-3 text-sm">
              <a
                href="mailto:contact@awarenesswithroy.com"
                className="group flex items-center gap-3 text-white/70 hover:text-white transition"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#8B5CF6]/20 transition">
                  <Mail size={16} />
                </div>

                contact@awarenesswithroy.com
              </a>

              <a
                href="tel:+918448009694"
                className="group flex items-center gap-3 text-white/70 hover:text-white transition"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#8B5CF6]/20 transition">
                  <Phone size={16} />
                </div>

                +91 84480 09694
              </a>

              <a
                href="https://wa.me/16475008349"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-white/70 hover:text-white transition"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#8B5CF6]/20 transition">
                  <MessageCircle
                    size={16}
                  />
                </div>

                WhatsApp Support
              </a>
            </div>

            {/* SOCIAL */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://instagram.com/awakenwithsrishti"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition-all duration-300"
              >
                <Instagram
                  size={18}
                />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map(
                (link) => (
                  <li
                    key={link.href}
                  >
                    <Link
                      href={
                        link.href
                      }
                      className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
                    >
                      <span>
                        {
                          link.label
                        }
                      </span>

                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Therapies
            </h3>

            <ul className="space-y-3">
              {services?.length >
              0 ? (
                services
                  .slice(0, 6)
                  .map(
                    (
                      service
                    ) => (
                      <li
                        key={
                          service._id
                        }
                      >
                        <Link
                          href={`/services/${service.slug}`}
                          className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
                        >
                          <span>
                            {
                              service.name
                            }
                          </span>

                          <ArrowUpRight
                            size={
                              14
                            }
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          />
                        </Link>
                      </li>
                    )
                  )
              ) : (
                <p className="text-white/40 text-sm">
                  Loading services...
                </p>
              )}
            </ul>
          </div>

          {/* POLICIES */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Policies
            </h3>

            <ul className="space-y-3">
              {policies.map(
                (policy) => (
                  <li
                    key={
                      policy.href
                    }
                  >
                    <Link
                      href={
                        policy.href
                      }
                      className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
                    >
                      <span>
                        {
                          policy.label
                        }
                      </span>

                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
{/* DISCLAIMER */}
<div className="mt-12 pt-8 border-t border-white/10">
  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
    Disclaimer
  </h3>

  <p className="text-sm leading-7 text-white/50 max-w-5xl">
    Eligibility is confirmed during the initial consultation based on your
    physical location and applicable professional requirements. This practice
    does not provide emergency or crisis services. If you are in immediate
    danger, contact local emergency services or a crisis service in your
    location.
  </p>
</div>

{/* BOTTOM */}
<div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-8 text-sm text-white/35">
  ...
</div>
        {/* BOTTOM */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-8 text-sm text-white/35">
          <p>
            ©{' '}
            {new Date().getFullYear()}{' '}
            Srishti Roy. All
            rights reserved.
          </p>

          <div className="flex items-center gap-3 text-center">
            <span>
              Sessions in English
            </span>

            <span>·</span>

            <span>हिन्दी</span>

            <span>·</span>

            <span>বাংলা</span>

            <span>·</span>

            <span>اردو</span>
          </div>

          <p>
            Designed with care for
            mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
}