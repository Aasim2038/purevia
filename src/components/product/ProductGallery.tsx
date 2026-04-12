"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  "linear-gradient(135deg, #E8F5E0 0%, #D4E5CB 100%)", // Mock Neem
  "linear-gradient(135deg, #FDF0E0 0%, #E8D5B0 100%)", // Mock Sandalwood
  "linear-gradient(135deg, #F5E6E8 0%, #E0D0D2 100%)", // Mock Rose
];

export default function ProductGallery() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Swipe handlers
  const handleDragEnd = (_e: any, info: any) => {
    if (info.offset.x < -50 && activeIdx < images.length - 1) setActiveIdx(activeIdx + 1);
    if (info.offset.x > 50 && activeIdx > 0) setActiveIdx(activeIdx - 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(2.5rem,4vw,3.5rem)] text-[var(--color-sage-dark)] font-light cursor-grab active:cursor-grabbing"
            style={{ background: images[activeIdx], fontFamily: 'var(--font-cormorant)' }}
          >
            Puroable
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-[12px] overflow-hidden transition-all duration-300 border-2 ${activeIdx === idx ? 'border-[var(--color-sage)] scale-105 shadow-[0_4px_15px_rgba(138,158,126,0.15)]' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
          >
            <div className="absolute inset-0" style={{ background: img }} />
          </button>
        ))}
      </div>
    </div>
  );
}
