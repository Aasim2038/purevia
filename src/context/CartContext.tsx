"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  maxStock?: number;
  minQty?: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartHydrated: boolean;
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  settings: {
    freeShippingThreshold: number;
    shippingCharge: number;
    onlineDiscount: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "pureable_cart_items";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  // Settings are now hardcoded for maximum performance and to avoid redundant DB calls.
  const settings = {
    freeShippingThreshold: 299,
    shippingCharge: 40,
    onlineDiscount: 5,
  };


  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const normalized = parsed
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          id: String(item.id ?? ""),
          name: String(item.name ?? ""),
          price: Number(item.price ?? 0),
          quantity: Number(item.quantity ?? 0),
          imageUrl: item.imageUrl ? String(item.imageUrl) : null,
          maxStock: Number(item.maxStock) > 0 ? Number(item.maxStock) : undefined,
          minQty: Number(item.minQty) > 0 ? Number(item.minQty) : undefined,
        }))
        .map((item) => ({
          ...item,
          quantity: Math.max(item.minQty || 1, item.maxStock ? Math.min(item.quantity, item.maxStock) : item.quantity),
        }))
        .filter((item) => item.id && item.name && item.price >= 0 && item.quantity > 0);
      setItems(normalized);
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsCartHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isCartHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to persist cart to localStorage:", error);
    }
  }, [items, isCartHydrated]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const safeRequestedQty = Math.max(1, Number(quantity) || 1);
      const cap = item.maxStock && item.maxStock > 0 ? item.maxStock : undefined;
      if (existing) {
        const mergedCap = cap ?? existing.maxStock;
        const nextQty = existing.quantity + safeRequestedQty;
        const clampedQty = mergedCap ? Math.min(nextQty, mergedCap) : nextQty;
        return prev.map((i) =>
          i.id === item.id ? { ...i, maxStock: mergedCap, minQty: item.minQty, quantity: clampedQty } : i
        );
      }
      return [...prev, { ...item, quantity: cap ? Math.min(safeRequestedQty, cap) : Math.max(item.minQty || 1, safeRequestedQty) }];
    });
    setIsCartOpen(true); // Open the drawer immediately when adding to cart
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        // Use minQty from product data, default to 1
        const minReq = item.minQty && item.minQty > 0 ? item.minQty : 1;
        const boundedQty = Math.max(quantity, minReq);
        const cap = item.maxStock && item.maxStock > 0 ? item.maxStock : undefined;
        const safeQty = cap ? Math.min(boundedQty, cap) : boundedQty;
        return { ...item, quantity: safeQty };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isCartHydrated, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, isCartOpen, setIsCartOpen, settings }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
