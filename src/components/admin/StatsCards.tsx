"use client";
import React, { useEffect, useState } from "react";
import { DollarSign, Package, Users, TriangleAlert } from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockCount: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[#EAE6DF] animate-pulse h-[140px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
        <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
          <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
            <DollarSign size={16} />
          </div>
          <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Revenue</span>
        </div>
        <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">
          {formatCurrency(stats?.totalRevenue || 0)}
        </div>
        <div className="text-[0.75rem] text-[var(--color-sage-dark)] mt-2 font-medium">Global lifetime revenue</div>
      </div>

      {/* Total Orders */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
        <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
          <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
            <Package size={16} />
          </div>
          <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Orders</span>
        </div>
        <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">
          {(stats?.totalOrders || 0).toLocaleString("en-IN")}
        </div>
        <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Total orders processed</div>
      </div>

      {/* Total Users */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
        <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
          <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
            <Users size={16} />
          </div>
          <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Users</span>
        </div>
        <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">
          {(stats?.totalUsers || 0).toLocaleString("en-IN")}
        </div>
        <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Registered customers</div>
      </div>

      {/* Low Stock Count */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
        <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
          <div className="w-9 h-9 rounded-full bg-[#FCF3F3] flex items-center justify-center text-red-600">
            <TriangleAlert size={16} />
          </div>
          <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Low Stock</span>
        </div>
        <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">
          {(stats?.lowStockCount || 0).toLocaleString("en-IN")}
        </div>
        <div className="text-[0.75rem] text-red-600/80 mt-2 font-medium">Products with stock ≤ 5</div>
      </div>
    </div>
  );
}
