import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-text)] min-h-screen pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[3rem] md:text-[4rem] font-light mb-12 border-b border-[rgba(196,168,130,0.2)] pb-8">
          Shipping <span className="italic">Policy</span>
        </h1>
        
        <div className="space-y-10 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed font-light">
          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Delivery Timeline</h2>
            <p>
              We strive to deliver our premium botanical products to your doorstep as quickly as possible. Our standard delivery timeline across India is <span className="text-[var(--color-text)] font-medium">3-7 business days</span>.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Aurangabad Special Delivery</h2>
            <p>
              For our customers in Aurangabad, we are proud to offer <span className="text-[var(--color-text)] font-medium">Same Day Delivery</span> for orders placed
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Shipping Charges</h2>
            <p>
              We offer free shipping on all orders above ₹299. For orders below this threshold, a flat shipping fee of ₹40 applies. These charges are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Tracking Your Order</h2>
            <p>
              Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can also track your order status directly from your profile dashboard on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
