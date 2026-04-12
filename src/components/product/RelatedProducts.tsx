"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const products = [
  { name: 'Rose Petal Toner', price: 950, bg: 'linear-gradient(135deg, #F5E6E8 0%, #E0D0D2 100%)', badge: 'Best Seller' },
  { name: 'Aloe Vera Gel', price: 650, bg: 'linear-gradient(135deg, #E8F5E0 0%, #D4E5CB 100%)' },
  { name: 'Golden Turmeric Mask', price: 1450, bg: 'linear-gradient(135deg, #FDF0E0 0%, #E8D5B0 100%)' },
  { name: 'Hibiscus Hair Oil', price: 1100, bg: 'linear-gradient(135deg, #EAD7E3 0%, #C4AAB8 100%)' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function RelatedProducts() {
  return (
    <section className="py-24 border-t border-[rgba(138,158,126,0.15)]">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center justify-center gap-3">
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
          You Might Also Like
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          variants={staggerContainer}
        >
          {products.map((product, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUp}
              className="group relative bg-[#FDFAF6] rounded-[20px] p-6 border border-[rgba(196,168,130,0.15)] transition-all duration-400 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(138,158,126,0.08)] flex flex-col items-center text-center cursor-pointer overflow-hidden"
            >
              <Link href="/product/123" className="absolute inset-0 z-20" aria-label={`View ${product.name}`}></Link>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-[var(--color-sage-dark)] text-white text-[0.65rem] uppercase tracking-[0.15em] py-1.5 px-3 rounded-full z-10 font-medium">
                  {product.badge}
                </div>
              )}
              
              <div 
                className="w-full aspect-square rounded-[12px] mb-6 relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ background: product.bg }}
              >
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-[rgba(247,243,237,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-[0.75rem] tracking-[0.15em] uppercase text-[var(--color-text)] border-b border-[var(--color-text)] pb-0.5 pointer-events-none">Quick View</span>
                </div>
              </div>

              <h3 className="font-serif text-[1.3rem] text-[var(--color-text)] font-light leading-tight mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {product.name}
              </h3>
              
              <div className="text-[1rem] text-[var(--color-earth)] italic font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
                ₹{product.price}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
