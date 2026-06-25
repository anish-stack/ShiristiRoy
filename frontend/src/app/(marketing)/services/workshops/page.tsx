"use client";
import React from "react";
import Image from "next/image";
import img from '@/assets/speech.jpg'

const areasOfFocus = [
  "Emotional Resilience & Stress Management",
  "Self-Worth & Confidence Building",
  "Identity Development & Personal Growth",
  "Career Clarity & Decision-Making",
  "Communication & Assertiveness",
  "Relationships & Belonging",
  "Emotional Regulation & Anger Management",
  "Leadership & Interpersonal Effectiveness",
  "Student & Employee Wellbeing",
];

const formats = [
  {
    tag: "Format 01",
    name: "Keynote Workshops",
    duration: "60–90 minutes",
    desc: "Designed for large groups, conferences, wellness weeks, orientation programs, and special events.",
  },
  {
    tag: "Format 02",
    name: "Interactive Skills Workshops",
    duration: "2–3 hours",
    desc: "Includes psychoeducation, experiential exercises, guided reflection, discussion, and practical skill-building.",
  },
  {
    tag: "Format 03",
    name: "Multi-Session Development Series",
    duration: "4–8 sessions",
    desc: "A deeper learning experience that allows participants to build insight, practice new skills, and create sustainable change over time.",
  },
];

const customizedFor = [
  "Universities and Colleges",
  "Student Affairs Departments",
  "International Student Programs",
  "Corporate Wellness Initiatives",
  "Leadership Development Programs",
  "Healthcare Organizations",
  "High-Performance Teams and Athletes",
];

const availableFor = [
  { icon: "🎤", label: "Workshops" },
  { icon: "🗣️", label: "Speaking Engagements" },
  { icon: "🏢", label: "Corporate Training" },
  { icon: "🎓", label: "University Programming" },
  { icon: "👥", label: "Group Facilitation" },
  { icon: "💬", label: "Individual Counselling and Coaching" },
];

export default function InnerCompassPage() {
  return (
    <section className="bg-[#F8F5F2]">
      <main
        className="bg-[#F8F5F2] font-[Inter,sans-serif] max-w-[1200px] mx-auto px-6 pb-16 text-[#1a1a1a]"
      >
        {/* ── Hero ── */}
        <section className="py-20 pb-16 border-b border-[#e8e4de] flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#5a8a72] font-medium mb-5">
              Workshop Program
            </p>
            <h1
              className="font-[Playfair_Display,Georgia,serif] text-[clamp(2.2rem,5vw,3.4rem)] font-normal leading-[1.18] mb-5"
            >
              The{" "}
              <em className="italic text-[#5a8a72]">Inner Compass</em> Series
            </h1>
            <p className="text-[1.12rem] font-medium mb-5 text-[#1a1a1a]">
              Psychological Skills for Growth, Resilience &amp; Meaningful Living
            </p>
            <p className="text-base leading-[1.8] text-[#5a5a5a] mb-4">
              The Inner Compass Series is a structured workshop program designed
              for university students, young professionals, and workplace teams
              navigating the challenges of modern life. Grounded in Adlerian
              Psychology and informed by evidence-based approaches including CBT,
              ACT, DBT, Emotionally Focused Therapy (EFT), and Internal Family
              Systems (IFS), these workshops combine psychological insight with
              practical skills that participants can immediately apply in their
              daily lives.
            </p>
            <p className="text-base leading-[1.8] text-[#5a5a5a] mb-4">
              Developed through extensive clinical experience working with
              students, international populations, athletes, and early-career
              professionals, the program addresses the real challenges facing
              today&apos;s emerging adults and professionals: stress,
              perfectionism, identity confusion, loneliness, difficulties with
              emotional regulation, communication challenges, and career
              uncertainty.
            </p>
            <p className="text-base leading-[1.8] text-[#5a5a5a]">
              Rather than focusing solely on symptom reduction, The Inner Compass
              Series helps participants develop self-awareness, resilience,
              purpose, emotional intelligence, and healthier relationships with
              themselves and others.
            </p>
          </div>

          {/* Right: image */}
          <div className="flex-shrink-0 w-full lg:w-[420px]">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src={img}
                alt="Inner Compass workshop session"
                fill
                className="object-cover"
                priority
              />
              {/* subtle overlay badge */}
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#5a8a72] font-medium mb-0.5">
                  Evidence-Based
                </p>
                <p className="text-sm font-medium text-[#1a1a1a]">
                  CBT · ACT · DBT · EFT · IFS
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Areas of Focus ── */}
        <section className="py-14 border-b border-[#e8e4de]">
          <p className="text-[11px] tracking-[0.13em] uppercase text-[#5a8a72] font-medium mb-7">
            What we cover
          </p>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.7rem] font-normal mb-5 text-[#1a1a1a]">
            Areas of Focus
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 mt-7">
            {areasOfFocus.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2.5 px-[18px] py-3.5 border border-[#e8e4de] rounded-xl bg-white text-[0.92rem] text-[#1a1a1a]"
              >
                <span className="w-2 h-2 rounded-full bg-[#5a8a72] flex-shrink-0" />
                {area}
              </div>
            ))}
          </div>
        </section>

        {/* ── Delivery Formats ── */}
        <section className="py-14 border-b border-[#e8e4de]">
          <p className="text-[11px] tracking-[0.13em] uppercase text-[#5a8a72] font-medium mb-7">
            How we deliver
          </p>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.7rem] font-normal mb-5 text-[#1a1a1a]">
            Delivery Formats
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mt-7">
            {formats.map((f) => (
              <div
                key={f.tag}
                className="p-6 border border-[#e8e4de] border-l-[3px] border-l-[#5a8a72] rounded-r-xl bg-white"
              >
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#5a8a72] font-medium mb-3">
                  {f.tag}
                </p>
                <p className="font-[Playfair_Display,Georgia,serif] text-[1.15rem] font-normal mb-1.5 text-[#1a1a1a]">
                  {f.name}
                </p>
                <p className="text-[0.82rem] text-[#8a8a8a] mb-3.5 font-light">
                  {f.duration}
                </p>
                <p className="text-[0.88rem] leading-[1.65] text-[#5a5a5a]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Customized Programs ── */}
        <section className="py-14 border-b border-[#e8e4de]">
          <p className="text-[11px] tracking-[0.13em] uppercase text-[#5a8a72] font-medium mb-7">
            Tailored to your context
          </p>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.7rem] font-normal mb-5 text-[#1a1a1a]">
            Customized Programs
          </h2>
          <p className="text-base leading-[1.8] text-[#5a5a5a] max-w-[680px]">
            Workshops can be adapted for:
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5 mt-6">
            {customizedFor.map((item) => (
              <div
                key={item}
                className="px-4 py-3 border border-[#e8e4de] rounded-lg text-[0.88rem] text-[#5a5a5a] bg-[#f7f5f2]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ── Available For ── */}
        <section className="py-14 border-b border-[#e8e4de]">
          <p className="text-[11px] tracking-[0.13em] uppercase text-[#5a8a72] font-medium mb-7">
            Services
          </p>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.7rem] font-normal mb-5 text-[#1a1a1a]">
            Available for
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5 mt-6">
            {availableFor.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3.5 py-3 border border-[#e8e4de] rounded-lg text-[0.88rem] text-[#5a5a5a] bg-white"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* ── Closing Quote ── */}
        <div className="pt-16 text-center">
          <p className="font-[Playfair_Display,Georgia,serif] text-[1.45rem] font-normal italic leading-[1.55] text-[#1a1a1a] max-w-[580px] mx-auto">
            &ldquo;Helping individuals move from self-doubt and disconnection
            toward purpose, resilience, and meaningful connection.&rdquo;
          </p>
          <div className="w-10 h-0.5 bg-[#5a8a72] mx-auto mt-6" />
        </div>
      </main>
    </section>
  );
}