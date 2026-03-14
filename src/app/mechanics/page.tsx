import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentLanguage } from "@/lib/language";
import MechanicsClient from "./MechanicsClient";

export const metadata: Metadata = {
    title: "Find a Bike Mechanic Near You",
    description: "Browse skilled bike mechanics and DIY fixers. Read reviews, check availability, and get quotes for any repair job.",
};

const TEXT = {
    en: {
        eyebrow: "🔧 Service Marketplace",
        title: "Find a Bike Mechanic",
        lead: "Browse skilled mechanics and knowledgeable DIY fixers near you. Get your bike serviced, repaired, or fully rebuilt.",
        offerSkills: "+ Offer My Skills",
    },
    it: {
        eyebrow: "🔧 Marketplace dei servizi",
        title: "Trova un meccanico per bici",
        lead: "Scopri meccanici e appassionati competenti vicino a te. Porta la tua bici a fare un check, una riparazione o un restauro completo.",
        offerSkills: "+ Offri le tue competenze",
    },
} as const;

export default async function MechanicsPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const mechanics = await prisma.mechanicProfile.findMany({
        where: { isAvailable: true },
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
                {/* Header */}
                <div className="page-listing-header">
                    <div>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{t.title}</h1>
                        <p className="text-body-lg page-listing-header__lead">
                            {t.lead}
                        </p>
                    </div>
                    <Link href="/mechanics/new" className="btn btn-primary">
                        {t.offerSkills}
                    </Link>
                </div>

                <MechanicsClient initialMechanics={mechanics} lang={lang} />
            </div>
        </div>
    );
}
