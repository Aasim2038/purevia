"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart } = useCart();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[rgba(26,22,16,0.4)] backdrop-blur-sm z-[1000] cursor-pointer"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[var(--color-cream)] shadow-[-10px_0_40px_rgba(26,22,16,0.1)] z-[1001] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-[rgba(138,158,126,0.2)]">
              <h2 className="font-serif text-[1.8rem] text-[var(--color-text)] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[2rem] leading-none text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus:outline-none font-light"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="text-[3.5rem] mb-6 grayscale mix-blend-multiply opacity-50">🛒</div>
                  <p className="text-[var(--color-text)] tracking-widest uppercase text-[0.85rem]">Your cart is empty</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-5 items-center bg-white p-4 rounded-[16px] border border-[rgba(138,158,126,0.1)] shadow-[0_4px_10px_rgba(138,158,126,0.02)]">
                      {/* Fake Image Placeholder */}
                      <div className="w-[85px] h-[85px] rounded-[10px] shrink-0 bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)]"></div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between gap-2 items-start mb-1">
                          <h3 className="font-serif text-[1.2rem] leading-tight font-light text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-[0.65rem] uppercase tracking-wider text-red-500/70 hover:text-red-600 transition-colors shrink-0 focus:outline-none">Remove</button>
                        </div>
                        
                        <div className="text-[var(--color-earth)] italic font-light font-serif mb-3 text-[1.1rem]" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{item.price}</div>
                        
                        <div className="flex items-center bg-[var(--color-cream)] rounded-full border border-[rgba(138,158,126,0.2)] h-8 w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex justify-center items-center text-[var(--color-sage-dark)] hover:bg-[var(--color-warm)] transition-colors rounded-l-full focus:outline-none">-</button>
                          <span className="text-[0.8rem] font-medium w-6 text-center text-[var(--color-text)]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex justify-center items-center text-[var(--color-sage-dark)] hover:bg-[var(--color-warm)] transition-colors rounded-r-full focus:outline-none">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-[rgba(138,158,126,0.2)] bg-white shadow-[0_-10px_30px_rgba(138,158,126,0.03)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[0.85rem] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">Subtotal</span>
                  <span className="font-serif text-[1.8rem] font-light italic text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{subtotal}</span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center bg-[var(--color-sage-dark)] text-[#F7F3ED] py-[1.2rem] uppercase tracking-[0.1em] text-[0.85rem] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(138,158,126,0.3)] hover:shadow-[0_8px_25px_rgba(138,158,126,0.4)] hover:-translate-y-1 focus:outline-none no-underline"
                >
                  Checkout securely
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
