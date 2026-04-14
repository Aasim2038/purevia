"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster, toast } from "sonner";
import { getShortOrderId } from "@/lib/orderId";

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type AdminOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: string | null;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingPinCode: string;
  lat: number | null;
  lng: number | null;
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

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusClassMap: Record<OrderStatus, string> = {
  PENDING: "bg-[#FFF4E5] text-[#D48806]",
  SHIPPED: "bg-[#E6F4FF] text-[#0958D9]",
  DELIVERED: "bg-[#E8F5E0] text-[var(--color-sage-dark)]",
  CANCELLED: "bg-[#FCF3F3] text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const statusMatch = statusFilter === "ALL" || order.status === statusFilter;
      if (!statusMatch) return false;
      if (!normalizedSearch) return true;
      const nameMatch = order.customerName.toLowerCase().includes(normalizedSearch);
      const phoneMatch = order.customerPhone.toLowerCase().includes(normalizedSearch);
      const shortIdMatch = getShortOrderId(order.id).toLowerCase().includes(normalizedSearch);
      return nameMatch || phoneMatch || shortIdMatch;
    });
  }, [orders, statusFilter, searchQuery]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed");
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      toast.success("Order status updated.");
    } catch (error: any) {
      toast.error(error.message || "Could not update status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <Toaster position="bottom-right" richColors />
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Orders</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-[1500px] mx-auto flex-1">
          <div className="flex flex-col gap-5 mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Orders Management</h2>

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-[360px]">
                <input
                  type="text"
                  placeholder="Search by Name, Phone, or #PV-XXXX"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.88rem] outline-none focus:border-[var(--color-sage-dark)]"
                />
              </div>
              <div className="flex bg-[#FAF9F7] p-1 rounded-xl border border-[#EAE6DF] w-fit">
                {["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab as any)}
                    className={`px-4 py-2 text-[0.72rem] tracking-[0.1em] uppercase font-medium rounded-lg transition-all ${
                      statusFilter === tab ? "bg-white text-[var(--color-sage-dark)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {tab === "ALL" ? "All" : statusLabels[tab as OrderStatus]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-6 py-5 min-w-[170px]">Order</th>
                    <th className="px-6 py-5 min-w-[170px]">Customer Name</th>
                    <th className="px-6 py-5 min-w-[130px]">Phone Number</th>
                    <th className="px-6 py-5 min-w-[110px]">Total</th>
                    <th className="px-6 py-5 min-w-[120px]">Payment</th>
                    <th className="px-6 py-5 min-w-[180px]">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 font-serif italic text-[var(--color-text-muted)]">Loading orders...</td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 font-serif italic text-[var(--color-text-muted)]">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0 align-top">
                        <td className="px-6 py-4">
                          <div className="font-serif font-medium text-[1.02rem] text-[var(--color-text)] mb-1">{getShortOrderId(order.id)}</div>
                          <div className="text-[0.75rem] text-[var(--color-text-muted)]">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{order.customerName}</td>
                        <td className="px-6 py-4 text-[0.82rem] text-[var(--color-text-muted)]">{order.customerPhone}</td>
                        <td className="px-6 py-4 font-serif text-[1rem] font-medium">₹{order.totalAmount}</td>
                        <td className="px-6 py-4 text-[0.78rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{order.paymentMethod || "N/A"}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex w-fit px-2.5 py-1 rounded-full text-[0.66rem] uppercase tracking-[0.08em] font-semibold ${statusClassMap[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="appearance-none border border-[#EAE6DF] py-1.5 px-2.5 rounded-full text-[0.66rem] uppercase tracking-[0.08em] font-medium cursor-pointer focus:outline-none bg-white"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 text-[0.72rem] uppercase tracking-[0.1em] rounded-full border border-[rgba(138,158,126,0.35)] text-[var(--color-sage-dark)] hover:bg-[var(--color-cream)]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#EAE6DF] shadow-[0_24px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-[#EAE6DF]">
              <h3 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Shipping Address</div>
                <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DF] p-4 text-[0.9rem] leading-[1.7]">
                  <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)] mb-2">
                    {getShortOrderId(selectedOrder.id)}
                  </div>
                  <div className="font-medium text-[var(--color-text)]">{selectedOrder.customerName}</div>
                  <div>{selectedOrder.customerPhone}</div>
                  <div>{selectedOrder.shippingAddress}</div>
                  <div>{selectedOrder.shippingCity} - {selectedOrder.shippingPinCode}</div>
                </div>
              </div>

              {selectedOrder.lat !== null && selectedOrder.lng !== null && (
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Pinned Delivery Location</div>
                  <div className="rounded-xl overflow-hidden border border-[#EAE6DF]">
                    <iframe
                      title="Delivery Location Map"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedOrder.lng - 0.004}%2C${selectedOrder.lat - 0.004}%2C${selectedOrder.lng + 0.004}%2C${selectedOrder.lat + 0.004}&layer=mapnik&marker=${selectedOrder.lat}%2C${selectedOrder.lng}`}
                      className="w-full h-[220px]"
                    />
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedOrder.lat}&mlon=${selectedOrder.lng}#map=17/${selectedOrder.lat}/${selectedOrder.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-[0.78rem] text-[var(--color-sage-dark)] underline"
                  >
                    Open full map
                  </a>
                </div>
              )}

              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Products</div>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white rounded-xl border border-[#EAE6DF] p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#EAE6DF] bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)]">
                          {item.product?.images?.[0] ? <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                          <Link href={`/product/${item.productId}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-sage-dark)]">{item.productName}</Link>
                          <div className="text-[0.78rem] text-[var(--color-text-muted)]">Qty: {item.quantity} x ₹{item.unitPrice}</div>
                        </div>
                      </div>
                      <div className="font-serif text-[1rem] text-[var(--color-earth)]">₹{item.lineTotal}</div>
                    </div>
                  ))}
                </div>
              </div>

              {(() => {
                const subtotal = selectedOrder.orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
                const shipping = Math.max(0, selectedOrder.totalAmount - subtotal);
                const grand = selectedOrder.totalAmount;
                return (
                  <div>
                    <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Payment Summary</div>
                    <div className="bg-[#FAF9F7] rounded-xl border border-[#EAE6DF] p-4 space-y-2 text-[0.88rem]">
                      <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Subtotal</span><span>₹{subtotal}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-text-muted)]">Shipping</span><span>₹{shipping}</span></div>
                      <div className="flex justify-between font-semibold border-t border-[#EAE6DF] pt-2"><span>Grand Total</span><span>₹{grand}</span></div>
                      <div className="text-[0.75rem] uppercase tracking-[0.09em] text-[var(--color-sage-dark)] pt-1">
                        Payment Method: {selectedOrder.paymentMethod || "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
