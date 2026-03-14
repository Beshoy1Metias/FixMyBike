"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "@/components/ListingCard/ListingCard";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./parts.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

const Map = dynamic(() => import("@/components/Map/Map"), { ssr: false });

interface Part {
    id: string;
    title: string;
    price: number;
    condition: string;
    location: string;
    category: string;
    brand: string | null;
    latitude: number | null;
    longitude: number | null;
    photos: { url: string }[];
}

interface PartsClientProps {
    initialParts: Part[];
    lang: "en" | "it";
}

const CATEGORIES = [
    { key: "", labelEn: "All", labelIt: "Tutte", icon: "📦" },
    { key: "BRAKES", labelEn: "Brakes", labelIt: "Freni", icon: "🛑" },
    { key: "DRIVETRAIN", labelEn: "Drivetrain", labelIt: "Trasmissione", icon: "⚙️" },
    { key: "WHEELS", labelEn: "Wheels", labelIt: "Ruote", icon: "🔄" },
    { key: "HANDLEBARS", labelEn: "Handlebars", labelIt: "Manubri", icon: "🏍️" },
    { key: "SADDLES", labelEn: "Saddles", labelIt: "Selle", icon: "🪑" },
    { key: "FORKS", labelEn: "Forks", labelIt: "Forcelle", icon: "🔱" },
    { key: "PEDALS", labelEn: "Pedali", labelIt: "Pedali", icon: "👟" },
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

const UI_TEXT = {
    en: {
        list: "List",
        map: "Map",
        noResults: "No parts found with these filters.",
    },
    it: {
        list: "Elenco",
        map: "Mappa",
        noResults: "Nessun ricambio trovato con questi filtri.",
    },
};

export default function PartsClient({ initialParts, lang }: PartsClientProps) {
    const [parts, setParts] = useState<Part[]>(initialParts);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, string | number | boolean | null>>({});
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [activeListingId, setActiveListingId] = useState<string | null>(null);
    const t = UI_TEXT[lang];

    const fetchParts = async (newFilters: Record<string, string | number | boolean | null>) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/parts?${params.toString()}`);
            const data = await res.json();
            if (data.parts) {
                const sortedParts = [...data.parts];
                if (newFilters.sort === "price_asc") {
                    sortedParts.sort((a: Part, b: Part) => a.price - b.price);
                } else if (newFilters.sort === "price_desc") {
                    sortedParts.sort((a: Part, b: Part) => b.price - a.price);
                }
                setParts(sortedParts);
            }
        } catch (error) {
            console.error("Failed to fetch parts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Record<string, string | number | boolean | null>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchParts(updatedFilters);
    };

    const handlePillClick = (cat: string) => {
        const newFilters = { ...filters, category: cat };
        setFilters(newFilters);
        fetchParts(newFilters);
    };

    const mapListings = parts.map(part => {
        if (part.latitude === null || part.longitude === null) return null;
        return {
            id: part.id,
            title: part.title,
            latitude: part.latitude,
            longitude: part.longitude,
            price: part.price,
            image: part.photos[0]?.url || null,
            type: "part" as const,
            href: `/parts/${part.id}`
        };
    }).filter((l): l is NonNullable<typeof l> => l !== null);

    return (
        <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                {/* Category pills */}
                <div className={styles.categoryPills} style={{ margin: 0 }}>
                    {CATEGORIES.map((c) => (
                        <button 
                            key={c.key} 
                            className={`${styles.pill} ${(filters.category || "") === c.key ? styles.pillActive : ""}`}
                            onClick={() => handlePillClick(c.key)}
                        >
                            {c.icon} {lang === "it" ? c.labelIt : c.labelEn}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div style={{ display: "flex", background: "var(--surface-2)", padding: "4px", borderRadius: "8px", gap: "4px" }}>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
                        style={{ padding: "4px 12px", minHeight: "32px" }}
                    >
                        {t.list}
                    </button>
                    <button 
                        onClick={() => setViewMode("map")}
                        className={`btn btn-sm ${viewMode === "map" ? "btn-primary" : "btn-ghost"}`}
                        style={{ padding: "4px 12px", minHeight: "32px" }}
                    >
                        {t.map}
                    </button>
                </div>
            </div>

            <ListingFilters 
                type="parts" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {viewMode === "list" ? (
                <StaggerContainer className={`grid-4 ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                    {parts.length > 0 ? (
                        parts.map((part) => (
                            <FadeIn key={part.id}>
                                <div 
                                    onMouseEnter={() => setActiveListingId(part.id)}
                                    onMouseLeave={() => setActiveListingId(null)}
                                >
                                    <ListingCard
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
                                </div>
                            </FadeIn>                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                            <p className="text-muted">{t.noResults}</p>
                        </div>
                    )}
                </StaggerContainer>
            ) : (
                <FadeIn delay={0.2} style={{ height: "600px", marginTop: "var(--space-6)" }}>
                    <Map 
                        listings={mapListings} 
                        height="600px" 
                        activeId={activeListingId}
                        onMarkerClick={(id) => setActiveListingId(id)}
                    />
                </FadeIn>
            )}
        </FadeIn>
    );
}
