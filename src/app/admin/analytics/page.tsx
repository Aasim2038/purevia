"use client";
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminAnalyticsPage() {
  const weeklyRevenue = [
    { day: 'Mon', amount: 8500, height: '45%' },
    { day: 'Tue', amount: 12200, height: '65%' },
    { day: 'Wed', amount: 9800, height: '52%' },
    { day: 'Thu', amount: 15400, height: '82%' },
    { day: 'Fri', amount: 18900, height: '100%' },
    { day: 'Sat', amount: 14200, height: '75%' },
    { day: 'Sun', amount: 11500, height: '60%' },
  ];

  const topProducts = [
    { name: 'Neem Aloe Face Wash', category: 'Skin Care', sales: 428, target: 500, percentage: '85%' },
    { name: 'Sandalwood Body Wash', category: 'Body Care', sales: 312, target: 500, percentage: '62%' },
    { name: 'Rose Turmeric Serum', category: 'Skin Care', sales: 284, target: 500, percentage: '56%' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Analytics & Performance</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto flex-1 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-medium text-[var(--color-text-muted)] mb-2">Customer Growth</h3>
                  <div className="font-serif text-[2.8rem] font-medium text-[var(--color-text)] leading-none">+842</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#E8F5E0] flex items-center justify-center text-[var(--color-sage-dark)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                </div>
              </div>
              <p className="text-[0.8rem] text-[var(--color-sage-dark)] font-medium bg-[#E8F5E0] self-start px-3 py-1 rounded-md">New users accounts created this month</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-medium text-[var(--color-text-muted)] mb-2">Conversion Rate</h3>
                  <div className="font-serif text-[2.8rem] font-medium text-[var(--color-text)] leading-none">4.2%</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#E6F4FF] flex items-center justify-center text-[#0958D9]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
              </div>
              <p className="text-[0.8rem] text-[var(--color-text-muted)] font-medium bg-[#FAF9F7] self-start px-3 py-1 rounded-md border border-[#EAE6DF]">+0.4% baseline improvement compared to last month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sales Graph Mockup */}
            <div className="bg-white rounded-2xl p-8 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] h-[400px] flex flex-col">
              <div className="flex justify-between items-end mb-8 shrink-0">
                <div>
                  <h2 className="font-serif text-[1.6rem] font-light text-[var(--color-text)] mb-1">Weekly Revenue</h2>
                  <p className="text-[0.8rem] text-[var(--color-text-muted)] font-light">Last 7 days performance metrics</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-[1.4rem] font-medium text-[var(--color-text)]">₹90,500</div>
                  <div className="text-[0.7rem] uppercase tracking-[0.1em] font-medium text-[var(--color-sage-dark)]">Total Gross</div>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 pb-2 border-b border-[#EAE6DF] relative">
                {/* Y-axis Guides */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-1">
                  <div className="border-t border-dashed border-[rgba(196,168,130,0.2)] w-full h-0"></div>
                  <div className="border-t border-dashed border-[rgba(196,168,130,0.2)] w-full h-0"></div>
                  <div className="border-t border-dashed border-[rgba(196,168,130,0.2)] w-full h-0"></div>
                  <div className="border-t border-dashed border-[rgba(196,168,130,0.2)] w-full h-0"></div>
                </div>

                {weeklyRevenue.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group z-10 h-full justify-end">
                    <div className="relative w-full max-w-[40px] flex items-end h-[85%] rounded-t-lg bg-[#FAF9F7] overflow-hidden group-hover:bg-[#F5F3ED] transition-colors cursor-pointer">
                      <div 
                        className="w-full bg-[var(--color-sage-dark)] rounded-t-lg transition-all duration-1000 ease-out origin-bottom"
                        style={{ height: data.height }}
                      ></div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-text)] text-white text-[0.7rem] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                        ₹{data.amount}
                      </div>
                    </div>
                    <span className="text-[0.7rem] font-medium text-[var(--color-text-muted)] mt-4">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-8 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] h-[400px] flex flex-col">
              <div className="mb-8 shrink-0">
                <h2 className="font-serif text-[1.6rem] font-light text-[var(--color-text)] mb-1">Top Performing Products</h2>
                <p className="text-[0.8rem] text-[var(--color-text-muted)] font-light">Best sellers based on absolute volume</p>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                {topProducts.map((product, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <div className="font-medium text-[0.95rem] text-[var(--color-text)]">{product.name}</div>
                        <div className="text-[0.75rem] text-[var(--color-text-muted)] mb-1">{product.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[0.95rem] text-[var(--color-text)]">{product.sales}</div>
                        <div className="text-[0.7rem] text-[var(--color-text-muted)]">Sales</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#FAF9F7] rounded-full overflow-hidden border border-[rgba(196,168,130,0.1)]">
                      <div 
                        className="h-full bg-[var(--color-earth-dark)] rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: product.percentage }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-auto py-3 text-[0.75rem] uppercase tracking-[0.15em] font-medium text-[var(--color-sage-dark)] hover:bg-[#FAF9F7] rounded-xl transition-colors">
                  View Full Product Report
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
