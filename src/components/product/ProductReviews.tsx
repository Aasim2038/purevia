"use client";
import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  { name: "Priya Rao", date: "Oct 12, 2026", rating: 5, text: "Absolutely love it. The texture is amazing and my skin feels so soft." },
  { name: "Sneha Kulkarni", date: "Sep 28, 2026", rating: 5, text: "Best natural face wash I've ever used. Doesn't strip moisture at all." },
  { name: "Anjali Mehta", date: "Aug 14, 2026", rating: 4, text: "Very gentle and smells earthy. I just wish the bottle was bigger!" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProductReviews() {
  const ratingData = [
    { stars: 5, pct: 85 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <div className="py-24 border-t border-[rgba(138,158,126,0.15)] mt-16">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[1000px] mx-auto"
      >
        <motion.h3 variants={fadeUp} className="font-serif text-[clamp(2rem,3vw,2.5rem)] text-[var(--color-text)] font-light mb-12 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Customer <em className="italic text-[var(--color-sage-dark)]">Reviews</em>
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {/* Rating Summary */}
          <motion.div variants={fadeUp} className="md:col-span-1">
            <div className="text-[4rem] font-serif font-light text-[var(--color-text)] leading-none mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>4.8</div>
            <div className="text-[var(--color-earth)] text-[1.2rem] mb-2 tracking-[0.1em]">★★★★★</div>
            <div className="text-[0.85rem] text-[var(--color-text-muted)] font-light mb-8">Based on 124 reviews</div>

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
            {reviews.map((rev, idx) => (
              <motion.div key={idx} variants={fadeUp} className="pb-8 border-b border-[rgba(138,158,126,0.1)] last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[var(--color-earth)] text-[0.9rem] tracking-[0.1em]">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <span className="text-[0.75rem] text-[var(--color-text-muted)] font-light tracking-wide">{rev.date}</span>
                </div>
                <div className="text-[0.9rem] text-[var(--color-text)] font-medium mb-3">{rev.name}</div>
                <p className="text-[0.95rem] text-[var(--color-text-muted)] font-light leading-[1.7]">
                  {rev.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
