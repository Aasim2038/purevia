import React from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import Footer from "@/components/sections/Footer";

export default function ProductPage({ params }: { params: { id: string } }) {
  // Suppress unused param warning
  const _id = params.id;

  return (
    <main className="bg-[var(--color-cream)] pt-24 md:pt-32 pb-0 min-h-screen">
      {/* Upper Grid */}
      <section className="px-6 md:px-16 mx-auto container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-12">
          {/* Left Column: Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery />
          </div>

          {/* Right Column: Info */}
          <div>
            <ProductInfo />
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews />
      </section>

      {/* Related Products */}
      <div className="px-6 md:px-16 mx-auto container max-w-7xl">
        <RelatedProducts />
      </div>

      <Footer />
    </main>
  );
}
