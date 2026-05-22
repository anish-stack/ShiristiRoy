"use client"
import React from 'react';
import TherapistCard from './TherapistCard';
import TherapiesSection from './TherapiesSection';

interface TherapistProps {
  therapists: any;
}

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '12+', label: 'Nationalities Served' },
  { value: '200+', label: 'Sessions Held' },
  { value: '98%', label: 'Client Satisfaction' },
];

const Therapist = ({ therapists }: TherapistProps) => {
  if (!therapists) return null;

  return (
    <section className="relative mx-auto mt-32 max-w-7xl overflow-hidden px-4 lg:px-6">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#C8D8E8]/40 via-[#E8D5C4]/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#D4E8D4]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-[#EAD8F0]/30 blur-3xl" />

      {/* Main layout */}
      <div className="relative flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">

        {/* ── Left: text + stats ── */}
        <div className="flex flex-col gap-8 lg:max-w-[420px] lg:shrink-0">

          {/* Pill */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#B8CEDD]/60 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7DA98D]" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7D8793]">Your Therapist</p>
          </div>

          {/* Heading */}
          <div>
            <h2
              className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-[#3C4D5C] lg:text-[3.75rem]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Meet Your
            </h2>
            <h2
              className="font-serif text-5xl font-bold leading-[1.05] tracking-tight lg:text-[3.75rem]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                background: 'linear-gradient(135deg, #7DA98D 0%, #4B7A8C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Guide
            </h2>
          </div>

          {/* Accent line */}
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-[#7DA98D] to-transparent" />
            <div className="h-1 w-1 rounded-full bg-[#7DA98D]/50" />
          </div>

          {/* Body */}
          <p className="text-[0.95rem] leading-[1.85] text-[#6B7280]">
            Connect with a compassionate therapist who will support, guide, and walk with you throughout your wellness journey — wherever you are in life.
          </p>

          {/* Trust badges */}
          <div className="flex flex-col gap-3">
            {[
              'Licensed & Certified Professional',
              'Private & Confidential Sessions',
              'Personalized Wellness Plan',
            ].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7DA98D]/15 text-[9px] text-[#7DA98D]">✦</span>
                <span className="text-sm text-[#6B7280]">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Stats grid ── */}
          <div className="mt-2 grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md"
              >
                {/* Subtle gradient accent */}
                <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#7DA98D]/20 to-[#4B7A8C]/10 blur-xl transition-all duration-500 group-hover:scale-150" />
                <p
                  className="relative text-3xl font-bold tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #7DA98D, #4B7A8C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.value}
                </p>
                <p className="relative mt-1 text-xs leading-snug text-[#6B7280]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: card ── */}
        <div className="relative flex-1">
          {/* Corner accents */}
          <div className="absolute -left-4 -top-4 z-10 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-[#7DA98D]/40" />
          <div className="absolute -bottom-4 -right-4 z-10 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-[#4B7A8C]/30" />

          {/* Glow behind card */}
          <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-[#7DA98D]/15 to-[#4B7A8C]/10 blur-2xl" />

          {/* Card wrapper */}
          <div className="relative rounded-3xl border border-white/60 bg-white/55 p-1 shadow-2xl shadow-[#3C4D5C]/10 backdrop-blur-md">
            <TherapistCard therapist={therapists} />
          </div>

          {/* Floating quote bubble */}
          <div className="absolute -bottom-6 -left-6 z-20 max-w-[220px] rounded-2xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-[#3C4D5C]/10 backdrop-blur-sm lg:-left-10">
            <p className="text-[0.72rem] leading-relaxed text-[#6B7280] italic">
              "Healing is not linear — and that's perfectly okay."
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-[#7DA98D]/40 to-transparent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#7DA98D]">Mantra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave line */}
      <div className="mt-24 flex items-center gap-4 opacity-25">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7DA98D] to-transparent" />
        <span className="text-xs text-[#7DA98D]">✦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4B7A8C] to-transparent" />
      </div>

      <TherapiesSection/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&display=swap');
        section { animation: sectionUp 0.75s ease both; }
        @keyframes sectionUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Therapist;