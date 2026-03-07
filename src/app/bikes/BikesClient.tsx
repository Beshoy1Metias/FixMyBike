"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "@/components/ListingCard/ListingCard";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./bikes.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import Map from "@/components/Map/Map";

interface BikesClientProps {
    initialBikes: any[];
    lang: "en" | "it";
}

const CONDITION_LABELS: Record<string, { en: string; it: string }> = {
    NEW: { en: "New", it: "Nuovo" },
    LIKE_NEW: { en: "Like New", it: "Come nuovo" },
    GOOD: { en: "Good", it: "Buono" },
    FAIR: { en: "Fair", it: "Discreto" },
    POOR: { en: "Poor", it: "Da sistemare" },
};

const BIKE_TYPES = [
    { label: "ALL", key: "", icon: "" },
    { label: "ROAD", key: "ROAD", icon: "🏁" },
    { label: "MOUNTAIN", key: "MOUNTAIN", icon: "⛰️" },
    { label: "GRAVEL", key: "GRAVEL", icon: "🌄" },
    { label: "HYBRID", key: "HYBRID", icon: "🚴" },
    { label: "E-Bike", key: "ELECTRIC", icon: "⚡" },
    { label: "BMX", key: "BMX", icon: "🤸" },
    { label: "FOLDING", key: "FOLDING", icon: "📐" },
    { label: "CITY", key: "CITY", icon: "🏙️" },
];

const PILL_LABELS: Record<string, Record<string, string>> = {
    en: {
        ALL: "All",
        ROAD: "Road",
        MOUNTAIN: "Mountain",
        GRAVEL: "Gravel",
        HYBRID: "Hybrid",
        "E-Bike": "E-Bike",
        BMX: "BMX",
        FOLDING: "Folding",
        CITY: "City",
    },
    it: {
        ALL: "Tutte",
        ROAD: "Strada",
        MOUNTAIN: "MTB",
        GRAVEL: "Gravel",
        HYBRID: "Ibrida",
        "E-Bike": "E‑Bike",
        BMX: "BMX",
        FOLDING: "Pieghevole",
        CITY: "Città",
    }
};

export default function BikesClient({ initialBikes, lang }: BikesClientProps) {
    const [bikes, setBikes] = useState(initialBikes);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const fetchBikes = async (newFilters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/bikes?${params.toString()}`);
            const data = await res.json();
            if (data.bikes) {
                // Client-side sorting if needed (though API should handle it)
                let sortedBikes = data.bikes;
                if (newFilters.sort === "price_asc") {
                    sortedBikes.sort((a: any, b: any) => a.price - b.price);
                } else if (newFilters.sort === "price_desc") {
                    sortedBikes.sort((a: any, b: any) => b.price - a.price);
                }
                setBikes(sortedBikes);
            }
        } catch (error) {
            console.error("Failed to fetch bikes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: any) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchBikes(updatedFilters);
    };

    const handlePillClick = (type: string) => {
        const newFilters = { ...filters, bikeType: type };
        setFilters(newFilters);
        fetchBikes(newFilters);
    };

    const mapListings = bikes.map(bike => ({
        id: bike.id,
        title: bike.title,
        latitude: bike.latitude,
        longitude: bike.longitude,
        price: bike.price,
        type: "bike" as const,
        href: `/bikes/${bike.id}`
    })).filter(l => l.latitude && l.longitude);

    return (
        <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                {/* Type pills */}
                <div className={styles.typePills} style={{ margin: 0 }}>
                    {BIKE_TYPES.map((t) => (
                        <button 
                            key={t.label} 
                            className={`${styles.pill} ${(filters.bikeType || "") === t.key ? styles.pillActive : ""}`}
                            onClick={() => handlePillClick(t.key)}
                        >
                            {t.icon && <span>{t.icon}</span>} {PILL_LABELS[lang][t.label]}
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
                        List
                    </button>
                    <button 
                        onClick={() => setViewMode("map")}
                        className={`btn btn-sm ${viewMode === "map" ? "btn-primary" : "btn-ghost"}`}
                        style={{ padding: "4px 12px", minHeight: "32px" }}
                    >
                        Map
                    </button>
                </div>
            </div>

            <ListingFilters 
                type="bikes" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {viewMode === "list" ? (
                <StaggerContainer className={`grid-4 ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                    {bikes.length > 0 ? (
                        bikes.map((bike) => (
                            <FadeIn key={bike.id}>
                                <ListingCard
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
                            </FadeIn>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                            <p className="text-muted">{lang === "it" ? "Nessuna bici trovata con questi filtri." : "No bikes found with these filters."}</p>
                        </div>
                    )}
                </StaggerContainer>
            ) : (
                <FadeIn delay={0.2} style={{ height: "600px", marginTop: "var(--space-6)" }}>
                    <Map listings={mapListings} height="600px" />
                </FadeIn>
            )}
        </FadeIn>
    );
}
