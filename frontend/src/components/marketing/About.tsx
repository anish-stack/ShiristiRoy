"use client"

import React, { useRef } from "react"
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
  CheckCircle2,
} from "lucide-react"

import therapyImage from "@/assets/therepy.png"
import pngImage from "@/assets/pngwing.com.png"

// ─── DATA ────────────────────────────────────────────────────────────────────

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
  { icon: Brain, label: "Cognitive Behavioural", tag: "CBT" },
  { icon: Heart, label: "Adlerian Therapy", tag: "Adlerian" },
  { icon: Wind, label: "Mindfulness-Based", tag: "MBSR" },
  { icon: Users, label: "Group Therapy", tag: "Group" },
  { icon: Smile, label: "Positive Psychology", tag: "PsyPos" },
  { icon: Leaf, label: "Integrative Approach", tag: "Integrative" },
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

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const AboutPractice = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])

  return (
    <>
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

          {/* ── TOP GRID: text + image ── */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              {/* eyebrow */}
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-[2px] bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#9B7AD9] font-bold">
                  About The Practice
                </span>
              </div>

              {/* heading */}
              <h2
                className="text-5xl sm:text-6xl leading-[1.05] text-[#2A2535] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                A sanctuary for{" "}
                <em className="text-[#9B7AD9] not-italic font-light">
                  awareness
                </em>
                {" "}&{" "}
                <em className="text-[#D9698A] not-italic font-light">
                  healing
                </em>
              </h2>

              {/* ornament */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CDB9F3] to-transparent" />
                <Leaf size={16} className="text-[#B89BEA]" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#CDB9F3] to-transparent" />
              </div>

              {/* body */}
              <div className="space-y-5 text-[#6B6578] text-[1.05rem] leading-relaxed max-w-lg">
                <p>
                  Srishti Roy is a registered Counselling Psychologist with over{" "}
                  <strong className="text-[#2A2535] font-medium">3 years of experience</strong>{" "}
                  working with individuals and groups across{" "}
                  <strong className="text-[#2A2535] font-medium">12+ nationalities</strong>, offering
                  culturally sensitive mental health support.
                </p>
                <p>
                  Drawing from Adlerian-informed and integrative therapeutic approaches, her practice
                  focuses on anxiety, self-esteem, emotional regulation, relationships, family
                  dynamics, and self-understanding.
                </p>
              </div>

              {/* quote */}
              <div className="relative mt-8 pl-6 border-l-2 border-[#CDB9F3]">
                <Quote size={18} className="absolute -top-1 -left-2 text-[#9B7AD9] fill-[#9B7AD9]" />
                <p
                  className="text-xl text-[#9B7AD9] font-light italic"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Healing begins with understanding.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/therapists/srishti-roy"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#9B7AD9] to-[#8E75CC] text-white px-8 py-4 rounded-full shadow-lg shadow-[#9B7AD9]/25 hover:shadow-[#9B7AD9]/40 hover:scale-105 transition-all duration-300 font-medium"
                >
                  Meet Srishti
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
              {/* blob bg */}
              <div className="absolute inset-0 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-gradient-to-br from-[#E8DDF9] via-[#F5EEF9] to-[#FFE8EF] z-0 scale-105" />

              {/* image frame */}
              <div className="relative z-10 w-full max-w-sm lg:max-w-full overflow-hidden rounded-[38px] border-2 border-[#CDB9F3]/60 shadow-2xl shadow-[#9B7AD9]/15 aspect-[3/4]">
                <Image
                  src={therapyImage}
                  alt="Srishti Roy – Counselling Psychologist"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2535]/20 via-transparent to-white/10" />
              </div>

              {/* floating pill – top left */}
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

              {/* floating stat – bottom right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -right-4 sm:-right-10 bg-gradient-to-br from-[#9B7AD9] to-[#8E75CC] rounded-3xl shadow-xl p-5 z-20 text-white"
              >
                <p className="text-3xl font-bold">3+</p>
                <p className="text-white/80 text-xs mt-1 font-medium">Years of<br />Experience</p>
              </motion.div>

              {/* deco ring */}
              <div className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full border border-[#CDB9F3]/30 z-0" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full border border-[#CDB9F3]/20 z-0" />
            </motion.div>
          </div>

          {/* ── STATS BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8DEFA] rounded-3xl overflow-hidden shadow-lg"
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-[#FAF7FF] transition-colors">
                <p
                  className="text-4xl font-bold text-[#9B7AD9] mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {s.value}
                </p>
                <p className="text-[#6B6578] text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── FEATURE CARDS ── */}
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#E8DEFA] rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-[#CDB9F3] transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3ECFF] to-[#E8DDF9] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} className="text-[#9B7AD9]" />
                  </div>
                  <span className="text-[0.8rem] font-semibold text-[#2A2535] text-center leading-tight">{t.label}</span>
                  <span className="text-[0.65rem] uppercase tracking-wider text-[#B89BEA] font-bold">{t.tag}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MISSION SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative bg-[#FAF8F5] py-28 overflow-hidden">
        {/* background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #9B7AD9 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E8DDF9]/30 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* LEFT – mission text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-[2px] bg-gradient-to-r from-[#D9698A] to-[#9B7AD9]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#D9698A] font-bold">
                  Our Mission
                </span>
              </div>

              <h2
                className="text-4xl sm:text-5xl text-[#2A2535] leading-[1.08] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Committed to making{" "}
                <span className="italic text-[#D9698A] font-light">mental wellness</span>
                {" "}accessible to all
              </h2>

              <p className="text-[#6B6578] text-[1.05rem] leading-relaxed mb-10 max-w-lg">
                Every person deserves a space where they feel heard, valued, and understood — regardless
                of background, culture, or language. This practice was built on that belief.
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

            {/* RIGHT – lady doctor image + overlays */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* background shape */}
              <div className="absolute inset-0 rounded-[50%_40%_60%_45%/45%_55%_45%_55%] bg-gradient-to-br from-[#FFE8EF] via-[#F3ECFF] to-[#E8DDF9] z-0 scale-105" />

              {/* main image */}
              <div className="relative z-10 overflow-hidden rounded-[38px] border-2 border-[#F5C0CF]/60 shadow-2xl shadow-[#D9698A]/10 aspect-[4/5] max-w-sm mx-auto lg:max-w-full">
                {/*
                  Replace src with your lady doctor image import.
                  e.g. import doctorImage from "@/assets/doctor.png"
                  and set src={doctorImage}
                */}
                <Image
                  src={therapyImage}
                  alt="Dr. Srishti Roy – Counselling Psychologist"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2535]/25 via-transparent to-white/5" />
              </div>

              {/* floating badge – specialization */}
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

              {/* floating badge – nationalities */}
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

              {/* deco circles */}
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full border border-[#D9698A]/20 z-0" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border border-[#D9698A]/15 z-0" />
            </motion.div>

          </div>
        </div>
      </section>

{/* ═══════════════════════════════════════════
    CALM CTA BANNER
═══════════════════════════════════════════ */}
<section className="relative overflow-hidden bg-gradient-to-br from-[#F6F1EA] via-[#EFE7DC] to-[#E7DDD1] mb-12 py-24">
  {/* Soft ambient glow */}
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
    {/* Icon */}
    <div className="w-16 h-16 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-lg flex items-center justify-center mx-auto mb-8">
      <Leaf
        size={28}
        className="text-[#8A9A8C]"
      />
    </div>

    {/* Heading */}
    <h2
      className="text-4xl sm:text-5xl md:text-6xl text-[#4B463F] font-light leading-[1.15] mb-6"
      style={{
        fontFamily:
          "'Cormorant Garamond', Georgia, serif",
      }}
    >
      Your journey toward healing
      <br />

      <span className="italic text-[#8D7A68]">
        starts with one gentle step.
      </span>
    </h2>

    {/* Description */}
    <p className="text-[#6E665D] text-lg md:text-xl leading-9 max-w-2xl mx-auto mb-10 font-light">
      Book a free 15-minute
      discovery call and explore a
      safe, compassionate space
      designed for your emotional
      well-being and personal
      growth.
    </p>

    {/* CTA */}
    <Link
      href="/book"
      className="group inline-flex items-center gap-3 bg-[#8D7A68] text-white font-medium px-10 py-4 rounded-full shadow-[0_10px_40px_rgba(141,122,104,0.18)] hover:bg-[#7A6858] hover:scale-[1.03] transition-all duration-300"
    >
      Begin Your Journey

      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform duration-300"
      />
    </Link>
  </motion.div>
</section>
    </>
  )
}

export default AboutPractice