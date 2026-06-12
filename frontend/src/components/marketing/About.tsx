"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Heart,
  Globe,
  Sparkles,
  Shield,
  Leaf,
  Quote,
  Brain,
  Users,
  Smile,
  Wind,
  Star,
  Scale,
  Compass,
  Focus,
  TrendingUp,
  Layers3,
  CheckCircle2,
} from "lucide-react"

import therapyImage from "@/assets/therepy.png"
import therpiest from "@/assets/image_11zon.jpg"
import pngImage from "@/assets/pngwing.com.png"
import { therapistApi } from "@/lib/api"
import TherapistCard from "./TherapistCard"

const features = [
  {
    icon: Heart,
    title: "Compassionate Care",
    desc: "A warm, non-judgmental space where you can safely explore your thoughts and emotions.",
    color: "#F9D0D8",
    accent: "#D9698A",
  },
  {
    icon: Globe,
    title: "Culturally Sensitive",
    desc: "Therapy that respects your identity, experiences, and personal background.",
    color: "#D0E8F9",
    accent: "#6A9FCC",
  },
  {
    icon: Sparkles,
    title: "Insight-Oriented",
    desc: "Helping you recognize patterns and move toward meaningful transformation.",
    color: "#E8D0F9",
    accent: "#9B7AD9",
  },
  {
    icon: Shield,
    title: "Safe Reflective Space",
    desc: "Confidential, calm, and supportive sessions tailored to your emotional pace.",
    color: "#D0F4E8",
    accent: "#4BAF8C",
  },
]

const therapies = [
  { icon: Scale, label: "Cognitive Behavioural", tag: "CBT", route: "/therapy/cognitive-behavioural" },
  { icon: Compass, label: "Adlerian Therapy", tag: "Adlerian", route: "/therapy/adlerian-therapy" },
  { icon: Focus, label: "Mindfulness-Based", tag: "MBSR", route: "/therapy/mindfulness-based" },
  { icon: Users, label: "Group Therapy", tag: "Group", route: "/therapy/group-therapy" },
  { icon: TrendingUp, label: "Positive Psychology", tag: "PsyPos", route: "/therapy/positive-psychology" },
  { icon: Layers3, label: "Integrative Approach", tag: "Integrative", route: "/therapy/integrative-approach" },
]

const missionPoints = [
  "Creating access to affirming, culturally-informed mental health care",
  "Empowering individuals to understand their inner world with clarity",
  "Building bridges across identity, language, and lived experience",
  "Grounding healing in evidence-based, compassionate practice",
]

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "12+", label: "Nationalities Served" },
  { value: "200+", label: "Sessions Held" },
  { value: "98%", label: "Client Satisfaction" },
]

const credentials = [
  "MSc Clinical Psychology · Adler Graduate Professional School",
  "BSc Hons Biology & Psychology · University of Toronto",
  "Registered Psychotherapist · Ontario",
  "Counselling in English, Hindi, Bengali & Urdu",
]

const AboutPractice = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])


  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO ROW
      ═══════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8">

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#C8D8E8]/50 via-[#E8D5C4]/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-20 h-72 w-72 rounded-full bg-[#D4E8D4]/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-[#EAD8F0]/40 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">

          {/* ── LEFT: all content ── */}
          <div className="flex flex-col gap-8">


            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2
                className="text-6xl font-bold leading-[1.05] tracking-tight text-[#3C4D5C] lg:text-[5rem]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Meet
              </h2>
              <h2
                className="text-6xl font-bold leading-[1.02] tracking-tight lg:text-[5rem]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  background: "linear-gradient(135deg, rgba(169, 125, 125, 0.58) 0%, #4B7A8C 60%, #7DA98D 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                Srishti Roy
              </h2>
              <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#7DA98D]/70">
                Counselling Psychologist · MSc Clinical Psychology
              </p>
            </div>

            {/* Accent */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-[#7DA98D] to-transparent" />
              <div className="flex gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#7DA98D]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#4B7A8C]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#7DA98D]" />
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-[#4B7A8C] to-transparent" />
            </div>

            {/* Bio card */}
            <div className="relative rounded-3xl border border-white/80 bg-white/60 px-7 py-7 shadow-xl shadow-[#3C4D5C]/8 backdrop-blur-md">
              <div className="absolute -left-3 -top-3 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-[#7DA98D]/50" />
              <div className="absolute -bottom-3 -right-3 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-[#4B7A8C]/40" />
              <div
                className="absolute -top-4 left-6 text-6xl leading-none text-[#7DA98D]/15 select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                "
              </div>
              <p className="relative text-[0.97rem] leading-[1.95] text-[#5A6472]">
                Srishti Roy is a{" "}
                <span className="font-semibold text-[#3C4D5C]">Canadian-trained Counselling Psychologist</span>{" "}
                and mental health professional with over{" "}
                <span className="font-semibold text-[#7DA98D]">3 years and 3,000+ hours</span>{" "}
                of clinical experience supporting individuals, students, athletes, families, and culturally diverse populations across Canada and internationally. Her work is grounded in{" "}
                <span className="font-semibold text-[#3C4D5C]">evidence-based practice</span>, cultural sensitivity, and a deep commitment to helping individuals build resilience, self-awareness, and lasting emotional well-being.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: "3+", label: "Years Exp." },
                { value: "3,000+", label: "Clin. Hours" },
                { value: "12+", label: "Nationalities" },
                { value: "4", label: "Languages" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/70 py-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7DA98D]/5 to-[#4B7A8C]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p
                    className="relative text-2xl font-bold"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      background: "linear-gradient(135deg, #7DA98D, #4B7A8C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="relative mt-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[#9CA3AF]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {credentials.map((label) => (
                <div
                  key={label}
                  className="group flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7DA98D]/40 hover:shadow-md"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7DA98D]/20 to-[#4B7A8C]/15 text-[10px] text-[#7DA98D] transition-transform duration-300 group-hover:scale-110">
                    ✦
                  </span>
                  <span className="text-sm font-medium text-[#5A6472] leading-snug">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/book"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#8D7A68] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8D7A68]/30 transition-all duration-300 hover:scale-105 hover:bg-[#7A6858] hover:shadow-xl hover:shadow-[#8D7A68]/35"
              >
                Book a Free Consultation
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/therapists/srishti-roy"
                className="group inline-flex items-center gap-2.5 rounded-full border border-[#7DA98D]/50 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#4B7A8C] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md"
              >
                Learn More
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT: TherapistCard ── */}
          <div className="relative">
            {/* Corner accents */}
            <div className="absolute -left-4 -top-4 z-10 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-[#7DA98D]/40" />
            <div className="absolute -bottom-4 -right-4 z-10 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-[#4B7A8C]/30" />

            {/* Glow behind card */}
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-[#7DA98D]/15 to-[#4B7A8C]/10 blur-2xl" />

            {/* Card */}
            <div className="relative rounded-3xl  p-1 overflow-hidden aspect-[3/4]">
              <Image
                src={therpiest}
                alt="Srishti Roy – Counselling Psychologist"
                fill
                className="object-cover  rounded-3xl"
                priority
              />
              {/* soft gradient overlay bottom */}
            
            </div>

            {/* Floating quote bubble */}
            <div className="absolute -bottom-6 -right-6 z-20 max-w-[200px] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-sm">
              <p className="text-[0.7rem] leading-relaxed text-[#6B7280] italic">
                "Healing is not linear — and that's perfectly okay."
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[#7DA98D]/40 to-transparent" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#7DA98D]">Srishti Roy</span>
              </div>
            </div>

            {/* Floating stat top-left */}
            <div className="absolute -left-6 top-10 z-20 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-sm">
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  background: "linear-gradient(135deg, #7DA98D, #4B7A8C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                3,000+
              </p>
              <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#9CA3AF]">Clinical Hours</p>
            </div>
          </div>
        </div>

        <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
    @keyframes shimmer {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
  `}</style>
      </div>
      {/* ═══════════════════════════════════════════
          ABOUT SECTION
      ═══════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-[#FAF8F5] py-28 lg:py-36"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Ambient blobs */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#C9B5F5]/15 blur-[160px]" />
          <div className="absolute bottom-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-[#DDE8F8]/25 blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#F9D0D8]/10 blur-[120px]" />
        </motion.div>

        {/* Decorative leaves – bottom left */}
        <motion.div
          className="absolute -bottom-20 -left-24 opacity-70 pointer-events-none z-0"
          animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={pngImage} alt="" width={440} height={440} className="object-contain" />
        </motion.div>

        {/* Decorative leaves – top right */}
        <motion.div
          className="absolute -top-10 -right-10 opacity-60 pointer-events-none z-0 rotate-180"
          animate={{ y: [0, -10, 0], rotate: [180, 183, 180] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={pngImage} alt="" width={280} height={280} className="object-contain" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TOP GRID: text + image */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#9B7AD9] font-bold">
                  Meet Your Therapist
                </span>
              </div>

              <h2
                className="text-5xl sm:text-6xl leading-[1.05] text-[#2A2535] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Evidence-Based Therapy Rooted in{" "}
                <em className="text-[#9B7AD9] not-italic font-light">
                  Compassion
                </em>
                {" "}& {" "}
                <em className="text-[#D9698A] not-italic font-light">
                  Cultural Understanding
                </em>
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CDB9F3] to-transparent" />
                <Leaf size={16} className="text-[#B89BEA]" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CDB9F3] to-transparent" />
              </div>

              <div className="space-y-5 text-[#6B6578] text-[1.05rem] leading-relaxed max-w-lg">
                <p>
                  Srishti Roy is a registered Counselling Psychologist with over{" "}
                  <strong className="text-[#2A2535] font-medium">3 years and 3,000+ hours</strong>{" "}
                  of clinical experience working with individuals, students, athletes, families, and culturally diverse populations across{" "}
                  <strong className="text-[#2A2535] font-medium">12+ nationalities</strong>.
                </p>
                <p>
                  Drawing from Adlerian-informed and integrative therapeutic approaches, her practice focuses on anxiety, trauma, emotional regulation, life transitions, relationship concerns, and identity development — grounded in evidence-based, culturally sensitive care.
                </p>
              </div>

              <div className="relative mt-8 pl-6 border-l-2 border-[#CDB9F3]">
                <Quote size={18} className="absolute -top-1 -left-2 text-[#9B7AD9] fill-[#9B7AD9]" />
                <p
                  className="text-xl text-[#9B7AD9] font-light italic"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Healing begins with understanding.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/therapists/srishti-roy"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#9B7AD9] to-[#8E75CC] text-white px-8 py-4 rounded-full shadow-lg shadow-[#9B7AD9]/25 hover:shadow-[#9B7AD9]/40 hover:scale-105 transition-all duration-300 font-medium"
                >
                  Meet Your Therapist
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/book"
                  className="group inline-flex items-center gap-3 border border-[#CDB9F3] text-[#9B7AD9] bg-white/60 backdrop-blur-sm px-8 py-4 rounded-full hover:bg-[#F3ECFF] hover:scale-105 transition-all duration-300 font-medium"
                >
                  Book a Session
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT – image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-gradient-to-br from-[#E8DDF9] via-[#F5EEF9] to-[#FFE8EF] z-0 scale-105" />

              <div className="relative z-10 w-full max-w-sm lg:max-w-full overflow-hidden rounded-[38px] border-2 border-[#CDB9F3]/60 shadow-2xl shadow-[#9B7AD9]/15 aspect-[3/4]">
                <Image
                  src={therapyImage}
                  alt="Srishti Roy – Counselling Psychologist"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2535]/20 via-transparent to-white/10" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute top-8 -left-6 sm:-left-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-5 z-20 max-w-[160px]"
              >
                <div className="w-11 h-11 rounded-full bg-[#F3ECFF] flex items-center justify-center mb-3">
                  <Leaf size={22} className="text-[#9B7AD9]" />
                </div>
                <p className="text-[#2A2535] text-sm font-semibold leading-relaxed">Compassion · Empathy · Growth</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -right-4 sm:-right-10 bg-gradient-to-br from-[#9B7AD9] to-[#8E75CC] rounded-3xl shadow-xl p-5 z-20 text-white"
              >
                <p className="text-3xl font-bold">3,000+</p>
                <p className="text-white/80 text-xs mt-1 font-medium">Clinical Hours<br />of Experience</p>
              </motion.div>

              <div className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full border border-[#CDB9F3]/30 z-0" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full border border-[#CDB9F3]/20 z-0" />
            </motion.div>
          </div>

          {/* FEATURE CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-400 cursor-default"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: item.color }}
                  >
                    <Icon size={26} style={{ color: item.accent }} />
                  </div>
                  <h3 className="text-[1.05rem] font-semibold text-[#2A2535] mb-2">{item.title}</h3>
                  <p className="text-[#6B6578] text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THERAPIES SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#F3ECFF] to-[#FAF8F5] py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#DDE8F8]/40 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-[#F9D0D8]/30 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
              <span className="text-xs tracking-[0.25em] uppercase text-[#9B7AD9] font-bold">
                Therapeutic Modalities
              </span>
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#D9698A] to-[#9B7AD9]" />
            </div>
            <h2
              className="text-4xl sm:text-5xl text-[#2A2535] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Approaches tailored{" "}
              <span className="italic text-[#9B7AD9] font-light">for you</span>
            </h2>
            <p className="mt-4 text-[#6B6578] max-w-lg mx-auto leading-relaxed">
              Integrating multiple evidence-based methods to best support your unique healing journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {therapies.map((t, i) => {
              const Icon = t.icon
              return (
                <Link href={t.route} className="block cursor-pointer" key={t.route}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    className="group flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#E8DEFA] rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-[#CDB9F3] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3ECFF] to-[#E8DDF9] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon size={22} className="text-[#9B7AD9]" />
                    </div>
                    <span className="text-[0.8rem] font-semibold text-[#2A2535] text-center leading-tight">{t.label}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#B89BEA] font-bold">{t.tag}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MISSION / TRUST SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FAF8F5] py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(circle, #9B7AD9 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E8DDF9]/30 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-[2px] bg-gradient-to-r from-[#D9698A] to-[#9B7AD9]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#D9698A] font-bold">
                  Trust & Commitment
                </span>
              </div>

              <h2
                className="text-4xl sm:text-5xl text-[#2A2535] leading-[1.08] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Why Clients{" "}
                <span className="italic text-[#D9698A] font-light">Trust</span>
                {" "}Srishti Roy
              </h2>

              <p className="text-[#6B6578] text-[1.05rem] leading-relaxed mb-10 max-w-lg">
                With 3,000+ clinical hours across 12+ nationalities, Srishti brings deep expertise in trauma-informed care, cultural sensitivity, and evidence-based therapy — delivering real, lasting change for individuals, students, and athletes.
              </p>

              <div className="space-y-4">
                {missionPoints.map((pt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#9B7AD9] to-[#D9698A] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <CheckCircle2 size={14} className="text-white fill-white" />
                    </div>
                    <p className="text-[#4A4558] leading-relaxed">{pt}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 p-7 bg-gradient-to-br from-[#9B7AD9]/8 to-[#D9698A]/8 border border-[#E8DEFA] rounded-3xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#E8AA5C] fill-[#E8AA5C]" />
                  ))}
                </div>
                <p
                  className="text-lg text-[#4A4558] italic leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  "Srishti's gentle, culturally-aware approach helped me feel understood for the first time in years. She creates a space that feels both safe and deeply affirming."
                </p>
                <p className="mt-3 text-sm font-semibold text-[#9B7AD9]">— Anonymous Client</p>
              </motion.div>
            </motion.div>

            {/* RIGHT – image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[50%_40%_60%_45%/45%_55%_45%_55%] bg-gradient-to-br from-[#FFE8EF] via-[#F3ECFF] to-[#E8DDF9] z-0 scale-105" />

              <div className="relative z-10 overflow-hidden rounded-[38px] border-2 border-[#F5C0CF]/60 shadow-2xl shadow-[#D9698A]/10 aspect-[4/5] max-w-sm mx-auto lg:max-w-full">
                <Image
                  src={therapyImage}
                  alt="Srishti Roy – Counselling Psychologist"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2535]/25 via-transparent to-white/5" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute top-10 -right-4 sm:-right-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-5 z-20 max-w-[180px]"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE8EF] to-[#F5C0CF] flex items-center justify-center mb-3">
                  <Heart size={18} className="text-[#D9698A]" />
                </div>
                <p className="text-[#2A2535] text-xs font-bold">Registered</p>
                <p className="text-[#2A2535] text-xs font-bold">Counselling</p>
                <p className="text-[#2A2535] text-xs font-bold">Psychologist</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute bottom-14 -left-4 sm:-left-12 bg-gradient-to-br from-[#9B7AD9] to-[#8E75CC] rounded-3xl shadow-xl p-5 z-20 text-white"
              >
                <p className="text-3xl font-bold">12+</p>
                <p className="text-white/80 text-xs mt-1 font-medium">Nationalities<br />Supported</p>
              </motion.div>

              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full border border-[#D9698A]/20 z-0" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-[#D9698A]/15 z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F6F1EA] via-[#EFE7DC] to-[#E7DDD1] mb-12 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#D8C7B5]/30 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#CBB8D7]/25 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-lg flex items-center justify-center mx-auto mb-8">
            <Leaf size={28} className="text-[#8A9A8C]" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-[#4B463F] font-light leading-[1.15] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Ready to Work with a Registered
            <br />
            <span className="italic text-[#8D7A68]">
              Counselling Psychologist?
            </span>
          </h2>

          <p className="text-[#6E665D] text-lg md:text-xl leading-9 max-w-2xl mx-auto mb-10 font-light">
            Book a free 15-minute discovery call with Srishti Roy — Canadian-trained, Ontario-registered, and experienced across anxiety, trauma, life transitions, and relationship concerns. Sessions available in English, Hindi, Bengali & Urdu.
          </p>

          <Link
            href="/book"
            className="group inline-flex items-center gap-3 bg-[#8D7A68] text-white font-medium px-10 py-4 rounded-full shadow-[0_10px_40px_rgba(141,122,104,0.18)] hover:bg-[#7A6858] hover:scale-[1.03] transition-all duration-300"
          >
            Begin Your Journey
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    </>
  )
}

export default AboutPractice