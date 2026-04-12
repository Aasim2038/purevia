"use client";
import React from 'react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } },
};

export default function NatureSection() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-16" id="about">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[6rem] items-center">
        
        {/* Visuals */}
        <motion.div 
          className="relative h-[300px] md:h-[550px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={fadeUp as any}
            className="absolute top-0 left-0 w-[72%] h-[260px] md:h-[420px] rounded-3xl border border-[rgba(196,168,130,0.25)] flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(160deg, var(--color-warm) 0%, rgba(138,158,126,0.25) 100%)' }}
          >
            <div className="text-center p-8">
              <div 
                className="font-serif text-[4rem] md:text-[8rem] font-light text-[var(--color-sage)] leading-none opacity-50"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                100
              </div>
              <p 
                className="text-[1.1rem] text-[var(--color-sage-dark)] italic mt-2 font-serif"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                percent natural
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeUp as any}
            className="absolute bottom-0 right-0 w-[55%] h-[120px] md:h-[180px] bg-[var(--color-sage-dark)] rounded-[24px] flex flex-col justify-center p-[1.8rem] overflow-hidden"
          >
            <p 
              className="text-[1rem] md:text-[1.3rem] font-light text-[rgba(247,243,237,0.9)] italic leading-snug font-serif"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              "Nature has the best answers. We just listen."
            </p>
            <span className="text-[0.72rem] tracking-[0.15em] uppercase text-[rgba(247,243,237,0.5)] mt-3 block">
              Puroable Promise
            </span>
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp as any} className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center gap-3">
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
            Our Story
          </motion.div>

          <motion.h2 
            variants={fadeUp as any} 
            className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.2] mb-6 text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Rooted in <em className="italic text-[var(--color-sage-dark)]">nature,</em><br/>
            backed by trust
          </motion.h2>

          <motion.p variants={fadeUp as any} className="text-[0.95rem] text-[var(--color-text-muted)] leading-[2] mb-[1.2rem] font-light">
            Puroable was born from a simple belief — that the best skincare and haircare doesn't need a chemistry lab. It needs the right plants, the right process, and the right intention.
          </motion.p>
          <motion.p variants={fadeUp as any} className="text-[0.95rem] text-[var(--color-text-muted)] leading-[2] mb-[1.2rem] font-light">
            Every product we make is free from parabens, sulphates, artificial fragrances, and synthetic chemicals. Just pure, effective nature — the way it was meant to be.
          </motion.p>

          <div className="mt-[2.5rem] flex flex-col gap-4">
            <motion.div variants={fadeUp as any} className="flex items-center gap-4 p-4 border border-[rgba(138,158,126,0.2)] rounded-xl transition-all duration-300 hover:bg-[rgba(138,158,126,0.06)] hover:border-[rgba(138,158,126,0.4)]">
              <div className="w-[36px] h-[36px] bg-[rgba(138,158,126,0.15)] rounded-lg flex items-center justify-center text-[1rem] shrink-0">🌱</div>
              <div className="text-[0.88rem] text-[var(--color-text-muted)] leading-[1.5]">
                <strong className="block text-[var(--color-text)] font-medium text-[0.92rem]">Zero Chemicals</strong>
                No parabens, sulphates, or synthetic additives — ever.
              </div>
            </motion.div>

            <motion.div variants={fadeUp as any} className="flex items-center gap-4 p-4 border border-[rgba(138,158,126,0.2)] rounded-xl transition-all duration-300 hover:bg-[rgba(138,158,126,0.06)] hover:border-[rgba(138,158,126,0.4)]">
              <div className="w-[36px] h-[36px] bg-[rgba(138,158,126,0.15)] rounded-lg flex items-center justify-center text-[1rem] shrink-0">🤝</div>
              <div className="text-[0.88rem] text-[var(--color-text-muted)] leading-[1.5]">
                <strong className="block text-[var(--color-text)] font-medium text-[0.92rem]">Ethically Sourced</strong>
                Ingredients sourced responsibly from trusted natural farms.
              </div>
            </motion.div>

            <motion.div variants={fadeUp as any} className="flex items-center gap-4 p-4 border border-[rgba(138,158,126,0.2)] rounded-xl transition-all duration-300 hover:bg-[rgba(138,158,126,0.06)] hover:border-[rgba(138,158,126,0.4)]">
              <div className="w-[36px] h-[36px] bg-[rgba(138,158,126,0.15)] rounded-lg flex items-center justify-center text-[1rem] shrink-0">💚</div>
              <div className="text-[0.88rem] text-[var(--color-text-muted)] leading-[1.5]">
                <strong className="block text-[var(--color-text)] font-medium text-[0.92rem]">Skin Safe</strong>
                Gentle enough for sensitive skin. Tested with care.
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
