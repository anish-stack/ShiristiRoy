'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    ArrowRight,
    Calendar,
    Clock3,
    IndianRupee,
    ShieldCheck,
    Sparkles,
    Star,
    Check,
} from 'lucide-react';

import AuthModal from './AuthModal';
import TherapistCard from './TherapistCard';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface Service {
    _id: string;
    slug: string;
    name: string;
    description: string;
    shortDesc: string;
    category: string;
    durationMin: number;
    isActive: boolean;
    order: number;
    modes: string[];
    createdAt: string;
    updatedAt: string;

    coverImage: {
        url: string;
        publicId: string;
    };

    price: {
        amount: number;
        currency: string;
    };

    seo: {
        keywords: string[];
    };
}

interface Testimonial {
    _id: string;
    authorName: string;
    text: string;
    rating: number;
}

interface ServiceDetailsProps {
    service: Service;
    therapist: any;
    testimonials?: Testimonial[];
}

const ServiceDetails = ({
    service,
    therapist,
    testimonials = [],
}: ServiceDetailsProps) => {
    const router = useRouter();
    const { user, hydrated } = useAuthStore();

    const [open, setOpen] = useState(false);
    
    const handleRedirect = () => {
        if (!hydrated) return;

        if (!user) {
            setOpen(true);
            return;
        }else{
            router.push("/book?serviceId=" + service._id);    
        }

      
    };
    return (
        <>
            <div className="min-h-screen bg-[#F8F5F2] pt-32 overflow-hidden text-[#425466]">
                {/* SOFT BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-24 left-[-80px] w-[320px] h-[320px] rounded-full bg-[#DCCFF2]/40 blur-3xl" />
                    <div className="absolute top-[30%] right-[-80px] w-[340px] h-[340px] rounded-full bg-[#B7C9E2]/40 blur-3xl" />
                    <div className="absolute bottom-0 left-[20%] w-[280px] h-[280px] rounded-full bg-[#C7D9C6]/30 blur-3xl" />
                </div>

                {/* HERO */}
                <section className="relative max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* LEFT */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFDFB] border border-[#E6E0F0] shadow-sm mb-7">
                                <ShieldCheck
                                    size={16}
                                    className="text-[#7E8DA6]"
                                />

                                <span className="text-sm font-medium text-[#5C6B7A]">
                                    Safe & Confidential Therapy
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.04em] text-[#435264]">
                                {service.name}
                            </h1>

                            <p className="mt-8 text-lg leading-8 text-[#6E7B88] max-w-xl">
                                {service.shortDesc}
                            </p>

                            {/* INFO */}
                            <div className="flex flex-wrap gap-4 mt-9">
                                <div className="flex items-center gap-3 bg-[#FFFDFB] px-5 py-3 rounded-2xl border border-[#E5E0EA] shadow-sm">
                                    <Clock3
                                        size={18}
                                        className="text-[#7B8DA8]"
                                    />

                                    <span className="font-medium text-[#526170]">
                                        {service.durationMin} Minutes
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 bg-[#FFFDFB] px-5 py-3 rounded-2xl border border-[#E5E0EA] shadow-sm">
                                    <IndianRupee
                                        size={18}
                                        className="text-[#7B8DA8]"
                                    />

                                    <span className="font-medium text-[#526170]">
                                        {service.price.amount}
                                    </span>
                                </div>

                                {service.modes.map((mode) => (
                                    <div
                                        key={mode}
                                        className="px-5 py-3 rounded-2xl bg-[#DCCFF2]/70 text-[#536273] capitalize border border-[#D8CCE8]"
                                    >
                                        {mode.replace('_', ' ')}
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-wrap gap-4 mt-11">
                                <button
                                    onClick={() => handleRedirect()}
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#6E84A3] text-white font-medium hover:scale-[1.02] transition-all shadow-lg shadow-[#AEBED6]/30"
                                >
                                    <Calendar size={18} />
                                    Book Appointment
                                </button>

                                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-[#D7DDE4] bg-[#FFFDFB] text-[#536273] font-medium hover:bg-[#EEF2F6] transition-all">
                                    Learn More
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#DCCFF2]/50 blur-3xl rounded-full" />

                            <div className="relative overflow-hidden rounded-[42px] border border-white/60 shadow-[0_30px_80px_rgba(115,131,158,0.18)]">
                                <Image
                                    src={service.coverImage.url}
                                    alt={service.name}
                                    width={1000}
                                    height={800}
                                    className="w-full h-[680px] object-cover"
                                />
                            </div>

                            {/* FLOAT CARD */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/70 backdrop-blur-2xl rounded-[28px] p-6 border border-white/70 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#7B8795]">
                                            Session Starts From
                                        </p>

                                        <h3 className="text-3xl font-bold mt-1 text-[#4B5A69]">
                                            ₹{service.price.amount}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => handleRedirect()}
                                        className="h-14 w-14 rounded-2xl bg-[#6E84A3] text-white flex items-center justify-center shadow-lg"
                                    >
                                        <ArrowRight size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ABOUT */}
                <section className="relative max-w-7xl mx-auto px-4 lg:px-6 mt-32">
                    <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-10">
                        {/* LEFT */}
                        <div className="bg-[#FFFDFB]/90 backdrop-blur-xl rounded-[40px] p-8 lg:p-12 border border-[#ECE5F2] shadow-[0_20px_60px_rgba(136,149,168,0.08)]">
                            <div className="flex items-center gap-2 mb-5">
                                <Sparkles
                                    size={18}
                                    className="text-[#8A9AB2]"
                                />

                                <span className="uppercase tracking-[0.25em] text-sm text-[#7D8793]">
                                    About Service
                                </span>
                            </div>

                            <h2 className="text-4xl font-bold leading-tight text-[#4A5968]">
                                Healing Through
                                <br />
                                Professional Guidance
                            </h2>

                            <p className="mt-8 text-[#697786] leading-8 text-lg">
                                {service.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-5 mt-10">
                                {[
                                    'Safe & confidential environment',
                                    'Professional therapist guidance',
                                    'Flexible online & offline sessions',
                                    'Personalized support plans',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4 p-5 rounded-3xl bg-[#F4F1F9] border border-[#ECE5F2]"
                                    >
                                        <div className="w-11 h-11 rounded-2xl bg-[#C7D9C6] text-[#4B5A69] flex items-center justify-center">
                                            <Check size={18} />
                                        </div>

                                        <span className="font-medium text-[#556474]">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="bg-[#6E84A3] rounded-[40px] p-8 lg:p-10 text-white shadow-[0_20px_70px_rgba(110,132,163,0.35)]">
                            <p className="uppercase tracking-[0.25em] text-sm text-white/60">
                                Session Details
                            </p>

                            <div className="space-y-8 mt-10">
                                <div>
                                    <p className="text-white/60 text-sm">
                                        Category
                                    </p>

                                    <h3 className="text-2xl font-semibold capitalize mt-1">
                                        {service.category}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-white/60 text-sm">
                                        Duration
                                    </p>

                                    <h3 className="text-2xl font-semibold mt-1">
                                        {service.durationMin} Minutes
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-white/60 text-sm">
                                        Available Modes
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {service.modes.map((mode) => (
                                            <span
                                                key={mode}
                                                className="px-4 py-2 rounded-full bg-white/15 capitalize border border-white/10"
                                            >
                                                {mode.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRedirect()}
                                    className="w-full mt-10 py-4 rounded-2xl bg-[#FFF8F1] text-[#556474] font-semibold hover:opacity-90 transition-all"
                                >
                                    Book Your Session
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THERAPIST */}
                <section className="relative max-w-7xl mx-auto px-4 lg:px-6 mt-32">
                    <div className="mb-14">
                        <p className="uppercase tracking-[0.25em] text-sm text-[#7D8793] mb-3">
                            Your Therapist
                        </p>

                        <h2 className="text-5xl font-bold text-[#4B5A69]">
                            Meet Your Guide
                        </h2>
                    </div>

                    <TherapistCard
                        therapist={therapist}
                        onBook={() => handleRedirect()}
                    />
                </section>

                {/* TESTIMONIALS */}
                <section className="relative max-w-7xl mx-auto px-4 lg:px-6 mt-32 pb-32">
                    <div className="flex items-end justify-between gap-6 mb-14">
                        <div>
                            <p className="uppercase tracking-[0.25em] text-sm text-[#7D8793] mb-3">
                                Testimonials
                            </p>

                            <h2 className="text-5xl font-bold leading-tight text-[#4B5A69]">
                                What Clients Say
                            </h2>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 bg-[#FFFDFB] px-5 py-3 rounded-2xl border border-[#E5E0EA] shadow-sm">
                            <Star
                                size={18}
                                fill="#6E84A3"
                                className="text-[#6E84A3]"
                            />

                            <span className="font-semibold text-[#556474]">
                                Trusted by many clients
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {testimonials.map((item) => (
                            <div
                                key={item._id}
                                className="bg-[#FFFDFB]/90 backdrop-blur-xl rounded-[32px] p-8 border border-[#ECE5F2] shadow-[0_15px_50px_rgba(130,144,164,0.08)]"
                            >
                                <div className="flex items-center gap-1 mb-5">
                                    {Array.from({
                                        length: item.rating,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill="#6E84A3"
                                            className="text-[#6E84A3]"
                                        />
                                    ))}
                                </div>

                                <p className="text-[#697786] leading-8 text-lg">
                                    "{item.text}"
                                </p>

                                <div className="mt-8">
                                    <h4 className="font-semibold text-lg text-[#4B5A69]">
                                        {item.authorName}
                                    </h4>

                                    <p className="text-sm text-[#95A0AC]">
                                        Verified Client
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* AUTH MODAL */}
            <AuthModal
                open={open}
                onClose={() => setOpen(false)}
                defaultMode="login"
                redirectTo='/book'
            />
        </>
    );
};

export default ServiceDetails;