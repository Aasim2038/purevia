"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@puroable.com') {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16 flex items-center justify-center selection:bg-[var(--color-sage)] selection:text-white">
        <motion.div 
          className="w-full max-w-md bg-[rgba(253,250,246,0.8)] backdrop-blur-xl border border-[rgba(196,168,130,0.2)] rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(92,115,82,0.06)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-3">{isLoginView ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-[var(--color-text-muted)] text-[14px] font-light">{isLoginView ? 'Enter your details to sign in' : 'Sign up to discover the Puroable experience'}</p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {!isLoginView && (
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Full Name</label>
                <input type="text" required placeholder="Jane Doe" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white transition-all duration-300 placeholder-[rgba(122,109,92,0.4)]" />
              </div>
            )}
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@puroable.com" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white transition-all duration-300 placeholder-[rgba(122,109,92,0.4)]" />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-2 ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••" className="w-full bg-[rgba(247,243,237,0.7)] border border-[rgba(196,168,130,0.3)] rounded-xl px-4 py-3.5 pr-12 text-[14px] outline-none focus:border-[var(--color-sage-dark)] focus:bg-white transition-all duration-300 placeholder-[rgba(122,109,92,0.4)]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            {isLoginView && (
              <div className="flex justify-end pt-1">
                <button type="button" className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="w-full bg-[var(--color-text)] text-white mt-4 py-4 rounded-xl text-[12px] tracking-[0.15em] uppercase hover:bg-[var(--color-sage-dark)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[rgba(196,168,130,0.2)] pt-6">
            <p className="text-[13px] text-[var(--color-text-muted)] font-light">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="text-[var(--color-sage-dark)] hover:text-[var(--color-earth-dark)] font-medium transition-colors ml-1 focus:outline-none">
                {isLoginView ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-32 px-6 md:px-16 selection:bg-[var(--color-sage)] selection:text-white">
      <motion.div 
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* User Header */}
        <motion.div variants={itemVariants as any} className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-[var(--color-warm)] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[rgba(196,168,130,0.3)]">
            <span className="font-serif text-3xl text-[var(--color-sage-dark)]">IS</span>
          </div>
          <h1 className="font-serif text-4xl text-[var(--color-text)] mb-3 tracking-wide">Isabella Swan</h1>
          <p className="text-[var(--color-text-muted)] tracking-wider text-sm uppercase">isabella.swan@example.com</p>
        </motion.div>

        {/* Navigation List (Cards) */}
        <div className=" अंतरिक्ष-y-4 mb-20 space-y-4">
          <motion.div variants={itemVariants as any}>
            <Link href="#" className="group block bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(92,115,82,0.06)] hover:bg-white hover:border-[var(--color-sage)] hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)] group-hover:bg-[var(--color-sage)] group-hover:text-white transition-colors duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">My Orders</h3>
                    <p className="min-w-0 text-[14px] text-[var(--color-text-muted)] font-light truncate mr-2">Track order history, status & dates</p>
                  </div>
                </div>
                <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-sage-dark)] transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants as any}>
            <Link href="#" className="group block bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(92,115,82,0.06)] hover:bg-white hover:border-[var(--color-sage)] hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)] group-hover:bg-[var(--color-sage)] group-hover:text-white transition-colors duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">Saved Addresses</h3>
                    <p className="min-w-0 text-[14px] text-[var(--color-text-muted)] font-light truncate mr-2">Manage previously used locations</p>
                  </div>
                </div>
                <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-sage-dark)] transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants as any}>
            <Link href="#" className="group block bg-[rgba(253,250,246,0.6)] backdrop-blur-md border border-[rgba(196,168,130,0.15)] rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(92,115,82,0.06)] hover:bg-white hover:border-[var(--color-sage)] hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-[var(--color-sage-dark)] group-hover:bg-[var(--color-sage)] group-hover:text-white transition-colors duration-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[var(--color-text)] mb-1">Help Center</h3>
                    <p className="min-w-0 text-[14px] text-[var(--color-text-muted)] font-light truncate mr-2">Client care & support queries</p>
                  </div>
                </div>
                <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-sage-dark)] transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.div variants={itemVariants as any} className="text-center">
          <button onClick={() => setIsLoggedIn(false)} className="text-[13px] tracking-[0.18em] uppercase font-medium text-[var(--color-text-muted)] hover:text-red-800 transition-colors duration-300 flex items-center justify-center gap-3 mx-auto relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 py-2 focus:outline-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
