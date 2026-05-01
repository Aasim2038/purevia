"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

type ProductInfoProps = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    ingredients?: string;
    howToUse?: string;
    images?: string[];
    minOrderQty?: number;
    isKit?: boolean;
    packs?: any;
    kitItems?: any;
  };
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const minQty = product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : 1;
  const [qty, setQty] = useState(minQty);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'ingredients' | 'howToUse' | 'shipping' | null>('ingredients');
  const packs = Array.isArray(product.packs) ? product.packs : [];
  const kitItems = Array.isArray(product.kitItems) ? product.kitItems : [];
  const hasPacks = packs.length > 0;
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const currentPrice = hasPacks ? packs[selectedPackIndex].price : product.price;
  const formattedPrice = Number(currentPrice || 0).toLocaleString('en-IN');
  const descriptionText = product.description?.trim() || 'No description available for this product yet.';
  const ingredientsText = product.ingredients?.trim() || 'Ingredient details are currently unavailable.';
  const howToUseText = product.howToUse?.trim() || 'Usage instructions are currently unavailable.';
  const categoryText = product.category?.trim() || 'Uncategorized';
  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = !isOutOfStock && Number(product.stock) <= 10;
  const maxAllowedQty = Math.max(1, Number(product.stock) || 1);

  const accordionItems = [
    {
      id: 'ingredients' as const,
      title: 'Ingredients',
      content: ingredientsText,
    },
    {
      id: 'howToUse' as const,
      title: 'How to Use',
      content: howToUseText,
    },
    {
      id: 'shipping' as const,
      title: 'Shipping & Returns',
      content:
        'Orders dispatch within 24-48 hours. Standard delivery takes 3-7 business days. Returns are accepted within 7 days for unopened products.',
    },
  ];

  const handleAdd = () => {
    if (isOutOfStock) return;
    
    let itemName = product.name;
    let itemPrice = product.price;
    let safeQty = Math.min(Math.max(1, qty), maxAllowedQty);

    if (hasPacks) {
      const pack = packs[selectedPackIndex];
      itemName = `${product.name} - ${pack.label}`;
      itemPrice = pack.price;
      // When buying a pack, we treat it as 1 unit of that pack in the cart
      safeQty = 1; 
      if (maxAllowedQty < pack.quantity) {
        alert(`Only ${maxAllowedQty} individual units available in stock. Cannot fulfill this pack size.`);
        return;
      }
    } else {
      if (safeQty > maxAllowedQty) {
        alert(`Only ${maxAllowedQty} available in stock.`);
        return;
      }
    }

    addToCart(
      {
        id: hasPacks ? `${product.id}-${selectedPackIndex}` : product.id,
        name: itemName,
        price: itemPrice,
        imageUrl: product.images?.[0] || null,
        maxStock: hasPacks ? Math.floor(maxAllowedQty / packs[selectedPackIndex].quantity) : maxAllowedQty,
        minQty: hasPacks ? 1 : (product.minOrderQty && product.minOrderQty > 1 ? product.minOrderQty : undefined),
      },
      safeQty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col justify-center h-full pt-8 md:pt-0">
      <div className="text-[0.75rem] tracking-[0.2em] uppercase text-[var(--color-sage-dark)] mb-4">{categoryText}</div>
      <h1 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.1] text-[var(--color-text)] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
        {product.name}
      </h1>
      {isLowStock && (
        <div className="mb-5">
          <span className="inline-flex px-2.5 py-1 rounded-full text-[0.62rem] uppercase tracking-[0.1em] font-semibold bg-[#FFF4E5] text-[#D48806]">
            Low Stock
          </span>
          <p className="text-[0.78rem] text-[#D48806] mt-2 uppercase tracking-[0.08em]">
            Only {product.stock} left in stock - order soon!
          </p>
        </div>
      )}
      <div className="text-[1.5rem] text-[var(--color-earth)] font-serif italic mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
        ₹{formattedPrice}
      </div>
      <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-[1.8] font-light mb-8 max-w-[500px]">
        {descriptionText}
      </p>


      {/* Quantity / Packs */}
      {hasPacks ? (
        <div className="flex flex-col gap-3 mb-10">
          <span className="text-[0.8rem] uppercase tracking-[0.1em] text-[var(--color-text)] font-medium">Select Bundle</span>
          <div className="flex flex-wrap gap-3">
            {packs.map((pack: any, idx: number) => (
              <button 
                key={idx}
                disabled={isOutOfStock || maxAllowedQty < pack.quantity}
                onClick={() => setSelectedPackIndex(idx)}
                className={`px-5 py-3 rounded-xl text-[0.85rem] transition-all duration-300 border focus:outline-none flex flex-col items-start gap-1 ${selectedPackIndex === idx ? 'border-[var(--color-sage-dark)] bg-[rgba(138,158,126,0.05)] shadow-sm' : 'border-[#EAE6DF] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-sage)]'} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <span className={`font-medium tracking-wide ${selectedPackIndex === idx ? 'text-[var(--color-sage-dark)]' : 'text-[var(--color-text)]'}`}>{pack.label}</span>
                <span className="text-[1.05rem] font-serif italic text-[var(--color-earth)]">₹{pack.price}</span>
              </button>
            ))}
          </div>
          {isOutOfStock && <span className="text-[0.74rem] uppercase tracking-[0.08em] text-red-600 mt-2">Out of Stock</span>}
        </div>
      ) : (
        <div className="flex items-center gap-6 mb-10">
          <span className="text-[0.8rem] uppercase tracking-[0.1em] text-[var(--color-text)] font-medium">Quantity</span>
          <div className="flex items-center bg-[var(--color-white)] rounded-full border border-[rgba(138,158,126,0.3)]">
            <button disabled={isOutOfStock || qty <= minQty} onClick={() => setQty(Math.max(minQty, qty - 1))} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-l-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">−</button>
            <input
              type="number"
              min={minQty}
              max={maxAllowedQty}
              value={qty}
              disabled={isOutOfStock}
              onChange={(e) => {
                const typedValue = Number(e.target.value) || minQty;
                setQty(Math.min(maxAllowedQty, Math.max(minQty, typedValue)));
              }}
              className="w-12 text-center text-[0.9rem] font-medium bg-transparent outline-none disabled:opacity-40"
            />
            <button disabled={isOutOfStock || qty >= maxAllowedQty} onClick={() => setQty(Math.min(maxAllowedQty, qty + 1))} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-r-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">+</button>
          </div>
          {isOutOfStock && <span className="text-[0.74rem] uppercase tracking-[0.08em] text-red-600">Out of Stock</span>}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button 
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="flex-1 py-[1rem] px-[2rem] rounded-full border border-[var(--color-sage)] text-[var(--color-sage-dark)] text-[0.8rem] uppercase tracking-[0.1em] transition-all duration-300 hover:bg-[var(--color-sage)] hover:text-white focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--color-sage-dark)]"
        >
          {isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
        <button 
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="flex-1 py-[1rem] px-[2rem] rounded-full bg-[var(--color-sage-dark)] text-white text-[0.8rem] uppercase tracking-[0.1em] transition-all duration-300 shadow-[0_4px_15px_rgba(138,158,126,0.3)] hover:shadow-[0_8px_25px_rgba(138,158,126,0.5)] hover:-translate-y-1 focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_15px_rgba(138,158,126,0.3)]"
        >
          {isOutOfStock ? 'Unavailable' : 'Buy Now'}
        </button>
      </div>
      
      {/* Product Details Accordion */}
      <div className="border-t border-[rgba(138,158,126,0.2)]">
        {accordionItems.map((item) => {
          const isOpen = openSection === item.id;
          return (
            <div key={item.id} className="border-b border-[rgba(138,158,126,0.2)] last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : item.id)}
                className="w-full py-4 flex justify-between items-center cursor-pointer group text-left"
              >
                <span className="text-[0.85rem] uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-sage-dark)]">
                  {item.title}
                </span>
                <span className={`text-[var(--color-sage)] text-[1.2rem] transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                  +
                </span>
              </button>
              <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="text-[0.9rem] text-[var(--color-text-muted)] leading-[1.8] pr-4">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
