import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./mechanics.module.css";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Find a Bike Mechanic Near You",
    description: "Browse skilled bike mechanics and DIY fixers. Read reviews, check availability, and get quotes for any repair job.",
};

const SKILL_BADGE: Record<string, { en: string; it: string }> = {
    BEGINNER: { en: "Beginner", it: "Principiante" },
    INTERMEDIATE: { en: "Intermediate", it: "Intermedio" },
    EXPERT: { en: "Expert", it: "Esperto" },
    PROFESSIONAL: { en: "Pro", it: "Professionista" },
};

const TEXT = {
    en: {
        eyebrow: "🔧 Service Marketplace",
        title: "Find a Bike Mechanic",
        lead: "Browse skilled mechanics and knowledgeable DIY fixers near you. Get your bike serviced, repaired, or fully rebuilt.",
        searchPlaceholder: "🔍  Search mechanics, skills, or location...",
        allLevels: "All Skill Levels",
        availableNow: "Available Now",
        availableOnly: "Available Only",
        offerSkills: "+ Offer My Skills",
        unavailable: "Unavailable",
    },
    it: {
        eyebrow: "🔧 Marketplace dei servizi",
        title: "Trova un meccanico per bici",
        lead: "Scopri meccanici e appassionati competenti vicino a te. Porta la tua bici a fare un check, una riparazione o un restauro completo.",
        searchPlaceholder: "🔍  Cerca per meccanico, competenze o città...",
        allLevels: "Tutti i livelli",
        availableNow: "Disponibili ora",
        availableOnly: "Solo disponibili",
        offerSkills: "+ Offri le tue competenze",
        unavailable: "Non disponibile",
    },
} as const;

export default async function MechanicsPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    const mechanics = await prisma.mechanicProfile.findMany({
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
            {/* Page Header */}
            <div className="container">
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        {t.lead}
                    </p>
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder={t.searchPlaceholder} />
                    </div>
                    <select className="form-select" style={{ width: 180 }}>
                        <option value="">{t.allLevels}</option>
                        <option value="BEGINNER">{SKILL_BADGE.BEGINNER[lang]}</option>
                        <option value="INTERMEDIATE">{SKILL_BADGE.INTERMEDIATE[lang]}</option>
                        <option value="EXPERT">{SKILL_BADGE.EXPERT[lang]}</option>
                        <option value="PROFESSIONAL">{SKILL_BADGE.PROFESSIONAL[lang]}</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">{t.availableNow}</option>
                        <option value="true">{t.availableOnly}</option>
                    </select>
                    <Link href="/mechanics/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        {t.offerSkills}
                    </Link>
                </div>

                {/* Mechanic Cards Grid */}
                <div className={styles.grid}>
                    {mechanics.map((m) => (
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
                                        {!m.isAvailable && <span className="badge badge-gray">{t.unavailable}</span>}
                                    </div>
                                </div>
                                {m.bio && <p className={styles.mechBio}>{m.bio}</p>}
                                {m.skills && (
                                    <div className={styles.mechSkills}>
                                        {m.skills.split(",").map((s) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}
