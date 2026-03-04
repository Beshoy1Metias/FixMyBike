import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/ListingCard/ListingCard";
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

const MOCK_PARTS = [
    { id: "1", title: "Shimano 105 R7000 Groupset — 11sp", price: 420, condition: "LIKE_NEW", category: "DRIVETRAIN", location: "Munich", brand: "Shimano" },
    { id: "2", title: "SRAM Rival AXS 12sp Rear Derailleur", price: 195, condition: "GOOD", category: "DRIVETRAIN", location: "Lyon", brand: "SRAM" },
    { id: "3", title: "Hunt 4Season Disc Wheelset 700c", price: 380, condition: "GOOD", category: "WHEELS", location: "Manchester", brand: "Hunt" },
    { id: "4", title: "Fox 36 Float 29\" 160mm Fork", price: 680, condition: "LIKE_NEW", category: "FORKS", location: "Innsbruck", brand: "Fox" },
    { id: "5", title: "Fizik Antares R3 Saddle — Black", price: 110, condition: "NEW", category: "SADDLE", location: "Rome", brand: "Fizik" },
    { id: "6", title: "Hope Tech 4 Brake Set — Front & Rear", price: 220, condition: "GOOD", category: "BRAKES", location: "Sheffield", brand: "Hope" },
    { id: "7", title: "Thomson Elite Stem 90mm 31.8", price: 55, condition: "GOOD", category: "HANDLEBARS", location: "Hamburg", brand: "Thomson" },
    { id: "8", title: "Lezyne Mega Drive 1800i Lights Set", price: 75, condition: "LIKE_NEW", category: "LIGHTS", location: "Brussels", brand: "Lezyne" },
];

const CONDITION_LABELS: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
};

export default function PartsPage() {
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
                    {MOCK_PARTS.map((part) => (
                        <ListingCard
                            key={part.id}
                            href={`/parts/${part.id}`}
                            title={part.title}
                            price={part.price}
                            condition={CONDITION_LABELS[part.condition]}
                            location={part.location}
                            badge={CONDITION_LABELS[part.condition]}
                            badgeVariant={part.condition === "NEW" ? "success" : part.condition === "LIKE_NEW" ? "accent" : "gray"}
                            tags={[part.brand, part.category.charAt(0) + part.category.slice(1).toLowerCase()]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
