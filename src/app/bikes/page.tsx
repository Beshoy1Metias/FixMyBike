import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/ListingCard/ListingCard";
import prisma from "@/lib/prisma";
import styles from "./bikes.module.css";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Bikes for Sale — Road, MTB, Gravel & More",
    description: "Browse complete bikes for sale from private sellers. Road, mountain, gravel, hybrid, BMX, e-bikes, and more. Find your next ride.",
};

const BIKE_TYPES = [
    { label: "ALL", icon: "" },
    { label: "ROAD", icon: "🏁" },
    { label: "MOUNTAIN", icon: "⛰️" },
    { label: "GRAVEL", icon: "🌄" },
    { label: "HYBRID", icon: "🚴" },
    { label: "E-Bike", icon: "⚡" },
    { label: "BMX", icon: "🤸" },
    { label: "FOLDING", icon: "📐" },
    { label: "CITY", icon: "🏙️" },
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
        eyebrow: "🚲 Bikes for Sale",
        title: "Find Your Next Ride",
        lead: "Browse bikes for sale from private sellers across the community. Road, mountain, gravel, e-bikes, and more.",
        searchPlaceholder: "🔍  Search by brand, model, location...",
        frameSize: "Frame Size",
        maxBudget: "Max Budget",
        sortNewest: "Sort: Newest",
        sortPriceAsc: "Price: Low to High",
        sortPriceDesc: "Price: High to Low",
        sellBike: "+ Sell My Bike",
        pillLabels: {
            ALL: "All",
            ROAD: "Road",
            MOUNTAIN: "Mountain",
            GRAVEL: "Gravel",
            HYBRID: "Hybrid",
            "E-Bike": "E-Bike",
            BMX: "BMX",
            FOLDING: "Folding",
            CITY: "City",
        } as Record<string, string>,
    },
    it: {
        eyebrow: "🚲 Bici in vendita",
        title: "Trova la tua prossima bici",
        lead: "Sfoglia le bici in vendita da privati nella community: strada, MTB, gravel, e‑bike e altro.",
        searchPlaceholder: "🔍  Cerca per marca, modello o città...",
        frameSize: "Taglia telaio",
        maxBudget: "Budget massimo",
        sortNewest: "Ordina: più recenti",
        sortPriceAsc: "Prezzo: dal più basso",
        sortPriceDesc: "Prezzo: dal più alto",
        sellBike: "+ Vendi la mia bici",
        pillLabels: {
            ALL: "Tutte",
            ROAD: "Strada",
            MOUNTAIN: "MTB",
            GRAVEL: "Gravel",
            HYBRID: "Ibrida",
            "E-Bike": "E‑Bike",
            BMX: "BMX",
            FOLDING: "Pieghevole",
            CITY: "Città",
        } as Record<string, string>,
    },
} as const;

export default async function BikesPage() {
    const lang = getCurrentLanguage();
    const t = TEXT[lang];
    const bikes = await prisma.bikeListing.findMany({
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

                {/* Type pills */}
                <div className={styles.typePills}>
                    {BIKE_TYPES.map((t) => (
                        <button key={t.label} className={`${styles.pill} ${t.label === "ALL" ? styles.pillActive : ""}`}>
                            {t.icon && <span>{t.icon}</span>} {TEXT[lang].pillLabels[t.label]}
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder={t.searchPlaceholder} />
                    </div>
                    <select className="form-select" style={{ width: 150 }}>
                        <option value="">{t.frameSize}</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.maxBudget}</option>
                        <option value="500">{lang === "it" ? "Sotto i 500 €" : "Under €500"}</option>
                        <option value="1000">{lang === "it" ? "Sotto i 1.000 €" : "Under €1,000"}</option>
                        <option value="2000">{lang === "it" ? "Sotto i 2.000 €" : "Under €2,000"}</option>
                        <option value="5000">{lang === "it" ? "Sotto i 5.000 €" : "Under €5,000"}</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.sortNewest}</option>
                        <option value="price_asc">{t.sortPriceAsc}</option>
                        <option value="price_desc">{t.sortPriceDesc}</option>
                    </select>
                    <Link href="/bikes/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        {t.sellBike}
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid-4">
                    {bikes.map((bike) => (
                        <ListingCard
                            key={bike.id}
                            href={`/bikes/${bike.id}`}
                            image={bike.photos[0]?.url ?? null}
                            title={bike.title}
                            price={bike.price}
                            condition={CONDITION_LABELS[bike.condition][lang]}
                            location={bike.location}
                            badge={bike.bikeType.charAt(0) + bike.bikeType.slice(1).toLowerCase()}
                            badgeVariant={bike.bikeType === "ELECTRIC" ? "accent" : "primary"}
                            meta={[
                                bike.brand,
                                bike.year ? String(bike.year) : null,
                                bike.frameSize ? `Size ${bike.frameSize}` : null,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
