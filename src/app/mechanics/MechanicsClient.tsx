"use client";

import { useState } from "react";
import Link from "next/link";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./mechanics.module.css";

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

    const fetchMechanics = async (currentFilters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(currentFilters).forEach(([key, value]) => {
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
        setFilters(newFilters);
        fetchMechanics(newFilters);
    };

    return (
        <>
            <ListingFilters 
                type="mechanics" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {/* Mechanic Cards Grid */}
            <div className={`${styles.grid} ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                {mechanics.length > 0 ? (
                    mechanics.map((m) => (
                        <Link href={`/mechanics/${m.id}`} key={m.id} className={styles.mechCard}>
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
                    ))
                ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-20) 0" }}>
                        <p className="text-muted">{lang === "it" ? "Nessun meccanico trovato." : "No mechanics found."}</p>
                    </div>
                )}
            </div>
        </>
    );
}
