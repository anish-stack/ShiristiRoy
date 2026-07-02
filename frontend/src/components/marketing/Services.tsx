"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Globe,
  Sparkles,
  Laptop,
  Leaf,
  Shield,
  Flower2,
  Brain,
  RefreshCw,
} from "lucide-react";

import { serviceApi } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";

// ─── Static fallback data (mirrors the screenshot) ───────────────────────────
const FALLBACK_SERVICES = [
  {
    _id: "1",
    slug: "individual-counselling",
    category: "individual",
    name: "Individual Counselling",
    shortDesc:
      "One-on-one therapy for emotional well-being, self-awareness, and growth.",
    modes: ["in_person"],
    price: { amount: 2500 },
    durationMin: 50,
    coverImage: {
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    },
  },
  {
    _id: "2",
    slug: "family-therapy",
    category: "family",
    name: "Family Therapy",
    shortDesc:
      "Strengthen communication, resolve conflicts, and support healthier family dynamics.",
    modes: ["in_person", "online"],
    price: { amount: 3500 },
    durationMin: 75,
    coverImage: {
      url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
    },
  },
  {
    _id: "3",
    slug: "online-therapy-sessions",
    category: "online",
    name: "Online Therapy Sessions",
    shortDesc:
      "Secure video counselling from the comfort and privacy of your own space.",
    modes: ["online"],
    price: { amount: 2500 },
    durationMin: 50,
    coverImage: {
      url: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&q=80",
    },
  },
  {
    _id: "4",
    slug: "adlerian-integrative-therapy",
    category: "integrative",
    name: "Adlerian-Informed & Integrative Therapy",
    shortDesc:
      "Reflective, insight-oriented therapy drawing from Adlerian psychology.",
    modes: ["in_person"],
    price: { amount: 2500 },
    durationMin: 50,
    coverImage: {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
    },
  },
  {
    _id: "5",
    slug: "emotional-regulation",
    category: "emotional",
    name: "Emotional Regulation & Self-Understanding",
    shortDesc: "Build resilience, self-compassion, and healthier coping.",
    modes: ["in_person", "online"],
    price: { amount: 2500 },
    durationMin: 50,
    coverImage: {
      url: "https://images.unsplash.com/photo-1602524205975-7a3c3f6cc4fe?w=600&q=80",
    },
  },
  {
    _id: "6",
    slug: "young-adult-student-support",
    category: "youth",
    name: "Young Adult & Student Support",
    shortDesc:
      "Support for academic stress, identity, loneliness, burnout, and life transitions.",
    modes: ["online"],
    price: { amount: 2000 },
    durationMin: 50,
    coverImage: {
      url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    },
  },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  individual: Flower2,
  family: Leaf,
  online: Laptop,
  integrative: RefreshCw,
  emotional: Brain,
  youth: Heart,
};

// ─── Animation variants ───────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const Services = () => {
  const [services, setServices] = useState<any[]>(FALLBACK_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.list();
        if (res?.length) setServices(res);
      } catch (err) {
        // keep fallback
      }
    };
    fetchServices();
  }, []);

  return (
    <section
      className="relative overflow-hidden py-8 lg:py-12"
      style={{ background: "#F8F5F1" }}
    >
      {/* ── Radial gradient atmosphere ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(210,190,245,0.22) 0%, transparent 60%)",
        }}
      />

      {/* ── Ambient colour blobs ── */}
      <div
        className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "rgba(217,198,255,0.18)",
          filter: "blur(130px)",
          transform: "translate(-20%, -20%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "rgba(220,232,248,0.28)",
          filter: "blur(130px)",
          transform: "translate(20%, 20%)",
        }}
      />

      {/* ── Floating leaf — bottom-left ── */}
      <motion.div
        className="absolute -bottom-16 -left-16 pointer-events-none select-none"
        style={{ opacity: 0.65, zIndex: 0 }}
        animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* SVG leaf cluster – bottom-left */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.85">
            {/* stem */}
            <path
              d="M60 280 Q100 220 160 140 Q200 80 230 40"
              stroke="#7A9A60"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* leaves */}
            {[
              "M160 140 Q120 100 80 120 Q110 160 160 140Z",
              "M160 140 Q195 105 220 130 Q195 165 160 140Z",
              "M120 185 Q80 148 55 170 Q80 205 120 185Z",
              "M120 185 Q155 152 175 175 Q155 208 120 185Z",
              "M90 230 Q55 198 35 218 Q55 248 90 230Z",
              "M90 230 Q122 200 140 220 Q122 248 90 230Z",
              "M195 95 Q165 62 150 82 Q170 108 195 95Z",
              "M195 95 Q222 68 232 90 Q215 112 195 95Z",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill={i % 2 === 0 ? "#8FAF6A" : "#A8C278"}
                opacity={0.9 - i * 0.05}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* ── Floating leaf — top-right ── */}
      <motion.div
        className="absolute -top-8 -right-8 pointer-events-none select-none"
        style={{ opacity: 0.55, zIndex: 0 }}
        animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.9">
            <path
              d="M180 20 Q140 80 100 140 Q70 190 60 220"
              stroke="#7A9A60"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {[
              "M100 140 Q130 105 155 122 Q132 155 100 140Z",
              "M100 140 Q68 108 48 128 Q68 158 100 140Z",
              "M130 100 Q155 68 172 85 Q155 112 130 100Z",
              "M130 100 Q104 72 90 90 Q104 114 130 100Z",
              "M155 55 Q172 30 185 45 Q172 65 155 55Z",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill={i % 2 === 0 ? "#B8CC90" : "#A0B878"}
                opacity={0.88}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <p
            className="text-xs uppercase tracking-[0.35em] font-semibold mb-4"
            style={{ color: "#8E75CC" }}
          >
            What I Offer
          </p>

          <h2
            className="font-serif leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 4rem)",
              color: "#2F2A35",
              letterSpacing: "-0.01em",
            }}
          >
            Therapy services
          </h2>

          <p
            className="mt-4 text-base"
            style={{ color: "#8D8592", fontFamily: "'Lato', sans-serif" }}
          >
            Compassionate support tailored to your unique journey.
          </p>

          {/* decorative divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-16 h-px" style={{ background: "#DDD2CF" }} />
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2C11 2 7 6 7 11C7 16 11 20 11 20C11 20 15 16 15 11C15 6 11 2 11 2Z"
                stroke="#B89BEA"
                strokeWidth="1.4"
                fill="none"
              />
              <path d="M11 2L11 20" stroke="#B89BEA" strokeWidth="1.2" />
              <path
                d="M7 11 Q9 8 11 11 Q13 14 15 11"
                stroke="#B89BEA"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
            <div className="w-16 h-px" style={{ background: "#DDD2CF" }} />
          </div>
        </motion.div>

        {/* ── Grid ── */}
        {/*
          Responsive:
            mobile  → 2 columns  (grid-cols-2)
            md      → 2 columns  (grid-cols-2)
            xl      → 3 columns  (grid-cols-3)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service?.category] || Shield;

            return (
              <motion.div
                key={service?._id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.35, ease: "easeOut" },
                }}
                className="group relative overflow-hidden"
                style={{
                  borderRadius: "28px",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,0.65)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 24px 60px rgba(155,122,217,0.16)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px rgba(0,0,0,0.04)";
                }}
              >
                {/* hover glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(247,241,255,0.55) 0%, transparent 60%)",
                    borderRadius: "28px",
                  }}
                />

                {/* ── Split layout: LEFT text, RIGHT image ── */}
                <div
                  className="relative z-10 flex"
                  style={{ minHeight: "220px" }}
                >
                  {/* LEFT: all text content */}
                  <div className="flex flex-col p-5 flex-1 min-w-0">
                    {/* Icon circle */}
                    <div
                      className="flex items-center justify-center mb-4 self-start"
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        background: "#F5F0FF",
                        border: "1px solid #EDE5FA",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color="#9B7AD9" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3
                      className="font-serif leading-snug mb-2"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                        color: "#2F2A35",
                      }}
                    >
                      {service?.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="leading-relaxed mb-4 flex-1"
                      style={{
                        fontSize: "clamp(0.7rem, 1.2vw, 0.8rem)",
                        color: "#6D6672",
                        fontFamily: "'Lato', sans-serif",
                        lineHeight: 1.65,
                      }}
                    >
                      {service?.shortDesc}
                    </p>

                    {/* Price row + arrow */}
                    <div
                      className="flex items-center justify-between pt-3 mt-auto"
                      style={{ borderTop: "1px solid #EFE8E3" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          style={{
                            fontSize: "clamp(0.88rem, 1.5vw, 1rem)",
                            fontWeight: 700,
                            color: "#2F2A35",
                            fontFamily: "'Lato', sans-serif",
                          }}
                        >
                          ₹{service?.price?.amount?.toLocaleString()}
                        </span>
                        <span style={{ color: "#C8BED4", fontSize: "0.75rem" }}>
                          ·
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#8D8592",
                            fontFamily: "'Lato', sans-serif",
                          }}
                        >
                          {service?.durationMin} min
                        </span>
                      </div>

                      <Link
                        href={`/services/${service?.slug}`}
                        className="flex items-center justify-center transition-all duration-300"
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "#F7F1FF",
                          border: "1px solid #E7DBFA",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "#9B7AD9";
                          el.style.borderColor = "#9B7AD9";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "#F7F1FF";
                          el.style.borderColor = "#E7DBFA";
                        }}
                      >
                        <ArrowRight size={13} color="#9B7AD9" />
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT: image flush to right edge */}
                  <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{
                      width: "40%",
                      borderRadius: "0 28px 28px 0",
                    }}
                  >
                    {service?.coverImage?.url ? (
                      <Image
                        src={resolveMediaUrl(service.coverImage.url)}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 20vw"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#EDE8F5",
                        }}
                      />
                    )}
                    {/* soft left-edge blend */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(255,255,255,0.4) 0%, transparent 30%)",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

            <div className="card-soft group hover:shadow-md hover:border-brand-lavender/25 transition-all duration-300 flex flex-col">
              <div className="text-4xl mb-5">🎓</div>

              <h2 className="font-serif text-2xl text-brand-ink mb-3 group-hover:text-brand-lavender transition-colors">
                Workshops
              </h2>

              <p className="text-sm text-brand-ink/65 leading-relaxed flex-1">
                Interactive workshops focused on mental well-being, emotional
                resilience, personal growth, and practical life skills.
              </p>

              <div className="mt-6 pt-5 border-t border-brand-lavender/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-ink/40">
                    Online & In-person
                  </p>
                </div>

                <Link
                  href="/services/workshops"
                  className="text-brand-lavender hover:underline text-sm font-medium flex items-center gap-1"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>
        </div>

        {/* ── Footer leaf ── */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3C14 3 8 9 8 14C8 19 14 25 14 25C14 25 20 19 20 14C20 9 14 3 14 3Z"
              stroke="#B89BEA"
              strokeWidth="1.5"
              fill="rgba(185,155,234,0.15)"
            />
            <path d="M14 3L14 25" stroke="#B89BEA" strokeWidth="1.2" />
            <path
              d="M8 14 Q11 10 14 14 Q17 18 20 14"
              stroke="#B89BEA"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
