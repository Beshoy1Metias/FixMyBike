import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import styles from "./dashboard.module.css";
import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";
import DashboardClient from "./DashboardClient";
import MechanicStatusBtn from "./MechanicStatusBtn";

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
        loginPrompt: "Please log in to view your dashboard.",
        loginBtn: "Log In",
        offerMechanic: "Offer Mechanic Services",
        offerMechanicBody: "Create or update your mechanic profile to receive job requests.",
        sellPart: "Sell a Part",
        sellPartBody: "List a bike part or accessory for sale.",
        sellBike: "Sell a Bike",
        sellBikeBody: "Post a complete bike for sale.",
        postWanted: "Post a Wanted Ad",
        postWantedBody: "Tell sellers what bike you're looking for and your budget.",
        mechanicProfile: "Mechanic Profile",
        viewProfile: "View Profile",
        editProfile: "Edit Profile",
        available: "Available",
        unavailable: "Unavailable",
        markAvailable: "Mark as Available",
        markUnavailable: "Mark as Busy",
    },
    it: {
        eyebrow: "Il mio account",
        title: "Dashboard",
        lead: "Gestisci i tuoi annunci, il profilo meccanico e l'attività.",
        postListing: "+ Pubblica un annuncio",
        loginPrompt: "Accedi per visualizzare la tua dashboard.",
        loginBtn: "Accedi",
        offerMechanic: "Offri servizi di meccanico",
        offerMechanicBody: "Crea o aggiorna il tuo profilo meccanico per ricevere richieste di lavoro.",
        sellPart: "Vendi un ricambio",
        sellPartBody: "Metti in vendita un componente o un accessorio per bici.",
        sellBike: "Vendi una bici",
        sellBikeBody: "Pubblica un annuncio per una bici completa.",
        postWanted: "Pubblica una richiesta",
        postWantedBody: "Spiega che bici stai cercando e qual è il tuo budget.",
        mechanicProfile: "Profilo Meccanico",
        viewProfile: "Vedi Profilo",
        editProfile: "Modifica Profilo",
        available: "Disponibile",
        unavailable: "Non disponibile",
        markAvailable: "Segna come Disponibile",
        markUnavailable: "Segna come Occupato",
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
                        <p>{t.loginPrompt}</p>
                        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                            {t.loginBtn}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const userId = session.user.id;

    // Fetch user data (all listings, not just active ones)
    const [user, bikes, parts, wanted] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            include: { mechanicProfile: true }
        }),
        prisma.bikeListing.findMany({
            where: { userId },
            include: { photos: { orderBy: { isPrimary: "desc" } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.partListing.findMany({
            where: { userId },
            include: { photos: { orderBy: { isPrimary: "desc" } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.wantedPost.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        })
    ]);

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
                        <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                            <div>
                                <h2 className="text-heading-3" style={{ marginBottom: "var(--space-1)" }}>{t.mechanicProfile}</h2>
                                <p className="text-sm text-secondary-color">
                                    📍 {user.mechanicProfile.location} · <span style={{ color: user.mechanicProfile.isAvailable ? "var(--color-success)" : "var(--color-error)", fontWeight: 600 }}>
                                        {user.mechanicProfile.isAvailable ? t.available : t.unavailable}
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
                                <MechanicStatusBtn
                                    id={user.mechanicProfile.id}
                                    isAvailable={user.mechanicProfile.isAvailable}
                                    labelAvailable={t.markAvailable}
                                    labelBusy={t.markUnavailable}
                                />
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

                <DashboardClient
                    bikes={bikes}
                    parts={parts}
                    wanted={wanted}
                    lang={lang}
                />
            </div>
        </div>
    );
}
