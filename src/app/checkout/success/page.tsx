"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Is function ko alag kar diya taaki Suspense use kar sakein
function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const fromQuery = searchParams.get('orderId');
    if (fromQuery) {
      setOrderId(fromQuery);
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setOrderId(`PUR-${randomNum}`);
    }
  }, [searchParams]);

  return (
    <div className="relative z-10 max-w-[600px] w-full bg-white rounded-[32px] p-10 md:p-16 shadow-[0_20px_60px_rgba(138,158,126,0.05)] border border-[rgba(138,158,126,0.15)] text-center">
      {/* Animated Checkmark */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
        className="w-24 h-24 mx-auto mb-8 bg-[var(--color-sage-dark)] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(138,158,126,0.3)]"
      >
        <motion.svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" 
          />
        </motion.svg>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <div className="uppercase tracking-[0.2em] text-[0.75rem] text-[var(--color-text-muted)] mb-3">Order Confirmed</div>
        <h1 className="font-serif text-[clamp(2.2rem,4vw,3rem)] font-light leading-[1.1] mb-4 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Thank you for choosing <br/><em className="italic text-[var(--color-sage-dark)]">Pureable</em>
        </h1>
        <p className="text-[1rem] text-[var(--color-text-muted)] font-light leading-[1.6] mb-8 max-w-[400px] mx-auto">
          Your order <strong className="font-medium text-[var(--color-text)]">#{orderId}</strong> has been placed successfully. We will contact you shortly for confirmation.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
        <Link href="/" className="inline-flex py-[1.2rem] px-[3rem] tracking-[0.15em] uppercase text-[0.8rem] rounded-full bg-[var(--color-text)] text-[#F7F3ED] transition-all duration-300 hover:bg-[var(--color-earth-dark)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(196,168,130,0.3)] focus:outline-none">
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}

// Main Page Component
export default function CheckoutSuccessPage() {
  return (
    <main className="bg-[var(--color-cream)] min-h-screen flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(138,158,126,0.06)_0%,rgba(247,243,237,0)_70%)] blur-[50px] mix-blend-multiply" />
      </div>

      <Suspense fallback={<div className="text-[var(--color-text-muted)]">Loading confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
