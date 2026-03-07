import type { Metadata } from "next";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage your FixMyBike listings, mechanic profile, and account settings.",
};

const TEXT = {
    en: {
        eyebrow: "My Account",
        title: "Dashboard",
        lead: "Manage your listings, profile, and activity.",
        postListing: "+ Post a Listing",
        offerMechanic: "Offer Mechanic Services",
        offerMechanicBody: "Create or update your mechanic profile to receive job requests.",
        sellPart: "Sell a Part",
        sellPartBody: "List a bike part or accessory for sale.",
        sellBike: "Sell a Bike",
        sellBikeBody: "Post a complete bike for sale.",
        postWanted: "Post a Wanted Ad",
        postWantedBody: "Tell sellers what bike you're looking for and your budget.",
        activeListings: "My Active Listings",
        noListings: "You have no active listings yet.",
        postFirst: "Post Your First Listing",
    },
    it: {
        eyebrow: "Il mio account",
        title: "Dashboard",
        lead: "Gestisci i tuoi annunci, il profilo meccanico e l'attività.",
        postListing: "+ Pubblica un annuncio",
        offerMechanic: "Offri servizi di meccanico",
        offerMechanicBody: "Crea o aggiorna il tuo profilo meccanico per ricevere richieste di lavoro.",
        sellPart: "Vendi un ricambio",
        sellPartBody: "Metti in vendita un componente o un accessorio per bici.",
        sellBike: "Vendi una bici",
        sellBikeBody: "Pubblica un annuncio per una bici completa.",
        postWanted: "Pubblica una richiesta",
        postWantedBody: "Spiega che bici stai cercando e qual è il tuo budget.",
        activeListings: "I miei annunci attivi",
        noListings: "Non hai ancora annunci attivi.",
        postFirst: "Pubblica il tuo primo annuncio",
    },
} as const;

export default async function DashboardPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];
    return (
        <div className="section">
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{t.title}</h1>
                        <p className="text-body-lg">{t.lead}</p>
                    </div>
                    <Link href="/listings/new" className="btn btn-primary">
                        {t.postListing}
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    <Link href="/mechanics/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🔧</span>
                        <h3>{t.offerMechanic}</h3>
                        <p>{t.offerMechanicBody}</p>
                    </Link>
                    <Link href="/parts/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>⚙️</span>
                        <h3>{t.sellPart}</h3>
                        <p>{t.sellPartBody}</p>
                    </Link>
                    <Link href="/bikes/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🚲</span>
                        <h3>{t.sellBike}</h3>
                        <p>{t.sellBikeBody}</p>
                    </Link>
                    <Link href="/wanted/new" className={styles.actionCard}>
                        <span className={styles.actionIcon}>🔍</span>
                        <h3>{t.postWanted}</h3>
                        <p>{t.postWantedBody}</p>
                    </Link>
                </div>

                {/* My Listings Preview */}
                <div className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className="text-heading-3">{t.activeListings}</h2>
                    </div>
                    <div className={styles.emptyState}>
                        <p className="empty-state__icon">📝</p>
                        <p>{t.noListings}</p>
                        <Link href="/listings/new" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            {t.postFirst}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
