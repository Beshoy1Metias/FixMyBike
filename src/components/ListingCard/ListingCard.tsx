"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./ListingCard.module.css";

interface ListingCardProps {
    href: string;
    image?: string | null;
    title: string;
    price?: number | string | null;
    condition?: string | null;
    location: string;
    badge?: string;
    badgeVariant?: "primary" | "accent" | "success" | "gray";
    meta?: string;
    tags?: string[];
    statusAction?: {
        label: string;
        onClick: (e: React.MouseEvent) => void;
        variant: "sold" | "available";
    };
    isCompleted?: boolean;
    completedLabel?: string;
}

export default function ListingCard({
    href,
    image,
    title,
    price,
    condition,
    location,
    badge,
    badgeVariant = "gray",
    meta,
    tags = [],
    statusAction,
    isCompleted = false,
    completedLabel = "SOLD",
}: ListingCardProps) {
    return (
        <motion.div
            className={`${styles.cardWrapper} ${isCompleted ? styles.completed : ""}`}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link href={href} className={styles.card}>
                <div className={styles.imageWrap}>
                    {image ? (
                        <Image src={image} alt={title} fill className={styles.image} sizes="(max-width:640px) 100vw, 350px" />
                    ) : (
                        <div className={styles.imagePlaceholder}>🚲</div>
                    )}
                    
                    {/* Visual Overlays */}
                    <div className={styles.imageOverlay} />
                    <div className={styles.glassShine} />

                    <div className={styles.badgeContainer}>
                        {badge && (
                            <span className={`${styles.premiumBadge} ${styles[`badge_${badgeVariant}`]}`}>
                                {badge}
                            </span>
                        )}
                        {condition && (
                            <span className={styles.conditionBadge}>{condition}</span>
                        )}
                    </div>

                    {isCompleted && (
                        <div className={styles.completedOverlay}>
                            <span>{completedLabel}</span>
                        </div>
                    )}
                </div>
                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    
                    <div className={styles.footer}>
                        <div className={styles.priceContainer}>
                            {price !== undefined && price !== null && (
                                <span className={styles.listingPrice}>
                                    {typeof price === "number" ? `€${price.toLocaleString()}` : price}
                                </span>
                            )}
                        </div>
                        
                        <div className={styles.locationWrap}>
                            <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span className={styles.locationText}>
                                {location}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
            {statusAction && (
                <button
                    onClick={statusAction.onClick}
                    className={`${styles.statusBtn} ${statusAction.variant === "sold" ? styles.btnSold : styles.btnAvail}`}
                >
                    {statusAction.label}
                </button>
            )}
        </motion.div>
    );
}
