"use client";
import React from 'react';
import { motion } from 'framer-motion';

const items = [
  "Aloe Vera", "Rose Water", "Neem Extract", "Turmeric", "Coconut Oil", "Sandalwood", "Hibiscus", "Ashwagandha",
  "Aloe Vera", "Rose Water", "Neem Extract", "Turmeric", "Coconut Oil", "Sandalwood", "Hibiscus", "Ashwagandha"
];

export default function Marquee() {
  return (
    <div className="py-6 bg-[var(--color-text)] overflow-hidden flex w-full">
      <motion.div
        className="flex gap-12 whitespace-nowrap shrink-0 pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {items.map((item, i) => (
          <span 
            key={i} 
            className="font-serif text-[1.1rem] font-light italic text-[rgba(247,243,237,0.7)] tracking-[0.05em] flex items-center gap-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {item} <span className="w-1 h-1 bg-[var(--color-sage)] rounded-full"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
