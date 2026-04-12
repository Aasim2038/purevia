"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/sections/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pin: ''
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleGeolocation = () => {
    setGeoLoading(true);
    setGeoError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGeoLoading(false);
        },
        () => {
          setGeoError("Location access denied or unavailable.");
          setGeoLoading(false);
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = items.length > 0 && 
    formData.firstName.trim() !== '' && 
    formData.phone.trim() !== '' && 
    formData.address.trim() !== '';

  const handlePlaceOrder = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <main className="bg-[var(--color-cream)] pt-32 pb-0 min-h-screen select-none">
      <div className="px-6 md:px-16 mx-auto container max-w-[1200px] mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 border-b border-[rgba(138,158,126,0.15)] pb-6"
        >
          <div className="text-[0.75rem] tracking-[0.25em] uppercase text-[var(--color-sage-dark)] mb-4 flex items-center gap-3">
            <span className="block w-6 h-[1px] bg-[var(--color-sage)]" />
            Final Step
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Secure <em className="italic text-[var(--color-sage-dark)]">Checkout</em>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_10px_40px_rgba(138,158,126,0.03)] border border-[rgba(138,158,126,0.1)]">
              <h2 className="font-serif text-[1.8rem] font-light mb-8 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Shipping Information</h2>
              
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">Full Address</label>
                    <button 
                      type="button" 
                      onClick={handleGeolocation}
                      disabled={geoLoading}
                      className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)] cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 focus:outline-none"
                    >
                      {geoLoading ? "Locating..." : "📍 Use My Current Location"}
                    </button>
                  </div>
                  {coords && <div className="text-[0.75rem] text-[var(--color-sage-dark)] font-medium mb-1">Coordinates stored securely for delivery routing.</div>}
                  {geoError && <div className="text-[0.75rem] text-red-500/80 mb-1">{geoError}</div>}
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem] resize-none"></textarea>
                  <input type="hidden" name="lat" value={coords?.lat || ''} />
                  <input type="hidden" name="lng" value={coords?.lng || ''} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium">PIN Code</label>
                    <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="w-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] px-4 py-3.5 rounded-[12px] focus:outline-none focus:border-[var(--color-sage-dark)] focus:ring-1 focus:ring-[var(--color-sage-dark)] transition-all text-[0.95rem]" />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_10px_40px_rgba(138,158,126,0.03)] border border-[rgba(138,158,126,0.1)] mt-8">
              <h2 className="font-serif text-[1.8rem] font-light mb-8 text-[var(--color-text)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Payment Method</h2>
              <div className="flex flex-col gap-4">
                <label className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-[0_4px_20px_rgba(138,158,126,0.08)]' : 'border-[rgba(138,158,126,0.2)] bg-white hover:border-[var(--color-earth)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                    </div>
                    <span className="text-[0.95rem] text-[var(--color-text)] font-medium">Card Payment</span>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-sage-dark)] opacity-70"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                </label>

                <label className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'upi' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-[0_4px_20px_rgba(138,158,126,0.08)]' : 'border-[rgba(138,158,126,0.2)] bg-white hover:border-[var(--color-earth)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                    </div>
                    <span className="text-[0.95rem] text-[var(--color-text)] font-medium">UPI / QR Code</span>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-sage-dark)] opacity-70"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="10" height="10"></rect></svg>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                </label>

                <label className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-[var(--color-sage-dark)] bg-[rgba(247,243,237,0.3)] shadow-[0_4px_20px_rgba(138,158,126,0.08)]' : 'border-[rgba(138,158,126,0.2)] bg-white hover:border-[var(--color-earth)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-[var(--color-sage-dark)]' : 'border-[rgba(138,158,126,0.4)]'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-sage-dark)]"></div>}
                    </div>
                    <span className="text-[0.95rem] text-[var(--color-text)] font-medium">Cash on Delivery</span>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-sage-dark)] opacity-70"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                </label>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-[#FDFAF6] border border-[rgba(196,168,130,0.2)] p-8 md:p-10 rounded-[24px] lg:sticky lg:top-32 shadow-[0_10px_40px_rgba(138,158,126,0.03)]">
              <h2 className="font-serif text-[1.8rem] font-light mb-8 text-[var(--color-text)] border-b border-[rgba(138,158,126,0.15)] pb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>Order Summary</h2>
              
              <div className="flex flex-col gap-5 mb-8 max-h-[350px] overflow-visible pr-2 pt-2">
                {items.length === 0 ? (
                  <div className="text-[0.95rem] text-[var(--color-text-muted)] font-light italic">Your cart is perfectly pure... but empty.</div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {/* Image Placeholder */}
                          <div className="w-[60px] h-[60px] rounded-[10px] border border-[rgba(138,158,126,0.15)] bg-[linear-gradient(135deg,#E8F5E0_0%,#D4E5CB_100%)]"></div>
                          <span className="absolute -top-2.5 -right-2.5 w-[22px] h-[22px] flex items-center justify-center bg-[var(--color-sage-dark)] text-white text-[0.65rem] rounded-full shadow-sm z-10">{item.quantity}</span>
                        </div>
                        <span className="font-serif text-[1.1rem] bg-transparent text-[var(--color-text)] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>{item.name}</span>
                      </div>
                      <span className="font-serif text-[1.1rem] text-[var(--color-earth)] font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-4 py-6 border-y border-[rgba(138,158,126,0.15)] mb-8">
                <div className="flex justify-between items-center text-[0.8rem] text-[var(--color-text-muted)] uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="font-medium text-[var(--color-text)]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[0.8rem] text-[var(--color-text-muted)] uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className="font-medium text-[var(--color-text)]">{subtotal > 0 ? `₹${shipping}` : '—'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="font-medium text-[1.1rem] uppercase tracking-[0.1em] text-[var(--color-text)]">Total</span>
                <span className="font-serif text-[2.5rem] font-light text-[var(--color-earth)] italic leading-none" style={{ fontFamily: 'var(--font-cormorant)' }}>₹{total}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-[1.2rem] uppercase tracking-[0.15em] text-[0.85rem] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(138,158,126,0.15)] focus:outline-none flex justify-center items-center ${(!isFormValid || isSubmitting) ? 'bg-[var(--color-warm)] text-[var(--color-text-muted)] cursor-not-allowed shadow-none' : 'bg-[var(--color-sage-dark)] text-[#F7F3ED] hover:shadow-[0_8px_25px_rgba(138,158,126,0.3)] hover:-translate-y-1'}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
