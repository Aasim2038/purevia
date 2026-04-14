"use client";
import React from 'react';
import { motion } from 'framer-motion';

type ProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

type ProductReviewsProps = {
  reviews: ProductReview[];
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews)
    : 0;

  const ratingData = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, pct };
  });

  return (
    <div className="py-24 border-t border-[rgba(138,158,126,0.15)] mt-16">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[1000px] mx-auto"
      >
        <motion.h3 variants={fadeUp as any} className="font-serif text-[clamp(2rem,3vw,2.5rem)] text-[var(--color-text)] font-light mb-12 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Customer <em className="italic text-[var(--color-sage-dark)]">Reviews</em>
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {/* Rating Summary */}
          <motion.div variants={fadeUp as any} className="md:col-span-1">
            <div className="text-[4rem] font-serif font-light text-[var(--color-text)] leading-none mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {averageRating.toFixed(1)}
            </div>
            <div className="text-[var(--color-earth)] text-[1.2rem] mb-2 tracking-[0.1em]">
              {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
            </div>
            <div className="text-[0.85rem] text-[var(--color-text-muted)] font-light mb-8">
              Based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
            </div>

            <div className="flex flex-col gap-3">
              {ratingData.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[0.75rem] text-[var(--color-text)] font-medium w-12 text-right">{row.stars} Star</span>
                  <div className="flex-1 h-1.5 bg-[rgba(138,158,126,0.15)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--color-sage-dark)] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[0.75rem] text-[var(--color-text-muted)] font-light w-8 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Individual Reviews */}
          <motion.div variants={staggerContainer} className="md:col-span-2 flex flex-col gap-8 md:pl-12 border-t md:border-t-0 md:border-l border-[rgba(138,158,126,0.15)] pt-8 md:pt-0">
            {reviews.length === 0 ? (
              <motion.div variants={fadeUp as any} className="text-[0.95rem] text-[var(--color-text-muted)] font-light">
                No reviews yet. Be the first to review this product.
              </motion.div>
            ) : reviews.map((rev) => (
              <motion.div key={rev.id} variants={fadeUp as any} className="pb-8 border-b border-[rgba(138,158,126,0.1)] last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[var(--color-earth)] text-[0.9rem] tracking-[0.1em]">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <span className="text-[0.75rem] text-[var(--color-text-muted)] font-light tracking-wide">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-[0.9rem] text-[var(--color-text)] font-medium mb-3">{rev.name}</div>
                <p className="text-[0.95rem] text-[var(--color-text-muted)] font-light leading-[1.7]">
                  {rev.comment}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
