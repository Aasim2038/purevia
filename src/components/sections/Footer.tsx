import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1610] text-[#F7F3ED] pt-16 md:pt-24 pb-8 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-[rgba(247,243,237,0.1)] pb-16">
        
        {/* Brand Info */}
        <div className="md:col-span-2 pr-0 md:pr-12">
          <div className="font-serif text-[2.5rem] font-light tracking-[0.1em] text-white mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Pur<span className="text-[var(--color-sage)] italic">e</span>able
          </div>
          <p className="text-[0.9rem] text-[rgba(247,243,237,0.6)] leading-[1.8] font-light mb-8 max-w-[320px]">
            Entirely True, Entirely You. Natural beauty products crafted with love and pure ingredients.
          </p>
          <Link href="https://wa.me/918055197578" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-[1.1rem] text-white hover:text-[var(--color-sage)] transition-colors duration-300 decoration-transparent">
            +91 80551 97578
          </Link>
        </div>

        {/* Navigation */}
        <div>
          <div className="text-[0.8rem] tracking-[0.2em] uppercase text-[var(--color-sage)] mb-6">Navigate</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-4">
            <li><Link href="#" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Home</Link></li>
            <li><Link href="#products" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Shop</Link></li>
            <li><Link href="#about" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">About Us</Link></li>
            <li><Link href="#ingredients" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Ingredients</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <div className="text-[0.8rem] tracking-[0.2em] uppercase text-[var(--color-sage)] mb-6">Connect</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-4">
            <li><Link href="https://wa.me/918055197578" target="_blank" rel="noreferrer" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">WhatsApp</Link></li>
            <li><Link href="#" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Instagram</Link></li>
            <li><Link href="#" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="#" className="text-[0.95rem] text-[rgba(247,243,237,0.7)] font-light hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[0.75rem] text-[rgba(247,243,237,0.5)] tracking-[0.05em] font-light">
        <span>© 2026 Pureable. All rights reserved.</span>
        <span>Nagpur, Maharashtra · India</span>
      </div>
    </footer>
  );
}
