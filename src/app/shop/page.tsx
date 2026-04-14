import React from 'react';
import prisma from '@/lib/prisma';
import ShopClient from './ShopClient';
import { ProductType } from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
  }>;
};

function getProductTag(product: { createdAt: Date; stock: number }) {
  const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= 30) return 'New';
  if (product.stock > 0 && product.stock <= 10) return 'Trending';
  return 'Featured';
}

const categoryPresets: Record<string, { icon: string, bg: string }> = {
  'Skin Care': { icon: '🌿', bg: 'linear-gradient(135deg, #E8F5E0, #C8E6B8)' },
  'Hair Care': { icon: '🥥', bg: 'linear-gradient(135deg, #E8EFF8, #C8D8F0)' },
  'Body Care': { icon: '🪵', bg: 'linear-gradient(135deg, #F5EFEB, #E0CDBA)' },
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, tag } = await searchParams;
  const bestSellerRows = await (prisma as any).orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 8,
  }).catch(() => []);
  const bestSellerIds = new Set<string>(bestSellerRows.map((row: any) => row.productId));

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
      category: typeof p.category === 'string' ? p.category : '',
      size: "Standard",
      icon: preset.icon,
      badge: bestSellerIds.has(p.id) ? "Best Seller" : getProductTag({ createdAt: p.createdAt, stock: p.stock }),
      bg: preset.bg,
      images: Array.isArray(p.images) ? p.images : [],
      imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
    };
  });

  return <ShopClient initialProducts={mappedProducts} initialCategory={category} initialTag={tag} />;
}
