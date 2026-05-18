import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  allowedDevOrigins: ['192.168.1.4', 'localhost:3000'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      // Supabase storage URLs
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Unsplash images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
