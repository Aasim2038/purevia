import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

async function removeSupabaseAsset(publicUrl?: string | null) {
  if (!publicUrl) return;
  const marker = '/storage/v1/object/public/';
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const suffix = publicUrl.slice(markerIndex + marker.length);
  const firstSlash = suffix.indexOf('/');
  if (firstSlash === -1) return;

  const bucket = suffix.slice(0, firstSlash);
  const filePath = suffix.slice(firstSlash + 1);
  if (!bucket || !filePath) return;

  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) {
    console.error(`Error deleting asset from ${bucket}:`, error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, stock, description, ingredients, howToUse, imageUrls, videoUrl, isFeatured, showInGrid } = body;
    const parsedImageUrls = toStringArray(imageUrls).slice(0, 2);

    // Basic validation
    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parsedImageUrls.length === 0) {
      return NextResponse.json({ error: 'At least one product image is required' }, { status: 400 });
    }

    // Insert to database safely formatting inputs
    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        description: description ? String(description) : '',
        ingredients: ingredients ? String(ingredients) : '',
        howToUse: howToUse ? String(howToUse) : '',
        price: parseFloat(price),
        category: String(category),
        stock: parseInt(stock, 10) || 0,
        images: parsedImageUrls,
        videoUrl: typeof videoUrl === 'string' && videoUrl.trim().length > 0 ? videoUrl : null,
        isFeatured: Boolean(isFeatured),
        showInGrid: Boolean(showInGrid),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function updateProduct(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, category, stock, description, ingredients, howToUse, imageUrls, videoUrl, isFeatured, showInGrid } = body;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const data: any = {};
    if (name) data.name = String(name);
    if (description !== undefined) data.description = String(description);
    if (ingredients !== undefined) data.ingredients = String(ingredients);
    if (howToUse !== undefined) data.howToUse = String(howToUse);
    if (price !== undefined) data.price = parseFloat(price);
    if (category) data.category = String(category);
    if (stock !== undefined) data.stock = parseInt(stock, 10) || 0;
    if (imageUrls !== undefined) data.images = toStringArray(imageUrls).slice(0, 2);
    if (videoUrl !== undefined) data.videoUrl = typeof videoUrl === 'string' && videoUrl.trim().length > 0 ? videoUrl : null;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (showInGrid !== undefined) data.showInGrid = Boolean(showInGrid);

    const updated = await prisma.product.update({
      where: { id: String(id) },
      data
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return updateProduct(req);
}

export async function PUT(req: Request) {
  return updateProduct(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Delete associated files from Supabase
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        await removeSupabaseAsset(imageUrl);
      }
    }

    if (product.videoUrl) {
      await removeSupabaseAsset(product.videoUrl);
    }

    // Force delete: manually delete related records in the correct order
    try {
      // Delete in order of foreign key dependencies (leaf nodes first)
      const deletedReviews = await prisma.review.deleteMany({ where: { productId: id } });
      console.log(`Deleted ${deletedReviews.count} reviews`);
      
      const deletedCartItems = await prisma.cartItem.deleteMany({ where: { productId: id } });
      console.log(`Deleted ${deletedCartItems.count} cart items`);
      
      const deletedOrderItems = await prisma.orderItem.deleteMany({ where: { productId: id } });
      console.log(`Deleted ${deletedOrderItems.count} order items`);
      
      // Finally delete the product
      await prisma.product.delete({ where: { id } });
      console.log(`Product ${id} deleted successfully`);

      return NextResponse.json({ 
        success: true, 
        message: `Product deleted successfully (removed from ${deletedReviews.count} reviews, ${deletedCartItems.count} carts, ${deletedOrderItems.count} orders)`
      });
    } catch (cascadeError: any) {
      console.error('Cascade delete error:', cascadeError);
      console.error('Error details:', {
        code: cascadeError.code,
        message: cascadeError.message,
        meta: cascadeError.meta
      });
      throw cascadeError;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Provide specific error messages for common issues
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('foreign key constraint') || errorMsg.includes('constraint')) {
        return NextResponse.json(
          { error: 'Cannot delete product: Unexpected constraint violation. Please try again.' },
          { status: 400 }
        );
      }
      
      if (errorMsg.includes('not found') || errorMsg.includes('no record found')) {
        return NextResponse.json(
          { error: 'Product not found or already deleted.' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Deletion failed: ${error.message}` }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ error: 'Internal Server Error during deletion' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
