import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Globe,
  Star,
  Leaf,
  Sparkles,
  Shield,
} from "lucide-react";
import { publicApi, therapistApi, serviceApi } from "@/lib/api";
import { buildMetadata, personJsonLd, faqJsonLd } from "@/lib/seo";
import Hero from "@/components/marketing/hero";
import AboutPractice from "@/components/marketing/About";
import Services from "@/components/marketing/Services";

export const metadata: Metadata = buildMetadata({
  title: "Srishti Roy — Counselling Psychologist",
  description:
    "Adlerian-informed integrative therapy. Healing through awareness, reflection, and self-understanding. Online & in-person sessions.",
  keywords: [
    "counselling psychologist",
    "online therapy India",
    "adlerian therapy",
    "anxiety therapy",
    "family counselling",
  ],
  path: "/",
});

export const revalidate = 3600;

async function getData() {
  const [testimonials, faqs, services] = await Promise.allSettled([
    publicApi.testimonials(),
    publicApi.faqs(),
    serviceApi.list(),
  ]);
  return {
    testimonials: testimonials.status === "fulfilled" ? testimonials.value : [],
    faqs: faqs.status === "fulfilled" ? faqs.value.slice(0, 5) : [],
    services: services.status === "fulfilled" ? services.value.slice(0, 6) : [],
  };
}

export default async function HomePage() {
  const { testimonials, faqs, services } = await getData();



  return (
    <>
      {/* JSON-LD FAQ */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}

      {/* ── HERO ── */}
      <Hero />

      {/* ── APPROACH STRIP ── */}
      <section className="bg-brand-lavender text-gray-900 py-5 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[
            "Adlerian-Informed",
            "Integrative Counselling",
            "Anxiety Support",
            "Relationship Therapy",
            "Emotional Regulation",
            "Family Dynamics",
            "Life Transitions",
            "Self-Understanding",
          ].flatMap((t) => [
            <span
              key={t + "1"}
              className="inline-block mx-8 text-dark-900 text-sm tracking-widest uppercase opacity-80"
            >
              {t}
            </span>,
            <span key={t + "dot"} className="inline-block text-gray-900 mx-2">
              ◆
            </span>,
          ])}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </section>

      {/* ── ABOUT TEASER ── */}
      <AboutPractice />

      {/* ── SERVICES ── */}
      <Services />


      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section
          className="relative overflow-hidden py-24 px-6"
          style={{ background: "#FDFCF9" }}
        >
          {/* Leaf background */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[.05]">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
              <path
                d="M20 260 Q100 40 280 60 Q240 200 20 260Z"
                fill="#7A9E7E"
              />
              <line
                x1="20"
                y1="260"
                x2="280"
                y2="60"
                stroke="#5d8661"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="180"
                x2="180"
                y2="120"
                stroke="#5d8661"
                strokeWidth="1.2"
              />
              <line
                x1="50"
                y1="220"
                x2="160"
                y2="150"
                stroke="#5d8661"
                strokeWidth="1.2"
              />
              <line
                x1="110"
                y1="140"
                x2="200"
                y2="95"
                stroke="#5d8661"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-14">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] tracking-[.25em] uppercase font-normal"
                style={{ color: "#7A9E7E" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    d="M9 9c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3v2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r=".5" fill="currentColor" />
                </svg>
                Questions & clarity
              </span>
              <h2
                className="mt-2 font-serif text-[2.8rem] font-light leading-tight"
                style={{ color: "#2C2C28" }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            {/* Accordion */}
            <div>
              {faqs.map((f) => (
                <details
                  key={f._id}
                  className="group border-b"
                  style={{ borderColor: "rgba(0,0,0,.07)" }}
                >
                  <summary
                    className="flex justify-between items-center gap-4 py-5 cursor-pointer list-none font-normal text-[.97rem] leading-relaxed"
                    style={{ color: "#2C2C28" }}
                  >
                    {f.question}
                    {/* Plus/cross icon */}
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-open:bg-[#7A9E7E] group-open:border-[#7A9E7E]"
                      style={{ border: "1px solid #C8DEC9" }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        strokeLinecap="round"
                        className="transition-transform duration-300 group-open:rotate-45"
                        stroke="currentColor"
                        style={{ stroke: "inherit" }}
                      >
                        <line x1="7" y1="2" x2="7" y2="12" />
                        <line x1="2" y1="7" x2="12" y2="7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pb-5">
                    <p
                      className="text-[.93rem] leading-[1.75]"
                      style={{ color: "#6B6B63" }}
                    >
                      <span
                        className="inline-block w-4 h-px mr-2 align-middle"
                        style={{ background: "#7A9E7E" }}
                      />
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
                style={{ background: "#7A9E7E" }}
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
