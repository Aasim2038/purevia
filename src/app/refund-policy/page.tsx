import React from 'react';

export default function RefundPolicyPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-text)] min-h-screen pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[3rem] md:text-[4rem] font-light mb-12 border-b border-[rgba(196,168,130,0.2)] pb-8">
          Refund <span className="italic">Policy</span>
        </h1>
        
        <div className="space-y-10 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed font-light">
          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Cancellation Policy</h2>
            <p>
              We understand that plans change. You can cancel your order any time <span className="text-[var(--color-text)] font-medium">before the items have been shipped</span>. Once the order has been dispatched from our facility, we are unable to process any cancellations.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Refund Process</h2>
            <p>
              Once a cancellation request is approved, the refund will be initiated to your original payment method. Please allow <span className="text-[var(--color-text)] font-medium">5-7 business days</span> for the amount to reflect in your account, depending on your bank's processing times.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">Returns & Exchanges</h2>
            <p>
              Due to the nature of our products and for hygiene reasons, we do not accept returns. However, if you receive a damaged or incorrect product, please reach out to us within 24 hours of delivery with photographic evidence, and we will arrange for a replacement.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
