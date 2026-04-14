import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

type RelatedProductsProps = {
  category: string;
  currentProductId: string;
};

export default async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const products = await prisma.product.findMany({
    where: {
      category,
      NOT: { id: currentProductId },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  if (products.length === 0) return null;

  return (
    <section className="py-24 border-t border-[rgba(138,158,126,0.15)]">
      <div>
        <div className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center justify-center gap-3">
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
          You Might Also Like
          <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative bg-[#FDFAF6] rounded-[20px] p-6 border border-[rgba(196,168,130,0.15)] transition-all duration-400 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(138,158,126,0.08)] flex flex-col items-center text-center cursor-pointer overflow-hidden"
            >
              <Link href={`/product/${product.id}`} className="absolute inset-0 z-20" aria-label={`View ${product.name}`}></Link>
              
              <div 
                className="w-full aspect-square rounded-[12px] mb-6 relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #F7F3ED 0%, #EEE7DB 100%)' }}
              >
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : null}
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-[rgba(247,243,237,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-[0.75rem] tracking-[0.15em] uppercase text-[var(--color-text)] border-b border-[var(--color-text)] pb-0.5 pointer-events-none">Quick View</span>
                </div>
              </div>

              <h3 className="font-serif text-[1.3rem] text-[var(--color-text)] font-light leading-tight mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {product.name}
              </h3>
              
              <div className="text-[1rem] text-[var(--color-earth)] italic font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
                ₹{product.price}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
