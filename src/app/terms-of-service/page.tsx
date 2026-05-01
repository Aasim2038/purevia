import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)] pt-32 pb-24 px-6 md:px-16">
      <section className="max-w-4xl mx-auto bg-white border border-[#EAE6DF] rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(26,22,16,0.04)]">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-[var(--color-text)] mb-6">Terms of Service</h1>
        <div className="space-y-5 text-[0.95rem] leading-[1.9] text-[var(--color-text-muted)]">
          <p>
            This is a placeholder Terms of Service page for Pureable. By using this site, customers agree to comply
            with applicable laws and the terms outlined in this agreement.
          </p>
          <p>
            Product availability, pricing, and offers may change without prior notice. Orders are subject to acceptance,
            stock validation, and successful payment authorization.
          </p>
          <p>
            Customers are responsible for providing accurate shipping details. Delays caused by incomplete or incorrect
            information may affect delivery timelines.
          </p>
          <p>
            All content, branding, and design elements on this website are protected intellectual property and may not
            be copied or redistributed without written permission.
          </p>
          <p>
            These terms are provided as draft placeholder content and should be reviewed by legal counsel prior to
            production launch.
          </p>
        </div>
      </section>
    </main>
  );
}
