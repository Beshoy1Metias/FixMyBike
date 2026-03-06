import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FixMyBike — Marketplace for Bike Mechanics, Parts & Sales",
    template: "%s | FixMyBike",
  },
  description:
    "Find local bike mechanics, buy or sell bike parts and accessories, or list your bike for sale. Fix My Bike is the #1 marketplace for cyclists.",
  keywords: ["bike repair", "bicycle mechanics", "bike parts", "bikes for sale", "cycling marketplace"],
  openGraph: {
    title: "FixMyBike — Bike Mechanics, Parts & Sales Marketplace",
    description: "Find local bike mechanics, buy or sell bike parts and accessories, or list your bike for sale.",
    type: "website",
    locale: "en_US",
    siteName: "FixMyBike",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ paddingTop: "var(--navbar-height)" }}>
            {children}
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
