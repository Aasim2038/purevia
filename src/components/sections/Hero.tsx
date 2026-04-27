"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2, // Small delay before hero text begins
      ease: [0.23, 1, 0.32, 1]
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      mass: 0.8,
    },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative h-screen flex items-center overflow-hidden" id="hero">
      {/* Background with multiple gradients */}
      <div 
        className="absolute inset-0 z-0 bg-[var(--color-cream)]" 
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(138,158,126,0.15) 0%, rgba(247, 243, 237, 0) 70%),
            radial-gradient(ellipse 50% 80% at 20% 80%, rgba(196,168,130,0.12) 0%, rgba(247, 243, 237, 0) 60%)
          `
        }} 
      />
      
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Parallax leaves */}
      <motion.div 
        className="absolute opacity-[0.08] pointer-events-none z-[1]" style={{ width: 300, height: 300, top: -60, right: '55%', y: y1 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M50 5 C30 20 10 40 20 70 C30 95 50 95 50 95 C50 95 70 95 80 70 C90 40 70 20 50 5Z" fill="#5C7352"/>
          <path d="M50 10 L50 90" stroke="#8A9E7E" strokeWidth="1.5" opacity="0.5"/>
          <path d="M35 30 Q50 40 65 30" stroke="#8A9E7E" strokeWidth="0.8" opacity="0.4"/>
          <path d="M28 50 Q50 60 72 50" stroke="#8A9E7E" strokeWidth="0.8" opacity="0.4"/>
          <path d="M30 68 Q50 76 70 68" stroke="#8A9E7E" strokeWidth="0.8" opacity="0.4"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute opacity-[0.06] pointer-events-none z-[1]" style={{ width: 200, height: 200, bottom: '10%', right: '5%', y: y2 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="35" ry="48" fill="#C4A882" transform="rotate(-20 50 50)"/>
          <path d="M50 8 L50 92" stroke="#F7F3ED" strokeWidth="1.5" opacity="0.4" transform="rotate(-20 50 50)"/>
        </svg>
      </motion.div>

      <motion.div 
        className="absolute opacity-[0.05] pointer-events-none z-[1]" style={{ width: 160, height: 160, top: '15%', left: '35%', y: y3 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="#8A9E7E"/>
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-[700px] px-6 md:px-16 container mx-auto pt-24 md:pt-0">
        <motion.div
          variants={staggerContainer as any}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp as any} className="text-[0.78rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-6 flex items-center gap-3">
            <span className="block w-8 h-[1px] bg-[var(--color-sage-dark)]" />
            Same Day Delivery in Nagpur · 100% Natural & Chemical Free
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={fadeUp as any} 
            className="font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-light mb-6 text-[var(--color-text)]"
            style={{ lineHeight: 1.0, letterSpacing: '-0.01em', fontFamily: 'var(--font-cormorant)' }}
          >
            Beauty that<br />
            feels <em className="italic text-[var(--color-sage-dark)]">truly</em><br />
            natural
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp as any} className="text-[1rem] text-[var(--color-text-muted)] leading-[1.8] max-w-[400px] mb-10 font-light">
            Crafted from nature's finest ingredients. No chemicals, no compromise — only pure, gentle care for your skin and hair.
          </motion.p>

          {/* Actions */}
          <motion.div variants={fadeUp as any} className="flex gap-4 items-center">
            <Link href="/shop" className="btn-primary">
              Explore Products
            </Link>
            <Link href="#about" className="btn-ghost" style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Our Story &rarr;
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop: Clean Typography (no image box) */}
      <motion.div 
        className="absolute right-[8%] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-6 max-md:hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="w-[420px] h-[420px] relative overflow-hidden pointer-events-none flex items-center justify-center border border-[rgba(196,168,130,0.3)]"
          style={{ background: 'linear-gradient(135deg, var(--color-warm) 0%, rgba(138,158,126,0.3) 100%)' }}
          animate={{
            borderRadius: [
              "60% 40% 55% 45% / 50% 60% 40% 50%",
              "50% 50% 40% 60% / 60% 40% 55% 45%",
              "40% 60% 50% 50% / 45% 55% 50% 55%",
              "55% 45% 60% 40% / 55% 45% 60% 40%",
              "60% 40% 55% 45% / 50% 60% 40% 50%"
            ]
          }}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 8 }}
        >
          {/* SVG Leaf background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-80" style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.1))' }}>
            <svg viewBox="0 0 200 200" width="160" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M100 180 C100 180 80 120 100 40" stroke="#5C7352" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M100 140 C140 130 160 90 150 70 C140 50 110 90 100 140" fill="#8A9E7E"/>
               <path d="M100 110 C60 100 40 60 50 40 C60 20 90 60 100 110" fill="#8A9E7E" opacity="0.9"/>
               <path d="M100 70 C130 60 140 30 130 10 C120 -10 100 30 100 70" fill="#C4A882" opacity="0.8"/>
            </svg>
          </div>
        </motion.div>
        
        <div className="absolute top-[1.5rem] right-[1.5rem] bg-[var(--color-white)]/80 border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3 text-[0.75rem] tracking-[0.05em] text-[var(--color-text-muted)] backdrop-blur-md z-[3]">
          <strong className="block text-[1.3rem] text-[var(--color-sage-dark)] font-medium leading-tight">100%</strong>
          Chemical Free
        </div>
      </motion.div>

      {/* Mobile: Hero Video */}
      <motion.div
        className="absolute inset-0 md:hidden z-5 flex items-end justify-center pb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <video
          src="/videos/hero-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[85%] h-auto max-h-[40vh] object-contain rounded-2xl"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-[3rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[0.5rem] text-[0.72rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)] z-[3]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div 
          className="w-[1px] h-[48px] bg-gradient-to-b from-[var(--color-earth)] to-[rgba(247,243,237,0)] origin-top"
          animate={{ scaleY: [0, 1, 1, 0], transformOrigin: ["top", "top", "bottom", "bottom"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", times: [0, 0.5, 0.51, 1] }}
        />
        Scroll
      </motion.div>
    </section>
  );
}
