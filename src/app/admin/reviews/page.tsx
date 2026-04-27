"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster, toast } from "sonner";

type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: { name: string };
  user: { name: string | null; email: string };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch reviews");
      setReviews(data);
    } catch (error: any) {
      toast.error(error.message || "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Deletion failed");
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Could not delete review.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none relative">
      <Toaster position="bottom-right" richColors />
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-8 md:px-12 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Reviews</h1>
          <div className="flex items-center gap-5">
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">A</div>
          </div>
        </header>

        <div className="p-8 md:p-12 pl-8 md:pl-12 pt-8 w-full max-w-[1500px] mx-auto flex-1">
          <div className="flex flex-col gap-5 mb-8">
            <h2 className="font-serif text-[1.4rem] font-light text-[var(--color-text)]">Reviews Management</h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FCFAf8] text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)] font-medium border-b border-[#EAE6DF]">
                    <th className="px-6 py-5 min-w-[150px]">Date</th>
                    <th className="px-6 py-5 min-w-[200px]">Product</th>
                    <th className="px-6 py-5 min-w-[150px]">User</th>
                    <th className="px-6 py-5 min-w-[100px]">Rating</th>
                    <th className="px-6 py-5 min-w-[300px]">Comment</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.9rem] text-[var(--color-text)]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 font-serif italic text-[var(--color-text-muted)]">Loading reviews...</td>
                    </tr>
                  ) : reviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 font-serif italic text-[var(--color-text-muted)]">No reviews found.</td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review.id} className="border-b border-[#F5F3ED] hover:bg-[#FAF9F7] transition-colors last:border-0 align-top">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[0.8rem] text-[var(--color-text-muted)]">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-[0.95rem]">{review.product.name}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{review.user.name || "Anonymous"}</div>
                          <div className="text-[0.75rem] text-[var(--color-text-muted)]">{review.user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-earth)] tracking-[0.1em]">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[0.85rem] text-[var(--color-text-muted)] leading-[1.6] line-clamp-3">
                            {review.comment}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="px-4 py-2 text-[0.72rem] uppercase tracking-[0.1em] rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
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
    </div>
  );
}
