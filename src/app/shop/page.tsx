import React from 'react';
import prisma from '@/lib/prisma';
import ShopClient from './ShopClient';
import { ProductType } from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const categoryPresets: Record<string, { icon: string, bg: string }> = {
  'Skin Care': { icon: '🌿', bg: 'linear-gradient(135deg, #E8F5E0, #C8E6B8)' },
  'Hair Care': { icon: '🥥', bg: 'linear-gradient(135deg, #E8EFF8, #C8D8F0)' },
  'Body Care': { icon: '🪵', bg: 'linear-gradient(135deg, #F5EFEB, #E0CDBA)' },
};

export default async function ShopPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const mappedProducts: ProductType[] = dbProducts.map((p: any) => {
    const preset = categoryPresets[p.category] || { icon: '📦', bg: 'linear-gradient(135deg, #F5EFEB, #E0CDBA)' };
    
    return {
      id: p.id,
      name: p.name,
      desc: p.description || '',
      price: p.price,
      category: p.category,
      size: "Standard",
      icon: preset.icon,
      badge: p.stock < 10 && p.stock > 0 ? "Low Stock" : p.stock === 0 ? "Out of Stock" : "New",
      bg: preset.bg,
      imageUrl: p.images && p.images.length > 0 ? p.images[0] : null
    };
  });

  return <ShopClient initialProducts={mappedProducts} />;
}
