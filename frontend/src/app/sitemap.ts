import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awakenwithsrishti.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/individual-counselling`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/family-therapy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/online-therapy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/adlerian-integrative-therapy`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/emotional-regulation`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services/young-adult-support`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/therapists/srishti-roy`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/book`, changeFrequency: 'weekly', priority: 0.95 },
  ];
}
