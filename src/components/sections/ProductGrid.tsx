"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

const products = [
  {
    name: "Neem Aloe Face Wash",
    desc: "Deep cleansing with natural neem & cooling aloe vera. Removes impurities gently.",
    price: "₹349",
    size: "100ml",
    icon: "🌿",
    badge: "Bestseller",
    bg: "linear-gradient(135deg, #E8F5E0, #C8E6B8)"
  },
  {
    name: "Rose Turmeric Glow Serum",
    desc: "Brightening serum with rose water & turmeric. Reduces dark spots naturally.",
    price: "₹499",
    size: "30ml",
    icon: "🌹",
    badge: "New",
    bg: "linear-gradient(135deg, #FDF0E0, #F5D5A8)"
  },
  {
    name: "Coconut Bhringraj Hair Oil",
    desc: "Nourishing hair oil blend for strong, shiny, naturally healthy hair growth.",
    price: "₹299",
    size: "150ml",
    icon: "🥥",
    badge: null,
    bg: "linear-gradient(135deg, #E8EFF8, #C8D8F0)"
  },
  {
    name: "Hibiscus Face Pack",
    desc: "Anti-ageing hibiscus clay mask for youthful, glowing, refreshed skin.",
    price: "₹249",
    size: "75g",
    icon: "🌸",
    badge: "Popular",
    bg: "linear-gradient(135deg, #F5E8F0, #E8C8DC)"
  },
  {
    name: "Green Tea Eye Cream",
    desc: "Reduces dark circles & puffiness with antioxidant-rich green tea extracts.",
    price: "₹399",
    size: "15g",
    icon: "🍵",
    badge: null,
    bg: "linear-gradient(135deg, #F0F5E8, #D8E8C0)"
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, mass: 0.8 } },
};

export default function ProductGrid() {
  return (
    <section className="bg-[var(--color-white)] py-16 md:py-32 px-6 md:px-16" id="products">
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div>
          <motion.div variants={fadeUp as any} className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center gap-3">
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
            Our Collection
          </motion.div>
          <motion.h2 
            variants={fadeUp as any} 
            className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.15]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Pure products,<br/>
            <em className="italic text-[var(--color-sage-dark)]">real results</em>
          </motion.h2>
        </div>
        <motion.div variants={fadeUp as any}>
          <Link 
            href="/shop" 
            className="text-[0.8rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)] no-underline flex items-center gap-2 transition-all duration-300 whitespace-nowrap pb-1 border-b border-[var(--color-earth)] hover:text-[var(--color-sage-dark)] hover:gap-3"
          >
            View All &rarr;
          </Link>
        </motion.div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} variants={fadeUp as any} />
        ))}
      </motion.div>
    </section>
  );
}
