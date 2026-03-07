import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import MechanicsClient from "../../MechanicsClient";
import { getCurrentLanguage } from "@/lib/language";

type Props = {
    params: { location: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const location = decodeURIComponent(params.location);
    const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);
    
    return {
        title: `Bike Mechanics in ${capitalizedLocation} — Repair & Service`,
        description: `Find top-rated bike mechanics in ${capitalizedLocation}. Get your bike repaired, serviced, or built by experts in ${capitalizedLocation}.`,
        alternates: {
            canonical: `/mechanics/in/${params.location}`,
        },
    };
}

const TEXT = {
    en: {
        eyebrow: "🔧 Local Mechanics",
        title: (loc: string) => `Bike Mechanics in ${loc}`,
        lead: (loc: string) => `Find skilled bike mechanics and repair services near you in ${loc}.`,
        offerSkills: "+ Offer My Skills",
    },
    it: {
        eyebrow: "🔧 Meccanici Locali",
        title: (loc: string) => `Meccanici bici a ${loc}`,
        lead: (loc: string) => `Trova meccanici esperti e servizi di riparazione vicino a te a ${loc}.`,
        offerSkills: "+ Offri le tue competenze",
    },
} as const;

export default async function LocationMechanicsPage({ params }: Props) {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const location = decodeURIComponent(params.location);
    const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

    const mechanics = await prisma.mechanicProfile.findMany({
        where: {
            isAvailable: true,
            location: {
                contains: location,
                mode: "insensitive",
            },
        },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, image: true },
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
                        <Link href="/mechanics/new" className="btn btn-primary">
                            {t.offerSkills}
                        </Link>
                    </div>
                </div>

                <MechanicsClient initialMechanics={mechanics} lang={lang} />
            </div>
        </div>
    );
}
