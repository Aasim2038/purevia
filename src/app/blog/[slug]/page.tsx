import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/data/blog-posts';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import BlogProductAd from '@/components/blog/BlogProductAd';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Generate Server-Side Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Pureable',
      description: 'The requested blog post could not be found.',
    };
  }

  const imageUrl = `https://pureable.in${post.image}`;
  const pageUrl = `https://pureable.in/blog/${post.slug}`;

  return {
    title: `${post.title} | Pureable`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: pageUrl,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

// Generate static params for build-time pre-rendering
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const posts = getAllPosts();
  // Find related posts (other posts excluding the current one)
  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  // Format date
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Split blocks for in-content product ad conversion injection
  const midpoint = Math.ceil(post.blocks.length / 2);
  const firstHalfBlocks = post.blocks.slice(0, midpoint);
  const secondHalfBlocks = post.blocks.slice(midpoint);

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p
            key={index}
            className="font-sans text-[1.05rem] text-[var(--color-text)] leading-[1.85] font-light tracking-[0.01em]"
          >
            {block.content}
          </p>
        );

      case 'heading':
        return (
          <h2
            key={index}
            className="font-serif text-2xl md:text-3xl font-light text-[var(--color-text)] mt-12 mb-4 leading-tight tracking-[0.02em]"
          >
            {block.content}
          </h2>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="my-10 pl-6 border-l-3 border-[var(--color-sage-dark)] py-2 bg-[var(--color-warm)]/10 rounded-r-2xl pr-6"
          >
            <p className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-[var(--color-sage-dark)]">
              “{block.content}”
            </p>
          </blockquote>
        );

      case 'list':
        return (
          <ul key={index} className="list-none pl-0 my-6 flex flex-col gap-4">
            {block.items?.map((item: string, idx: number) => {
              const hasColon = item.includes(':');
              const [boldPart, restPart] = hasColon ? item.split(/:(.+)/) : [item, ''];
              return (
                <li key={idx} className="flex gap-3 text-[1.02rem] text-[var(--color-text)] font-sans font-light leading-relaxed align-top">
                  <span className="text-[var(--color-sage-dark)] font-bold select-none mt-1">•</span>
                  <div>
                    {hasColon ? (
                      <>
                        <strong className="font-medium text-[var(--color-text)]">{boldPart}:</strong>
                        {restPart}
                      </>
                    ) : (
                      item
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        );

      default:
        return null;
    }
  };

  // Construct JSON-LD structured data for Google Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.description,
    'image': `https://pureable.in${post.image}`,
    'datePublished': post.publishDate,
    'dateModified': post.publishDate,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Pureable',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://pureable.in/logo.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://pureable.in/blog/${post.slug}`,
    },
  };

  return (
    <>
      {/* Dynamic JSON-LD SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgressBar />

      <main className="min-h-screen bg-[var(--color-cream)] pt-32 pb-24 px-6 md:px-16 text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors duration-300 mb-12 group"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Journal
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--color-warm)]/40 rounded-full text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-earth-dark)] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.01em] leading-[1.2] mb-6">
              {post.title}
            </h1>

            {/* Subtitle / Excerpt */}
            <p className="font-sans text-base md:text-lg text-[var(--color-text-muted)] font-light leading-[1.6] mb-8 max-w-3xl">
              {post.description}
            </p>

            {/* Author Meta */}
            <div className="flex items-center gap-4 pt-6 border-t border-[rgba(196,168,130,0.15)]">
              {/* Author Initials Avatar */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/25 flex items-center justify-center font-serif text-lg font-light text-[var(--color-sage-dark)] uppercase">
                {post.author.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-medium tracking-[0.02em]">{post.author.name}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-light tracking-[0.02em] mt-0.5">
                  {post.author.role} <span className="mx-1.5">•</span> {formattedDate} <span className="mx-1.5">•</span> {post.readTime}
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full mb-12 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(26,22,16,0.04)] border border-[rgba(138,158,126,0.1)]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-w-1200px) 100vw, 1200px"
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Article Body */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {firstHalfBlocks.map((block, index) => renderBlock(block, index))}

              {/* In-article Product Recommendation for Higher Conversion */}
              {post.adProductId && (
                <BlogProductAd productId={post.adProductId} ctaText="Buy Now" />
              )}

              {/* Second Half of Content */}
              {secondHalfBlocks.map((block, index) => renderBlock(block, index + midpoint))}
            </div>

            {/* Author Profile Bio Card */}
            <div className="mt-16 p-8 bg-[var(--color-white)] rounded-3xl border border-[rgba(138,158,126,0.08)] shadow-[0_4px_24px_rgba(26,22,16,0.01)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-sage)]/25 flex items-center justify-center font-serif text-2xl font-light text-[var(--color-sage-dark)] uppercase shrink-0">
                {post.author.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-base font-semibold text-[var(--color-text)]">{post.author.name}</h4>
                <p className="text-xs text-[var(--color-earth-dark)] font-medium tracking-[0.05em] uppercase mt-1">{post.author.role}</p>
                <p className="font-sans text-xs text-[var(--color-text-muted)] font-light leading-[1.6] mt-3">
                  Dedicated to crafting and discovering clean, chemical-free solutions that respect the intelligence of nature and the health of your body.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-24 pt-16 border-t border-[rgba(196,168,130,0.15)]">
            <h3 className="font-serif text-3xl font-light text-center mb-12">Related Readings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.slug}
                  href={`/blog/${rPost.slug}`}
                  className="group flex gap-4 p-4 rounded-2xl bg-[var(--color-white)] border border-[rgba(138,158,126,0.06)] hover:border-[rgba(138,158,126,0.15)] hover:shadow-[0_8px_32px_rgba(26,22,16,0.04)] transition-all duration-300"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--color-cream)] shrink-0">
                    <Image
                      src={rPost.image}
                      alt={rPost.title}
                      fill
                      sizes="96px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-earth-dark)] font-medium mb-1.5">
                      {rPost.tags[0]}
                    </span>
                    <h4 className="font-serif text-lg font-light text-[var(--color-text)] group-hover:text-[var(--color-sage-dark)] transition-colors duration-300 leading-snug line-clamp-2">
                      {rPost.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
