"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  maxStock?: number;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "purevia_cart_items";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartHydrated, setIsCartHydrated] = useState(false);

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
        }))
        .map((item) => ({
          ...item,
          quantity: item.maxStock ? Math.min(item.quantity, item.maxStock) : item.quantity,
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
          i.id === item.id ? { ...i, maxStock: mergedCap, quantity: clampedQty } : i
        );
      }
      return [...prev, { ...item, quantity: cap ? Math.min(safeRequestedQty, cap) : safeRequestedQty }];
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
        const cap = item.maxStock && item.maxStock > 0 ? item.maxStock : undefined;
        const safeQty = cap ? Math.min(quantity, cap) : quantity;
        return { ...item, quantity: safeQty };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isCartHydrated, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, isCartOpen, setIsCartOpen }}>
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
