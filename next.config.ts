import type { NextConfig } from "next";

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // output: "export" usually required for Capacitor Native, but breaks dynamic routes without explicit `generateStaticParams`. PWA fallback preferred by Next.js apps.
};

export default withPWA(nextConfig);
