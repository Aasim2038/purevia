import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream)] pt-32 pb-24 px-6 md:px-16">
      <section className="max-w-4xl mx-auto bg-white border border-[#EAE6DF] rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(26,22,16,0.04)]">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-[var(--color-text)] mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-[0.95rem] leading-[1.9] text-[var(--color-text-muted)]">
          <p>
            This is a placeholder privacy policy for Pureable. We respect your privacy and are committed to protecting
            your personal information through transparent data handling practices.
          </p>
          <p>
            We may collect customer details such as name, email, phone number, shipping address, and order history to
            process purchases, provide support, and improve service quality.
          </p>
          <p>
            Payment-related information is handled through secure payment channels. Pureable does not store complete
            card credentials on its own systems.
          </p>
          <p>
            Your data may be used for order fulfillment, delivery updates, account security, and relevant transactional
            communication. Marketing communication is optional and can be managed through your preferences.
          </p>
          <p>
            We maintain reasonable technical and organizational safeguards to protect your information. Policy details
            should be reviewed with legal counsel before production launch.
          </p>
        </div>
      </section>
    </main>
  );
}
