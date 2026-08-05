import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow picsum.photos for development mock data
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      // Add your CMS image hostname here for production:
      // { protocol: "https", hostname: "cdn.example.com" },
    ],
    // Responsive breakpoints (matches Tailwind breakpoints)
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Serve modern formats
    formats: ["image/avif", "image/webp"],
    // Minimum TTL for cached optimized images
    minimumCacheTTL: 604800, // 7 days
  },

  // Enable React strict mode for development
  reactStrictMode: true,

  // Headers for static assets
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
