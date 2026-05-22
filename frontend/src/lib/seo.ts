import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awakenwithsrishti.com';

export function buildMetadata(opts: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${opts.path ?? ''}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(', '),
    robots: opts.noindex ? 'noindex,nofollow' : 'index,follow',
    alternates: { canonical: url },
    openGraph: {
      title: opts.title, description: opts.description, url,
      type: 'website', siteName: 'Srishti Roy — Counselling Psychologist',
      images: opts.ogImage ? [{ url: opts.ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image', title: opts.title, description: opts.description,
      images: opts.ogImage ? [opts.ogImage] : [],
    },
  };
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Srishti Roy',
    jobTitle: 'Counselling Psychologist',
    url: BASE_URL,
    telephone: '+918448009694',
    email: 'contact@awakentherapy.in',
    knowsLanguage: ['en', 'hi', 'bn', 'ur'],
    description: 'Registered Counselling Psychologist. Adlerian-informed integrative therapy.',
    sameAs: ['https://www.instagram.com/awakenwithsrishti'],
  };
}

export function serviceJsonLd(s: { name: string; description: string; price?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    provider: { '@type': 'Person', name: 'Srishti Roy' },
    ...(s.price ? { offers: { '@type': 'Offer', price: s.price, priceCurrency: 'INR' } } : {}),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
