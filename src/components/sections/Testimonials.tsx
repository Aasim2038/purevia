"use client";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    stars: "★★★★★",
    text: `"My skin literally transformed in 3 weeks. No irritation, no breakouts — just clear, glowing skin. I will never go back to chemical products!"`,
    initials: "PR",
    name: "Priya Rao",
    location: "Nagpur, Maharashtra"
  },
  {
    stars: "★★★★★",
    text: `"The hair oil is absolutely magical. My hair fall reduced so much and I can see new growth. Pure ingredients, pure results!"`,
    initials: "SK",
    name: "Sneha Kulkarni",
    location: "Pune, Maharashtra"
  },
  {
    stars: "★★★★★",
    text: `"Finally found a face wash that doesn't dry my skin. The neem face wash is so gentle yet effective. Love that it's 100% natural!"`,
    initials: "AM",
    name: "Anjali Mehta",
    location: "Mumbai, Maharashtra"
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

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollWidth <= clientWidth) return;
    const index = Math.round((scrollLeft / (scrollWidth - clientWidth)) * (testimonials.length - 1));
    setActiveIndex(Math.max(0, Math.min(index, testimonials.length - 1)));
  };

  const scrollTo = (index: number) => {
    if (!containerRef.current) return;
    const { scrollWidth, clientWidth } = containerRef.current;
    const scrollPosition = (index / (testimonials.length - 1)) * (scrollWidth - clientWidth);
    
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setActiveIndex(index);
    
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

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-12 md:py-24 px-6 md:px-16 bg-[var(--color-cream)] select-none" id="testimonials">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center gap-3">
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
          What Our Customers Say
        </motion.div>
        
        <motion.h2 
          variants={fadeUp} 
          className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.15] mb-16 text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Loved by <em className="italic text-[var(--color-sage-dark)]">thousands</em>
        </motion.h2>

        <motion.div 
          ref={containerRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:shrink-0 after:w-2 md:after:hidden ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab md:cursor-auto'}`}
          variants={staggerContainer}
        >
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUp}
              className={`w-[85%] md:w-auto shrink-0 bg-[var(--color-white)] rounded-[20px] p-8 border border-[rgba(138,158,126,0.2)] transition-transform duration-300 ${!isDragging ? 'hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(138,158,126,0.08)]' : ''} ${isDragging ? 'pointer-events-none snap-none' : 'snap-center md:snap-start'}`}
            >
              <div className="text-[var(--color-earth)] text-[0.85rem] tracking-[0.1em] mb-4 pointer-events-none">
                {test.stars}
              </div>
              <div 
                className="font-serif text-[1.2rem] font-light italic leading-[1.7] text-[var(--color-text)] mb-6 pointer-events-none"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {test.text}
              </div>
              <div className="flex items-center gap-4 pointer-events-none">
                <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[0.85rem] font-medium text-white bg-[var(--color-sage-dark)] shrink-0">
                  {test.initials}
                </div>
                <div className="text-[0.82rem] leading-tight flex-shrink min-w-0">
                  <strong className="block text-[var(--color-text)] font-medium mb-1 truncate">{test.name}</strong>
                  <span className="text-[var(--color-text-muted)] font-light truncate block">{test.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Active Dot Indicators (Mobile Only for Testimonials) */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button 
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-[4px] rounded-full transition-all duration-300 border-none cursor-pointer focus:outline-none ${activeIndex === i ? 'w-8 bg-[var(--color-sage-dark)] opacity-80' : 'w-2 bg-[var(--color-sage)] opacity-30 hover:opacity-50'}`}
              aria-label={`Scroll to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
