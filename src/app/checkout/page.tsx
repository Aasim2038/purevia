"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Script from 'next/script';

type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart, isCartHydrated, settings } = useCart();
  const [activeStep, setActiveStep] = useState<CheckoutStep>('shipping');
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pin: ''
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    // 1. Restore from localStorage if guest was redirected
    const savedData = localStorage.getItem('pureable_checkout_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCoords(parsed.coords || null);
        setPaymentMethod(parsed.paymentMethod || "");
        
        // If we just returned from signup, trigger the action
        const autoTrigger = localStorage.getItem('pureable_checkout_auto_trigger');
        if (autoTrigger === 'true' && session?.user) {
          localStorage.removeItem('pureable_checkout_auto_trigger');
          localStorage.removeItem('pureable_checkout_data');
          // Use a small timeout to ensure everything is ready
          setTimeout(() => {
            if (parsed.isOnlinePayment) {
              handleRazorpayPayment();
            } else {
              handlePlaceOrder();
            }
          }, 500);
        }
      } catch (e) {
        console.error("Failed to restore checkout data", e);
      }
    }

    if (!session?.user) return;

    const loadSavedAddress = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (!res.ok || !data.user) return;

        setFormData((prev) => ({
          ...prev,
          firstName: prev.firstName || (data.user.name ? String(data.user.name).split(' ')[0] : ''),
          lastName: prev.lastName || (data.user.name ? String(data.user.name).split(' ').slice(1).join(' ') : ''),
          email: prev.email || data.user.email || '',
          phone: prev.phone || data.user.phone || '',
          address: prev.address || data.user.address || '',
          city: prev.city || data.user.city || '',
          pin: prev.pin || data.user.pinCode || '',
        }));
      } catch (error) {
        console.error('Failed to load profile address:', error);
      }
    };

    loadSavedAddress();
  }, [session]);

  const handleLocationClick = () => {
    setGeoLoading(true);
    setGeoError("");
    setShowManualLocation(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoLoading(false);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGeoError("Location permission denied. Please allow location access in browser settings.");
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setGeoError("Location unavailable. Please ensure GPS/network is enabled.");
          } else if (err.code === err.TIMEOUT) {
            setGeoError("Location request timed out. Try again in an open area.");
          } else {
            setGeoError("Could not fetch location right now.");
          }
          setShowManualLocation(true);
          setGeoLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
      setShowManualLocation(true);
      setGeoLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = items.length > 0 &&
    formData.firstName.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.pin.trim() !== '';
  const hasStockViolation = items.some(
    (item) => typeof item.maxStock === "number" && item.quantity > item.maxStock
  );

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setActiveStep('payment');
    }
  };

  const handlePlaceOrder = async (razorpayPaymentId?: string, razorpayOrderId?: string) => {
    if (!isFormValid) {
      setActiveStep('shipping');
      return;
    }
    if (hasStockViolation) {
      setGeoError("One or more items exceed available stock. Please update your cart quantities.");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim() === '' ? null : formData.email.trim(),
          paymentMethod,
          razorpayPaymentId: razorpayPaymentId || null,
          razorpayOrderId: razorpayOrderId || null,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          shippingAmount: shipping,
          grandTotal: total,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      const data = await res.json();
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (error) {
      console.error(error);
      setGeoError('Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsSubmitting(true);
      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: `rcpt_${Date.now()}`,
        }),
      });
      
      if (!orderRes.ok) throw new Error('Failed to create Razorpay order');
      
      const orderData = await orderRes.json();

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Pureable',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response: any) {
          // Payment success! Now place the order in our DB
          await handlePlaceOrder(response.razorpay_payment_id, response.razorpay_order_id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#5C7352', // Sage dark
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay payment failed:', error);
      setGeoError('Payment initialization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutAction = () => {
    if (!session?.user) {
      // Save data and redirect to signup
      localStorage.setItem('pureable_checkout_data', JSON.stringify({
        formData,
        coords,
        paymentMethod,
        isOnlinePayment
      }));
      localStorage.setItem('pureable_checkout_auto_trigger', 'true');
      router.push('/signup?callbackUrl=/checkout');
      return;
    }

    if (isOnlinePayment) {
      handleRazorpayPayment();
    } else {
      handlePlaceOrder();
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isOnlinePayment = paymentMethod === 'card' || paymentMethod === 'upi';
  const onlineDiscount = isOnlinePayment ? Math.floor(subtotal * (settings.onlineDiscount / 100)) : 0;
  const shipping = subtotal > 0 && subtotal < settings.freeShippingThreshold ? settings.shippingCharge : 0;
  const total = subtotal - onlineDiscount + shipping;
  const remainingForFreeShipping = settings.freeShippingThreshold - subtotal;

  const accordionVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: { height: 'auto', opacity: 1, overflow: 'hidden', transition: { duration: 0.4, ease: "easeInOut" as const } }
  };

  // Shared generic summary details to avoid duplication
  const renderSummaryDetails = (isMobile: boolean = false) => (
    <div className={`flex flex-col gap-6 ${isMobile ? 'pt-6 border-t border-[rgba(138,158,126,0.15)] mt-4' : ''}`}>
      {!isCartHydrated ? (
        <div className="text-[0.95rem] text-[var(--color-text-muted)] font-light italic text-center py-6">Loading your cart...</div>
      ) : items.length === 0 ? (
        <div className="text-[0.95rem] text-[var(--color-text-muted)] font-light italic text-center py-6">Your cart is perfectly pure... but empty.</div>
      ) : (
        <div className="flex flex-col gap-6 max-h-[350px] overflow-y-auto overflow-x-hidden pt-3 pr-4 pl-1">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative mt-2">
                  <div className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-[10px] border border-[rgba(138,158,126,0.15)] overflow-hidden bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)] relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <span className="absolute -top-3 -right-3 w-[22px] h-[22px] flex items-center justify-center bg-[var(--color-sage-dark)] text-white text-[0.65rem] rounded-full shadow-sm z-10">{item.quantity}</span>
                </div>
                <span className="font-serif text-[1.05rem] md:text-[1.15rem] text-[var(--color-text)] font-light leading-snug" style={{ fontFamily: 'var(--font-cormorant)' }}>{item.name}</span>
              </div>
              <span className="font-serif text-[1.05rem] md:text-[1.15rem] text-[var(--color-earth)] font-medium whitespace-nowrap" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 py-6 border-y border-[rgba(138,158,126,0.15)] mt-4 relative">
        {remainingForFreeShipping > 0 ? (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-cream)] px-4 py-1 text-[0.7rem] text-[#D48806] border border-[#D48806]/20 rounded-full font-medium uppercase tracking-wider whitespace-nowrap">
            Add ₹{remainingForFreeShipping} more for FREE Delivery!
          </div>
        ) : subtotal > 0 && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-sage)] px-4 py-1 text-[0.7rem] text-white rounded-full font-medium uppercase tracking-wider whitespace-nowrap shadow-sm">
            You unlocked FREE Delivery!
          </div>
        )}
        <div className="flex justify-between items-center text-[0.8rem] md:text-[0.85rem] text-[var(--color-text-muted)] uppercase tracking-wider pt-2">
          <span>Subtotal</span>
          <span className="font-medium text-[var(--color-text)]">₹{subtotal}</span>
        </div>
        <AnimatePresence>
          {onlineDiscount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex justify-between items-center text-[0.8rem] md:text-[0.85rem] text-[#D48806] uppercase tracking-wider overflow-hidden"
            >
              <span>Online Payment Discount ({settings.onlineDiscount}%)</span>
              <span className="font-medium">-₹{onlineDiscount}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between items-center text-[0.8rem] md:text-[0.85rem] text-[var(--color-text-muted)] uppercase tracking-wider">
          <span>Shipping</span>
          <span className="font-medium text-[var(--color-text)]">{subtotal > 0 ? (shipping > 0 ? `₹${shipping}` : 'FREE') : '—'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium text-[1.1rem] md:text-[1.2rem] uppercase tracking-[0.1em] text-[var(--color-text)]">Total</span>
        <span className="font-serif text-[2rem] md:text-[2.4rem] font-light text-[var(--color-earth)] italic leading-none" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{total}</span>
      </div>
      {hasStockViolation && (
        <div className="text-[0.72rem] uppercase tracking-[0.08em] text-red-600">
          Stock changed. Please reduce quantity in cart before checkout.
        </div>
      )}
    </div>
  );

  const BRAND_NAME = "Pureable";

  return (
    <main className="bg-[var(--color-cream)] pt-[90px] pb-40 lg:pb-32 min-h-screen select-none relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />


      {/* Mobile Sticky Order Peeker (Only visible on Mobile) */}
      <div className="lg:hidden sticky top-[80px] z-40 bg-white border-b border-[rgba(138,158,126,0.15)] shadow-[0_4px_15px_rgba(138,158,126,0.06)] px-6 py-5">
        <button
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full flex justify-between items-center focus:outline-none"
        >
          <div className="flex items-center gap-3 text-[0.95rem] font-medium text-[var(--color-text)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-sage-dark)]"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Order Summary <span className="text-[var(--color-text-muted)] text-[0.85rem] font-normal">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-[1.2rem] text-[var(--color-earth)] font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{total}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-[var(--color-text-muted)] transition-transform duration-300 ${isMobileSummaryOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </button>
        <AnimatePresence>
          {isMobileSummaryOpen && (
            <motion.div initial="hidden" animate="visible" exit="hidden" variants={accordionVariants}>
              {renderSummaryDetails(true)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Online Payment Discount Banner */}
      <div className="px-6 md:px-16 mx-auto container max-w-[1200px] mb-6">
        <div className="bg-[linear-gradient(135deg,#FFF4E5_0%,#FDE6C8_100%)] border border-[#D48806]/20 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm">
          <span className="text-[1.2rem]">✨</span>
          <p className="text-[0.85rem] md:text-[0.95rem] font-medium text-[#B37305] tracking-wide uppercase">
            Save extra 5% with Online Payments!
          </p>
          <span className="text-[1.2rem]">✨</span>
        </div>
      </div>

      <div className="px-6 md:px-16 mx-auto container max-w-[1200px] mt-10 lg:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 lg:mb-12 text-center lg:text-left"
        >
          <div className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex justify-center lg:justify-start items-center gap-3">
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
            Final Step
            <span className="hidden lg:block w-6 h-[1px] bg-[var(--color-sage)]" />
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Secure <em className="italic text-[var(--color-sage-dark)]">Checkout</em> at {BRAND_NAME}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left Column: Form Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* STEP 1: SHIPPING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className={`bg-white rounded-[24px] shadow-[0_10px_40px_rgba(138,158,126,0.03)] border transition-all duration-300 overflow-hidden ${activeStep === 'shipping' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.2)]'}`}
            >
              <button
                onClick={() => setActiveStep('shipping')}
                className="w-full flex justify-between items-center p-6 lg:p-8 focus:outline-none"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-[1.2rem] transition-colors ${activeStep === 'shipping' || isFormValid ? 'bg-[var(--color-sage-dark)] text-white' : 'bg-[#F7F3ED] text-[var(--color-text-muted)]'}`}>1</div>
                  <h2 className="font-serif text-[1.5rem] lg:text-[1.7rem] font-light text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Shipping Information</h2>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${activeStep === 'shipping' ? 'rotate-180 text-[var(--color-sage-dark)]' : 'text-[var(--color-text-muted)]'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <AnimatePresence>
                {activeStep === 'shipping' && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={accordionVariants}>
                    <div className="px-6 lg:px-8 pb-8 pt-0">
                      <form onSubmit={handleShippingSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Phone Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex justify-between items-end mb-2">
                            <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Full Address</label>
                            <button
                              type="button"
                              onClick={handleLocationClick}
                              disabled={geoLoading}
                              className="text-[0.75rem] bg-[rgba(138,158,126,0.1)] hover:bg-[rgba(138,158,126,0.2)] active:scale-95 text-[var(--color-sage-dark)] font-medium px-4 py-2 rounded-full transition-all flex items-center gap-1.5 focus:outline-none shadow-sm"
                            >
                              <span className="text-[1rem]">📍</span>
                              {geoLoading ? "Locating..." : "Use My Location"}
                            </button>
                          </div>
                          {coords && <div className="text-[0.75rem] text-[var(--color-sage-dark)] font-medium mb-1">Coordinates stored securely for delivery routing.</div>}
                          {geoError && (
                            <div className="mb-1">
                              <div className="text-[0.75rem] text-red-500/80">{geoError}</div>
                              <button
                                type="button"
                                onClick={() => { setShowManualLocation(true); setGeoError(""); }}
                                className="text-[0.72rem] text-[var(--color-sage-dark)] underline mt-1"
                              >
                                Use Manual Entry
                              </button>
                            </div>
                          )}
                          {showManualLocation && (
                            <div className="text-[0.75rem] text-[var(--color-text-muted)] mb-1">
                              Manual entry enabled. Please continue typing your full address below.
                            </div>
                          )}
                          <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem] resize-none"></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">PIN Code</label>
                            <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={!isFormValid}
                          className={`mt-4 w-full py-[1.2rem] uppercase tracking-[0.15em] text-[0.85rem] rounded-full transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(138,158,126,0.15)] focus:outline-none flex justify-center items-center ${!isFormValid ? 'bg-[var(--color-warm)] text-[var(--color-text-muted)] cursor-not-allowed shadow-none' : 'bg-[var(--color-sage-dark)] text-[#F7F3ED] hover:shadow-[0_8px_25px_rgba(138,158,126,0.3)] hover:-translate-y-1'}`}
                        >
                          Continue to Payment
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STEP 2: PAYMENT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className={`bg-white rounded-[24px] shadow-[0_10px_40px_rgba(138,158,126,0.03)] border transition-all duration-300 overflow-hidden ${activeStep === 'payment' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.2)]'}`}
            >
              <button
                onClick={() => { if (isFormValid) setActiveStep('payment') }}
                disabled={!isFormValid}
                className={`w-full flex justify-between items-center p-6 lg:p-8 focus:outline-none ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-[1.2rem] transition-colors ${activeStep === 'payment' ? 'bg-[var(--color-sage-dark)] text-white' : 'bg-[#F7F3ED] text-[var(--color-text-muted)]'}`}>2</div>
                  <h2 className="font-serif text-[1.5rem] lg:text-[1.7rem] font-light text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Payment Method</h2>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${activeStep === 'payment' ? 'rotate-180 text-[var(--color-sage-dark)]' : 'text-[var(--color-text-muted)]'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <AnimatePresence>
                {activeStep === 'payment' && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={accordionVariants}>
                    <div className="px-6 lg:px-8 pb-8 pt-0 flex flex-col gap-4">
                      <label className={`relative flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-300 active:scale-[0.99] ${paymentMethod === 'card' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-sm' : 'border-[rgba(138,158,126,0.2)] bg-[var(--color-cream)] hover:border-[var(--color-sage)]'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                            {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                          </div>
                          <span className="text-[0.95rem] text-[var(--color-text)] font-medium">Card Payment</span>
                        </div>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                      </label>
                      {paymentMethod === 'card' && (
                        <div className="text-[0.8rem] text-[#D48806] font-medium -mt-3 ml-2 animate-in fade-in slide-in-from-top-1">
                          Save {settings.onlineDiscount}% Instantly with Online Payment!
                        </div>
                      )}

                      <label className={`relative flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-300 active:scale-[0.99] ${paymentMethod === 'upi' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-sm' : 'border-[rgba(138,158,126,0.2)] bg-[var(--color-cream)] hover:border-[var(--color-sage)]'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                            {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                          </div>
                          <span className="text-[0.95rem] text-[var(--color-text)] font-medium">UPI / QR Code</span>
                        </div>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                      </label>
                      {paymentMethod === 'upi' && (
                        <div className="text-[0.8rem] text-[#D48806] font-medium -mt-3 ml-2 animate-in fade-in slide-in-from-top-1">
                          Save {settings.onlineDiscount}% Instantly with Online Payment!
                        </div>
                      )}

                      <label className={`relative flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-300 active:scale-[0.99] ${paymentMethod === 'cod' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-sm' : 'border-[rgba(138,158,126,0.2)] bg-[var(--color-cream)] hover:border-[var(--color-sage)]'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                          </div>
                          <span className="text-[0.95rem] text-[var(--color-text)] font-medium">Cash on Delivery</span>
                        </div>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                      </label>

                      {/* Place Order for Mobile embedded in payment step optionally, but we have sticky bottom bar. So just descriptive text here */}
                      <div className="lg:hidden text-[0.85rem] text-center text-[var(--color-text-muted)] mt-5 italic">
                        Use the sticky button below to complete your order securely.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Order Summary (Desktop Sticky Sidebar) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block lg:col-span-5"
          >
            <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(138,158,126,0.03)] border border-[rgba(138,158,126,0.2)] p-10 sticky top-[120px]">
              <h2 className="font-serif text-[1.6rem] font-light text-[var(--color-text)] mb-6 pb-4 border-b border-[rgba(138,158,126,0.15)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                Order Summary
              </h2>

              {renderSummaryDetails(false)}

              {activeStep === 'payment' && paymentMethod !== '' && (
                <motion.button
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onClick={handleCheckoutAction}
                  disabled={!isFormValid || hasStockViolation || isSubmitting}
                  className={`mt-10 w-full py-[1.2rem] uppercase tracking-[0.15em] text-[0.85rem] rounded-full transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(138,158,126,0.15)] focus:outline-none flex justify-center items-center ${(!isFormValid || hasStockViolation || isSubmitting) ? 'bg-[var(--color-warm)] text-[var(--color-text-muted)] cursor-not-allowed shadow-none' : 'bg-[var(--color-sage-dark)] text-[#F7F3ED] hover:shadow-[0_8px_25px_rgba(138,158,126,0.3)] hover:-translate-y-1'}`}
                >

                  {isSubmitting ? <div className="w-5 h-5 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin"></div> : "Place Order"}
                </motion.button>
              )}
              <div className="mt-6 text-[0.7rem] text-center text-[var(--color-text-muted)] leading-relaxed">
                By placing an order, you agree to our <Link href="/privacy-policy" className="underline hover:text-[var(--color-sage-dark)]">Privacy Policy</Link>.
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <AnimatePresence>
        {activeStep === 'payment' && paymentMethod !== '' && (
          <motion.div
            initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(138,158,126,0.15)] p-5 px-6 z-50 flex justify-between items-center shadow-[0_-10px_30px_rgba(138,158,126,0.08)] pb-8"
          >
            <div className="flex flex-col">
              <span className="text-[0.7rem] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Total Amount</span>
              <span className="font-serif text-[1.6rem] text-[var(--color-earth)] font-medium leading-none" style={{ fontFamily: 'var(--font-cormorant)' }}>
                ₹{total}
              </span>
              {isOnlinePayment && onlineDiscount > 0 && (
                <span className="text-[0.7rem] text-[#D48806] font-medium mt-1">
                  (Saved ₹{onlineDiscount})
                </span>
              )}
            </div>
            <button
              onClick={handleCheckoutAction}
              disabled={!isFormValid || hasStockViolation || isSubmitting}
              className={`flex-1 ml-6 py-[1rem] uppercase tracking-[0.15em] text-[0.8rem] rounded-full transition-all duration-300 active:scale-95 focus:outline-none flex justify-center items-center ${(!isFormValid || hasStockViolation || isSubmitting) ? 'bg-[#F7F3ED] text-[var(--color-text-muted)] cursor-not-allowed border border-[rgba(138,158,126,0.2)]' : 'bg-[var(--color-sage-dark)] text-[#F7F3ED] shadow-[0_4px_15px_rgba(138,158,126,0.3)]'}`}
            >

              {isSubmitting ? <div className="w-5 h-5 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin"></div> : "Place Order"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="lg:hidden px-6 pb-10 -mt-10 text-[0.65rem] text-center text-[var(--color-text-muted)]">
        By placing an order, you agree to our <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </div>
    </main>
  );
}
