import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/ListingCard/ListingCard";
import prisma from "@/lib/prisma";
import styles from "./bikes.module.css";

export const metadata: Metadata = {
    title: "Bikes for Sale — Road, MTB, Gravel & More",
    description: "Browse complete bikes for sale from private sellers. Road, mountain, gravel, hybrid, BMX, e-bikes, and more. Find your next ride.",
};

const BIKE_TYPES = [
    { label: "All", icon: "" },
    { label: "Road", icon: "🏁" },
    { label: "Mountain", icon: "⛰️" },
    { label: "Gravel", icon: "🌄" },
    { label: "Hybrid", icon: "🚴" },
    { label: "E-Bike", icon: "⚡" },
    { label: "BMX", icon: "🤸" },
    { label: "Folding", icon: "📐" },
    { label: "City", icon: "🏙️" },
];

const CONDITION_LABELS: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
};

export default async function BikesPage() {
    const bikes = await prisma.bikeListing.findMany({
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
                    <span className="page-header__eyebrow">🚲 Bikes for Sale</span>
                    <h1 className="text-heading-1">Find Your Next Ride</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        Browse bikes for sale from private sellers across the community. Road, mountain, gravel, e-bikes, and more.
                    </p>
                </div>

                {/* Type pills */}
                <div className={styles.typePills}>
                    {BIKE_TYPES.map((t) => (
                        <button key={t.label} className={`${styles.pill} ${t.label === "All" ? styles.pillActive : ""}`}>
                            {t.icon && <span>{t.icon}</span>} {t.label}
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder="🔍  Search by brand, model, location..." />
                    </div>
                    <select className="form-select" style={{ width: 150 }}>
                        <option value="">Frame Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Max Budget</option>
                        <option value="500">Under €500</option>
                        <option value="1000">Under €1,000</option>
                        <option value="2000">Under €2,000</option>
                        <option value="5000">Under €5,000</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Sort: Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <Link href="/bikes/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        + Sell My Bike
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid-4">
                    {bikes.map((bike) => (
                        <ListingCard
                            key={bike.id}
                            href={`/bikes/${bike.id}`}
                            image={bike.photos[0]?.url ?? null}
                            title={bike.title}
                            price={bike.price}
                            condition={CONDITION_LABELS[bike.condition]}
                            location={bike.location}
                            badge={bike.bikeType.charAt(0) + bike.bikeType.slice(1).toLowerCase()}
                            badgeVariant={bike.bikeType === "ELECTRIC" ? "accent" : "primary"}
                            meta={[
                                bike.brand,
                                bike.year ? String(bike.year) : null,
                                bike.frameSize ? `Size ${bike.frameSize}` : null,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
