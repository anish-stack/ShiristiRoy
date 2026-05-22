    // components/common/TherapistCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Clock3,
  Globe2,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

interface Therapist {
  _id: string;

  slug: string;

  title: string;

  bio: string;

  shortBio: string;

  specializations: string[];

  approaches: string[];

  languages: string[];

  yearsExperience: number;

  defaultSlotDurationMin: number;

  timezone: string;

  isAcceptingClients: boolean;

  isFeatured: boolean;

  consultationFee: {
    amount: number;
    currency: string;
  };

  rating: {
    avg: number;
    count: number;
  };

  user: {
    _id: string;
    name: string;
    preferredLanguage: string;
  };

  gallery?: string[];
}

interface TherapistCardProps {
  therapist: Therapist;
  compact?: boolean;
  showBio?: boolean;
  onBook?: () => void;
}

const   TherapistCard = ({
  therapist,
  compact = false,
  showBio = true,
  onBook,
}: TherapistCardProps) => {
  return (
    <div className="group overflow-hidden rounded-[32px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* CONTENT */}
      <div className="p-6">
        {/* NAME */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-black">
              {therapist.user.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {therapist.title}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-sm text-white">
            <Star
              size={14}
              fill="white"
            />

            {therapist.rating.avg || 'New'}
          </div>
        </div>

        {/* BIO */}
        {showBio && (
          <p className="mt-5 line-clamp-3 leading-7 text-gray-600">
            {compact
              ? therapist.shortBio
              : therapist.bio}
          </p>
        )}

        {/* STATS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
            <Clock3 size={15} />
            {therapist.yearsExperience}+ Years
          </div>

          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
            <Globe2 size={15} />
            {therapist.languages.join(', ')}
          </div>
        </div>

        {/* SPECIALIZATIONS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {therapist.specializations
            .slice(0, 4)
            .map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-1 text-xs capitalize text-gray-700"
              >
                {item}
              </span>
            ))}
        </div>

            
      </div>
    </div>
  );
};

export default TherapistCard;