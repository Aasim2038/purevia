import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard, { ProductType } from "@/components/ui/ProductCard";
import HorizontalScroller from "@/components/storefront/HorizontalScroller";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Footer from "@/components/sections/Footer";

const categoryPresets: Record<string, { icon: string; bg: string }> = {
  "Skin Care": { icon: "🌿", bg: "linear-gradient(135deg, #E8F5E0, #C8E6B8)" },
  "Hair Care": { icon: "🥥", bg: "linear-gradient(135deg, #E8EFF8, #C8D8F0)" },
  "Body Care": { icon: "🪵", bg: "linear-gradient(135deg, #F5EFEB, #E0CDBA)" },
};

type HomeSectionProps = {
  title: string;
  subtitle: string;
  viewAllHref: string;
  products: ProductType[];
};

function ProductRailSection({ title, subtitle, viewAllHref, products }: HomeSectionProps) {
  return (
    <section className="py-14 md:py-18">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-sage-dark)] mb-2">{subtitle}</div>
          <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-light leading-[1.1] text-[var(--color-text)]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h2>
        </div>
        <Link href={viewAllHref} className="text-[0.75rem] tracking-[0.14em] uppercase text-[var(--color-sage-dark)] border-b border-[var(--color-sage-dark)] pb-1 hover:text-[var(--color-earth-dark)] hover:border-[var(--color-earth-dark)] transition-colors">
          View All
        </Link>
      </div>
      <HorizontalScroller>
        <div className="flex gap-5 snap-x snap-mandatory">
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px] sm:min-w-[300px] md:min-w-[320px] max-w-[320px] snap-start flex-shrink-0 touch-pan-y">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </HorizontalScroller>
    </section>
  );
}

function getProductTag(product: { createdAt: Date; stock: number }) {
  const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= 30) return "New";
  if (product.stock > 0 && product.stock <= 10) return "Trending";
  return "Featured";
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const bestSellerRows = await (prisma as any).orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 8,
  }).catch(() => []);
  const bestSellerIds = new Set<string>(bestSellerRows.map((row: any) => row.productId));

  const mappedProducts: ProductType[] = dbProducts.map((p: any) => {
    const preset = categoryPresets[p.category] || { icon: "📦", bg: "linear-gradient(135deg, #F5EFEB, #E0CDBA)" };
    const tag = getProductTag({ createdAt: p.createdAt, stock: p.stock });
    return {
      id: p.id,
      name: p.name,
      desc: p.description || "",
      price: p.price,
      category: typeof p.category === "string" ? p.category : "",
      size: "Standard",
      icon: preset.icon,
      badge: bestSellerIds.has(p.id) ? "Best Seller" : tag,
      bg: preset.bg,
      images: Array.isArray(p.images) ? p.images : [],
      imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
    };
  });

  const productById = new Map(mappedProducts.map((product) => [product.id, product]));
  const newArrivals = mappedProducts.slice(0, 10);
  const bestSellers = bestSellerRows
    .map((row: any) => productById.get(row.productId))
    .filter(Boolean) as ProductType[];
  const featuredProducts = mappedProducts
    .filter((p) => p.badge === "Featured" || p.category === "Skin Care")
    .slice(0, 8);

  const categories = [
    { title: "Skin Care", icon: "🌿", href: "/shop?category=Skin%20Care" },
    { title: "Hair Care", icon: "🥥", href: "/shop?category=Hair%20Care" },
    { title: "Body Care", icon: "🪵", href: "/shop?category=Body%20Care" },
  ];

  return (
    <main>
      <Hero />
      <Marquee />
      <section className="bg-[var(--color-cream)] px-6 md:px-16 py-6">
        <div className="mx-auto container max-w-[1400px]">
          <section className="py-10 md:py-14">
            <div className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-sage-dark)] mb-2">Explore</div>
            <h2 className="font-serif text-[clamp(2rem,3.2vw,2.7rem)] font-light leading-[1.1] text-[var(--color-text)] mb-7" style={{ fontFamily: "var(--font-cormorant)" }}>
              Shop by Category
            </h2>
            <HorizontalScroller>
              <div className="flex gap-5">
                {categories.map((category) => (
                  <Link key={category.title} href={category.href} className="min-w-[150px] bg-white border border-[rgba(196,168,130,0.18)] rounded-[20px] px-5 py-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)] flex items-center justify-center text-[1.65rem] mb-3">
                      {category.icon}
                    </div>
                    <div className="font-serif text-[1.1rem] text-[var(--color-text)]" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {category.title}
                    </div>
                  </Link>
                ))}
              </div>
            </HorizontalScroller>
          </section>

          <ProductRailSection
            title="New Arrivals"
            subtitle="Just Launched"
            products={newArrivals}
            viewAllHref="/shop?tag=New"
          />
          <ProductRailSection
            title="Best Sellers"
            subtitle="Most Loved"
            products={bestSellers}
            viewAllHref="/shop?tag=Best%20Seller"
          />
          <ProductRailSection
            title="Featured Products"
            subtitle="Editor Picks"
            products={featuredProducts}
            viewAllHref="/shop?tag=Featured"
          />

          <section className="py-16 md:py-20">
            <div className="bg-[var(--color-sage-dark)] text-white rounded-[28px] px-6 md:px-12 py-10 md:py-12">
              <div className="max-w-3xl">
                <div className="text-[0.72rem] tracking-[0.2em] uppercase mb-3 text-[rgba(255,255,255,0.8)]">Stay Connected</div>
                <h3 className="font-serif text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.1] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Join the Purevia Family
                </h3>
                <p className="text-[0.95rem] text-[rgba(255,255,255,0.85)] mb-6">
                  Get early access to new collections, ingredient stories, and premium offers.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white text-[var(--color-text)] border border-transparent rounded-full px-5 py-3.5 text-[0.92rem] focus:outline-none focus:border-[var(--color-earth)]"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--color-earth)] hover:bg-[var(--color-earth-dark)] text-white rounded-full px-8 py-3.5 text-[0.75rem] tracking-[0.12em] uppercase transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
