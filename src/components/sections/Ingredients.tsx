"use client";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ingredients = [
  { icon: '🌿', name: 'Neem', desc: 'Powerful antibacterial & antifungal properties. Clears acne and purifies skin naturally.' },
  { icon: '🌵', name: 'Aloe Vera', desc: 'The ultimate skin soother. Hydrates, heals, and calms irritated or sensitive skin.' },
  { icon: '🌹', name: 'Rose Water', desc: 'Natural toner that balances skin pH, reduces redness, and adds a natural glow.' },
  { icon: '💛', name: 'Turmeric', desc: 'Ancient brightening spice. Reduces pigmentation and gives the skin a golden radiance.' },
  { icon: '🥥', name: 'Coconut Oil', desc: 'Deep nourishment for hair & skin. Strengthens hair from root to tip.' },
  { icon: '🌸', name: 'Hibiscus', desc: "Nature's botox. Rich in amino acids that boost collagen and fight ageing." },
  { icon: '🪷', name: 'Sandalwood', desc: 'Soothing and fragrant. Calms inflammation and brightens the complexion.' },
  { icon: '🍵', name: 'Green Tea', desc: 'Loaded with antioxidants. Fights free radicals and reduces signs of ageing.' }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function Ingredients() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollWidth <= clientWidth) return;
    const index = Math.round((scrollLeft / (scrollWidth - clientWidth)) * (ingredients.length - 1));
    setActiveIndex(Math.max(0, Math.min(index, ingredients.length - 1)));
  };

  const scrollTo = (index: number) => {
    if (!containerRef.current) return;
    const { scrollWidth, clientWidth } = containerRef.current;
    const scrollPosition = (index / (ingredients.length - 1)) * (scrollWidth - clientWidth);
    
    // Temporarily turn off snapping for the smooth auto-scroll to avoid conflict
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setActiveIndex(index);
    
    // Turn snapping back on after scroll finishes
    setTimeout(() => {
      if (containerRef.current) containerRef.current.style.scrollSnapType = '';
    }, 600);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Fast scroll
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-[var(--color-warm)] py-12 md:py-24 overflow-hidden select-none" id="ingredients">
      {/* Header */}
      <motion.div 
        className="px-6 md:px-16 mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp as any} className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center gap-3">
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
          What's Inside
        </motion.div>
        
        <motion.h2 
          variants={fadeUp as any} 
          className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.15] text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Ingredients straight<br/>
          from <em className="italic text-[var(--color-sage-dark)]">Mother Nature</em>
        </motion.h2>
      </motion.div>

      {/* Horizontal Scroll Track */}
      <motion.div 
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className={`flex gap-4 md:gap-6 px-6 md:px-16 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:shrink-0 after:w-2 md:after:w-8 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {ingredients.map((item, idx) => (
          <motion.div 
            key={idx}
            variants={fadeRight as any}
            className={`w-[85%] md:w-[320px] bg-[var(--color-white)] rounded-[20px] p-8 md:snap-start border border-[rgba(196,168,130,0.2)] shrink-0 transition-transform duration-300 ${!isDragging ? 'hover:-translate-y-2' : ''} ${isDragging ? 'pointer-events-none snap-none' : 'snap-center'}`}
          >
            <span className="text-[2.5rem] mb-4 block leading-none pointer-events-none">{item.icon}</span>
            <div 
              className="font-serif text-[1.4rem] font-normal mb-2 text-[var(--color-text)] pointer-events-none"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {item.name}
            </div>
            <div className="text-[0.83rem] text-[var(--color-text-muted)] leading-[1.7] font-light pointer-events-none">
              {item.desc}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {ingredients.map((_, i) => (
          <button 
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-[4px] rounded-full transition-all duration-300 border-none cursor-pointer focus:outline-none ${activeIndex === i ? 'w-8 bg-[var(--color-sage-dark)] opacity-80' : 'w-2 bg-[var(--color-sage)] opacity-30 hover:opacity-50'}`}
            aria-label={`Scroll to ingredient ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
