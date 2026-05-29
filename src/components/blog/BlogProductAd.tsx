import React from 'react';
import prisma from '@/lib/prisma';
import BlogProductAdClient from './BlogProductAdClient';

interface BlogProductAdProps {
  productId?: string;
  ctaText?: string;
}

export default async function BlogProductAd({ productId, ctaText }: BlogProductAdProps) {
  let product = null;

  if (productId) {
    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          images: true,
          stock: true,
          minOrderQty: true,
          category: true,
        }
      });
    } catch (error) {
      console.error("Error fetching product for BlogProductAd:", error);
    }
  }

  // Fallback product if DB fetch fails or productId is not found/not provided
  const fallbackProduct = {
    id: productId || 'fallback-rosehip-oil',
    name: 'Rosehip Seed Infused Glow Elixir',
    description: 'An Ayurvedic face oil infused with cold-pressed rosehip seed, gold flakes, and saffron to brighten skin tone, combat free radicals, and provide a luminous natural glow.',
    price: 899,
    images: ['/images/blog/chemical-free-skincare.png'], // Uses our generated skincare image
    stock: 15,
    minOrderQty: 1,
    category: 'Skin Care',
  };

  const productData = product ? {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : '/images/blog/chemical-free-skincare.png',
    stock: product.stock,
    minOrderQty: product.minOrderQty,
  } : {
    id: fallbackProduct.id,
    name: fallbackProduct.name,
    description: fallbackProduct.description,
    price: fallbackProduct.price,
    imageUrl: fallbackProduct.images[0],
    stock: fallbackProduct.stock,
    minOrderQty: fallbackProduct.minOrderQty,
  };

  return (
    <BlogProductAdClient product={productData} ctaText={ctaText} />
  );
}
