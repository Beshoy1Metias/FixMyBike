import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentLanguage } from "@/lib/language";
import WantedClient from "./WantedClient";

export const metadata: Metadata = {
    title: "Wanted: Bikes — Post Your Wishlist",
    description: "Looking to buy a bike? Post your desired specs and budget. Let sellers come to you with matching offers.",
};

const TEXT = {
    en: {
        eyebrow: "🔍 Wanted Bikes",
        title: "People Looking to Buy",
        lead: "Got a bike to sell? Browse these wanted posts and contact buyers directly if you have what they're looking for. Or post your own request and let the perfect bike come to you.",
        postRequest: "+ Post a Request",
    },
    it: {
        eyebrow: "🔍 Cerco bici",
        title: "Persone in cerca di una bici",
        lead: "Hai una bici da vendere? Sfoglia questi annunci di ricerca e contatta direttamente chi sta cercando proprio ciò che offri. Oppure pubblica tu una richiesta e lascia che ti scrivano i venditori.",
        postRequest: "+ Pubblica una richiesta",
    },
} as const;

export default async function WantedPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const posts = await prisma.wantedPost.findMany({
        where: { isFulfilled: false },
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
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)", marginBottom: "var(--space-8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-4)" }}>
                        <div>
                            <span className="page-header__eyebrow">{t.eyebrow}</span>
                            <h1 className="text-heading-1">{t.title}</h1>
                            <p className="text-body-lg" style={{ maxWidth: 600 }}>
                                {t.lead}
                            </p>
                        </div>
                        <Link href="/wanted/new" className="btn btn-primary">
                            {t.postRequest}
                        </Link>
                    </div>
                </div>

                <WantedClient initialPosts={posts} lang={lang} />
            </div>
        </div>
    );
}
