import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [revenueData, totalOrders, totalUsers, lowStockCount] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED'
        },
        _sum: {
          totalAmount: true
        }
      }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({
        where: {
          stock: { lte: 5 }
        }
      })
    ]);

    return NextResponse.json({
      totalRevenue: revenueData._sum.totalAmount || 0,
      totalOrders,
      totalUsers,
      lowStockCount
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
