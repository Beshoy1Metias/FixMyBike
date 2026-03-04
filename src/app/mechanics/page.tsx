import type { Metadata } from "next";
import Link from "next/link";
import styles from "./mechanics.module.css";

export const metadata: Metadata = {
    title: "Find a Bike Mechanic Near You",
    description: "Browse skilled bike mechanics and DIY fixers. Read reviews, check availability, and get quotes for any repair job.",
};

// Placeholder mechanic data until DB is connected
const MOCK_MECHANICS = [
    { id: "1", name: "Marco V.", location: "Amsterdam", skillLevel: "PROFESSIONAL", skills: "Full Build, Suspension, Brakes", rating: 4.9, reviews: 87, available: true, hourlyRate: 45, bio: "Former pro mechanic with 15 years of experience. Specialized in road and gravel builds." },
    { id: "2", name: "Sara K.", location: "Berlin", skillLevel: "EXPERT", skills: "Gears, Wheels, Electrics (E-Bikes)", rating: 4.8, reviews: 52, available: true, hourlyRate: 35, bio: "E-bike specialist and general service. Quick turnaround guaranteed." },
    { id: "3", name: "Tom H.", location: "London", skillLevel: "INTERMEDIATE", skills: "Brakes, Tyres, Basic Service", rating: 4.6, reviews: 24, available: false, hourlyRate: 25, bio: "DIY enthusiast with a fully equipped workshop at home. Happy to help on weekends." },
    { id: "4", name: "Fatima A.", location: "Barcelona", skillLevel: "EXPERT", skills: "MTB, Suspension, Dropper Posts", rating: 5.0, reviews: 41, available: true, hourlyRate: 40, bio: "Mountain bike fanatic. I'll get your trail rig dialed in perfectly." },
    { id: "5", name: "Luca M.", location: "Milan", skillLevel: "PROFESSIONAL", skills: "Full Strip & Rebuild, Carbon, Di2", rating: 4.9, reviews: 103, available: true, hourlyRate: 60, bio: "Racing mechanic. Specialising in high-end road bikes and electronic groupsets." },
    { id: "6", name: "Anna O.", location: "Paris", skillLevel: "INTERMEDIATE", skills: "City Bikes, Lights, Racks, Basic Tune", rating: 4.4, reviews: 18, available: true, hourlyRate: 20, bio: "Your friendly neighbourhood fixer. Quick tune-ups and commuter bike specialists." },
];

const SKILL_BADGE: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
    PROFESSIONAL: "Pro",
};

export default function MechanicsPage() {
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
                    {MOCK_MECHANICS.map((m) => (
                        <Link href={`/mechanics/${m.id}`} key={m.id} className={styles.mechCard}>
                            {/* Avatar */}
                            <div className={styles.mechAvatar}>
                                <span>{m.name.charAt(0)}</span>
                                {m.available && <span className={styles.availDot} title="Available" />}
                            </div>
                            <div className={styles.mechInfo}>
                                <div className={styles.mechTop}>
                                    <div>
                                        <h3 className={styles.mechName}>{m.name}</h3>
                                        <p className={styles.mechLocation}>📍 {m.location}</p>
                                    </div>
                                    <div className={styles.mechBadges}>
                                        <span className={`badge badge-${m.skillLevel === "PROFESSIONAL" ? "primary" : m.skillLevel === "EXPERT" ? "accent" : "gray"}`}>
                                            {SKILL_BADGE[m.skillLevel]}
                                        </span>
                                        {!m.available && <span className="badge badge-gray">Unavailable</span>}
                                    </div>
                                </div>
                                <p className={styles.mechBio}>{m.bio}</p>
                                <div className={styles.mechSkills}>
                                    {m.skills.split(", ").map((s) => (
                                        <span key={s} className={`badge badge-gray`} style={{ fontSize: "0.7rem" }}>{s}</span>
                                    ))}
                                </div>
                                <div className={styles.mechFooter}>
                                    <div className={styles.mechRating}>
                                        <span className={styles.stars}>★</span>
                                        <strong>{m.rating}</strong>
                                        <span className="text-muted">({m.reviews} reviews)</span>
                                    </div>
                                    <span className="price-sm">€{m.hourlyRate}<span className="text-muted text-xs"> /hr</span></span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
