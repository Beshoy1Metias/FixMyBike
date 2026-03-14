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
                    {badge && (
                        <span className={`badge badge-${badgeVariant} ${styles.badge}`}>{badge}</span>
                    )}
                    {condition && (
                        <span className={`badge badge-gray ${styles.condition}`}>{condition}</span>
                    )}
                    {isCompleted && (
                        <div className={styles.completedOverlay}>
                            <span>SOLD</span>
                        </div>
                    )}
                </div>
                <div className={styles.body}>
                    {tags.length > 0 && (
                        <div className={styles.tags}>
                            {tags.map((t) => (
                                <span key={t} className={`badge badge-gray ${styles.tag}`}>{t}</span>
                            ))}
                        </div>
                    )}
                    <h3 className={styles.title}>{title}</h3>
                    {meta && <p className={styles.meta}>{meta}</p>}
                    <div className={styles.footer}>
                        {price !== undefined && price !== null ? (
                            <span className="price-sm">
                                {typeof price === "number" ? `€${price.toLocaleString()}` : price}
                            </span>
                        ) : null}
                        <span className={styles.location}>
                            📍 {location}
                        </span>
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
