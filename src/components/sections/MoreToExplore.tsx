"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard, { ProductType } from "@/components/ui/ProductCard";

type MoreToExploreProps = {
  products: ProductType[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function MoreToExplore({ products }: MoreToExploreProps) {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-cream)]">
      <div className="px-6 md:px-16 container mx-auto max-w-[1400px]">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="mb-12"
        >
          <motion.div variants={fadeUp} className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-sage-dark)] mb-2">
            Discover
          </motion.div>
          <div className="flex justify-between items-end mb-2">
            <motion.h2 variants={fadeUp} className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-light leading-[1.1] text-[var(--color-text)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              More to Explore
            </motion.h2>
            <Link href="/shop" className="text-[0.75rem] tracking-[0.14em] uppercase text-[var(--color-sage-dark)] border-b border-[var(--color-sage-dark)] pb-1 hover:text-[var(--color-earth-dark)] hover:border-[var(--color-earth-dark)] transition-colors hidden sm:block">
              View All
            </Link>
          </div>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 2) * 0.1, duration: 0.5 }}
              className="flex"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-12 sm:hidden"
        >
          <Link href="/shop" className="btn-primary">
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
