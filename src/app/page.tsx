import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import NatureSection from "@/components/sections/NatureSection";
import ProductGrid from "@/components/sections/ProductGrid";
import Ingredients from "@/components/sections/Ingredients";
import Testimonials from "@/components/sections/Testimonials";
import PromiseSection from "@/components/sections/Promise";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <NatureSection />
      <ProductGrid />
      <Ingredients />
      <Testimonials />
      <PromiseSection />
      <Footer />
    </main>
  );
}
