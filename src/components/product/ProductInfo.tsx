"use client";
import React, { useState } from 'react';
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
  };
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'ingredients' | 'howToUse' | 'shipping' | null>('ingredients');
  const formattedPrice = Number(product.price || 0).toLocaleString('en-IN');
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
    const safeQty = Math.min(Math.max(1, qty), maxAllowedQty);
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || null,
        maxStock: maxAllowedQty,
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
      <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-[1.8] font-light mb-10 max-w-[500px]">
        {descriptionText}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-6 mb-10">
        <span className="text-[0.8rem] uppercase tracking-[0.1em] text-[var(--color-text)] font-medium">Quantity</span>
        <div className="flex items-center bg-[var(--color-white)] rounded-full border border-[rgba(138,158,126,0.3)]">
          <button disabled={isOutOfStock} onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-l-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">−</button>
          <input
            type="number"
            min={1}
            max={maxAllowedQty}
            value={qty}
            disabled={isOutOfStock}
            onChange={(e) => {
              const typedValue = Number(e.target.value) || 1;
              setQty(Math.min(maxAllowedQty, Math.max(1, typedValue)));
            }}
            className="w-12 text-center text-[0.9rem] font-medium bg-transparent outline-none disabled:opacity-40"
          />
          <button disabled={isOutOfStock || qty >= maxAllowedQty} onClick={() => setQty(Math.min(maxAllowedQty, qty + 1))} className="w-10 h-10 flex items-center justify-center text-[1.2rem] text-[var(--color-sage-dark)] transition-colors hover:bg-[var(--color-warm)] rounded-r-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed">+</button>
        </div>
        {isOutOfStock && <span className="text-[0.74rem] uppercase tracking-[0.08em] text-red-600">Out of Stock</span>}
      </div>

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
