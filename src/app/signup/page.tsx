"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push("/profile?onboarding=1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md bg-[rgba(253,250,246,0.8)] backdrop-blur-xl border border-[rgba(196,168,130,0.2)] rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(92,115,82,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-3">Create Account</h1>
          <p className="text-[var(--color-text-muted)] text-[14px] font-light">Sign up to discover the Puroable experience</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@puroable.com" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 pr-12 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[var(--color-text)] text-white mt-4 py-4 rounded-xl text-[12px] tracking-[0.15em] uppercase">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(196,168,130,0.2)] pt-6">
          <p className="text-[13px] text-[var(--color-text-muted)] font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-sage-dark)] font-medium">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
