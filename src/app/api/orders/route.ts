import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendAdminNewOrderAlert, sendCustomerOrderConfirmation } from "@/lib/email";

type IncomingOrderItem = {
  productId: string;
  quantity: number;
};

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true },
  });
  return user;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
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

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      pin,
      paymentMethod,
      items,
      lat,
      lng,
      shippingAmount,
      grandTotal,
      razorpayOrderId,
      razorpayPaymentId,
    } = body ?? {};

    const orderItems: IncomingOrderItem[] = Array.isArray(items) ? items : [];
    if (!firstName || !phone || !address || !city || !pin || orderItems.length === 0) {
      return NextResponse.json({ error: "Missing required checkout data" }, { status: 400 });
    }

    const productIds = orderItems.map((item) => item.productId).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true },
    });
    const productMap = new Map(dbProducts.map((product) => [product.id, product]));

    const normalizedItems = orderItems
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Number(product.price) || 0;
        if (quantity > product.stock) {
          return {
            productId: product.id,
            productName: product.name,
            unitPrice,
            quantity,
            lineTotal: unitPrice * quantity,
            insufficientStock: true as const,
          };
        }
        return {
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity,
          lineTotal: unitPrice * quantity,
          insufficientStock: false as const,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (normalizedItems.length === 0) {
      return NextResponse.json({ error: "No valid products in order" }, { status: 400 });
    }

    const outOfStockItem = normalizedItems.find((item) => item.insufficientStock);
    if (outOfStockItem) {
      return NextResponse.json(
        { error: `${outOfStockItem.productName} is out of stock for requested quantity.` },
        { status: 400 }
      );
    }

    const subtotalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const safeShippingAmount = Number(shippingAmount) > 0 ? Number(shippingAmount) : 0;
    const safeGrandTotal = Number(grandTotal) > 0 ? Number(grandTotal) : subtotalAmount + safeShippingAmount;
    const customerName = `${String(firstName).trim()} ${String(lastName || "").trim()}`.trim();

    const cleanItems = normalizedItems.map(({ insufficientStock, ...item }) => item);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cleanItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new Error(`Insufficient stock for ${item.productName}`);
        }
      }

      return tx.order.create({
        data: {
          userId: user?.id ?? null,
          customerName,
          customerEmail: (email && String(email).trim() !== '') ? String(email).trim() : null,
          customerPhone: String(phone).trim(),
          shippingAddress: String(address).trim(),
          shippingCity: String(city).trim(),
          shippingPinCode: String(pin).trim(),
          paymentMethod: (paymentMethod && String(paymentMethod).trim() !== '') ? String(paymentMethod).trim() : null,
          totalAmount: safeGrandTotal,
          lat: typeof lat === "number" ? lat : null,
          lng: typeof lng === "number" ? lng : null,
          razorpayOrderId: (razorpayOrderId && String(razorpayOrderId).trim() !== '') ? String(razorpayOrderId).trim() : null,
          razorpayPaymentId: (razorpayPaymentId && String(razorpayPaymentId).trim() !== '') ? String(razorpayPaymentId).trim() : null,
          paymentStatus: razorpayPaymentId ? 'PAID' : 'PENDING',
          orderItems: {
            create: cleanItems,
          },
        },
        include: {
          orderItems: true,
        },
      });
    });

    const updatedProducts = await prisma.product.findMany({
      where: { id: { in: cleanItems.map((item) => item.productId) } },
      select: { id: true, name: true, stock: true },
    });
    const lowStockWarnings = updatedProducts
      .filter((product) => product.stock <= 3)
      .map((product) => ({ name: product.name, stock: product.stock }));

    if (email && String(email).trim()) {
      sendCustomerOrderConfirmation({
        to: String(email).trim(),
        customerName,
        orderId: order.id,
        totalAmount: safeGrandTotal,
        items: cleanItems,
      }).catch((emailError) => {
        console.error("Customer confirmation email failed:", emailError);
      });
    }

    sendAdminNewOrderAlert({
      orderId: order.id,
      customerName,
      customerEmail: email ? String(email).trim() : null,
      totalAmount: safeGrandTotal,
      items: cleanItems,
      lowStockWarnings,
    }).catch((emailError) => {
      console.error("Admin order alert email failed:", emailError);
    });

    return NextResponse.json({ orderId: order.id, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof Error && error.message.startsWith("Insufficient stock")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body ?? {};

    if (!id || action !== "cancel") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        id: String(id),
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: existingOrder.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
