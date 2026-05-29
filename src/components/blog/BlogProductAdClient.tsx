'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export interface AdProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock?: number;
  minOrderQty?: number;
}

interface BlogProductAdClientProps {
  product: AdProductData;
  ctaText?: string;
}

export default function BlogProductAdClient({ product, ctaText }: BlogProductAdClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const qty = product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : 1;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      maxStock: product.stock && product.stock > 0 ? product.stock : undefined,
      minQty: product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : undefined,
    }, qty);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const qty = product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : 1;

    // Add to cart to populate checkout context
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      maxStock: product.stock && product.stock > 0 ? product.stock : undefined,
      minQty: product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : undefined,
    }, qty);

    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <div className="my-12 p-6 md:p-8 bg-[var(--color-white)] rounded-3xl border border-[rgba(196,168,130,0.18)] shadow-[0_12px_40px_rgba(26,22,16,0.03)] hover:shadow-[0_16px_48px_rgba(92,115,82,0.06)] hover:border-[rgba(138,158,126,0.15)] transition-all duration-500 max-w-2xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
        
        {/* Product Image */}
        <div className="relative aspect-square w-full sm:w-40 md:w-48 rounded-2xl overflow-hidden bg-[var(--color-cream)] shrink-0 border border-[rgba(196,168,130,0.1)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-w-640px) 100vw, 192px"
            loading="lazy"
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 text-center sm:text-left flex flex-col justify-between h-full">
          <div>
            {/* Category and Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] font-medium text-[var(--color-earth-dark)]">
                Recommended Product
              </span>
              <span className="text-[var(--color-text-muted)] text-[0.65rem]">•</span>
              <div className="flex items-center gap-0.5 text-xs text-[var(--color-sage-dark)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Product Title */}
            <h3 className="font-serif text-xl md:text-2xl font-light text-[var(--color-text)] mb-2 leading-snug">
              {product.name}
            </h3>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-[var(--color-text-muted)] font-light leading-[1.6] mb-5">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[rgba(196,168,130,0.1)] flex flex-wrap items-center justify-between gap-4">
            <div className="text-lg font-medium text-[var(--color-earth-dark)]">
              ₹{product.price}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-[0.1em] border transition-all duration-300 flex items-center justify-center gap-2 select-none active:scale-95 ${
                  isAdded
                    ? 'bg-[var(--color-sage-dark)] text-white border-[var(--color-sage-dark)]'
                    : 'bg-transparent text-[var(--color-text)] border-[rgba(44,36,22,0.3)] hover:border-[var(--color-text)] hover:bg-[var(--color-warm)]/20'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1.5"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-[var(--color-text)] hover:bg-[var(--color-sage-dark)] text-white rounded-full text-xs font-medium uppercase tracking-[0.1em] transition-all duration-300 shadow-sm active:scale-95 flex items-center justify-center"
              >
                {ctaText || 'Buy Now'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
