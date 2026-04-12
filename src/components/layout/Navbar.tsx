"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState('');
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(desktopSearch.trim()) {
      router.push('/shop');
    }
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center transition-all duration-400 ${scrolled ? 'bg-[rgba(247,243,237,0.95)] backdrop-blur-[12px] py-4 px-6 md:px-16 border-b border-[rgba(196,168,130,0.2)]' : 'py-6 px-6 md:px-16 bg-[rgba(247,243,237,0)]'}`}>
        <Link href="/" className="font-serif text-[1.8rem] font-light tracking-[0.1em] text-[var(--color-text)] no-underline relative z-[101]">
          Pur<span className="text-[var(--color-sage-dark)] italic">o</span>able
        </Link>
        <ul className="hidden md:flex gap-10 list-none m-0 p-0 items-center">
          <li><Link href="/shop" className="text-[0.82rem] font-medium tracking-[0.15em] uppercase text-[var(--color-sage-dark)] no-underline transition-colors duration-300 hover:text-[var(--color-earth-dark)]">Shop</Link></li>
          <li><Link href="/#about" className="text-[0.82rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)] no-underline transition-colors duration-300 hover:text-[var(--color-sage-dark)]">About</Link></li>
          <li><Link href="/#ingredients" className="text-[0.82rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)] no-underline transition-colors duration-300 hover:text-[var(--color-sage-dark)]">Ingredients</Link></li>
        </ul>
        <div className="flex items-center gap-4 md:gap-6 relative z-[101]">
          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={desktopSearch}
              onChange={(e) => setDesktopSearch(e.target.value)}
              className="bg-transparent border-b border-[rgba(196,168,130,0.3)] py-1 pl-7 pr-2 text-[0.8rem] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-sage-dark)] transition-all w-[140px] focus:w-[180px] duration-300 ease-in-out"
            />
            <button type="submit" aria-label="Search" className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] cursor-pointer bg-transparent border-none p-0 flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          {/* Desktop Cart */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-[0.82rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)] no-underline transition-colors duration-300 hover:text-[var(--color-sage-dark)] max-md:hidden focus:outline-none flex items-center gap-2"
          >
            Cart <span className={`flex items-center justify-center text-[0.65rem] w-[18px] h-[18px] rounded-full text-white ${cartCount > 0 ? 'bg-[var(--color-sage-dark)]' : 'bg-[var(--color-earth)]'}`}>{cartCount}</span>
          </button>
          <Link href="/profile" className="hidden md:flex text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors" aria-label="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[400px] bg-[rgba(247,243,237,0.85)] backdrop-blur-[16px] border border-[rgba(196,168,130,0.2)] rounded-full px-8 py-3.5 flex justify-between items-center z-[100] shadow-[0_8px_32px_rgba(92,115,82,0.12)]">
        <Link href="/" className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors" aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </Link>
        <Link href="/shop" className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors" aria-label="Shop">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </Link>
        <Link href="/shop" className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors" aria-label="Search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors" aria-label="Profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </Link>
        <button onClick={() => setIsCartOpen(true)} className="relative flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[var(--color-sage-dark)] text-white text-[0.6rem] w-[16px] h-[16px] flex items-center justify-center rounded-full font-serif font-medium leading-none shadow-[0_2px_8px_rgba(92,115,82,0.4)]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
