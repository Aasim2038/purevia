import React from 'react';

export default function TermsOfServicePage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-text)] min-h-screen pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[3rem] md:text-[4rem] font-light mb-12 border-b border-[rgba(196,168,130,0.2)] pb-8">
          Terms of <span className="italic">Service</span>
        </h1>
        
        <div className="space-y-10 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed font-light">
          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">2. Product Information</h2>
            <p>
              The products listed on Pureable are subject to change without notice. We attempt to be as accurate as possible in the description of our chemical-free, Ayurvedic products; however, we do not warrant that product descriptions or other content are error-free.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">3. User Conduct</h2>
            <p>
              Users are prohibited from using the site to engage in any conduct that would violate any local, state, national or international law. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">4. Limitation of Liability</h2>
            <p>
              Pureable and its technical backers ATASS Solutions shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
