"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "@/components/ListingCard/ListingCard";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./bikes.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

const Map = dynamic(() => import("@/components/Map/Map"), { ssr: false });

interface Bike {
    id: string;
    title: string;
    price: number;
    condition: string;
    location: string;
    bikeType: string;
    brand: string;
    year: number | null;
    frameSize: string | null;
    latitude: number | null;
    longitude: number | null;
    photos: { url: string }[];
}

interface BikesClientProps {
    initialBikes: Bike[];
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

const UI_TEXT = {
    en: {
        list: "List",
        map: "Map",
        size: "Size",
        noResults: "No bikes found with these filters.",
    },
    it: {
        list: "Lista",
        map: "Mappa",
        size: "Taglia",
        noResults: "Nessuna bici trovata con questi filtri.",
    },
};

export default function BikesClient({ initialBikes, lang }: BikesClientProps) {
    const [bikes, setBikes] = useState<Bike[]>(initialBikes);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, string | number | boolean | null>>({});
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const t = UI_TEXT[lang];

    const fetchBikes = async (newFilters: Record<string, string | number | boolean | null>) => {
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
                const sortedBikes = [...data.bikes];
                if (newFilters.sort === "price_asc") {
                    sortedBikes.sort((a: Bike, b: Bike) => a.price - b.price);
                } else if (newFilters.sort === "price_desc") {
                    sortedBikes.sort((a: Bike, b: Bike) => b.price - a.price);
                }
                setBikes(sortedBikes);
            }
        } catch (error) {
            console.error("Failed to fetch bikes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Record<string, string | number | boolean | null>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchBikes(updatedFilters);
    };

    const handlePillClick = (type: string) => {
        const newFilters = { ...filters, bikeType: type };
        setFilters(newFilters);
        fetchBikes(newFilters);
    };

    const mapListings = bikes.map(bike => {
        if (bike.latitude === null || bike.longitude === null) return null;
        return {
            id: bike.id,
            title: bike.title,
            latitude: bike.latitude,
            longitude: bike.longitude,
            price: bike.price,
            image: bike.photos[0]?.url || null,
            type: "bike" as const,
            href: `/bikes/${bike.id}`
        };
    }).filter((l): l is NonNullable<typeof l> => l !== null);

    return (
        <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                {/* Type pills */}
                <div className={styles.typePills} style={{ margin: 0 }}>
                    {BIKE_TYPES.map((type) => (
                        <button 
                            key={type.label} 
                            className={`${styles.pill} ${(filters.bikeType || "") === type.key ? styles.pillActive : ""}`}
                            onClick={() => handlePillClick(type.key)}
                        >
                            {type.icon && <span>{type.icon}</span>} {PILL_LABELS[lang][type.label]}
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
                                        bike.frameSize ? `${t.size} ${bike.frameSize}` : null,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                />
                            </FadeIn>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                            <p className="text-muted">{t.noResults}</p>
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
