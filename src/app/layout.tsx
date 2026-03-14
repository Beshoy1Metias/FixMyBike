import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/components/LanguageProvider/LanguageProvider";
import PushNotificationProvider from "@/components/PushNotificationProvider/PushNotificationProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fix-my-bike.it"),
  icons: {
    icon: "/logo.svg?v=3",
    apple: "/logo.svg?v=3",
  },
  title: {
    default: "FixMyBike Padova — Bici, Meccanici & Ricambi a Padova",
    template: "%s | FixMyBike Padova",
  },
  description:
    "Trova meccanici di bici a Padova, compra e vendi ricambi e accessori per bici, o metti in vendita la tua bici. Il marketplace di riferimento per i ciclisti di Padova e dintorni.",
  keywords: [
    "meccanico bici Padova",
    "riparazione bici Padova",
    "ricambi bici Padova",
    "bici usate Padova",
    "bike repair Padova",
    "bicycle mechanic Padova",
    "bike parts Padova",
    "cycling Padova",
    "bici Padova",
  ],
  openGraph: {
    title: "FixMyBike Padova — Bici, Meccanici & Ricambi",
    description: "Trova meccanici di bici a Padova, compra e vendi ricambi, o metti in vendita la tua bici.",
    type: "website",
    locale: "it_IT",
    siteName: "FixMyBike",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 800,
        alt: "FixMyBike Logo",
      },
    ],
  },
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
          <PushNotificationProvider />
          <LanguageProvider>
            <Navbar />
            <main style={{ paddingTop: "var(--navbar-height)" }}>
              {children}
            </main>
            <Footer />
            <Analytics />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
