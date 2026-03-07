import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./mechanics.module.css";

export const metadata: Metadata = {
    title: "Find a Bike Mechanic Near You",
    description: "Browse skilled bike mechanics and DIY fixers. Read reviews, check availability, and get quotes for any repair job.",
};

const SKILL_BADGE: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
    PROFESSIONAL: "Pro",
};

export default async function MechanicsPage() {
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
                    <span className="page-header__eyebrow">🔧 Service Marketplace</span>
                    <h1 className="text-heading-1">Find a Bike Mechanic</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        Browse skilled mechanics and knowledgeable DIY fixers near you. Get your bike serviced, repaired, or fully rebuilt.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder="🔍  Search mechanics, skills, or location..." />
                    </div>
                    <select className="form-select" style={{ width: 180 }}>
                        <option value="">All Skill Levels</option>
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="EXPERT">Expert</option>
                        <option value="PROFESSIONAL">Professional</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Available Now</option>
                        <option value="true">Available Only</option>
                    </select>
                    <Link href="/mechanics/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        + Offer My Skills
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
                                            {SKILL_BADGE[m.skillLevel]}
                                        </span>
                                        {!m.isAvailable && <span className="badge badge-gray">Unavailable</span>}
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
