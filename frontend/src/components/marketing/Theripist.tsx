"use client"
import React, { useState } from 'react';
import TherapistCard from './TherapistCard';
import TherapiesSection from './TherapiesSection';

interface TherapistProps {
  therapists: any;
}

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '3,000+', label: 'Clinical Hours' },
  { value: '12+', label: 'Nationalities Served' },
  { value: '98%', label: 'Client Satisfaction' },
];

const credentials = [
  'MSc Clinical Psychology · Adler Graduate Professional School',
  'BSc Hons Biology & Psychology · University of Toronto',
  'Registered Psychotherapist · Ontario',
  'Counselling in English, Hindi, Bengali & Urdu',
];

const areasOfFocus = [
  'Anxiety, stress, and burnout',
  'Trauma and emotional recovery',
  'Life transitions and adjustment difficulties',
  'Academic and workplace pressures',
  'Relationship and interpersonal concerns',
  'Identity exploration and self-development',
  'Emotional regulation and resilience building',
  'Student and athlete mental health',
];

const Therapist = ({ therapists }: TherapistProps) => {
  const [activeTab, setActiveTab] = useState<'background' | 'experience' | 'approach'>('background');

  if (!therapists) return null;

  return (
    <section className="relative mx-auto mt-32 max-w-7xl overflow-hidden px-4 lg:px-6">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#C8D8E8]/40 via-[#a06d5f5d]/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#D4E8D4]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-[#EAD8F0]/30 blur-3xl" />

      {/* ── HERO ROW ── */}
      <div className="relative flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">

        {/* Left */}
        <div className="flex flex-col gap-8 lg:max-w-[420px] lg:shrink-0">

          {/* Pill */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#B8CEDD]/60 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7DA98D]" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7D8793]">Your Therapist</p>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-[#3C4D5C] lg:text-[3.75rem]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Meet
            </h2>
            <h2 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight lg:text-[3.75rem]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                background: 'linear-gradient(135deg, #a06d5f5d 0%, #a06d5f91 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Srishti Roy
            </h2>
          </div>

          {/* Accent line */}
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-[#7DA98D] to-transparent" />
            <div className="h-1 w-1 rounded-full bg-[#7DA98D]/50" />
          </div>

          {/* Intro para — 100% verbatim */}
          <p className="text-[0.95rem] leading-[1.85] text-[#6B7280]">
            Srishti Roy is a Canadian-trained Counselling Psychologist and mental health professional with over 3 years and 3,000+ hours of clinical experience supporting individuals, students, athletes, families, and culturally diverse populations across Canada and internationally. Her work is grounded in evidence-based practice, cultural sensitivity, and a deep commitment to helping individuals build resilience, self-awareness, and lasting emotional well-being.
          </p>

          {/* Credentials */}
          <div className="flex flex-col gap-3">
            {credentials.map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7DA98D]/15 text-[9px] text-[#7DA98D]">✦</span>
                <span className="text-sm text-[#6B7280]">{label}</span>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          {/* <div className="mt-2 grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
                <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#7DA98D]/20 to-[#4B7A8C]/10 blur-xl transition-all duration-500 group-hover:scale-150" />
                <p className="relative text-3xl font-bold tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: 'linear-gradient(135deg, #7DA98D, #4B7A8C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {s.value}
                </p>
                <p className="relative mt-1 text-xs leading-snug text-[#6B7280]">{s.label}</p>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right: card */}
        <div className="relative flex-1">
          <div className="absolute -left-4 -top-4 z-10 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-[#7DA98D]/40" />
          <div className="absolute -bottom-4 -right-4 z-10 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-[#4B7A8C]/30" />
          <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-[#7DA98D]/15 to-[#4B7A8C]/10 blur-2xl" />
          <div className="relative rounded-3xl border border-white/60 bg-white/55 p-1 shadow-2xl shadow-[#3C4D5C]/10 backdrop-blur-md">
            <TherapistCard therapist={therapists} />
          </div>
          <div className="absolute -bottom-6 -left-6 z-20 max-w-[220px] rounded-2xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-[#3C4D5C]/10 backdrop-blur-sm lg:-left-10">
            <p className="text-[0.72rem] leading-relaxed text-[#6B7280] italic">
              "Healing is not linear — and that's perfectly okay."
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-[#7DA98D]/40 to-transparent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#7DA98D]">Srishti Roy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL BIO TABS ── */}
      <div className="relative mt-24 rounded-3xl border border-white/60 bg-white/50 p-8 shadow-xl shadow-[#3C4D5C]/8 backdrop-blur-md lg:p-12">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7DA98D]/5 to-[#4B7A8C]/5" />

        {/* Tab bar */}
        <div className="relative mb-10 flex gap-2 overflow-x-auto pb-1">
          {(['background', 'experience', 'approach'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#a06d5f5d] to-[#a06d5f5d] text-white shadow-md'
                  : 'border border-[#B8CEDD]/60 bg-white/60 text-[#7D8793] hover:bg-white/80'
              }`}
            >
              {tab === 'background' ? 'Educational Background' : tab === 'experience' ? 'Professional Experience' : 'Approach & Languages'}
            </button>
          ))}
        </div>

        {/* Tab: Background */}
        {activeTab === 'background' && (
          <div className="relative flex flex-col gap-6">
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Srishti began her academic journey at the University of Toronto, where she completed an Honours Bachelor of Science (BSc Hons) in Biology and Psychology. During her undergraduate studies, she conducted research examining the relationship between young adult stress and cardiovascular health, fostering a lasting interest in the connection between emotional well-being, physical health, and human resilience.
            </p>
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              She later earned her Master's degree in Clinical Psychology from Adler Graduate Professional School, where her training emphasized Adlerian psychology, insight-oriented psychotherapy, community mental health, and holistic approaches to psychological well-being.
            </p>

            {/* Timeline visual */}
            <div className="mt-4 flex flex-col gap-4 border-l-2 border-[#7DA98D]/30 pl-6">
              {[
                { year: 'UofT', label: 'BSc Hons · Biology & Psychology', sub: 'Research: young adult stress & cardiovascular health' },
                { year: 'Adler', label: "Master's · Clinical Psychology", sub: 'Adlerian psychology · insight-oriented psychotherapy · community mental health' },
              ].map((item) => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-gradient-to-br from-[#7DA98D] to-[#4B7A8C]" />
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#7DA98D]">{item.year}</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#3C4D5C]">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Experience */}
        {activeTab === 'experience' && (
          <div className="relative flex flex-col gap-6">
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Prior to completing her graduate training, Srishti worked in Scarborough, Ontario, as both a Psychometrist and Private Clinic Administrator within a mental health setting. In these roles, she gained valuable experience in psychological assessment, client care coordination, and multidisciplinary mental health services, strengthening her understanding of both clinical practice and healthcare systems.
            </p>
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Throughout her career, Srishti has worked extensively with university students, young adults, international students, athletes, and working professionals. During her time at York University, she provided counselling support to varsity athletes and students from diverse cultural backgrounds, helping clients navigate academic pressure, burnout, identity development, emotional regulation, relationship concerns, and major life transitions.
            </p>
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              She also worked as a Registered Psychotherapist in Ontario, supporting individuals recovering from motor vehicle accidents, trauma-related experiences, adjustment difficulties, anxiety, chronic stress, and other complex life challenges. This work provided extensive experience in trauma-informed care, emotional recovery, and psychological rehabilitation.
            </p>
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Having worked with clients from more than 12 nationalities, Srishti brings a culturally responsive and inclusive perspective to therapy, recognizing the importance of identity, family systems, culture, migration experiences, and social context in mental health.
            </p>

            {/* Areas of focus */}
            <div className="mt-2 rounded-2xl border border-[#B8CEDD]/40 bg-white/60 p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#4B7A8C]">Areas of Focus</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {areasOfFocus.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7DA98D]/15 text-[8px] text-[#7DA98D]">✦</span>
                    <span className="text-sm text-[#6B7280]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Beyond therapy room */}
            <div className="rounded-2xl border border-[#B8CEDD]/40 bg-white/60 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#4B7A8C]">Beyond the Therapy Room</p>
              <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
                In addition to her clinical work, Srishti has designed and facilitated workshops, psychoeducational programs, and mental health initiatives for universities, educational institutions, and young adults. Her presentations focus on topics such as emotional wellness, stress management, productivity, self-awareness, resilience, and practical psychological skills for everyday life.
              </p>
              <p className="mt-4 text-[0.95rem] leading-[1.9] text-[#6B7280]">
                Through both therapy and education, Srishti is committed to making mental health support accessible, culturally relevant, and empowering, helping individuals move toward greater well-being, personal growth, and meaningful change.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Approach */}
        {activeTab === 'approach' && (
          <div className="relative flex flex-col gap-6">
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Srishti's therapeutic style is warm, collaborative, reflective, and insight-oriented. She believes that meaningful change occurs when individuals are provided with a safe, non-judgmental space to better understand themselves, their experiences, and their patterns of relating to the world.
            </p>
            <p className="text-[0.95rem] leading-[1.9] text-[#6B7280]">
              Her work integrates Adlerian principles with evidence-based and integrative therapeutic approaches, helping clients develop greater self-awareness, emotional clarity, healthier relationships, and sustainable coping strategies. She views therapy as a collaborative process that honours each client's unique strengths, values, and lived experiences.
            </p>

            {/* Languages */}
            <div className="rounded-2xl border border-[#B8CEDD]/40 bg-white/60 p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#4B7A8C]">Languages</p>
              <p className="mb-4 text-sm text-[#6B7280]">
                To ensure clients can express themselves in the language in which they feel most comfortable, Srishti offers counselling and psychotherapy services in:
              </p>
              <div className="flex flex-wrap gap-3">
                {['English', 'Hindi', 'Bengali', 'Urdu'].map((lang) => (
                  <span key={lang} className="rounded-full bg-gradient-to-r from-[#7DA98D]/10 to-[#4B7A8C]/10 px-5 py-2 text-sm font-semibold text-[#4B7A8C] border border-[#7DA98D]/20">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-24 flex items-center gap-4 opacity-25">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#7DA98D] to-transparent" />
        <span className="text-xs text-[#7DA98D]">✦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#4B7A8C] to-transparent" />
      </div>

      <TherapiesSection />

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