import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, orderId } = body ?? {};

    if (!email || !password || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(String(password), 10);

    // Create user and link order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name ? String(name).trim() : null,
          email: String(email).toLowerCase().trim(),
          password: hashedPassword,
        },
      });

      // Update the order to link it to the new user
      await tx.order.update({
        where: { id: orderId },
        data: { userId: user.id },
      });

      return user;
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: result.id, email: result.email, name: result.name } 
    }, { status: 201 });

  } catch (error) {
    console.error("Register guest error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
