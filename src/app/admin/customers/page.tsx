"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster, toast } from "sonner";
import { Search, Trash2, ShieldAlert } from "lucide-react";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch customers");
      setCustomers(data);
    } catch (error: any) {
      toast.error(error.message || "Could not load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(query);
      const emailMatch = c.email?.toLowerCase().includes(query);
      const phoneMatch = c.phone?.toLowerCase().includes(query);
      return nameMatch || emailMatch || phoneMatch;
    });
  }, [customers, searchQuery]);

  const confirmDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/admin/customers?id=${customerToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error("Error deleting customer");
    } finally {
      setIsProcessing(false);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <Toaster position="bottom-right" richColors />
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Customers</h1>
          <div className="flex items-center gap-5">
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 w-full max-w-7xl mx-auto flex-1">
          <div className="flex flex-col gap-5 mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Registered Customers</h2>

            <div className="relative w-full max-w-xl mb-6">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by Name, Email, or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EAE6DF] rounded-xl pl-12 pr-4 py-3 text-[0.88rem] outline-none focus:border-[var(--color-sage-dark)] shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-6 py-5">Name</th>
                    <th className="px-6 py-5">Email Address</th>
                    <th className="px-6 py-5">Phone Number</th>
                    <th className="px-6 py-5">Joined Date</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 font-serif italic text-[var(--color-text-muted)]">Loading customers...</td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 font-serif italic text-[var(--color-text-muted)]">No customers found.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0">
                        <td className="px-6 py-4 font-medium">{customer.name || "N/A"}</td>
                        <td className="px-6 py-4 text-[0.85rem] text-[var(--color-text-muted)]">{customer.email || "N/A"}</td>
                        <td className="px-6 py-4 text-[0.85rem] text-[var(--color-text-muted)]">{customer.phone || "N/A"}</td>
                        <td className="px-6 py-4">
                          <div className="text-[0.75rem] text-[var(--color-text-muted)]">
                            {new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => confirmDelete(customer)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-[#EAE6DF] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <ShieldAlert size={28} />
              </div>
              <h3 className="font-serif text-[1.4rem] font-light text-[var(--color-text)] mb-2">Delete Customer</h3>
              <p className="text-[0.88rem] text-[var(--color-text-muted)] mb-8 px-4 leading-relaxed">
                Are you sure you want to delete <strong className="text-[var(--color-text)]">{customerToDelete.name || customerToDelete.email}</strong>? This action is permanent and cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteModalOpen(false)} 
                  disabled={isProcessing}
                  className="flex-1 px-6 py-2.5 text-[0.8rem] tracking-[0.05em] uppercase font-medium text-[var(--color-text)] bg-[#F5F3ED] hover:bg-[#EAE6DF] rounded-full transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-2.5 text-white text-[0.8rem] tracking-[0.05em] uppercase font-medium rounded-full shadow-md bg-red-600 hover:bg-red-700 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
