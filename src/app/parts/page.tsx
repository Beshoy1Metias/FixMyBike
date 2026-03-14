import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentLanguage } from "@/lib/language";
import PartsClient from "./PartsClient";

export const metadata: Metadata = {
    title: "Bike Parts & Accessories for Sale",
    description: "Buy and sell new and used bike parts, components, and accessories. Brakes, drivetrains, wheels, saddles, and more.",
};

const TEXT = {
    en: {
        eyebrow: "⚙️ Parts & Accessories",
        title: "Buy & Sell Bike Parts",
        lead: "Find quality new and used components from fellow cyclists. Brakes, drivetrains, wheels, saddles, and everything in between.",
        sellPart: "+ Sell a Part",
    },
    it: {
        eyebrow: "⚙️ Ricambi e accessori",
        title: "Compra e vendi ricambi bici",
        lead: "Trova componenti nuovi e usati da altri ciclisti: freni, trasmissioni, ruote, selle e molto altro.",
        sellPart: "+ Vendi un ricambio",
    },
} as const;

export default async function PartsPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const parts = await prisma.partListing.findMany({
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
                    <Link href="/parts/new" className="btn btn-primary">
                        {t.sellPart}
                    </Link>
                </div>

                <PartsClient initialParts={parts} lang={lang} />
            </div>
        </div>
    );
}
