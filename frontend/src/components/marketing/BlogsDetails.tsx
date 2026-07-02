'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  CalendarDays,
  Clock3,
  Eye,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';

interface BlogsDetailsProps {
  blog: any;
}

const BlogsDetails = ({
  blog,
}: BlogsDetailsProps) => {
  if (!blog) return null;

  return (
    <article className="relative overflow-hidden bg-[#F8F6F2] text-[#2D2A26]">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[320px] md:h-[520px] overflow-hidden bg-[#EDE8F8]">
          {blog?.coverImage?.url && (
            <Image
              src={resolveMediaUrl(blog.coverImage.url)}
              alt={
                blog?.coverImage?.alt ||
                blog?.title
              }
              fill
              priority
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 lg:px-6 pb-10 md:pb-16 w-full">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-5 transition"
            >
              <ArrowLeft size={18} />
              Back to Blogs
            </Link>

            <div className="flex flex-wrap gap-3 mb-5">
              {blog?.category && (
                <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur text-white text-sm font-medium border border-white/10">
                  {blog.category}
                </span>
              )}

              {blog?.status && (
                <span className="px-4 py-2 rounded-full bg-[#C9A86A] text-[#1A140B] text-sm font-semibold">
                  {blog.status}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl">
              {blog?.title}
            </h1>

            {blog?.excerpt && (
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-5 mt-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />

                <span>
                  {new Date(
                    blog?.publishedAt
                  ).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />

                <span>
                  {
                    blog?.readingTimeMin
                  }{' '}
                  min read
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Eye size={16} />

                <span>
                  {blog?.views || 0} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* AUTHOR */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-[#E7E0D5]">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#E7E0D5]">
              {blog?.author?.avatar
                ?.url ? (
                <Image
                  src={
                    blog.author.avatar
                      .url
                  }
                  alt={
                    blog.author.name
                  }
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-[#6A5D4D]">
                  {blog?.author?.name?.[0]}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-[#8C7F70] mb-1">
                Written by
              </p>

              <h3 className="text-lg font-semibold text-[#2D2A26]">
                {blog?.author?.name ||
                  'Admin'}
              </h3>
            </div>
          </div>

          {/* BLOG CONTENT */}
          <div
            className="
              prose
              prose-lg
              md:prose-xl
              max-w-none

              prose-headings:text-[#2D2A26]
              prose-headings:font-bold

              prose-p:text-[#4E463D]
              prose-p:leading-8

              prose-a:text-[#A67C52]
              prose-a:no-underline
              hover:prose-a:underline

              prose-strong:text-[#2D2A26]

              prose-li:text-[#4E463D]

              prose-blockquote:border-[#C9A86A]
              prose-blockquote:text-[#6A5D4D]

              prose-img:rounded-3xl
              prose-img:shadow-xl
            "
            dangerouslySetInnerHTML={{
              __html:
                blog?.content || '',
            }}
          />

          {/* TAGS */}
          {blog?.tags?.length >
            0 && (
            <div className="mt-16 pt-10 border-t border-[#E7E0D5]">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-[#6A5D4D] font-medium">
                  <Tag size={18} />
                  Tags:
                </div>

                {blog.tags.map(
                  (
                    tag: string,
                    index: number
                  ) => (
                    <Link
                      key={index}
                      href={`/blogs?tag=${tag}`}
                      className="px-4 py-2 rounded-full bg-[#EFE8DE] hover:bg-[#E3D7C7] transition text-sm font-medium text-[#5C5144]"
                    >
                      #{tag}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-[#2D2A26] px-8 md:px-14 py-14 text-center">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#fff,transparent_40%)]" />

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to Improve Your
              Mental Wellness?
            </h2>

            <p className="mt-5 text-white/70 max-w-2xl mx-auto text-lg leading-8">
              Connect with experienced
              therapists and begin your
              healing journey today.
            </p>

            <div className="mt-8">
              <Link
                href="/therapists"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#C9A86A] hover:bg-[#D8B77A] text-[#1F1810] font-semibold transition-all duration-300"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default BlogsDetails;