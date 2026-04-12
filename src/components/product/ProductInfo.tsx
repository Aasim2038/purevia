"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductInfo() {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = {
    id: "p1",
    name: "Neem Purifying Face Wash",
    price: 1200,
  };

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col justify-center h-full pt-8 md:pt-0">
      <div className="text-[0.75rem] tracking-[0.2em] uppercase text-[var(--color-sage-dark)] mb-4">Skincare</div>
      <h1 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.1] text-[var(--color-text)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        {product.name}
      </h1>
      <div className="text-[1.5rem] text-[var(--color-earth)] font-serif italic mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
        ₹{product.price}
      </div>
      <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-[1.8] font-light mb-10 max-w-[500px]">
        A daily purifying face wash infused with pure Neem and Turmeric. Clears breakouts, balances oil production, and leaves the skin feeling naturally fresh. 100% free from SLS and parabens.
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-6 mb-10">
        <span className="text-[0.8rem] uppercase tracking-[0.1em] text-[var(--color-text)] font-medium">Quantity</span>
        <div className="flex items-center bg-[var(--color-white)] rounded-full border border-[rgba(138,158,126,0.3)]">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-l-full focus:outline-none">−</button>
          <span className="w-8 text-center text-[0.9rem] font-medium">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-r-full focus:outline-none">+</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button 
          onClick={handleAdd}
          className="flex-1 py-[1rem] px-[2rem] rounded-full border border-[var(--color-sage)] text-[var(--color-sage-dark)] text-[0.8rem] uppercase tracking-[0.1em] transition-all duration-300 hover:bg-[var(--color-sage)] hover:text-white focus:outline-none"
        >
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
        <button 
          onClick={handleAdd}
          className="flex-1 py-[1rem] px-[2rem] rounded-full bg-[var(--color-sage-dark)] text-white text-[0.8rem] uppercase tracking-[0.1em] transition-all duration-300 shadow-[0_4px_15px_rgba(138,158,126,0.3)] hover:shadow-[0_8px_25px_rgba(138,158,126,0.5)] hover:-translate-y-1 focus:outline-none"
        >
          Buy Now
        </button>
      </div>
      
      {/* Accordion mockup */}
      <div className="border-t border-[rgba(138,158,126,0.2)]">
        <div className="py-4 flex justify-between items-center cursor-pointer group">
          <span className="text-[0.85rem] uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-sage-dark)]">Ingredients</span>
          <span className="text-[var(--color-sage)] text-[1.2rem] transition-transform group-hover:rotate-90">+</span>
        </div>
        <div className="border-t border-[rgba(138,158,126,0.2)] py-4 flex justify-between items-center cursor-pointer group">
          <span className="text-[0.85rem] uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-sage-dark)]">How to Use</span>
          <span className="text-[var(--color-sage)] text-[1.2rem] transition-transform group-hover:rotate-90">+</span>
        </div>
        <div className="border-t border-[rgba(138,158,126,0.2)] py-4 flex justify-between items-center cursor-pointer group">
          <span className="text-[0.85rem] uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-sage-dark)]">Shipping & Returns</span>
          <span className="text-[var(--color-sage)] text-[1.2rem] transition-transform group-hover:rotate-90">+</span>
        </div>
      </div>
    </div>
  );
}
