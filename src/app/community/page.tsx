import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import CommunityClient from "./CommunityClient";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Community Forum | FixMyBike",
    description: "Discuss bikes, share app feedback, and connect with other cyclists in our community space.",
};

const TEXT = {
    en: {
        eyebrow: "💬 Community Space",
        title: "Bike Talk & Feedback",
        lead: "Welcome to the community! Share your thoughts on the app, ask for bike advice, or just chat with fellow riders.",
    },
    it: {
        eyebrow: "💬 Spazio Community",
        title: "Discussioni e Feedback",
        lead: "Benvenuti nella community! Condividi i tuoi pensieri sull'app, chiedi consigli sulle bici o semplicemente chiacchiera con altri ciclisti.",
    },
} as const;

export default async function CommunityPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];

    const posts = await prisma.forumPost.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
            _count: {
                select: { comments: true },
            },
        },
        take: 50,
    });

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 600 }}>
                        {t.lead}
                    </p>
                </div>

                <CommunityClient initialPosts={posts} lang={lang} />
            </div>
        </div>
    );
}
