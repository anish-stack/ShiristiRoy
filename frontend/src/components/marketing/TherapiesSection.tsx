import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Wind, Users, Smile, Leaf } from 'lucide-react';
import Link from 'next/link';

const therapies = [
    {
        icon: Brain,
        label: 'Cognitive Behavioural',
        tag: 'CBT',
        route: '/therapy/cognitive-behavioural',
        desc: 'Reshape thought patterns to change behaviour and mood.',
    },
    {
        icon: Heart,
        label: 'Adlerian Therapy',
        tag: 'Adlerian',
        route: '/therapy/adlerian-therapy',
        desc: 'Understand social belonging and life goals.',
    },
    {
        icon: Wind,
        label: 'Mindfulness-Based',
        tag: 'MBSR',
        route: '/therapy/mindfulness-based',
        desc: 'Present-moment awareness for stress reduction.',
    },
    {
        icon: Users,
        label: 'Group Therapy',
        tag: 'Group',
        route: '/therapy/group-therapy',
        desc: 'Heal through shared experiences and peer support.',
    },
    {
        icon: Smile,
        label: 'Positive Psychology',
        tag: 'PsyPos',
        route: '/therapy/positive-psychology',
        desc: 'Build on strengths, not just fix weaknesses.',
    },
    {
        icon: Leaf,
        label: 'Integrative Approach',
        tag: 'Integrative',
        route: '/therapy/integrative-approach',
        desc: 'Combining methods tailored to your whole self.',
    },
];

const TherapiesSection = () => {
    return (
        <section className="relative overflow-hidden py-28">
            {/* Background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[#DDE8F8]/40 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-[#F9D0D8]/30 blur-[100px]" />
                <div className="absolute left-0 top-1/2 h-[200px] w-[200px] rounded-full bg-[#E8DDF9]/20 blur-[80px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mb-20 flex flex-col items-center text-center"
                >
                    <div className="mb-6 inline-flex items-center gap-3">
                        <div className="h-[2px] w-8 bg-gradient-to-r from-[#9B7AD9] to-[#D9698A]" />
                        <span
                            className="text-xs font-bold uppercase tracking-[0.25em] text-[#9B7AD9]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            Therapeutic Modalities
                        </span>
                        <div className="h-[2px] w-8 bg-gradient-to-r from-[#D9698A] to-[#9B7AD9]" />
                    </div>

                    <h2
                        className="text-4xl leading-tight text-[#2A2535] sm:text-5xl lg:text-6xl"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        Approaches tailored{' '}
                        <em className="font-light not-italic text-[#9B7AD9]" style={{ fontStyle: 'italic' }}>
                            for you
                        </em>
                    </h2>

                    <p className="mt-5 max-w-xl leading-relaxed text-[#6B6578]">
                        Integrating multiple evidence-based methods to best support your unique healing journey — mind, body, and spirit.
                    </p>

                    {/* Decorative underline */}
                    <div className="mt-8 flex items-center gap-2 opacity-40">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#9B7AD9]" />
                        <span className="text-[10px] text-[#9B7AD9]">✦</span>
                        <div className="h-px w-16 bg-gradient-to-r from-[#9B7AD9] to-transparent" />
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {therapies.map((therapy, index) => {
                        const Icon = therapy.icon;

                        return (
                            <Link
                                key={therapy.route}
                                href={therapy.route}
                                className="block cursor-pointer"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.55 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                    className="group relative overflow-hidden rounded-3xl border border-[#E8DEFA] bg-white/80 p-7 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:border-[#CDB9F3] hover:shadow-xl hover:shadow-[#9B7AD9]/10"
                                >
                                    {/* Number watermark */}
                                    <span
                                        className="absolute right-5 top-4 text-6xl font-bold leading-none text-[#F0E9FF] transition-colors duration-300 group-hover:text-[#E8DDF9]"
                                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Glow orb */}
                                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-[#9B7AD9]/10 to-[#D9698A]/5 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:from-[#9B7AD9]/20" />

                                    {/* Icon */}
                                    <div className="relative mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3ECFF] to-[#E8DDF9] p-3 shadow-inner transition-transform duration-300 group-hover:scale-110">
                                        <Icon size={24} className="text-[#9B7AD9]" />
                                    </div>

                                    {/* Tag */}
                                    <span className="mb-2 inline-block rounded-full bg-[#F3ECFF] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#9B7AD9]">
                                        {therapy.tag}
                                    </span>

                                    {/* Title */}
                                    <h3
                                        className="mb-2 text-lg font-bold text-[#2A2535]"
                                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                    >
                                        {therapy.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm leading-relaxed text-[#7B7488]">
                                        {therapy.desc}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className="mt-6 h-px w-0 bg-gradient-to-r from-[#9B7AD9] to-[#D9698A] transition-all duration-500 group-hover:w-full" />
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-[#E8DEFA] bg-white/60 px-8 py-10 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left"
                >
                    <div>
                        <p
                            className="text-2xl font-bold text-[#2A2535]"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                            Not sure which approach suits you?
                        </p>
                        <p className="mt-1 text-sm text-[#7B7488]">Your therapist will guide you to the right fit — no pressure, no rush.</p>
                    </div>
                    <button className="shrink-0 rounded-full bg-gradient-to-r from-[#9B7AD9] to-[#D9698A] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9B7AD9]/25 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                        Book Free Consultation
                    </button>
                </motion.div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
      `}</style>
        </section>
    );
};

export default TherapiesSection;