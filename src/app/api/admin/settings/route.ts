import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'default',
          freeShippingThreshold: 299,
          shippingCharge: 40,
          onlineDiscount: 5,
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { freeShippingThreshold, shippingCharge, onlineDiscount } = body;

    let settings = await prisma.settings.findFirst();
    
    settings = await prisma.settings.upsert({
      where: { id: settings?.id || 'default' },
      update: { freeShippingThreshold: Number(freeShippingThreshold), shippingCharge: Number(shippingCharge), onlineDiscount: Number(onlineDiscount) },
      create: { id: 'default', freeShippingThreshold: Number(freeShippingThreshold), shippingCharge: Number(shippingCharge), onlineDiscount: Number(onlineDiscount) },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PUT(req);
}