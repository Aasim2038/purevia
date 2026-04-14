"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    const session = await getSession();
    const role = session?.user?.role;
    if (role === "ADMIN") {
      router.push("/admin");
      return;
    }
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md bg-[rgba(253,250,246,0.8)] backdrop-blur-xl border border-[rgba(196,168,130,0.2)] rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(92,115,82,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-3">Welcome Back</h1>
          <p className="text-[var(--color-text-muted)] text-[14px] font-light">Enter your details to sign in</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[rgba(196,168,130,0.2)] pt-6">
          <p className="text-[13px] text-[var(--color-text-muted)] font-light">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[var(--color-sage-dark)] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
