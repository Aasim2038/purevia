import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, stock, description, imageUrl } = body;

    // Basic validation
    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert to database safely formatting inputs
    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        description: description ? String(description) : '',
        price: parseFloat(price),
        category: String(category),
        stock: parseInt(stock, 10) || 0,
        images: imageUrl ? [String(imageUrl)] : [],
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, category, stock, description, imageUrl } = body;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const data: any = {};
    if (name) data.name = String(name);
    if (description !== undefined) data.description = String(description);
    if (price !== undefined) data.price = parseFloat(price);
    if (category) data.category = String(category);
    if (stock !== undefined) data.stock = parseInt(stock, 10) || 0;
    if (imageUrl) data.images = [String(imageUrl)];

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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Attempt to softly delete the image from Supabase storage if it exists
    if (product.images && product.images.length > 0) {
       const imageUrl = product.images[0];
       const pathParts = imageUrl.split('product-images/');
       if (pathParts.length > 1) {
          const filePath = pathParts[1];
          const { error } = await supabase.storage.from('product-images').remove([filePath]);
          if (error) console.error("Error deleting image from storage:", error);
       }
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
