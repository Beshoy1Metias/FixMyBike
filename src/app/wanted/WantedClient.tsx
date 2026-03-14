"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import styles from "./wanted.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

const Map = dynamic(() => import("@/components/Map/Map"), { ssr: false });

interface WantedPost {
    id: string;
    title: string;
    description: string;
    location: string;
    maxBudget: number | null;
    bikeType: string | null;
    frameSize: string | null;
    createdAt: Date;
    latitude: number | null;
    longitude: number | null;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface WantedClientProps {
    initialPosts: WantedPost[];
    lang: "en" | "it";
}

function formatPostedAt(date: Date, lang: "en" | "it") {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        const m = diffMinutes || 1;
        return lang === "it" ? `${m} min fa` : `${m}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return lang === "it" ? `${diffHours} h fa` : `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
        return lang === "it" ? `${diffDays} g fa` : `${diffDays}d ago`;
    }
    return d.toLocaleDateString(lang === "it" ? "it-IT" : undefined);
}

const UI_TEXT = {
    en: {
        list: "List",
        map: "Map",
        buyer: "Buyer",
        anonymous: "FixMyBike buyer",
        budget: "Budget",
        upTo: "up to",
        size: "Size",
        noResults: "No wanted posts found.",
    },
    it: {
        list: "Elenco",
        map: "Mappa",
        buyer: "Acquirente",
        anonymous: "Utente FixMyBike",
        budget: "Budget",
        upTo: "fino a",
        size: "Taglia",
        noResults: "Nessun annuncio trovato con questi filtri.",
    },
};

export default function WantedClient({ initialPosts, lang }: WantedClientProps) {
    const [posts, setPosts] = useState<WantedPost[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, string | number | boolean | null>>({});
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const t = UI_TEXT[lang];

    const fetchPosts = async (newFilters: Record<string, string | number | boolean | null>) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) params.append(key, String(value));
            });

            const res = await fetch(`/api/wanted?${params.toString()}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch wanted posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Record<string, string | number | boolean | null>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchPosts(updatedFilters);
    };

    const mapListings = posts.map(post => {
        if (post.latitude === null || post.longitude === null) return null;
        return {
            id: post.id,
            title: post.title,
            latitude: post.latitude,
            longitude: post.longitude,
            price: post.maxBudget ? `${t.upTo} €${post.maxBudget.toLocaleString()}` : undefined,
            image: post.user.image || null,
            type: "bike" as const, // Close enough for map display
            href: `/wanted/${post.id}`
        };
    }).filter((l): l is NonNullable<typeof l> => l !== null);

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
                type="wanted" 
                lang={lang} 
                onFilterChange={handleFilterChange} 
                initialFilters={filters}
            />

            {viewMode === "list" ? (
                <StaggerContainer className={`${styles.postList} ${loading ? "opacity-50" : ""}`} style={{ transition: "opacity 0.2s" }}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <FadeIn key={post.id}>
                                <Link href={`/wanted/${post.id}`} className={styles.postCard}>
                                    <div className={styles.postLeft}>
                                        <div className={styles.postAvatar}>
                                            {(post.user.name || "B").charAt(0)}
                                        </div>
                                    </div>
                                    <div className={styles.postBody}>
                                        <div className={styles.postTop}>
                                            <div>
                                                <h3 className={styles.postTitle}>{post.title}</h3>
                                                <div className={styles.postMeta}>
                                                    <span>👤 {post.user.name || t.anonymous}</span>
                                                    <span>📍 {post.location}</span>
                                                    <span>🕐 {formatPostedAt(post.createdAt, lang)}</span>
                                                </div>
                                            </div>
                                            <div className={styles.postRight}>
                                                {post.maxBudget && (
                                                    <div className={styles.postBudget}>
                                                        <span className={styles.budgetLabel}>{t.budget}</span>
                                                        <span className="price-sm">
                                                            {t.upTo} €{post.maxBudget.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className={styles.postDesc}>{post.description}</p>
                                        <div className={styles.postTags}>
                                            {post.bikeType && (
                                                <span className="badge badge-primary">{post.bikeType}</span>
                                            )}
                                            {post.frameSize && (
                                                <span className="badge badge-gray">
                                                    {t.size} {post.frameSize}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
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
