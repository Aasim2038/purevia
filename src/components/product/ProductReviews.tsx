"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';

type ProductReview = {
  id: string;
  user?: { name: string | null };
  rating: number;
  comment: string;
  isVerified?: boolean;
  createdAt: Date;
};

type ProductReviewsProps = {
  reviews: ProductReview[];
  productId: string;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProductReviews({ reviews: initialReviews, productId }: ProductReviewsProps) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = React.useState(initialReviews);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId }),
      });
      if (res.ok) {
        const { review } = await res.json();
        setReviews([review, ...reviews]);
        setHasSubmitted(true);
        setShowForm(false);
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif text-[1.4rem] text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Customer Voices</h4>
              {!hasSubmitted && !showForm && (
                <button 
                  onClick={() => status === 'unauthenticated' ? signIn() : setShowForm(true)} 
                  className="text-[0.75rem] uppercase tracking-widest text-[var(--color-sage-dark)] font-medium border border-[var(--color-sage-dark)] px-4 py-2 rounded-full hover:bg-[var(--color-sage-dark)] hover:text-white transition-colors"
                >
                  {status === 'unauthenticated' ? 'Login to Review' : 'Write a Review'}
                </button>
              )}
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded-2xl border border-[rgba(138,158,126,0.15)] mb-6 flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[1rem] font-medium text-[var(--color-text)]">New Review</span>
                    <button type="button" onClick={() => setShowForm(false)} className="text-[1.2rem] text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)]">&times;</button>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[0.8rem] uppercase tracking-wider text-[var(--color-text-muted)]">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button type="button" key={star} onClick={() => setFormData({...formData, rating: star})} className={`text-[1.2rem] ${star <= formData.rating ? 'text-[var(--color-earth)]' : 'text-gray-300'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea required rows={4} placeholder="Your Review *" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className="bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[var(--color-sage-dark)] text-[0.9rem] resize-none"></textarea>

                  <button type="submit" disabled={isSubmitting} className="mt-2 py-[0.9rem] bg-[var(--color-sage-dark)] text-white rounded-full uppercase tracking-widest text-[0.8rem] hover:bg-[#4a5e42] transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {hasSubmitted && !showForm && (
              <div className="bg-[#E8F5E0] text-[var(--color-sage-dark)] px-4 py-3 rounded-lg text-sm mb-6 text-center">
                Thank you for your review!
              </div>
            )}

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
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-[0.9rem] text-[var(--color-text)] font-medium">{rev.user?.name || 'Anonymous'}</div>
                  {rev.isVerified && (
                    <span className="bg-[#E8EFF8] text-[#4A729A] text-[0.6rem] px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#C8D8F0] font-medium flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Verified Buyer
                    </span>
                  )}
                </div>
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
