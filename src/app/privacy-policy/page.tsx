import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-text)] min-h-screen pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[3rem] md:text-[4rem] font-light mb-12 border-b border-[rgba(196,168,130,0.2)] pb-8">
          Privacy <span className="italic">Policy</span>
        </h1>
        
        <div className="space-y-10 text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed font-light">
          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">1. Introduction</h2>
            <p>
              At Pureable, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This policy outlines how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">2. Information Collection</h2>
            <p>
              We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, and shipping address.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">3. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--color-text)] font-serif text-[1.8rem] mb-4">4. Third-Party Services</h2>
            <p>
              We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
