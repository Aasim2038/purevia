import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import Footer from "@/components/sections/Footer";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductById(id: string) {
  return (prisma as any).product.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product ? product.name : "Product Not Found",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[var(--color-cream)] pt-24 md:pt-32 pb-0 min-h-screen">
      {/* Upper Grid */}
      <section className="px-6 md:px-16 mx-auto container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-12">
          {/* Left Column: Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews reviews={product.reviews || []} />
      </section>

      {/* Related Products */}
      <div className="px-6 md:px-16 mx-auto container max-w-7xl">
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>

      <Footer />
    </main>
  );
}
