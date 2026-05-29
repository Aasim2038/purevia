import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'The Journal | Pureable',
  description: 'Explore the science of chemical-free beauty, Ayurvedic daily self-care rituals, and conscious living guide by Pureable.',
  openGraph: {
    title: 'The Journal | Pureable',
    description: 'Explore the science of chemical-free beauty, Ayurvedic daily self-care rituals, and conscious living guide by Pureable.',
    url: 'https://pureable.in/blog',
    type: 'website',
  }
};

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogListingPage({ searchParams }: PageProps) {
  const { tag: activeTag } = await searchParams;
  const posts = getAllPosts();

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap((post) => post.tags)))];

  // Filter posts based on active tag
  const filteredPosts = activeTag && activeTag !== 'All'
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pt-32 pb-24 px-6 md:px-16 text-[var(--color-text)]">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16 md:mb-24">
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[0.05em] mb-6 leading-tight">
          The <span className="text-[var(--color-sage-dark)] italic font-light">Journal</span>
        </h1>
        <p className="max-w-xl mx-auto font-sans text-sm md:text-base text-[var(--color-text-muted)] font-light leading-[1.8] tracking-[0.02em]">
          A mindful space dedicated to the science of chemical-free beauty, holistic wellness, and Ayurvedic rituals for conscious daily living.
        </p>
      </div>

      {/* Tag Navigation */}
      <div className="max-w-6xl mx-auto mb-12 border-b border-[rgba(196,168,130,0.15)] pb-6 flex flex-wrap justify-center gap-3">
        {allTags.map((tag) => {
          const isActive = (!activeTag && tag === 'All') || activeTag === tag;
          return (
            <Link
              key={tag}
              href={tag === 'All' ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}
              className={`px-6 py-2 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                isActive
                  ? 'bg-[var(--color-sage-dark)] text-white shadow-sm'
                  : 'bg-[var(--color-white)] text-[var(--color-text-muted)] hover:bg-[var(--color-warm)] hover:text-[var(--color-text)] border border-[rgba(196,168,130,0.1)]'
              }`}
            >
              {tag}
            </Link>
          );
        })}
      </div>

      {/* Articles Section */}
      <div className="max-w-6xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-[var(--color-text-muted)] italic">No articles found matching this category.</p>
            <Link href="/blog" className="mt-6 inline-block text-xs uppercase tracking-widest text-[var(--color-sage-dark)] font-medium hover:underline">
              Back to all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="group flex flex-col h-full bg-[var(--color-white)] rounded-3xl overflow-hidden border border-[rgba(138,158,126,0.08)] hover:border-[rgba(138,158,126,0.2)] shadow-[0_4px_24px_rgba(26,22,16,0.02)] hover:shadow-[0_12px_40px_rgba(26,22,16,0.06)] transition-all duration-500">
                {/* Image Container */}
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-cream)]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-earth-dark)] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl font-light text-[var(--color-text)] mb-4 leading-snug group-hover:text-[var(--color-sage-dark)] transition-colors duration-300">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-sm text-[var(--color-text-muted)] font-light leading-[1.7] mb-6 line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Metadata and Read More */}
                  <div className="pt-6 border-t border-[rgba(196,168,130,0.1)] flex items-center justify-between">
                    <div className="text-[0.7rem] text-[var(--color-text-muted)] font-light tracking-[0.02em]">
                      <span className="font-medium text-[var(--color-text)]">{post.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[0.75rem] uppercase tracking-[0.15em] font-medium text-[var(--color-sage-dark)] flex items-center gap-1.5 transition-all duration-300 group-hover:translate-x-1"
                    >
                      Read
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
