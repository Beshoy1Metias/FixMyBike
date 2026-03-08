import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import styles from "./dashboard.module.css";
import { getCurrentLanguage } from "@/lib/language";
import ListingCard from "@/components/ListingCard/ListingCard";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

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
        mechanicProfile: "Mechanic Profile",
        viewProfile: "View Profile",
        editProfile: "Edit Profile",
        bikes: "Bikes",
        parts: "Parts",
        wanted: "Wanted Ads",
        conditionLabels: {
            NEW: "New",
            LIKE_NEW: "Like New",
            GOOD: "Good",
            FAIR: "Fair",
            POOR: "Needs repair"
        }
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
        mechanicProfile: "Profilo Meccanico",
        viewProfile: "Vedi Profilo",
        editProfile: "Modifica Profilo",
        bikes: "Bici",
        parts: "Ricambi",
        wanted: "Richieste",
        conditionLabels: {
            NEW: "Nuova",
            LIKE_NEW: "Come nuova",
            GOOD: "Buona",
            FAIR: "Discreta",
            POOR: "Da sistemare"
        }
    },
} as const;

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];

    if (!session?.user?.id) {
        return (
            <div className="section">
                <div className="container">
                    <div className={styles.emptyState}>
                        <p>Please log in to view your dashboard.</p>
                        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const userId = session.user.id;

    // Fetch user data
    const [user, bikes, parts, wanted] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            include: { mechanicProfile: true }
        }),
        prisma.bikeListing.findMany({
            where: { userId, isSold: false },
            include: { photos: { orderBy: { isPrimary: "desc" } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.partListing.findMany({
            where: { userId, isSold: false },
            include: { photos: { orderBy: { isPrimary: "desc" } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.wantedPost.findMany({
            where: { userId, isFulfilled: false },
            orderBy: { createdAt: "desc" }
        })
    ]);

    const hasAnyListings = bikes.length > 0 || parts.length > 0 || wanted.length > 0;

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

                {/* Mechanic Profile Status */}
                {user?.mechanicProfile && (
                    <FadeIn className="card" style={{ marginBottom: "var(--space-8)", borderLeft: "4px solid var(--color-primary)" }}>
                        <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 className="text-heading-3" style={{ marginBottom: "var(--space-1)" }}>{t.mechanicProfile}</h2>
                                <p className="text-sm text-secondary-color">
                                    📍 {user.mechanicProfile.location} · {user.mechanicProfile.isAvailable ? (lang === "it" ? "Disponibile" : "Available") : (lang === "it" ? "Non disponibile" : "Unavailable")}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                <Link href={`/mechanics/${user.mechanicProfile.id}`} className="btn btn-secondary btn-sm">
                                    {t.viewProfile}
                                </Link>
                                <Link href="/mechanics/new" className="btn btn-primary btn-sm">
                                    {t.editProfile}
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                    {!user?.mechanicProfile && (
                        <Link href="/mechanics/new" className={styles.actionCard}>
                            <span className={styles.actionIcon}>🔧</span>
                            <h3>{t.offerMechanic}</h3>
                            <p>{t.offerMechanicBody}</p>
                        </Link>
                    )}
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

                {/* My Listings */}
                <div className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className="text-heading-3">{t.activeListings}</h2>
                    </div>

                    {!hasAnyListings ? (
                        <div className={styles.emptyState}>
                            <p className="empty-state__icon">📝</p>
                            <p>{t.noListings}</p>
                            <Link href="/listings/new" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                                {t.postFirst}
                            </Link>
                        </div>
                    ) : (
                        <StaggerContainer className="grid-4">
                            {/* Bikes */}
                            {bikes.map((bike) => (
                                <FadeIn key={bike.id}>
                                    <ListingCard
                                        href={`/bikes/${bike.id}`}
                                        image={bike.photos[0]?.url}
                                        title={bike.title}
                                        price={bike.price}
                                        location={bike.location}
                                        badge={t.bikes}
                                        badgeVariant="primary"
                                        condition={t.conditionLabels[bike.condition as keyof typeof t.conditionLabels]}
                                    />
                                </FadeIn>
                            ))}

                            {/* Parts */}
                            {parts.map((part) => (
                                <FadeIn key={part.id}>
                                    <ListingCard
                                        href={`/parts/${part.id}`}
                                        image={part.photos[0]?.url}
                                        title={part.title}
                                        price={part.price}
                                        location={part.location}
                                        badge={t.parts}
                                        badgeVariant="accent"
                                        condition={t.conditionLabels[part.condition as keyof typeof t.conditionLabels]}
                                    />
                                </FadeIn>
                            ))}

                            {/* Wanted Ads */}
                            {wanted.map((post) => (
                                <FadeIn key={post.id}>
                                    <ListingCard
                                        href={`/wanted/${post.id}`}
                                        title={post.title}
                                        price={post.maxBudget ? `${lang === "it" ? "Fino a" : "Up to"} €${post.maxBudget}` : null}
                                        location={post.location}
                                        badge={t.wanted}
                                        badgeVariant="gray"
                                    />
                                </FadeIn>
                            ))}
                        </StaggerContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
