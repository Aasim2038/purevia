"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

// Is function ko alag kar diya taaki Suspense use kar sakein
function SuccessContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fromQuery = searchParams.get('orderId');
    if (fromQuery) {
      setOrderId(fromQuery);
      // Fetch order details
      fetch(`/api/orders/public/${fromQuery}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setOrderData(data.order);
          }
        })
        .catch(err => console.error("Error fetching order:", err));
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setOrderId(`PUR-${randomNum}`);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch('/api/auth/register-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderData?.customerName,
          email: orderData?.customerEmail,
          password,
          orderId: orderData?.id
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsRegistered(true);
        // Auto login after registration
        const result = await signIn('credentials', {
          redirect: false,
          email: orderData?.customerEmail,
          password: password,
        });
        
        if (result?.ok) {
          setTimeout(() => {
            router.push('/profile/orders');
          }, 2000);
        }
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Post-Checkout Account Box */}
      {orderData && !orderData.userId && !isRegistered && !session && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-10 p-8 rounded-[24px] bg-[var(--color-cream)] border border-[var(--color-sage)]/20 text-left shadow-sm"
        >
          <h3 className="font-serif text-[1.4rem] text-[var(--color-text)] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Track your order easily</h3>
          <p className="text-[0.9rem] text-[var(--color-text-muted)] mb-6">
            Set a password to create an account. You can track your order status and save your details for next time.
          </p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Email / Phone</label>
              <input 
                type="text" 
                disabled 
                value={orderData.customerEmail || orderData.customerPhone} 
                className="w-full bg-white/50 border border-[rgba(138,158,126,0.2)] px-4 py-3 rounded-[12px] text-[0.9rem] text-[var(--color-text-muted)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Set Password</label>
              <input 
                type="password" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[rgba(138,158,126,0.2)] px-4 py-3 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.9rem]"
              />
            </div>
            {error && <p className="text-[0.8rem] text-red-600 mt-1">{error}</p>}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[var(--color-sage-dark)] text-white rounded-full text-[0.75rem] uppercase tracking-[0.15em] font-medium hover:bg-[var(--color-text)] transition-all flex justify-center items-center shadow-md"
            >
              {isSubmitting ? "Creating Account..." : "Save Details & Create Account"}
            </button>
          </form>
        </motion.div>
      )}

      {/* Case B: Logged In Message */}
      {session && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-[24px] bg-[rgba(138,158,126,0.05)] border border-[var(--color-sage)]/10 text-center"
        >
          <p className="text-[1rem] text-[var(--color-text)] mb-6 leading-relaxed">
            Order details have been saved to your account and sent to your email.
          </p>
          <Link href="/profile/orders" className="inline-flex py-3.5 px-8 bg-[var(--color-sage-dark)] text-white rounded-full text-[0.75rem] uppercase tracking-[0.15em] font-medium hover:bg-[var(--color-text)] transition-all shadow-sm">
            View Order History
          </Link>
        </motion.div>
      )}

      {isRegistered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 rounded-[24px] bg-[#E8F5E0] border border-[var(--color-sage-dark)]/20 text-[var(--color-sage-dark)] font-medium"
        >
          ✨ Account created! Redirecting to your orders...
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
        <Link href="/" className="inline-flex py-[1.2rem] px-[3rem] tracking-[0.15em] uppercase text-[0.8rem] rounded-full border border-[var(--color-text)] text-[var(--color-text)] transition-all duration-300 hover:bg-[var(--color-text)] hover:text-white hover:-translate-y-1 focus:outline-none">
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
