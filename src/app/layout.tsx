import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/providers/AuthProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Puroable | Premium Chemical-Free Beauty",
    template: "%s | Puroable",
  },
  description:
    "Puroable offers premium chemical-free skincare, haircare and bodycare with a luxury, nature-first experience.",
  keywords: [
    "Puroable",
    "chemical free skincare",
    "premium beauty",
    "natural cosmetics",
    "organic personal care",
    "luxury skincare India",
  ],
  openGraph: {
    title: "Puroable | Premium Chemical-Free Beauty",
    description:
      "Discover premium chemical-free skincare, haircare and bodycare crafted for modern luxury wellness.",
    url: "https://puroable.com",
    siteName: "Puroable",
    type: "website",
    images: [
      {
        url: "https://puroable.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Puroable Premium Beauty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puroable | Premium Chemical-Free Beauty",
    description:
      "Premium chemical-free skincare, haircare and bodycare with a luxury-first shopping experience.",
    images: ["https://puroable.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} ${cormorant.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <CustomCursor />
            <Navbar />
            <CartDrawer />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
