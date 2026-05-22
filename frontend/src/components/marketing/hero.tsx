"use client"

import { ArrowRight, Leaf } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

import indiualsCouncil from "@/assets/indiuals_counsel.png"
import familyCouncil from "@/assets/family_counsil.jpeg"

const slides = [
    {
        image: indiualsCouncil,
        title: "Individual Counselling",
        desc: "A reflective and safe therapeutic space for emotional growth & self-awareness.",
    },
    {
        image: familyCouncil,
        title: "Family Therapy",
        desc: "Helping families reconnect through understanding, communication & healing.",
    },
]

const Hero = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-ivory via-[#EDE8F8] to-[#E8EFF7]">
            {/* Blur Background */}
            <div className="absolute top-1/4 -right-32 w-[520px] h-[520px] rounded-full bg-brand-lavender/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-brand-sage/15 blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">
                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-brand-lavender/20 shadow-sm mb-6">
                        <Leaf size={15} className="text-brand-lavender" />
                        <p className="text-sm font-medium text-brand-ink">
                            Counselling Psychologist
                        </p>
                    </div>

                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-brand-ink leading-[1.05] mb-6">
                        Healing through <br />
                        <span className="text-brand-lavender italic">
                            awareness
                        </span>{" "}
                        & self-understanding
                    </h1>

                    <p className="text-lg text-brand-ink/60 leading-relaxed mb-10 max-w-xl">
                        A compassionate and reflective space for individuals and
                        families. Adlerian-informed integrative therapy in English,
                        हिन्दी, বাংলা & اردو.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <Link
                            href="/book"
                            className="group btn-primary flex items-center gap-2"
                        >
                            Book a Session
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition"
                            />
                        </Link>

                        <Link href="/about" className="btn-outline">
                            Learn More
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 max-w-md">
                        {[
                            ["3+", "Years Experience"],
                            ["12+", "Nationalities"],
                            ["4", "Languages"],
                        ].map(([value, label]) => (
                            <motion.div
                                whileHover={{ y: -4 }}
                                key={label}
                                className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm p-4"
                            >
                                <h3 className="font-serif text-2xl text-brand-lavender">
                                    {value}
                                </h3>
                                <p className="text-xs uppercase tracking-wide text-brand-ink/50 mt-1">
                                    {label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT IMAGE SLIDER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="relative w-full max-w-[520px] mx-auto"
                >
                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden  border border-white/40">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, scale: 1.08 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={slides[current].image}
                                    alt={slides[current].title}
                                    fill
                                    priority
                                    className="object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                                    <motion.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="font-serif text-2xl sm:text-4xl mb-3"
                                    >
                                        {slides[current].title}
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 0.9, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-sm sm:text-base leading-relaxed max-w-md text-white/90"
                                    >
                                        {slides[current].desc}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slider Dots */}
                        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${current === idx
                                            ? "w-8 bg-white"
                                            : "w-2.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero