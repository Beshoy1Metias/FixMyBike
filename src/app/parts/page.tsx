import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/ListingCard/ListingCard";
import prisma from "@/lib/prisma";
import styles from "./parts.module.css";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Bike Parts & Accessories for Sale",
    description: "Buy and sell new and used bike parts, components, and accessories. Brakes, drivetrains, wheels, saddles, and more.",
};

const CATEGORIES = [
    { key: "BRAKES", labelEn: "Brakes", labelIt: "Freni", icon: "🛑" },
    { key: "DRIVETRAIN", labelEn: "Drivetrain", labelIt: "Trasmissione", icon: "⚙️" },
    { key: "WHEELS", labelEn: "Wheels", labelIt: "Ruote", icon: "🔄" },
    { key: "HANDLEBARS", labelEn: "Handlebars", labelIt: "Manubri", icon: "🏍️" },
    { key: "SADDLES", labelEn: "Saddles", labelIt: "Selle", icon: "🪑" },
    { key: "FORKS", labelEn: "Forks", labelIt: "Forcelle", icon: "🔱" },
    { key: "PEDALS", labelEn: "Pedals", labelIt: "Pedali", icon: "👟" },
    { key: "LIGHTS", labelEn: "Lights", labelIt: "Luci", icon: "💡" },
    { key: "ACCESSORIES", labelEn: "Accessories", labelIt: "Accessori", icon: "🎒" },
];

const CONDITION_LABELS: Record<string, { en: string; it: string }> = {
    NEW: { en: "New", it: "Nuovo" },
    LIKE_NEW: { en: "Like New", it: "Come nuovo" },
    GOOD: { en: "Good", it: "Buono" },
    FAIR: { en: "Fair", it: "Discreto" },
    POOR: { en: "Poor", it: "Da sistemare" },
};

const TEXT = {
    en: {
        eyebrow: "⚙️ Parts & Accessories",
        title: "Buy & Sell Bike Parts",
        lead: "Find quality new and used components from fellow cyclists. Brakes, drivetrains, wheels, saddles, and everything in between.",
        searchPlaceholder: "🔍  Search parts, brands, or categories...",
        condition: "Condition",
        sortNewest: "Sort: Newest",
        sellPart: "+ Sell a Part",
    },
    it: {
        eyebrow: "⚙️ Ricambi e accessori",
        title: "Compra e vendi ricambi bici",
        lead: "Trova componenti nuovi e usati da altri ciclisti: freni, trasmissioni, ruote, selle e molto altro.",
        searchPlaceholder: "🔍  Cerca per ricambio, marca o categoria...",
        condition: "Condizione",
        sortNewest: "Ordina: più recenti",
        sellPart: "+ Vendi un ricambio",
    },
} as const;

export default async function PartsPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const parts = await prisma.partListing.findMany({
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
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        {t.lead}
                    </p>
                </div>

                {/* Category pills */}
                <div className={styles.categoryPills}>
                    <button className={`${styles.pill} ${styles.pillActive}`}>{lang === "it" ? "Tutte" : "All"}</button>
                    {CATEGORIES.map((c) => (
                        <button key={c.key} className={styles.pill}>
                            {c.icon} {lang === "it" ? c.labelIt : c.labelEn}
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder={t.searchPlaceholder} />
                    </div>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.condition}</option>
                        <option value="NEW">{CONDITION_LABELS.NEW[lang]}</option>
                        <option value="LIKE_NEW">{CONDITION_LABELS.LIKE_NEW[lang]}</option>
                        <option value="GOOD">{CONDITION_LABELS.GOOD[lang]}</option>
                        <option value="FAIR">{CONDITION_LABELS.FAIR[lang]}</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.sortNewest}</option>
                        <option value="price_asc">{lang === "it" ? "Prezzo: dal più basso" : "Price: Low to High"}</option>
                        <option value="price_desc">{lang === "it" ? "Prezzo: dal più alto" : "Price: High to Low"}</option>
                    </select>
                    <Link href="/parts/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        {t.sellPart}
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid-4">
                    {parts.map((part) => (
                        <ListingCard
                            key={part.id}
                            href={`/parts/${part.id}`}
                            image={part.photos[0]?.url ?? null}
                            title={part.title}
                            price={part.price}
                            condition={CONDITION_LABELS[part.condition][lang]}
                            location={part.location}
                            badge={CONDITION_LABELS[part.condition][lang]}
                            badgeVariant={part.condition === "NEW" ? "success" : part.condition === "LIKE_NEW" ? "accent" : "gray"}
                            tags={[
                                part.brand ?? "",
                                part.category.charAt(0) + part.category.slice(1).toLowerCase(),
                            ].filter(Boolean)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
