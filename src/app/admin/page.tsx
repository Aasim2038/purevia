"use client";
import React from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardPage() {
  const recentOrders = [
    { id: '#ORD-001', customer: 'Isabella Swan', amount: '₹1450', status: 'Delivered', date: 'Oct 12, 2026' },
    { id: '#ORD-002', customer: 'Edward Cullen', amount: '₹3200', status: 'Pending', date: 'Oct 12, 2026' },
    { id: '#ORD-003', customer: 'Jacob Black', amount: '₹850', status: 'Processing', date: 'Oct 11, 2026' },
    { id: '#ORD-004', customer: 'Alice Cullen', amount: '₹5400', status: 'Delivered', date: 'Oct 10, 2026' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest bg-[#E8F5E0] text-[var(--color-sage-dark)] font-medium">Delivered</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest bg-[#FFF4E5] text-[#D48806] font-medium">Pending</span>;
      case 'Processing':
        return <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest bg-[#E6F4FF] text-[#0958D9] font-medium">Processing</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest bg-gray-100 text-gray-500 font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Overview</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Revenue</span>
              </div>
              <div className="font-serif text-[2.2rem] font-medium text-[var(--color-text)]">₹124,500</div>
              <div className="text-[0.75rem] text-[var(--color-sage-dark)] mt-2 font-medium">+14.5% from last month</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Orders</span>
              </div>
              <div className="font-serif text-[2.2rem] font-medium text-[var(--color-text)]">452</div>
              <div className="text-[0.75rem] text-[var(--color-sage-dark)] mt-2 font-medium">+5.2% from last month</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Pending Deliveries</span>
              </div>
              <div className="font-serif text-[2.2rem] font-medium text-[var(--color-text)]">18</div>
              <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Requires attention today</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-8 h-8 rounded-full bg-[#FCF3F3] flex items-center justify-center text-red-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium text-red-700/80">Low Stock</span>
              </div>
              <div className="font-serif text-[2.2rem] font-medium text-[var(--color-text)]">5</div>
              <div className="text-[0.75rem] text-red-600/70 mt-2 font-medium">SKUs below threshold</div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="px-8 py-6 border-b border-[#EAE6DF] flex justify-between items-center bg-[#FCFAf8]">
              <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Recent Orders</h2>
              <button className="text-[0.75rem] uppercase tracking-[0.1em] font-medium text-[var(--color-sage-dark)] hover:text-[var(--color-earth-dark)] transition-colors focus:outline-none">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0">
                      <td className="px-8 py-5 font-serif font-medium text-[1rem]">{order.id}</td>
                      <td className="px-8 py-5 text-[var(--color-text-muted)] text-[0.85rem]">{order.date}</td>
                      <td className="px-8 py-5">{order.customer}</td>
                      <td className="px-8 py-5 font-serif text-[1rem]">{order.amount}</td>
                      <td className="px-8 py-5">{getStatusBadge(order.status)}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[0.75rem] uppercase tracking-[0.1em] font-medium text-[var(--color-sage-dark)] hover:text-[var(--color-earth-dark)] transition-colors focus:outline-none">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
