import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./wanted.module.css";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Wanted: Bikes — Post Your Wishlist",
    description: "Looking to buy a bike? Post your desired specs and budget. Let sellers come to you with matching offers.",
};

function formatPostedAt(date: Date, lang: "en" | "it") {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        const m = diffMinutes || 1;
        return lang === "it" ? `${m} min fa` : `${m}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return lang === "it" ? `${diffHours} h fa` : `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
        return lang === "it" ? `${diffDays} g fa` : `${diffDays}d ago`;
    }
    return date.toLocaleDateString(lang === "it" ? "it-IT" : undefined);
}

const TEXT = {
    en: {
        eyebrow: "🔍 Wanted Bikes",
        title: "People Looking to Buy",
        lead: "Got a bike to sell? Browse these wanted posts and contact buyers directly if you have what they're looking for. Or post your own request and let the perfect bike come to you.",
        searchPlaceholder: "🔍  Search wanted posts...",
        bikeType: "Bike Type",
        maxBudget: "Max Budget",
        postRequest: "+ Post a Request",
        budgetLabel: "Budget",
        sizeLabel: "Size",
    },
    it: {
        eyebrow: "🔍 Cerco bici",
        title: "Persone in cerca di una bici",
        lead: "Hai una bici da vendere? Sfoglia questi annunci di ricerca e contatta direttamente chi sta cercando proprio ciò che offri. Oppure pubblica tu una richiesta e lascia che ti scrivano i venditori.",
        searchPlaceholder: "🔍  Cerca tra le richieste...",
        bikeType: "Tipo di bici",
        maxBudget: "Budget massimo",
        postRequest: "+ Pubblica una richiesta",
        budgetLabel: "Budget",
        sizeLabel: "Taglia",
    },
} as const;

export default async function WantedPage() {
    const lang = getCurrentLanguage();
    const t = TEXT[lang];
    const posts = await prisma.wantedPost.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
        take: 40,
    });
    return (
        <div className="section">
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 600 }}>
                        {t.lead}
                    </p>
                </div>

                {/* Filter + Post CTA */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder={t.searchPlaceholder} />
                    </div>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.bikeType}</option>
                        <option value="ROAD">{lang === "it" ? "Strada" : "Road"}</option>
                        <option value="MOUNTAIN">{lang === "it" ? "MTB" : "Mountain"}</option>
                        <option value="GRAVEL">Gravel</option>
                        <option value="ELECTRIC">{lang === "it" ? "E‑bike" : "E-Bike"}</option>
                        <option value="FOLDING">{lang === "it" ? "Pieghevole" : "Folding"}</option>
                        <option value="BMX">BMX</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.maxBudget}</option>
                        <option value="500">{lang === "it" ? "Sotto i 500 €" : "Under €500"}</option>
                        <option value="1000">{lang === "it" ? "Sotto i 1.000 €" : "Under €1,000"}</option>
                        <option value="2000">{lang === "it" ? "Sotto i 2.000 €" : "Under €2,000"}</option>
                    </select>
                    <Link href="/wanted/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        {t.postRequest}
                    </Link>
                </div>

                {/* Wanted Posts List */}
                <div className={styles.postList}>
                    {posts.map((post) => (
                        <Link href={`/wanted/${post.id}`} key={post.id} className={styles.postCard}>
                            <div className={styles.postLeft}>
                                <div className={styles.postAvatar}>
                                    {(post.user.name || "B").charAt(0)}
                                </div>
                            </div>
                            <div className={styles.postBody}>
                                <div className={styles.postTop}>
                                    <div>
                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                        <div className={styles.postMeta}>
                                            <span>👤 {post.user.name || (lang === "it" ? "Utente FixMyBike" : "FixMyBike buyer")}</span>
                                            <span>📍 {post.location}</span>
                                            <span>🕐 {formatPostedAt(post.createdAt, lang)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.postRight}>
                                        {post.maxBudget && (
                                            <div className={styles.postBudget}>
                                                <span className={styles.budgetLabel}>{t.budgetLabel}</span>
                                                <span className="price-sm">
                                                    {lang === "it" ? "fino a " : "up to "}
                                                    €{post.maxBudget.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className={styles.postDesc}>{post.description}</p>
                                <div className={styles.postTags}>
                                    {post.bikeType && (
                                        <span className="badge badge-primary">{post.bikeType}</span>
                                    )}
                                    {post.frameSize && (
                                        <span className="badge badge-gray">
                                            {t.sizeLabel} {post.frameSize}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
