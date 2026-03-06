import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Cloudflare R2 public buckets and any pub-*.r2.dev domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Google OAuth avatars
      },
    ],
  },
  // Don't expose Next.js version in response headers
  poweredByHeader: false,
};

export default nextConfig;
