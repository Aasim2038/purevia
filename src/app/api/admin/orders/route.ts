import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            productName: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
            product: {
              select: {
                images: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body ?? {};

    if (!id || !status) {
      return NextResponse.json({ error: "Order id and status are required" }, { status: 400 });
    }

    const normalizedStatus = String(status).toUpperCase();
    const allowedStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowedStatuses.includes(normalizedStatus)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: String(id) },
      data: { status: normalizedStatus as any },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
