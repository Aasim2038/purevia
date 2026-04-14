import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RangeKey = "7d" | "30d" | "all";

function getRangeStart(range: RangeKey): Date | undefined {
  if (range === "all") return undefined;
  const now = new Date();
  const days = range === "7d" ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const range = (req.nextUrl.searchParams.get("range") || "7d") as RangeKey;
    const safeRange: RangeKey = ["7d", "30d", "all"].includes(range) ? range : "7d";
    const rangeStart = getRangeStart(safeRange);

    const orders = await prisma.order.findMany({
      where: rangeStart
        ? {
            createdAt: { gte: rangeStart },
          }
        : undefined,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const orderIds = orders.map((order) => order.id);
    const topProductsRaw =
      orderIds.length > 0
        ? await prisma.orderItem.groupBy({
            by: ["productId", "productName"],
            where: { orderId: { in: orderIds } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
          })
        : [];

    const revenueMap = new Map<string, number>();
    if (safeRange === "all") {
      for (const order of orders) {
        const key = getDateKey(order.createdAt);
        revenueMap.set(key, (revenueMap.get(key) || 0) + order.totalAmount);
      }
    } else {
      const start = rangeStart as Date;
      const end = new Date();
      const days = safeRange === "7d" ? 7 : 30;
      for (let i = days - 1; i >= 0; i -= 1) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        revenueMap.set(getDateKey(d), 0);
      }
      for (const order of orders) {
        const key = getDateKey(order.createdAt);
        if (revenueMap.has(key) && order.createdAt >= start) {
          revenueMap.set(key, (revenueMap.get(key) || 0) + order.totalAmount);
        }
      }
    }

    const dailyRevenue = Array.from(revenueMap.entries()).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue),
    }));

    const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const orderStatus = [
      { name: "Pending", value: statusCounts.PENDING || 0 },
      { name: "Shipped", value: statusCounts.SHIPPED || 0 },
      { name: "Delivered", value: statusCounts.DELIVERED || 0 },
    ];

    const topProducts = topProductsRaw.map((row) => ({
      productId: row.productId,
      name: row.productName,
      quantity: row._sum.quantity || 0,
    }));

    return NextResponse.json({
      range: safeRange,
      dailyRevenue,
      topProducts,
      orderStatus,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
