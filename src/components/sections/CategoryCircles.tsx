"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HorizontalScroller from "@/components/storefront/HorizontalScroller";

const categories = [
  { title: "Skin Care", icon: "🌿", href: "/shop?category=Skin%20Care", color: "from-[#E8F5E0] to-[#C8E6B8]" },
  { title: "Hair Care", icon: "🥥", href: "/shop?category=Hair%20Care", color: "from-[#E8EFF8] to-[#C8D8F0]" },
  { title: "Body Care", icon: "🪵", href: "/shop?category=Body%20Care", color: "from-[#F5EFEB] to-[#E0CDBA]" },
  { title: "Face Masks", icon: "💎", href: "/shop?category=Face%20Masks", color: "from-[#FEF3E0] to-[#F0DCC8]" },
  { title: "Curated Kits", icon: "🎁", href: "/shop?category=Curated%20Kits", color: "from-[#F0F8FF] to-[#E0EFFF]" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function CategoryCircles() {
  return (
    <section className="py-12 md:py-16 bg-[var(--color-cream)]">
      <div className="px-6 md:px-16 container mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="mb-8"
        >
          <motion.div variants={fadeUp} className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-sage-dark)] mb-2">
            Quick Access
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] font-light leading-[1.1] text-[var(--color-text)]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Browse by Category
          </motion.h2>
        </motion.div>

        <HorizontalScroller>
          <div className="flex gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link 
                  href={category.href}
                  className="group flex flex-col items-center gap-3 min-w-[100px] sm:min-w-[120px]"
                >
                  {/* Circular Category Icon */}
                  <div className={`w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-[2.5rem] sm:text-[3rem] border-2 border-white shadow-sm group-hover:shadow-md transition-all group-hover:scale-105`}>
                    {category.icon}
                  </div>
                  
                  {/* Category Name */}
                  <p className="text-[0.85rem] sm:text-[0.95rem] font-serif text-[var(--color-text)] text-center group-hover:text-[var(--color-sage-dark)] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {category.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </HorizontalScroller>
      </div>
    </section>
  );
}
