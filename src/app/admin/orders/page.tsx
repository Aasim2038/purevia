"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState('All');

  const ordersData = [
    { id: '#ORD-001', customer: 'Isabella Swan', email: 'isabella@example.com', amount: '₹1450', status: 'Delivered', date: 'Oct 12, 2026', items: 3 },
    { id: '#ORD-002', customer: 'Edward Cullen', email: 'edward@example.com', amount: '₹3200', status: 'Pending', date: 'Oct 12, 2026', items: 5 },
    { id: '#ORD-003', customer: 'Jacob Black', email: 'jacob@example.com', amount: '₹850', status: 'Shipped', date: 'Oct 11, 2026', items: 1 },
    { id: '#ORD-004', customer: 'Alice Cullen', email: 'alice@example.com', amount: '₹5400', status: 'Delivered', date: 'Oct 10, 2026', items: 8 },
    { id: '#ORD-005', customer: 'Bella Swan', email: 'bella@example.com', amount: '₹2100', status: 'Pending', date: 'Oct 09, 2026', items: 2 },
    { id: '#ORD-006', customer: 'Charlie Swan', email: 'charlie@example.com', amount: '₹450', status: 'Shipped', date: 'Oct 08, 2026', items: 1 },
  ];

  const filteredOrders = filter === 'All' ? ordersData : ordersData.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Orders</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Recent Transactions</h2>
            
            {/* Filter Tabs */}
            <div className="flex bg-[#FAF9F7] p-1 rounded-xl border border-[#EAE6DF]">
              {['All', 'Pending', 'Shipped', 'Delivered'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2 text-[0.75rem] tracking-[0.1em] uppercase font-medium rounded-lg transition-all duration-300 focus:outline-none ${
                    filter === tab 
                    ? 'bg-white text-[var(--color-sage-dark)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-8 py-5">Order Info</th>
                    <th className="px-8 py-5">Customer Details</th>
                    <th className="px-8 py-5 text-center">Items</th>
                    <th className="px-8 py-5 text-left">Amount</th>
                    <th className="px-8 py-5 text-right w-[180px]">Status Control</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-[var(--color-text-muted)] italic font-light">No orders match this status.</td>
                    </tr>
                  ) : filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0 relative">
                      <td className="px-8 py-4">
                        <div className="font-serif font-medium text-[1.1rem] text-[var(--color-text)] mb-0.5">{order.id}</div>
                        <div className="text-[0.75rem] text-[var(--color-text-muted)]">{order.date}</div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="font-medium text-[0.95rem]">{order.customer}</div>
                        <div className="text-[0.75rem] text-[var(--color-text-muted)] font-light">{order.email}</div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="inline-flex w-7 h-7 bg-[#FCFAf8] border border-[#EAE6DF] rounded-full items-center justify-center text-[0.8rem] font-medium text-[var(--color-text-muted)]">
                          {order.items}
                        </span>
                      </td>
                      <td className="px-8 py-4 font-serif text-[1.1rem] font-medium">
                        {order.amount}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <select 
                            defaultValue={order.status}
                            className={`appearance-none bg-transparent border py-1.5 pl-3 pr-8 rounded-full text-[0.7rem] uppercase tracking-widest font-medium cursor-pointer focus:outline-none transition-colors ${
                              order.status === 'Delivered' ? 'border-[#C8E6B8] bg-[#E8F5E0] text-[var(--color-sage-dark)] focus:border-[var(--color-sage-dark)]' :
                              order.status === 'Pending' ? 'border-[#FFE2A6] bg-[#FFF4E5] text-[#D48806] focus:border-[#D48806]' :
                              'border-[#C8D8F0] bg-[#E6F4FF] text-[#0958D9] focus:border-[#0958D9]'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </div>
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
    </div>
  );
}
