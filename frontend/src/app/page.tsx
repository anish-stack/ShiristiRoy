import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, Globe, Star, Leaf, Sparkles, Shield } from 'lucide-react';
import { publicApi, therapistApi, serviceApi } from '@/lib/api';
import { buildMetadata, personJsonLd, faqJsonLd } from '@/lib/seo';
import Hero from '@/components/marketing/hero';
import AboutPractice from '@/components/marketing/About';
import Services from '@/components/marketing/Services';

export const metadata: Metadata = buildMetadata({
  title: 'Srishti Roy — Counselling Psychologist',
  description: 'Adlerian-informed integrative therapy. Healing through awareness, reflection, and self-understanding. Online & in-person sessions.',
  keywords: ['counselling psychologist', 'online therapy India', 'adlerian therapy', 'anxiety therapy', 'family counselling'],
  path: '/',
});

export const revalidate = 3600;

async function getData() {
  const [testimonials, faqs, services] = await Promise.allSettled([
    publicApi.testimonials(),
    publicApi.faqs(),
    serviceApi.list(),
  ]);
  return {
    testimonials: testimonials.status === 'fulfilled' ? testimonials.value : [],
    faqs: faqs.status === 'fulfilled' ? faqs.value.slice(0, 5) : [],
    services: services.status === 'fulfilled' ? services.value.slice(0, 6) : [],
  };
}

export default async function HomePage() {
  const { testimonials, faqs, services } = await getData();

  const serviceIcons: Record<string, string> = {
    'individual-counselling': '🪷',
    'family-therapy': '🌿',
    'online-therapy': '💻',
    'adlerian-integrative-therapy': '🌀',
    'emotional-regulation': '🫧',
    'young-adult-support': '✨',
  };

  return (
    <>
      {/* JSON-LD FAQ */}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      )}

      {/* ── HERO ── */}
      <Hero />

      {/* ── APPROACH STRIP ── */}
      <section className="bg-brand-lavender text-white py-5 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {['Adlerian-Informed', 'Integrative Counselling', 'Anxiety Support', 'Relationship Therapy', 'Emotional Regulation', 'Family Dynamics', 'Life Transitions', 'Self-Understanding'].flatMap((t) => [
            <span key={t + '1'} className="inline-block mx-8 text-sm tracking-widest uppercase opacity-80">{t}</span>,
            <span key={t + 'dot'} className="inline-block text-white/40 mx-2">◆</span>,
          ])}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </section>

      {/* ── ABOUT TEASER ── */}
      <AboutPractice />

      {/* ── SERVICES ── */}
          <Services/>

{testimonials.length > 0 && (
  <section className="relative overflow-hidden py-24 px-6" style={{ background: '#F5EEE8' }}>
    {/* Sunray background */}
    <div className="pointer-events-none absolute -top-20 -right-20 opacity-[0.06]">
      <svg width="400" height="400" viewBox="0 0 400 400">
        <g transform="translate(200,200)">
          <circle r="60" fill="none" stroke="#7A9E7E" strokeWidth="1.5"/>
          <circle r="90" fill="none" stroke="#7A9E7E" strokeWidth=".8"/>
          <circle r="120" fill="none" stroke="#7A9E7E" strokeWidth=".5"/>
          <circle r="150" fill="none" stroke="#7A9E7E" strokeWidth=".4"/>
          <circle r="180" fill="none" stroke="#7A9E7E" strokeWidth=".3"/>
          <circle r="8" fill="#7A9E7E"/>
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 65} y1={Math.sin(a) * 65}
                x2={Math.cos(a) * 185} y2={Math.sin(a) * 185}
                stroke="#7A9E7E"
                strokeWidth={i % 3 === 0 ? '1.2' : '.5'}
              />
            );
          })}
        </g>
      </svg>
    </div>

    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[.25em] uppercase font-normal" style={{ color: '#7A9E7E' }}>
          {/* Sunray icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.9" y1="4.9" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="19.1" y2="19.1"/>
            <line x1="19.1" y1="4.9" x2="16.9" y2="7.1"/><line x1="7.1" y1="16.9" x2="4.9" y2="19.1"/>
          </svg>
          Healing journeys
        </span>
        <h2 className="mt-2 font-serif text-[2.8rem] font-light leading-tight" style={{ color: '#2C2C28' }}>
          What clients <em>share</em>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="relative rounded-[20px] p-8"
            style={{ background: '#FDFCF9', border: '1px solid rgba(122,158,126,.15)' }}
          >
            {/* Top line accent */}
            <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg,transparent,#C8DEC9,transparent)' }}/>

            {/* Lotus icon */}
            <div className="mb-5 opacity-70">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <ellipse cx="20" cy="28" rx="5" ry="9" fill="#C8DEC9" opacity=".7"/>
                <ellipse cx="20" cy="28" rx="5" ry="9" fill="#C8DEC9" opacity=".5" transform="rotate(-30 20 28)"/>
                <ellipse cx="20" cy="28" rx="5" ry="9" fill="#C8DEC9" opacity=".5" transform="rotate(30 20 28)"/>
                <ellipse cx="20" cy="28" rx="5" ry="9" fill="#7A9E7E" opacity=".6" transform="rotate(-60 20 28)"/>
                <ellipse cx="20" cy="28" rx="5" ry="9" fill="#7A9E7E" opacity=".6" transform="rotate(60 20 28)"/>
                <circle cx="20" cy="22" r="4" fill="#7A9E7E"/>
              </svg>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" style={{ fill: '#C9A84C' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            <p className="font-serif text-[1.2rem] font-light leading-relaxed italic mb-5" style={{ color: '#2C2C28' }}>
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="text-[12px] tracking-[.12em] uppercase" style={{ color: '#9E9E94' }}>
              — {t.authorName}
            </p>

            {/* Leaf watermark */}
            <svg className="absolute bottom-4 right-5 opacity-[.12]" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M8 40 Q24 4 44 8 Q40 28 8 40Z" fill="#7A9E7E"/>
              <line x1="8" y1="40" x2="44" y2="8" stroke="#5d8661" strokeWidth="1"/>
              <line x1="20" y1="22" x2="32" y2="16" stroke="#5d8661" strokeWidth=".7"/>
              <line x1="14" y1="32" x2="28" y2="24" stroke="#5d8661" strokeWidth=".7"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

{/* ── FAQ ──────────────────────────────────────────────────────── */}
{faqs.length > 0 && (
  <section className="relative overflow-hidden py-24 px-6" style={{ background: '#FDFCF9' }}>
    {/* Leaf background */}
    <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[.05]">
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
        <path d="M20 260 Q100 40 280 60 Q240 200 20 260Z" fill="#7A9E7E"/>
        <line x1="20" y1="260" x2="280" y2="60" stroke="#5d8661" strokeWidth="2"/>
        <line x1="80" y1="180" x2="180" y2="120" stroke="#5d8661" strokeWidth="1.2"/>
        <line x1="50" y1="220" x2="160" y2="150" stroke="#5d8661" strokeWidth="1.2"/>
        <line x1="110" y1="140" x2="200" y2="95" stroke="#5d8661" strokeWidth="1"/>
      </svg>
    </div>

    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[.25em] uppercase font-normal" style={{ color: '#7A9E7E' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 9c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3v2" strokeLinecap="round"/>
            <circle cx="12" cy="17" r=".5" fill="currentColor"/>
          </svg>
          Questions & clarity
        </span>
        <h2 className="mt-2 font-serif text-[2.8rem] font-light leading-tight" style={{ color: '#2C2C28' }}>
          Things people <em>wonder</em>
        </h2>
      </div>

      {/* Accordion */}
      <div>
        {faqs.map((f) => (
          <details key={f._id} className="group border-b" style={{ borderColor: 'rgba(0,0,0,.07)' }}>
            <summary className="flex justify-between items-center gap-4 py-5 cursor-pointer list-none font-normal text-[.97rem] leading-relaxed" style={{ color: '#2C2C28' }}>
              {f.question}
              {/* Plus/cross icon */}
              <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-open:bg-[#7A9E7E] group-open:border-[#7A9E7E]"
                style={{ border: '1px solid #C8DEC9' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" strokeLinecap="round"
                  className="transition-transform duration-300 group-open:rotate-45"
                  stroke="currentColor"
                  style={{ stroke: 'inherit' }}>
                  <line x1="7" y1="2" x2="7" y2="12"/>
                  <line x1="2" y1="7" x2="12" y2="7"/>
                </svg>
              </span>
            </summary>
            <div className="pb-5">
              <p className="text-[.93rem] leading-[1.75]" style={{ color: '#6B6B63' }}>
                <span className="inline-block w-4 h-px mr-2 align-middle" style={{ background: '#7A9E7E' }}/>
                {f.answer}
              </p>
            </div>
          </details>
        ))}
      </div>  

      {/* CTA */} 
      <div className="text-center mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-white text-[.85rem] tracking-[.12em] uppercase px-9 py-3.5 rounded-full transition-colors duration-200"
          style={{ background: '#7A9E7E' }}
        >
          Have more questions?
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </section>
)}  


    </>
  );
}
