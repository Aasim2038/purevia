"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster, toast } from 'sonner';

interface Settings {
  id: string;
  freeShippingThreshold: number;
  shippingCharge: number;
  onlineDiscount: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    id: '',
    freeShippingThreshold: 299,
    shippingCharge: 40,
    onlineDiscount: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        toast.success('Settings saved successfully');
      } else {
        const data = await res.json();
        toast.error(`Error: ${data.error || 'Failed to save settings'}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <Toaster position="bottom-right" richColors />
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Settings</h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--color-text-muted)] hover:text-[var(--color-sage-dark)] transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-2xl mx-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Global Configuration</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-[#EAE6DF] p-8 text-center">
              <p className="font-serif italic text-[var(--color-text-muted)]">Loading settings...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Free Shipping Threshold */}
                <div className="space-y-3">
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)]">
                    Free Shipping Threshold (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-serif">₹</span>
                    <input
                      type="number"
                      name="freeShippingThreshold"
                      value={settings.freeShippingThreshold}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full bg-white border border-[#EAE6DF] rounded-xl pl-8 pr-4 py-3 text-[1rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors"
                    />
                  </div>
                  <p className="text-[0.75rem] text-[var(--color-text-muted)]">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>

                {/* Shipping Charge */}
                <div className="space-y-3">
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)]">
                    Standard Shipping Charge (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-serif">₹</span>
                    <input
                      type="number"
                      name="shippingCharge"
                      value={settings.shippingCharge}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full bg-white border border-[#EAE6DF] rounded-xl pl-8 pr-4 py-3 text-[1rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors"
                    />
                  </div>
                  <p className="text-[0.75rem] text-[var(--color-text-muted)]">
                    Default shipping charge for orders below the free shipping threshold
                  </p>
                </div>

                {/* Online Discount */}
                <div className="space-y-3">
                  <label className="block text-[0.65rem] tracking-[0.15em] uppercase font-medium text-[var(--color-text-muted)]">
                    Online Payment Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="onlineDiscount"
                      value={settings.onlineDiscount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.5"
                      className="w-full bg-white border border-[#EAE6DF] rounded-xl pl-4 pr-8 py-3 text-[1rem] outline-none focus:border-[var(--color-sage-dark)] transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-serif">%</span>
                  </div>
                  <p className="text-[0.75rem] text-[var(--color-text-muted)]">
                    Discount percentage for online payments
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF9F7] border-t border-[#EAE6DF] flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-8 py-3 text-white text-[0.8rem] tracking-[0.1em] uppercase font-medium rounded-full shadow-md transition-all ${
                    saving
                      ? 'bg-gray-400 cursor-wait'
                      : 'bg-[var(--color-text)] hover:bg-[var(--color-sage-dark)] hover:-translate-y-0.5'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}