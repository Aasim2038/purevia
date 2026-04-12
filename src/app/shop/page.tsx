"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui/ProductCard';
import Footer from '@/components/sections/Footer';

const categories = ["All", "Skin Care", "Hair Care", "Body Care"];

const allProducts = [
  {
    id: "p1",
    name: "Neem Aloe Face Wash",
    desc: "Deep cleansing with natural neem & cooling aloe vera. Removes impurities gently.",
    price: 349,
    category: "Skin Care",
    size: "100ml",
    icon: "🌿",
    badge: "Bestseller",
    bg: "linear-gradient(135deg, #E8F5E0, #C8E6B8)"
  },
  {
    id: "p2",
    name: "Rose Turmeric Glow Serum",
    desc: "Brightening serum with rose water & turmeric. Reduces dark spots naturally.",
    price: 499,
    category: "Skin Care",
    size: "30ml",
    icon: "🌹",
    badge: "New",
    bg: "linear-gradient(135deg, #FDF0E0, #F5D5A8)"
  },
  {
    id: "p3",
    name: "Coconut Bhringraj Hair Oil",
    desc: "Nourishing hair oil blend for strong, shiny, naturally healthy hair growth.",
    price: 299,
    category: "Hair Care",
    size: "150ml",
    icon: "🥥",
    badge: null,
    bg: "linear-gradient(135deg, #E8EFF8, #C8D8F0)"
  },
  {
    id: "p4",
    name: "Hibiscus Face Pack",
    desc: "Anti-ageing hibiscus clay mask for youthful, glowing, refreshed skin.",
    price: 249,
    category: "Skin Care",
    size: "75g",
    icon: "🌸",
    badge: "Popular",
    bg: "linear-gradient(135deg, #F5E8F0, #E8C8DC)"
  },
  {
    id: "p5",
    name: "Green Tea Eye Cream",
    desc: "Reduces dark circles & puffiness with antioxidant-rich green tea extracts.",
    price: 399,
    category: "Skin Care",
    size: "15g",
    icon: "🍵",
    badge: null,
    bg: "linear-gradient(135deg, #F0F5E8, #D8E8C0)"
  },
  {
    id: "p6",
    name: "Argan Almond Hair Serum",
    desc: "Frizz-control serum for smooth, detangled, and extremely shiny hair.",
    price: 450,
    category: "Hair Care",
    size: "50ml",
    icon: "✨",
    badge: null,
    bg: "linear-gradient(135deg, #FFF9E6, #FFE2A6)"
  },
  {
    id: "p7",
    name: "Sandalwood Body Wash",
    desc: "Luxurious, hydrating body wash with a calming natural sandalwood scent.",
    price: 599,
    category: "Body Care",
    size: "250ml",
    icon: "🪵",
    badge: "Bestseller",
    bg: "linear-gradient(135deg, #F5EFEB, #E0CDBA)"
  },
  {
    id: "p8",
    name: "Lavender Bath Salt",
    desc: "Relaxing muscle-soothing bath salt blended with pure lavender essential oils.",
    price: 350,
    category: "Body Care",
    size: "200g",
    icon: "💜",
    badge: null,
    bg: "linear-gradient(135deg, #F3E8FC, #D8BFE8)"
  },
  {
    id: "p9",
    name: "Onion Seed Hair Oil",
    desc: "Potent formulation to reduce hair fall and stimulate thicker hair growth.",
    price: 320,
    category: "Hair Care",
    size: "100ml",
    icon: "🧅",
    badge: "Popular",
    bg: "linear-gradient(135deg, #FCE8E8, #EBA1A1)"
  },
  {
    id: "p10",
    name: "Coffee Sugar Body Scrub",
    desc: "Exfoliating scrub to remove dead skin cells and reveal a radiant, polished glow.",
    price: 420,
    category: "Body Care",
    size: "100g",
    icon: "☕",
    badge: "New",
    bg: "linear-gradient(135deg, #EBE1D7, #C6A990)"
  },
  {
    id: "p11",
    name: "Kumkumadi Night Cream",
    desc: "Ayurvedic night cream for repairing and rejuvenating the skin overnight.",
    price: 699,
    category: "Skin Care",
    size: "50g",
    icon: "🌙",
    badge: "Premium",
    bg: "linear-gradient(135deg, #FFF0B3, #FFD633)"
  },
  {
    id: "p12",
    name: "Pure Aloe Vera Gel",
    desc: "Multipurpose cooling gel for intense skin hydration and scalp care.",
    price: 200,
    category: "Skin Care",
    size: "100g",
    icon: "🌵",
    badge: null,
    bg: "linear-gradient(135deg, #E6FFFA, #99F2D1)"
  }
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Default");
  const { addToCart } = useCart();

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    }

    if (sortOption === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, sortOption]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col font-sans">

      <main className="flex-1 pt-32 pb-24 px-6 md:px-16" id="shop-catalog">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center justify-center gap-3"
          >
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
            Full Collection
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.15]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Shop <em className="italic text-[var(--color-sage-dark)]">All</em>
          </motion.h1>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-12 max-w-[1400px] mx-auto">
          {/* Search */}
          <div className="relative w-full xl:w-auto">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full xl:w-[280px] bg-transparent border-b border-[rgba(196,168,130,0.5)] py-2 pl-8 pr-1 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-sage-dark)] transition-colors text-[0.95rem] font-light"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 w-full xl:w-auto">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300 border ${
                  selectedCategory === cat 
                  ? 'bg-[var(--color-sage-dark)] text-white border-[var(--color-sage-dark)]' 
                  : 'bg-transparent text-[var(--color-text-muted)] border-[rgba(196,168,130,0.3)] hover:border-[var(--color-sage-dark)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="w-full xl:w-auto flex justify-center xl:justify-end">
            <div className="relative border-b border-[rgba(196,168,130,0.5)] pb-1 flex items-center">
              <span className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mr-2">Sort:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border-0 text-[0.8rem] tracking-[0.05em] text-[var(--color-text)] focus:outline-none cursor-pointer p-0 pr-4 appearance-none"
              >
                <option value="Default">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-[1400px] mx-auto">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={true} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-[3rem] mb-4 opacity-50">🍃</div>
              <h3 className="font-serif text-[1.8rem] text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>No products found</h3>
              <p className="text-[var(--color-text-muted)] font-light">We couldn't find anything matching your criteria. Try adjusting your filters or search.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortOption("Default"); }}
                className="mt-6 px-6 py-2 border border-[var(--color-sage-dark)] text-[var(--color-sage-dark)] rounded-full text-[0.8rem] tracking-[0.1em] uppercase hover:bg-[var(--color-sage-dark)] hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
