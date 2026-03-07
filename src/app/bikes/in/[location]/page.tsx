import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import BikesClient from "../../BikesClient";
import { getCurrentLanguage } from "@/lib/language";

type Props = {
    params: { location: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const location = decodeURIComponent(params.location);
    const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);
    
    return {
        title: `Bikes for Sale in ${capitalizedLocation} — Road, MTB, Gravel`,
        description: `Find new and used bikes for sale in ${capitalizedLocation}. Browse road, mountain, gravel, and e-bikes from local sellers in ${capitalizedLocation}.`,
        alternates: {
            canonical: `/bikes/in/${params.location}`,
        },
    };
}

const TEXT = {
    en: {
        eyebrow: "🚲 Local Bikes",
        title: (loc: string) => `Bikes for Sale in ${loc}`,
        lead: (loc: string) => `Browse bikes available near you in ${loc}. Find your perfect ride from local sellers.`,
        sellBike: "+ Sell My Bike",
    },
    it: {
        eyebrow: "🚲 Bici Locali",
        title: (loc: string) => `Bici in vendita a ${loc}`,
        lead: (loc: string) => `Sfoglia le bici disponibili vicino a te a ${loc}. Trova la tua bici ideale da venditori locali.`,
        sellBike: "+ Vendi la mia bici",
    },
} as const;

export default async function LocationBikesPage({ params }: Props) {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const location = decodeURIComponent(params.location);
    const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

    const bikes = await prisma.bikeListing.findMany({
        where: {
            isSold: false,
            location: {
                contains: location,
                mode: "insensitive",
            },
        },
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
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)", marginBottom: "var(--space-8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-4)" }}>
                        <div>
                            <span className="page-header__eyebrow">{t.eyebrow}</span>
                            <h1 className="text-heading-1">{t.title(capitalizedLocation)}</h1>
                            <p className="text-body-lg" style={{ maxWidth: 560 }}>
                                {t.lead(capitalizedLocation)}
                            </p>
                        </div>
                        <Link href="/bikes/new" className="btn btn-primary">
                            {t.sellBike}
                        </Link>
                    </div>
                </div>

                <BikesClient initialBikes={bikes} lang={lang} />
            </div>
        </div>
    );
}
