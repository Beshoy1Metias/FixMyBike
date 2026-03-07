"use client";

import { useState } from "react";
import ListingCard from "@/components/ListingCard/ListingCard";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./parts.module.css";

interface PartsClientProps {
    initialParts: any[];
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

export default function PartsClient({ initialParts, lang }: PartsClientProps) {
    const [parts, setParts] = useState(initialParts);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<any>({});

    const fetchParts = async (currentFilters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/parts?${params.toString()}`);
            const data = await res.json();
            if (data.parts) {
                let sortedParts = data.parts;
                if (currentFilters.sort === "price_asc") {
                    sortedParts.sort((a: any, b: any) => a.price - b.price);
                } else if (currentFilters.sort === "price_desc") {
                    sortedParts.sort((a: any, b: any) => b.price - a.price);
                }
                setParts(sortedParts);
            }
        } catch (error) {
            console.error("Failed to fetch parts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        fetchParts(newFilters);
    };

    const handlePillClick = (cat: string) => {
        const newFilters = { ...filters, category: cat };
        setFilters(newFilters);
        fetchParts(newFilters);
    };

    return (
        <>
            {/* Category pills */}
            <div className={styles.categoryPills}>
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

            <ListingFilters 
                type="parts" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {/* Grid */}
            <div className={`grid-4 ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                {parts.length > 0 ? (
                    parts.map((part) => (
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
                    ))
                ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                        <p className="text-muted">{lang === "it" ? "Nessun ricambio trovato." : "No parts found."}</p>
                    </div>
                )}
            </div>
        </>
    );
}
