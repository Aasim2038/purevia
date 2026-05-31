import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { ProductRailSkeleton } from "@/components/ui/LoadingSkeleton";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true }
          }
        }
      },
    },
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Pureable",
    };
  }

  const title = `${product.name} | Pureable`;
  const description = product.description || `Buy ${product.name} - premium chemical-free Ayurvedic skincare at Pureable.`;
  const url = `https://pureable.in/product/${slug}`;
  const imageUrl = product.images && product.images[0] ? product.images[0] : "https://pureable.in/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Pureable",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
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
        <ProductReviews reviews={product.reviews || []} productId={product.id} />
      </section>

      {/* Related Products */}
      <div className="px-6 md:px-16 mx-auto container max-w-7xl">
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>
    </>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <main className="bg-[var(--color-cream)] pt-24 md:pt-32 pb-0 min-h-screen">
      <Suspense fallback={<ProductRailSkeleton />}>
        <ProductContent slug={slug} />
      </Suspense>
    </main>
  );
}
