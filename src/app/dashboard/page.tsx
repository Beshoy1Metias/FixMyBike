import type { Metadata } from "next";
import Link from "next/link";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage your FixMyBike listings, mechanic profile, and account settings.",
};

export default function DashboardPage() {
    return (
        <div className="section">
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <span className="page-header__eyebrow">My Account</span>
                        <h1 className="text-heading-1">Dashboard</h1>
                        <p className="text-body-lg">Manage your listings, profile, and activity.</p>
                    </div>
                    <Link href="/listings/new" className="btn btn-primary">
                        + Post a Listing
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <Link href="/mechanics/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🔧</span>
                        <h3>Offer Mechanic Services</h3>
                        <p>Create or update your mechanic profile to receive job requests.</p>
                    </Link>
                    <Link href="/parts/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⚙️</span>
                        <h3>Sell a Part</h3>
                        <p>List a bike part or accessory for sale.</p>
                    </Link>
                    <Link href="/bikes/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🚲</span>
                        <h3>Sell a Bike</h3>
                        <p>Post a complete bike for sale.</p>
                    </Link>
                    <Link href="/wanted/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🔍</span>
                        <h3>Post a Wanted Ad</h3>
                        <p>Tell sellers what bike you&apos;re looking for and your budget.</p>
                    </Link>
                </div>

                {/* My Listings Preview */}
                <div className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className="text-heading-3">My Active Listings</h2>
                    </div>
                    <div className={styles.emptyState}>
                        <p className="empty-state__icon">📝</p>
                        <p>You have no active listings yet.</p>
                        <Link href="/listings/new" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            Post Your First Listing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
