"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    { id: '1', name: 'Neem Aloe Face Wash', category: 'Skin Care', price: '₹349', stock: 120, icon: '🌿', bg: 'linear-gradient(135deg, #E8F5E0, #C8E6B8)' },
    { id: '2', name: 'Rose Turmeric Glow Serum', category: 'Skin Care', price: '₹499', stock: 45, icon: '🌹', bg: 'linear-gradient(135deg, #FDF0E0, #F5D5A8)' },
    { id: '3', name: 'Coconut Bhringraj Hair Oil', category: 'Hair Care', price: '₹299', stock: 8, icon: '🥥', bg: 'linear-gradient(135deg, #E8EFF8, #C8D8F0)' },
    { id: '4', name: 'Hibiscus Face Pack', category: 'Skin Care', price: '₹249', stock: 65, icon: '🌸', bg: 'linear-gradient(135deg, #F5E8F0, #E8C8DC)' },
    { id: '5', name: 'Sandalwood Body Wash', category: 'Body Care', price: '₹599', stock: 0, icon: '🪵', bg: 'linear-gradient(135deg, #F5EFEB, #E0CDBA)' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Products</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Inventory Management</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-sage-dark)] text-white text-[0.8rem] tracking-[0.1em] uppercase rounded-full hover:bg-[var(--color-earth-dark)] transition-all shadow-sm hover:-translate-y-0.5 focus:outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-8 py-5 w-[100px]">Image</th>
                    <th className="px-8 py-5 min-w-[200px]">Product Name</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5 text-center">Stock</th>
                    <th className="px-8 py-5 text-right w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0 relative group">
                      <td className="px-8 py-4">
                        <div className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl shadow-sm border border-[#EAE6DF]" style={{ background: product.bg }}>
                          {product.icon}
                        </div>
                      </td>
                      <td className="px-8 py-4 font-serif font-medium text-[1.1rem]">{product.name}</td>
                      <td className="px-8 py-4 text-[0.85rem] text-[var(--color-text-muted)]">{product.category}</td>
                      <td className="px-8 py-4 font-serif text-[1rem]">{product.price}</td>
                      <td className="px-8 py-4 text-center">
                        <span className={`inline-flex items-center justify-center font-medium w-12 py-1 rounded-full text-[0.8rem] ${
                          product.stock > 20 ? 'bg-[#E8F5E0] text-[var(--color-sage-dark)]' : 
                          product.stock > 0 ? 'bg-[#FFF4E5] text-[#D48806]' : 'bg-[#FCF3F3] text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-[var(--color-text-muted)] hover:text-[#0958D9] transition-colors focus:outline-none" aria-label="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button className="p-1.5 text-[var(--color-text-muted)] hover:text-red-600 transition-colors focus:outline-none" aria-label="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pb-20">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[var(--color-text)]/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-[#FDFDFD] w-full max-w-lg rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-[#EAE6DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-[#EAE6DF] bg-white">
              <h3 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus:outline-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="flex gap-5">
                <div className="w-[120px] h-[120px] shrink-0 bg-[#FAF9F7] rounded-2xl border border-dashed border-[rgba(196,168,130,0.5)] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-cream)] transition-colors text-[var(--color-text-muted)] gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span className="text-[0.65rem] uppercase tracking-[0.1em] font-medium">Upload</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Product Name</label>
                    <input type="text" placeholder="e.g. Glowing Serum" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Price (₹)</label>
                    <input type="number" placeholder="499" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                  <select className="w-full bg-white border border-[#EAE6DF] rounded-xl px-3 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors">
                    <option>Skin Care</option>
                    <option>Hair Care</option>
                    <option>Body Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Stock Amount</label>
                  <input type="number" placeholder="0" className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)] mb-1">Description</label>
                <textarea rows={3} placeholder="Brief product description..." className="w-full bg-white border border-[#EAE6DF] rounded-xl px-4 py-2.5 text-[0.9rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors resize-none"></textarea>
              </div>
            </div>

            <div className="p-6 bg-[#FAF9F7] border-t border-[#EAE6DF] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[0.75rem] tracking-[0.1em] uppercase font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Cancel</button>
              <button className="px-6 py-2.5 bg-[var(--color-text)] text-white text-[0.75rem] tracking-[0.1em] uppercase font-medium rounded-full shadow-md hover:bg-[var(--color-sage-dark)] hover:-translate-y-0.5 transition-all">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
