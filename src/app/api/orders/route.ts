import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendAdminNewOrderAlert, sendCustomerOrderConfirmation } from "@/lib/email";

type IncomingOrderItem = {
  productId: string;
  quantity: number;
  price?: number;
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
            priceAtPurchase: true,
            lineTotal: true,
            product: {
              select: {
                images: true,
                packs: true,
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
    const body = await req.json().catch(() => ({}));
    
    console.log("INCOMING PAYLOAD:", body);

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      pin,
      userId: incomingUserIdRaw,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      lat,
      lng,
      shippingAmount,
      grandTotal,
      items
    } = body;
    
    // 1. Extract exactly the flat fields with safe fallbacks
    const safeFirstName = String(firstName || "").trim();
    const safeLastName = String(lastName || "").trim();
    const safeEmail = (email && String(email).trim() !== "") ? String(email).trim() : null;
    const incomingUserId = incomingUserIdRaw ? String(incomingUserIdRaw).trim() : null;
    const finalUserId = user?.id || incomingUserId;
    const safePhone = String(phone || "").trim();
    const safeAddress = String(address || "").trim();
    const safeCity = String(city || "").trim();
    const safePin = String(pin || "").trim();
    const safePaymentMethod = String(paymentMethod || "cod").trim();
    const orderItems: IncomingOrderItem[] = Array.isArray(items) ? items : [];
    
    // 2. Handle numeric/location fields safely
    const safeLat = (typeof lat === "number" && !isNaN(lat)) ? lat : null;
    const safeLng = (typeof lng === "number" && !isNaN(lng)) ? lng : null;
    const safeShippingAmount = Number(shippingAmount) || 0;
    const safeGrandTotal = Number(grandTotal) || 0;
    
    // 3. Razorpay fields
    const safeRazorpayOrderId = razorpayOrderId ? String(razorpayOrderId).trim() : null;
    const safeRazorpayPaymentId = razorpayPaymentId ? String(razorpayPaymentId).trim() : null;

    const missingFields = [];
    if (!safeFirstName) missingFields.push("firstName");
    if (!safeEmail) missingFields.push("email");
    if (!finalUserId) missingFields.push("userId");
    if (!safePhone) missingFields.push("phone");
    if (!safeAddress) missingFields.push("address");
    if (!safeCity) missingFields.push("city");
    if (!safePin) missingFields.push("pin");
    if (orderItems.length === 0) missingFields.push("items");

    if (missingFields.length > 0) {
      const errorMsg = `Missing required checkout data: ${missingFields.join(", ")}`;
      console.error("VALIDATION FAILED:", errorMsg);
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const sanitizedOrderItems = orderItems.map((item) => {
      const pId = String(item.productId || "");
      const cleanProductId = pId.includes('-') && pId.split('-').length > 5 ? pId.split('-').slice(0, 5).join('-') : pId;
      return { ...item, cleanProductId };
    });

    const productIds = sanitizedOrderItems.map((item) => item.cleanProductId).filter(Boolean);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, stock: true, packs: true },
    });
    const productMap = new Map(dbProducts.map((product) => [product.id, product]));

    const missingProduct = sanitizedOrderItems.find((item) => !productMap.has(item.cleanProductId));
    if (missingProduct) {
      console.error("VALIDATION FAILED: Product not found in database", missingProduct);
      return NextResponse.json({ error: `Product not found in database: ${missingProduct.cleanProductId}` }, { status: 400 });
    }

    const normalizedItems = sanitizedOrderItems
      .map((item) => {
        const product = productMap.get(item.cleanProductId)!;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Number(product.price) || 0;
        const priceAtPurchase = typeof item.price === "number" ? item.price : unitPrice;

        // Resolve product name with pack/variant information
        let finalProductName = product.name;
        const pId = String(item.productId || "");
        const parts = pId.split('-');
        const packIndex = parts.length > 5 ? parseInt(parts[5], 10) : null;
        if (packIndex !== null && !isNaN(packIndex) && Array.isArray(product.packs)) {
          const pack = product.packs[packIndex] as any;
          if (pack && pack.label) {
            finalProductName = `${product.name} - ${pack.label}`;
          }
        }

        if (quantity > product.stock) {
          return {
            productId: product.id,
            productName: finalProductName,
            unitPrice,
            priceAtPurchase,
            quantity,
            lineTotal: priceAtPurchase * quantity,
            insufficientStock: true as const,
          };
        }
        return {
          productId: product.id,
          productName: finalProductName,
          unitPrice,
          priceAtPurchase,
          quantity,
          lineTotal: priceAtPurchase * quantity,
          insufficientStock: false as const,
        };
      });

    const outOfStockItem = normalizedItems.find((item) => item.insufficientStock);
    if (outOfStockItem) {
      return NextResponse.json(
        { error: `${outOfStockItem.productName} is out of stock for requested quantity.` },
        { status: 400 }
      );
    }

    const subtotalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const validShippingAmount = safeShippingAmount > 0 ? safeShippingAmount : 0;
    const validGrandTotal = safeGrandTotal > 0 ? safeGrandTotal : subtotalAmount + validShippingAmount;
    const customerName = `${safeFirstName} ${safeLastName}`.trim();

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
          userId: finalUserId!,
          customerName: customerName || "Customer",
          customerEmail: safeEmail!,
          customerPhone: safePhone || "0000000000",
          shippingAddress: safeAddress || "Address not provided",
          shippingCity: safeCity || "City",
          shippingPinCode: safePin || "000000",
          paymentMethod: safePaymentMethod,
          totalAmount: validGrandTotal,
          lat: safeLat ?? undefined,
          lng: safeLng ?? undefined,
          razorpayOrderId: safeRazorpayOrderId || undefined,
          razorpayPaymentId: safeRazorpayPaymentId || undefined,
          paymentStatus: safeRazorpayPaymentId ? 'PAID' : 'PENDING',
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

    if (safeEmail) {
      sendCustomerOrderConfirmation({
        to: safeEmail,
        customerName,
        orderId: order.id,
        totalAmount: validGrandTotal,
        items: cleanItems,
      }).catch((emailError) => {
        console.error("Customer confirmation email failed:", emailError);
      });
    }

    sendAdminNewOrderAlert({
      orderId: order.id,
      customerName,
      customerEmail: safeEmail,
      totalAmount: validGrandTotal,
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
