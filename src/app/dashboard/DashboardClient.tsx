"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";
import ListingCard from "@/components/ListingCard/ListingCard";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import { useRouter } from "next/navigation";

interface Bike {
    id: string;
    title: string;
    price: number;
    location: string;
    condition: string;
    isSold: boolean;
    photos: { url: string }[];
}

interface Part {
    id: string;
    title: string;
    price: number;
    location: string;
    condition: string;
    isSold: boolean;
    photos: { url: string }[];
}

interface WantedPost {
    id: string;
    title: string;
    location: string;
    maxBudget: number | null;
    isFulfilled: boolean;
}

interface ListingItem {
    id: string;
    title: string;
    price?: number | string | null;
    maxBudget?: number | null;
    location: string;
    condition?: string | null;
    isSold?: boolean;
    isFulfilled?: boolean;
    photos?: { url: string }[];
    type: "bike" | "part" | "wanted";
}

interface DashboardClientProps {
    bikes: Bike[];
    parts: Part[];
    wanted: WantedPost[];
    lang: "en" | "it";
}

const TEXT = {
    en: {
        activeListings: "Active Listings",
        completedListings: "Completed / Sold",
        markSold: "Mark as Sold",
        markFound: "Mark as Found",
        markAvailable: "Mark as Available",
        noListings: "No listings found in this section.",
        bike: "Bike",
        part: "Part",
        wanted: "Wanted",
        conditionLabels: {
            NEW: "New",
            LIKE_NEW: "Like New",
            GOOD: "Good",
            FAIR: "Fair",
            POOR: "Needs repair"
        }
    },
    it: {
        activeListings: "Annunci Attivi",
        completedListings: "Completati / Venduti",
        markSold: "Segna come Venduto",
        markFound: "Segna come Trovato",
        markAvailable: "Segna come Disponibile",
        noListings: "Nessun annuncio trovato in questa sezione.",
        bike: "Bici",
        part: "Ricambio",
        wanted: "Richiesta",
        conditionLabels: {
            NEW: "Nuova",
            LIKE_NEW: "Come nuova",
            GOOD: "Buona",
            FAIR: "Discreta",
            POOR: "Da sistemare"
        }
    },
};

export default function DashboardClient({ bikes, parts, wanted, lang }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();
    const t = TEXT[lang];

    const handleStatusUpdate = async (id: string, type: string, currentStatus: boolean) => {
        setLoading(id);
        try {
            const res = await fetch("/api/listings/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    type,
                    status: !currentStatus
                })
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setLoading(null);
        }
    };

    const filterListings = (isCompleted: boolean): ListingItem[] => {
        const filteredBikes = bikes
            .filter(b => b.isSold === isCompleted)
            .map(b => ({ ...b, type: "bike" as const }));
        const filteredParts = parts
            .filter(p => p.isSold === isCompleted)
            .map(p => ({ ...p, type: "part" as const }));
        const filteredWanted = wanted
            .filter(w => w.isFulfilled === isCompleted)
            .map(w => ({ ...w, type: "wanted" as const }));
        
        return [...filteredBikes, ...filteredParts, ...filteredWanted];
    };

    const displayListings = filterListings(activeTab === "completed");

    return (
        <div className={styles.dashboardContent}>
            {/* Tabs */}
            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === "active" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("active")}
                >
                    {t.activeListings} ({filterListings(false).length})
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "completed" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("completed")}
                >
                    {t.completedListings} ({filterListings(true).length})
                </button>
            </div>

            {displayListings.length === 0 ? (
                <FadeIn>
                    <div className={styles.emptyState} style={{ padding: "var(--space-12) 0" }}>
                        <p>{t.noListings}</p>
                    </div>
                </FadeIn>
            ) : (
                <StaggerContainer className="grid-4">
                    {displayListings.map((item) => (
                        <FadeIn key={item.id}>
                            <ListingCard
                                href={`/${item.type === "wanted" ? "wanted" : item.type === "bike" ? "bikes" : "parts"}/${item.id}`}
                                image={item.photos?.[0]?.url}
                                title={item.title}
                                price={item.type === "wanted" ? (item.maxBudget ? `Up to €${item.maxBudget}` : null) : item.price}
                                location={item.location}
                                badge={t[item.type] as string}
                                badgeVariant={item.type === "bike" ? "primary" : item.type === "part" ? "accent" : "gray"}
                                condition={item.condition ? t.conditionLabels[item.condition as keyof typeof t.conditionLabels] : null}
                                isCompleted={item.isSold || item.isFulfilled}
                                statusAction={{
                                    label: loading === item.id ? "..." : (
                                        item.type === "wanted" 
                                            ? (item.isFulfilled ? t.markAvailable : t.markFound)
                                            : (item.isSold ? t.markAvailable : t.markSold)
                                    ),
                                    onClick: (e) => {
                                        e.preventDefault();
                                        handleStatusUpdate(item.id, item.type, !!(item.isSold || item.isFulfilled));
                                    },
                                    variant: (item.isSold || item.isFulfilled) ? "available" : "sold"
                                }}
                            />
                        </FadeIn>
                    ))}
                </StaggerContainer>
            )}
        </div>
    );
}
