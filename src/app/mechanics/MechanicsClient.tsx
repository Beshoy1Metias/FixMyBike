"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./mechanics.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import Map from "@/components/Map/Map";

interface MechanicsClientProps {
    initialMechanics: any[];
    lang: "en" | "it";
}

const SKILL_BADGE: Record<string, { en: string; it: string }> = {
    BEGINNER: { en: "Beginner", it: "Principiante" },
    INTERMEDIATE: { en: "Intermediate", it: "Intermedio" },
    EXPERT: { en: "Expert", it: "Esperto" },
    PROFESSIONAL: { en: "Pro", it: "Professionista" },
};

export default function MechanicsClient({ initialMechanics, lang }: MechanicsClientProps) {
    const [mechanics, setMechanics] = useState(initialMechanics);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const fetchMechanics = async (newFilters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/mechanics?${params.toString()}`);
            const data = await res.json();
            if (data.mechanics) {
                setMechanics(data.mechanics);
            }
        } catch (error) {
            console.error("Failed to fetch mechanics:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: any) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchMechanics(updatedFilters);
    };

    const mapListings = mechanics.map(m => ({
        id: m.id,
        title: m.user.name || "Mechanic",
        latitude: m.latitude,
        longitude: m.longitude,
        price: m.hourlyRate,
        type: "mechanic" as const,
        href: `/mechanics/${m.id}`
    })).filter(l => l.latitude && l.longitude);

    return (
        <FadeIn>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "var(--space-4)" }}>
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
                type="mechanics" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {viewMode === "list" ? (
                <StaggerContainer className={`${styles.grid} ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                    {mechanics.length > 0 ? (
                        mechanics.map((m) => (
                            <FadeIn key={m.id}>
                                <Link href={`/mechanics/${m.id}`} className={styles.mechCard}>
                                    {/* Avatar */}
                                    <div className={styles.mechAvatar}>
                                        <span>{(m.user.name || "M").charAt(0)}</span>
                                        {m.isAvailable && <span className={styles.availDot} title="Available" />}
                                    </div>
                                    <div className={styles.mechInfo}>
                                        <div className={styles.mechTop}>
                                            <div>
                                                <h3 className={styles.mechName}>{m.user.name || "Mechanic"}</h3>
                                                <p className={styles.mechLocation}>📍 {m.location}</p>
                                            </div>
                                            <div className={styles.mechBadges}>
                                                <span className={`badge badge-${m.skillLevel === "PROFESSIONAL" ? "primary" : m.skillLevel === "EXPERT" ? "accent" : "gray"}`}>
                                                    {SKILL_BADGE[m.skillLevel][lang]}
                                                </span>
                                                {!m.isAvailable && <span className="badge badge-gray">{lang === "it" ? "Non disponibile" : "Unavailable"}</span>}
                                            </div>
                                        </div>
                                        {m.bio && <p className={styles.mechBio}>{m.bio}</p>}
                                        {m.skills && (
                                            <div className={styles.mechSkills}>
                                                {m.skills.split(",").map((s: string) => (
                                                    <span key={s.trim()} className={`badge badge-gray`} style={{ fontSize: "0.7rem" }}>
                                                        {s.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.mechFooter}>
                                            {m.hourlyRate && (
                                                <span className="price-sm">
                                                    €{m.hourlyRate.toLocaleString()}
                                                    <span className="text-muted text-xs"> /hr</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                            <p className="text-muted">{lang === "it" ? "Nessun meccanico trovato." : "No mechanics found."}</p>
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
