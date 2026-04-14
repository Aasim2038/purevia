"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

// Main content component that uses dynamic hooks like useSearchParams()
function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "1";
  const { data: session, status } = useSession();
  const [profileLoading, setProfileLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProfileOrder | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pinCode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;

    setProfileForm((prev) => ({
      ...prev,
      name: prev.name || session.user.name || "",
    }));

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setProfileForm({
            name: data.user.name ?? session.user.name ?? "",
            phone: data.user.phone ?? "",
            address: data.user.address ?? "",
            city: data.user.city ?? "",
            pinCode: data.user.pinCode ?? "",
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } finally {
        setOrdersLoading(false);
      }
    };

    loadProfile();
    loadOrders();
  }, [session]);

  useEffect(() => {
    if (isOnboarding) {
      setIsAddressOpen(true);
      setIsEditingAddress(true);
    }
  }, [isOnboarding]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile.");
        return;
      }
      setSuccess("Profile updated. Checkout will use this address.");
      setIsEditingAddress(false);
    } finally {
      setProfileLoading(false);
    }
  };

  if (status !== "authenticated") {
    return <div className="min-h-screen bg-[var(--color-cream)] pt-32 px-6">Loading...</div>;
  }

  const initials = (profileForm.name || session.user.name || "U")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasSavedAddress = Boolean(profileForm.address || profileForm.city || profileForm.pinCode || profileForm.phone);
  const statusPillClass: Record<ProfileOrder["status"], string> = {
    PENDING: "bg-[#FFF4E5] text-[#D48806]",
    SHIPPED: "bg-[#E6F4FF] text-[#0958D9]",
    DELIVERED: "bg-[#E8F5E0] text-[var(--color-sage-dark)]",
    CANCELLED: "bg-[#FCF3F3] text-red-600",
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelLoadingId(orderId);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, action: "cancel" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not cancel order.");
        return;
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "CANCELLED" } : order)));
      setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: "CANCELLED" } : prev));
    } finally {
      setCancelLoadingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16">
      <motion.div className="max-w-3xl mx-auto" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-[var(--color-warm)] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[rgba(196,168,130,0.3)]">
            <span className="font-serif text-3xl text-[var(--color-sage-dark)]">{initials}</span>
          </div>
          <h1 className="font-serif text-4xl text-[var(--color-text)] mb-3 tracking-wide">
            {profileForm.name || session.user.name || "My Profile"}
          </h1>
          <p className="text-[var(--color-text-muted)] tracking-wider text-sm uppercase">{session.user.email}</p>
        </motion.div>

        <div className="space-y-4 mb-10">
          <motion.div variants={itemVariants} className="group bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6">
            <button type="button" className="w-full flex items-center justify-between text-left" onClick={() => setIsOrdersOpen((prev) => !prev)}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">My Orders</h3>
                  <p className="text-[14px] text-[var(--color-text-muted)] font-light">Track order history, status and dates</p>
                </div>
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-[var(--color-text-muted)] transition-transform ${isOrdersOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isOrdersOpen && (
              <div className="mt-6 border-t border-[rgba(196,168,130,0.2)] pt-4 space-y-3">
                {ordersLoading ? (
                  <p className="text-[14px] text-[var(--color-text-muted)]">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-[14px] text-[var(--color-text-muted)]">No orders yet.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl border border-[rgba(196,168,130,0.2)] px-4 py-3 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[rgba(196,168,130,0.25)] bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)] shrink-0">
                        {order.orderItems[0]?.product?.images?.[0] ? (
                          <img src={order.orderItems[0].product.images[0]} alt={order.orderItems[0].productName} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{getShortOrderId(order.id)}</div>
                        <div className="font-medium text-[var(--color-text)] truncate">{order.orderItems[0]?.productName || "Order Item"}</div>
                        <div className="text-[13px] text-[var(--color-text-muted)]">Total: <span className="text-[var(--color-text)]">₹{order.totalAmount}</span></div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.62rem] uppercase tracking-[0.08em] font-semibold ${statusPillClass[order.status]}`}>
                          {order.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-full border border-[rgba(138,158,126,0.35)] text-[0.65rem] tracking-[0.08em] uppercase text-[var(--color-sage-dark)] hover:bg-[var(--color-cream)]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6 md:p-8">
            <button type="button" className="w-full flex items-center justify-between text-left" onClick={() => setIsAddressOpen((prev) => !prev)}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">Saved Addresses</h3>
                  <p className="text-[14px] text-[var(--color-text-muted)] font-light">Manage your default shipping address for faster checkout.</p>
                </div>
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-[var(--color-text-muted)] transition-transform ${isAddressOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {isAddressOpen && (
              <div className="mt-6 border-t border-[rgba(196,168,130,0.2)] pt-4">
                {!isEditingAddress ? (
                  <div className="space-y-4">
                    {hasSavedAddress ? (
                      <div className="bg-white rounded-xl border border-[rgba(196,168,130,0.2)] p-4">
                        <p className="font-medium text-[var(--color-text)]">{profileForm.name || session.user.name}</p>
                        <p className="text-[14px] text-[var(--color-text-muted)] mt-1">{profileForm.phone || "No phone saved"}</p>
                        <p className="text-[14px] text-[var(--color-text-muted)] mt-2">
                          {[profileForm.address, profileForm.city, profileForm.pinCode].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[14px] text-[var(--color-text-muted)]">No saved address yet.</p>
                    )}
                    <button type="button" onClick={() => setIsEditingAddress(true)} className="w-full bg-[var(--color-sage-dark)] text-white py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase">
                      {hasSavedAddress ? "Edit Address" : "Add Address"}
                    </button>
                    {isOnboarding && (
                      <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="w-full border border-[rgba(196,168,130,0.35)] text-[var(--color-text-muted)] py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase hover:text-[var(--color-sage-dark)]"
                      >
                        Skip for now
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <input type="text" placeholder="Full name" value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} className="w-full border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 bg-white" />
                    <input type="text" placeholder="Phone" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 bg-white" />
                    <textarea placeholder="Address" value={profileForm.address} onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))} rows={3} className="w-full border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 resize-none bg-white" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" value={profileForm.city} onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))} className="w-full border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 bg-white" />
                      <input type="text" placeholder="PIN code" value={profileForm.pinCode} onChange={(e) => setProfileForm((p) => ({ ...p, pinCode: e.target.value }))} className="w-full border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 bg-white" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-700">{success}</p>}
                    <button type="submit" disabled={profileLoading} className="w-full bg-[var(--color-sage-dark)] text-white py-4 rounded-xl text-[12px] tracking-[0.15em] uppercase">
                      {profileLoading ? "Saving..." : "Save Address"}
                    </button>
                    <button type="button" onClick={() => setIsEditingAddress(false)} className="w-full border border-[rgba(196,168,130,0.35)] text-[var(--color-text-muted)] py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase">
                      Cancel
                    </button>
                    {isOnboarding && (
                      <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="w-full border border-[rgba(196,168,130,0.35)] text-[var(--color-text-muted)] py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase hover:text-[var(--color-sage-dark)]"
                      >
                        Skip for now
                      </button>
                    )}
                  </form>
                )}
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6">
            <button type="button" className="w-full flex items-center justify-between text-left" onClick={() => setIsHelpOpen((prev) => !prev)}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">Help & Support</h3>
                  <p className="text-[14px] text-[var(--color-text-muted)] font-light">Need help with orders or account issues?</p>
                </div>
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-[var(--color-text-muted)] transition-transform ${isHelpOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isHelpOpen && (
              <div className="mt-6 border-t border-[rgba(196,168,130,0.2)] pt-4 grid gap-3">
                <a href="mailto:atasssolutions@gmail.com" className="w-full text-center bg-[var(--color-sage-dark)] text-white py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase">
                  Email Support
                </a>
                <a href="https://wa.me/918055197578" target="_blank" rel="noreferrer" className="w-full text-center border border-[rgba(196,168,130,0.35)] text-[var(--color-text-muted)] py-3.5 rounded-xl text-[12px] tracking-[0.15em] uppercase hover:text-[var(--color-sage-dark)]">
                  WhatsApp Support
                </a>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-[13px] tracking-[0.18em] uppercase font-medium text-[var(--color-text-muted)] hover:text-red-700">
            Logout
          </button>
        </motion.div>
      </motion.div>

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

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-3 py-1 rounded-full text-[0.68rem] uppercase tracking-[0.1em] font-semibold ${statusPillClass[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
                <button
                  type="button"
                  disabled={selectedOrder.status !== "PENDING" || cancelLoadingId === selectedOrder.id}
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className={`px-4 py-2 rounded-full text-[0.68rem] uppercase tracking-[0.1em] ${
                    selectedOrder.status === "PENDING"
                      ? "border border-red-300 text-red-600 hover:bg-red-50"
                      : "border border-[rgba(196,168,130,0.25)] text-[var(--color-text-muted)] cursor-not-allowed"
                  }`}
                >
                  {cancelLoadingId === selectedOrder.id ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>

              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Products</div>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#FAF9F7] rounded-xl border border-[rgba(196,168,130,0.2)] p-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-[rgba(196,168,130,0.25)] bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)] shrink-0">
                          {item.product?.images?.[0] ? <img src={item.product.images[0]} alt={item.productName} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/product/${item.productId}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-sage-dark)] truncate block">
                            {item.productName}
                          </Link>
                          <div className="text-[12px] text-[var(--color-text-muted)]">Qty {item.quantity} x ₹{item.unitPrice}</div>
                        </div>
                      </div>
                      <div className="font-serif text-[1.02rem] text-[var(--color-earth)]">₹{item.lineTotal}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-2">Shipping Address</div>
                <div className="bg-[#FAF9F7] rounded-xl border border-[rgba(196,168,130,0.2)] p-4 text-[14px] text-[var(--color-text-muted)] leading-[1.7]">
                  <div>{selectedOrder.shippingAddress}</div>
                  <div>{selectedOrder.shippingCity} - {selectedOrder.shippingPinCode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component that provides Suspense boundary for dynamic hooks
export default function ProfilePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[var(--color-cream)] pt-32 px-6 flex items-center justify-center">
          <div className="text-[var(--color-text-muted)]">Loading profile...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
