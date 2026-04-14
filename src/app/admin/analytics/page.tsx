"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RangeKey = "7d" | "30d" | "all";
type AnalyticsResponse = {
  range: RangeKey;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number }>;
  orderStatus: Array<{ name: string; value: number }>;
};

const pieColors = ["#D48806", "#0958D9", "#6F8564"];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse>({
    range: "7d",
    dailyRevenue: [],
    topProducts: [],
    orderStatus: [],
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?range=${range}`);
        const json = await res.json();
        if (!active) return;
        if (res.ok) setData(json);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [range]);

  const revenueChartData = useMemo(
    () =>
      data.dailyRevenue.map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      })),
    [data.dailyRevenue]
  );

  const totalRevenue = useMemo(
    () => data.dailyRevenue.reduce((sum, point) => sum + point.revenue, 0),
    [data.dailyRevenue]
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Analytics & Performance</h1>
          <div className="flex items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeKey)}
              className="h-10 px-3 rounded-xl border border-[#EAE6DF] bg-white text-[0.8rem] uppercase tracking-[0.08em] text-[var(--color-text)] outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">
              A
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-6xl mx-auto flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-2">Revenue Snapshot</div>
              <div className="font-serif text-[2rem] text-[var(--color-text)]">₹{Math.round(totalRevenue).toLocaleString("en-IN")}</div>
              <div className="text-[0.8rem] text-[var(--color-sage-dark)] mt-2">
                {range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : "All-time period"}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-2">Orders in Range</div>
              <div className="font-serif text-[2rem] text-[var(--color-text)]">
                {data.orderStatus.reduce((sum, item) => sum + item.value, 0).toLocaleString("en-IN")}
              </div>
              <div className="text-[0.8rem] text-[var(--color-text-muted)] mt-2">
                Pending, shipped and delivered mix
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] h-[380px]">
              <div className="mb-4">
                <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Daily Revenue</h2>
                <p className="text-[0.78rem] text-[var(--color-text-muted)]">Revenue trend for selected period</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAE6DF" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7A6F63" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#7A6F63" }} />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#6F8564" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] h-[380px]">
              <div className="mb-4">
                <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Top 5 Selling Products</h2>
                <p className="text-[0.78rem] text-[var(--color-text-muted)]">By quantity sold</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAE6DF" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#7A6F63" }} interval={0} angle={-12} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: "#7A6F63" }} />
                    <Tooltip formatter={(value) => [value, "Qty Sold"]} />
                    <Bar dataKey="quantity" fill="#8A9E7E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)] mb-4">Order Status Breakdown</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(((percent || 0) * 100)).toFixed(0)}%`}
                  >
                    {data.orderStatus.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {loading && <div className="text-[0.85rem] text-[var(--color-text-muted)]">Refreshing analytics...</div>}
        </div>
      </main>
    </div>
  );
}
