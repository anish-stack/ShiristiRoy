import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { blogApi } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Reflections on Healing',
  description: 'Insights on awareness, healing, relationships, and personal growth by Srishti Roy, Counselling Psychologist.',
  path: '/blog',
});
export const revalidate = 1800;

export default async function BlogPage() {
  let items: any[] = []; let total = 0;
  try { const r = await blogApi.list(); items = r.items; total = r.total; } catch {}

  return (
    <>
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-[#EDE8F8]/40 to-brand-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-tag mb-4">Writing</p>
          <h1 className="font-serif text-5xl sm:text-6xl text-brand-ink mb-6">Reflections</h1>
          <p className="text-lg text-brand-ink/60">Thoughts on awareness, healing, and the journey toward self-understanding.</p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20 text-brand-ink/40">
              <p className="text-2xl mb-2">🌱</p>
              <p>Writing coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {items.map((b) => (
                <Link key={b._id} href={`/blog/${b.slug}`} className="card-soft group hover:shadow-md hover:border-brand-lavender/25 transition-all duration-300 grid sm:grid-cols-4 gap-6 items-start">
                  {b.coverImage?.url && (
                    <div className="sm:col-span-1 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-brand-lavender/10">
                      <img src={b.coverImage.url} alt={b.coverImage.alt || b.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={b.coverImage?.url ? 'sm:col-span-3' : 'sm:col-span-4'}>
                    {b.tags?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {b.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-brand-lavender/10 text-brand-lavender rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-serif text-2xl text-brand-ink group-hover:text-brand-lavender transition-colors mb-2">{b.title}</h2>
                    <p className="text-sm text-brand-ink/60 leading-relaxed mb-4 line-clamp-2">{b.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-brand-ink/40">
                      <span>{formatDate(b.publishedAt)}</span>
                      {b.readingTimeMin && <span className="flex items-center gap-1"><Clock size={12} /> {b.readingTimeMin} min read</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
