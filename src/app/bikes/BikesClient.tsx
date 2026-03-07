"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/components/ListingCard/ListingCard";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./bikes.module.css";

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

    const fetchBikes = async (currentFilters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/bikes?${params.toString()}`);
            const data = await res.json();
            if (data.bikes) {
                // Client-side sorting if needed (though API should handle it)
                let sortedBikes = data.bikes;
                if (currentFilters.sort === "price_asc") {
                    sortedBikes.sort((a: any, b: any) => a.price - b.price);
                } else if (currentFilters.sort === "price_desc") {
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
        setFilters(newFilters);
        fetchBikes(newFilters);
    };

    const handlePillClick = (type: string) => {
        const newFilters = { ...filters, bikeType: type };
        setFilters(newFilters);
        fetchBikes(newFilters);
    };

    return (
        <>
            {/* Type pills */}
            <div className={styles.typePills}>
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

            <ListingFilters 
                type="bikes" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {/* Grid */}
            <div className={`grid-4 ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                {bikes.length > 0 ? (
                    bikes.map((bike) => (
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
                    ))
                ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                        <p className="text-muted">{lang === "it" ? "Nessuna bici trovata con questi filtri." : "No bikes found with these filters."}</p>
                    </div>
                )}
            </div>
        </>
    );
}
