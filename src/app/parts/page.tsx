import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/ListingCard/ListingCard";
import prisma from "@/lib/prisma";
import styles from "./parts.module.css";

export const metadata: Metadata = {
    title: "Bike Parts & Accessories for Sale",
    description: "Buy and sell new and used bike parts, components, and accessories. Brakes, drivetrains, wheels, saddles, and more.",
};

const CATEGORIES = [
    { label: "Brakes", icon: "🛑" },
    { label: "Drivetrain", icon: "⚙️" },
    { label: "Wheels", icon: "🔄" },
    { label: "Handlebars", icon: "🏍️" },
    { label: "Saddles", icon: "🪑" },
    { label: "Forks", icon: "🔱" },
    { label: "Pedals", icon: "👟" },
    { label: "Lights", icon: "💡" },
    { label: "Accessories", icon: "🎒" },
];

const CONDITION_LABELS: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
};

export default async function PartsPage() {
    const parts = await prisma.partListing.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            photos: {
                orderBy: { isPrimary: "desc" },
            },
        },
        take: 40,
    });
    return (
        <div className="section">
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">⚙️ Parts & Accessories</span>
                    <h1 className="text-heading-1">Buy & Sell Bike Parts</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        Find quality new and used components from fellow cyclists. Brakes, drivetrains, wheels, saddles, and everything in between.
                    </p>
                </div>

                {/* Category pills */}
                <div className={styles.categoryPills}>
                    <button className={`${styles.pill} ${styles.pillActive}`}>All</button>
                    {CATEGORIES.map((c) => (
                        <button key={c.label} className={styles.pill}>
                            {c.icon} {c.label}
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder="🔍  Search parts, brands, or categories..." />
                    </div>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Condition</option>
                        <option value="NEW">New</option>
                        <option value="LIKE_NEW">Like New</option>
                        <option value="GOOD">Good</option>
                        <option value="FAIR">Fair</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Sort: Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <Link href="/parts/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        + Sell a Part
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid-4">
                    {parts.map((part) => (
                        <ListingCard
                            key={part.id}
                            href={`/parts/${part.id}`}
                            image={part.photos[0]?.url ?? null}
                            title={part.title}
                            price={part.price}
                            condition={CONDITION_LABELS[part.condition]}
                            location={part.location}
                            badge={CONDITION_LABELS[part.condition]}
                            badgeVariant={part.condition === "NEW" ? "success" : part.condition === "LIKE_NEW" ? "accent" : "gray"}
                            tags={[
                                part.brand ?? "",
                                part.category.charAt(0) + part.category.slice(1).toLowerCase(),
                            ].filter(Boolean)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
