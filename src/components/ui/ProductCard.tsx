"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export interface ProductType {
  id?: string;
  name: string;
  desc: string;
  price: number | string;
  size: string;
  icon: string;
  badge?: string | null;
  category: string;
  bg: string;
  stock?: number;
  images?: string[];
  imageUrl?: string | null;
  minOrderQty?: number;
  isKit?: boolean;
}

interface ProductCardProps {
  product: ProductType;
  variants?: Variants;
  layout?: boolean;
  priority?: boolean;
}

export default function ProductCard({ product, variants, layout, priority }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Normalize string price tags like '₹349' to number for CartContext processing
  const numericPrice = typeof product.price === 'string' 
    ? parseInt(product.price.replace(/[^0-9]/g, ''), 10) 
    : product.price;
  const thumbnail = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.imageUrl;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const qty = product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : 1;
    addToCart({
      id: product.id || `temp-${product.name}`,
      name: product.name,
      price: numericPrice || 0,
      imageUrl: thumbnail || null,
      maxStock: typeof product.stock === "number" && product.stock > 0 ? product.stock : undefined,
      minQty: product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : undefined,
    }, qty);
    
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <motion.div 
      layout={layout}
      variants={variants}
      initial={variants ? undefined : { opacity: 0, scale: 0.95 }}
      animate={variants ? undefined : { opacity: 1, scale: 1 }}
      exit={variants ? undefined : { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={variants ? undefined : { duration: 0.4, type: "spring", bounce: 0.25 }}
      className="group relative rounded-[20px] overflow-hidden bg-[var(--color-white)] border border-[rgba(196,168,130,0.15)] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(92,115,82,0.12)] cursor-pointer flex flex-col h-full"
    >
      <Link href={`/product/${product.id || '123'}`} className="absolute inset-0 z-20" aria-label={`View ${product.name}`}></Link>
      
      <div className="aspect-square sm:aspect-auto sm:h-[280px] relative overflow-hidden flex items-center justify-center shrink-0 bg-[var(--color-cream)]">
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply" style={{ background: product.bg }} />
        {thumbnail ? (
          <Image src={thumbnail} alt={product.name} fill priority={priority} className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="text-[5rem] relative z-[1] drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-translate-y-1">
            {product.icon}
          </div>
        )}
        {product.isKit && (
          <span className="absolute top-4 left-4 bg-[#D48806]/90 text-white text-[0.68rem] tracking-[0.12em] uppercase py-1 px-3 rounded-full z-20 backdrop-blur-[8px]">
            Combo/Kit
          </span>
        )}
        {product.badge && !product.isKit && (
          <span className="absolute top-4 left-4 bg-[var(--color-sage-dark)]/90 text-white text-[0.68rem] tracking-[0.12em] uppercase py-1 px-3 rounded-full z-20 backdrop-blur-[8px]">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="font-serif text-[1.1rem] sm:text-[1.4rem] font-normal mb-1 text-[var(--color-text)] leading-snug line-clamp-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {product.name}
        </div>
        <div className="text-[0.75rem] sm:text-[0.82rem] text-[var(--color-text-muted)] mb-4 sm:mb-5 leading-[1.6] font-light flex-1 line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem]">
          {product.desc}
        </div>
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-[rgba(196,168,130,0.1)] relative z-30">
          <div className="text-[1rem] sm:text-[1.2rem] font-medium text-[var(--color-earth-dark)]">
            ₹{numericPrice} <span className="text-[0.7rem] sm:text-[0.78rem] text-[var(--color-text-muted)] font-light ml-1">{product.size}</span>
          </div>
          <button 
            onClick={handleAdd}
            className={`w-[44px] h-[44px] border-none rounded-full flex items-center justify-center transition-all duration-300 shadow-sm focus:outline-none active:scale-95 ${isAdded ? 'bg-[var(--color-sage-dark)] text-white scale-110' : 'bg-[var(--color-text)] text-white hover:bg-[var(--color-sage-dark)] hover:scale-110'}`}
            aria-label="Add to Cart"
          >
            {isAdded ? (
              <motion.svg initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></motion.svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
