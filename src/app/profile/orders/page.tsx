"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getShortOrderId } from "@/lib/orderId";

type ProfileOrder = {
  id: string;
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPinCode: string;
  orderItems: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    product: {
      images: string[];
    } | null;
  }>;
};

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ProfileOrder | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;

    const loadOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [session]);

  const statusPillClass: Record<ProfileOrder["status"], string> = {
    PENDING: "bg-[#FFF4E5] text-[#D48806]",
    SHIPPED: "bg-[#E6F4FF] text-[#0958D9]",
    DELIVERED: "bg-[#E8F5E0] text-[var(--color-sage-dark)]",
    CANCELLED: "bg-[#FCF3F3] text-red-600",
  };

  if (status !== "authenticated") {
    return <div className="min-h-screen bg-[var(--color-cream)] pt-32 px-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <Link href="/profile" className="w-10 h-10 rounded-full bg-white border border-[rgba(196,168,130,0.2)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <h1 className="font-serif text-3xl text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Order History</h1>
        </div>

        {loading ? (
          <div className="text-[var(--color-text-muted)]">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(196,168,130,0.15)] shadow-sm">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-serif text-2xl text-[var(--color-text)] mb-2">No orders yet</h3>
            <p className="text-[var(--color-text-muted)] mb-8">When you place an order, it will appear here.</p>
            <Link href="/shop" className="btn-primary inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[24px] border border-[rgba(196,168,130,0.15)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[rgba(196,168,130,0.2)] bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)] shrink-0 relative">
                    {order.orderItems[0]?.product?.images?.[0] ? (
                      <Image src={order.orderItems[0].product.images[0]} alt={order.orderItems[0].productName} fill className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-1">{getShortOrderId(order.id)}</div>
                    <h3 className="font-serif text-xl text-[var(--color-text)] mb-1">{order.orderItems[0]?.productName || "Order Item"} {order.orderItems.length > 1 && `+ ${order.orderItems.length - 1} more`}</h3>
                    <div className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-3">
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                      <span className="w-1 h-1 rounded-full bg-[rgba(196,168,130,0.4)]" />
                      <span className="font-medium text-[var(--color-earth-dark)]">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 md:border-l md:border-[rgba(196,168,130,0.15)] md:pl-8">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-[0.1em] font-semibold ${statusPillClass[order.status]}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-5 py-2.5 rounded-full border border-[var(--color-sage)]/30 text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)] hover:bg-[var(--color-cream)] transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 md:p-8">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[rgba(196,168,130,0.25)] shadow-[0_24px_60px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[rgba(196,168,130,0.2)]">
                <div>
                  <h3 className="font-serif text-2xl text-[var(--color-text)]">Order Details</h3>
                  <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--color-sage-dark)] mt-1">{getShortOrderId(selectedOrder.id)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[0.68rem] uppercase tracking-[0.1em] font-semibold ${statusPillClass[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>

                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-3">Items Purchased</div>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-[#FAF9F7] rounded-xl border border-[rgba(196,168,130,0.2)] p-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[rgba(196,168,130,0.2)] bg-white shrink-0 relative">
                            {item.product?.images?.[0] ? <Image src={item.product.images[0]} alt={item.productName} fill className="w-full h-full object-cover" /> : null}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/product/${item.productId}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-sage-dark)] truncate block">{item.productName}</Link>
                            <div className="text-[12px] text-[var(--color-text-muted)]">Qty {item.quantity} x ₹{item.unitPrice}</div>
                          </div>
                        </div>
                        <div className="font-serif text-[1.1rem] text-[var(--color-earth-dark)]">₹{item.lineTotal}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[rgba(196,168,130,0.15)]">
                  <div>
                    <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Delivery Address</div>
                    <div className="text-[14px] text-[var(--color-text)] leading-relaxed">
                      {selectedOrder.shippingAddress}<br />
                      {selectedOrder.shippingCity}, {selectedOrder.shippingPinCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Total Amount</div>
                    <div className="font-serif text-3xl text-[var(--color-earth-dark)]">₹{selectedOrder.totalAmount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)] pt-32 px-6">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
