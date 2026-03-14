import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentLanguage } from "@/lib/language";
import BikesClient from "./BikesClient";

export const metadata: Metadata = {
    title: "Bikes for Sale — Road, MTB, Gravel & More",
    description: "Browse complete bikes for sale from private sellers. Road, mountain, gravel, hybrid, BMX, e-bikes, and more. Find your next ride.",
};

const TEXT = {
    en: {
        eyebrow: "🚲 Bikes for Sale",
        title: "Find Your Next Ride",
        lead: "Browse bikes for sale from private sellers across the community. Road, mountain, gravel, e-bikes, and more.",
        sellBike: "+ Sell My Bike",
    },
    it: {
        eyebrow: "🚲 Bici in vendita",
        title: "Trova la tua prossima bici",
        lead: "Sfoglia le bici in vendita da privati nella community: strada, MTB, gravel, e‑bike e altro.",
        sellBike: "+ Vendi la mia bici",
    },
} as const;

export default async function BikesPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const bikes = await prisma.bikeListing.findMany({
        where: { isSold: false },
        orderBy: { createdAt: "desc" },
        include: {
            photos: {
                orderBy: { isPrimary: "desc" },
            },
        },
        take: 40,
    });
    return (
        <div className="section">
            <div className="container">
                {/* Header */}
                <div className="page-listing-header">
                    <div>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{t.title}</h1>
                        <p className="text-body-lg page-listing-header__lead">
                            {t.lead}
                        </p>
                    </div>
                    <Link href="/bikes/new" className="btn btn-primary">
                        {t.sellBike}
                    </Link>
                </div>

                <BikesClient initialBikes={bikes} lang={lang} />
            </div>
        </div>
    );
}
