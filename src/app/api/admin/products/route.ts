import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, price, category, stock, description, ingredients, howToUse,
      isFeatured, showInGrid, isKit, minOrderQty, imageUrls, videoUrl,
      packs, kitItems
    } = body;

    // Ensure packs and kitItems are properly parsed for JSON storage
    const packsValue = packs 
      ? (typeof packs === 'string' ? JSON.parse(packs) : packs)
      : [];
    const kitItemsValue = kitItems 
      ? (typeof kitItems === 'string' ? JSON.parse(kitItems) : kitItems)
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        ingredients,
        howToUse,
        isFeatured: Boolean(isFeatured),
        showInGrid: Boolean(showInGrid),
        isKit: Boolean(isKit),
        minOrderQty: Number(minOrderQty) || 1,
        images: imageUrls || [],
        videoUrl,
        packs: packsValue,
        kitItems: kitItemsValue,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id, name, price, category, stock, description, ingredients, howToUse,
      isFeatured, showInGrid, isKit, minOrderQty, imageUrls, videoUrl,
      packs, kitItems
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Ensure packs and kitItems are properly stringified for JSON storage
    const packsValue = packs !== undefined 
      ? (typeof packs === 'string' ? JSON.parse(packs) : packs)
      : undefined;
    const kitItemsValue = kitItems !== undefined 
      ? (typeof kitItems === 'string' ? JSON.parse(kitItems) : kitItems)
      : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        ingredients,
        howToUse,
        isFeatured: Boolean(isFeatured),
        showInGrid: Boolean(showInGrid),
        isKit: Boolean(isKit),
        minOrderQty: Number(minOrderQty) || 1,
        ...(imageUrls?.length > 0 && { images: imageUrls }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(packsValue !== undefined && { packs: packsValue }),
        ...(kitItemsValue !== undefined && { kitItems: kitItemsValue }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}