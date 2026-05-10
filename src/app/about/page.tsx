"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  },
  viewport: { once: true }
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-text)] min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-16 text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-[var(--color-sage-dark)] font-medium tracking-[0.3em] uppercase text-[0.75rem] mb-6 block">Our Essence</span>
          <h1 className="font-serif text-[3.5rem] md:text-[5.5rem] leading-[1.1] font-light mb-8 max-w-4xl mx-auto">
            Ayurvedic Purity, <span className="italic">Redefined</span> for Modernity.
          </h1>
          <p className="font-sans text-[1.1rem] md:text-[1.25rem] text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Pureable was born from a singular commitment: to restore the sanctity of self-care through chemical-free, botanical excellence.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 md:px-16 mb-40">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] font-light mb-8 leading-tight">
              A Mission of <br/><span className="italic text-[var(--color-sage-dark)]">Uncompromising</span> Quality.
            </h2>
            <div className="space-y-6 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed">
              <p>
                In a world saturated with synthetic alternatives, Pureable stands as a sanctuary of transparency. We believe that what you put on your body is as vital as what you put in it.
              </p>
              <p>
                Our formulations are rooted in ancient Ayurvedic wisdom, stripped of parabens, sulfates, and artificial fragrances. We don't just create products; we curate rituals of purity.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 aspect-[4/5] relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(44,36,22,0.1)]"
          >
            <Image 
              src="/images/about/ingredients.png" 
              alt="Ayurvedic Ingredients" 
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="bg-[var(--color-warm)] py-32 mb-40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="aspect-square relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(44,36,22,0.08)]"
            >
              <Image 
                src="/images/about/story.png" 
                alt="Our Visionary Story" 
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <span className="text-[var(--color-earth-dark)] font-medium tracking-[0.3em] uppercase text-[0.7rem] mb-6 block">The Founder's Vision</span>
              <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] font-light mb-8 leading-tight">
                Young Vision, <br/>Technical <span className="italic font-normal">Precision</span>.
              </h2>
              <div className="space-y-6 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  At just 19 years old, <span className="text-[var(--color-text)] font-medium">Aasim</span> envisioned a brand that could bridge the gap between traditional herbal efficacy and modern luxury. Pureable is the realization of that vision—a testament to youthful audacity and heritage-driven passion.
                </p>
                <p>
                  This vision is fortified by the technical backing of <span className="text-[var(--color-text)] font-medium">ATASS Solutions</span>, ensuring that every artisanal blend is supported by rigorous research and sophisticated operational excellence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="container mx-auto px-6 md:px-16 mb-40">
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-[3rem] md:text-[4rem] font-light mb-6">The Soul of Our Formulas</h2>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">We source only the rarest, most potent ingredients from nature's apothecary.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12"
        >
          {/* Ingredient 1: Honey */}
          <motion.div variants={fadeInUp} className="group">
            <div className="aspect-[3/4] relative mb-6 rounded-2xl overflow-hidden">
               <div className="absolute inset-0 bg-[var(--color-earth)] opacity-10 group-hover:opacity-0 transition-opacity duration-500 z-10" />
               <Image 
                src="https://images.unsplash.com/photo-1589182397057-b1617b71ad3a?q=80&w=1974&auto=format&fit=crop" 
                alt="Wild Forest Honey" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="font-serif text-[1.5rem] mb-2">Wild Forest Honey</h3>
            <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed">A natural humectant that draws moisture into the skin, leaving it plump and radiant.</p>
          </motion.div>

          {/* Ingredient 2: Kesar */}
          <motion.div variants={fadeInUp} className="group">
            <div className="aspect-[3/4] relative mb-6 rounded-2xl overflow-hidden">
               <div className="absolute inset-0 bg-[var(--color-earth)] opacity-10 group-hover:opacity-0 transition-opacity duration-500 z-10" />
               <Image 
                src="https://images.unsplash.com/photo-1615485244980-362c1404c042?q=80&w=2070&auto=format&fit=crop" 
                alt="Kashmiri Kesar" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="font-serif text-[1.5rem] mb-2">Pure Kashmiri Kesar</h3>
            <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed">The 'Golden Spice' of skincare, known for its brightening properties and antioxidant rich profile.</p>
          </motion.div>

          {/* Ingredient 3: Charcoal */}
          <motion.div variants={fadeInUp} className="group">
            <div className="aspect-[3/4] relative mb-6 rounded-2xl overflow-hidden">
               <div className="absolute inset-0 bg-[var(--color-earth)] opacity-10 group-hover:opacity-0 transition-opacity duration-500 z-10" />
               <Image 
                src="https://images.unsplash.com/photo-1542364214-da488f5f653f?q=80&w=1964&auto=format&fit=crop" 
                alt="Activated Charcoal" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="font-serif text-[1.5rem] mb-2">Activated Charcoal</h3>
            <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed">Deeply detoxifying agent that draws out impurities and balances oil without stripping the skin.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-16 text-center border-t border-[rgba(196,168,130,0.2)] pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-[2.5rem] md:text-[4rem] font-light mb-10">Begin Your Purity Ritual.</h2>
          <Link href="/shop" className="btn-primary inline-flex scale-110">
            Explore Our Collection
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
