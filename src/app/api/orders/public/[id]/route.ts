import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        customerEmail: true,
        customerPhone: true,
        customerName: true,
        totalAmount: true,
        status: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching public order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
