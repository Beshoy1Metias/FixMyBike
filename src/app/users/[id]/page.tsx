import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ListingCard from "@/components/ListingCard/ListingCard";
import ReviewSection from "@/components/ReviewSystem/ReviewSection";
import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

interface UserProfilePageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        select: { name: true }
    });

    if (!user) return { title: "User Not Found" };

    return {
        title: `${user.name || "User Profile"} - FixMyBike`,
        description: `View ${user.name}'s listings and reviews on FixMyBike.`,
    };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { id } = await params;
    const lang = await getCurrentLanguage();

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            bikeListings: {
                where: { isSold: false },
                include: { photos: { take: 1 } },
                orderBy: { createdAt: "desc" }
            },
            partsListings: {
                where: { isSold: false },
                include: { photos: { take: 1 } },
                orderBy: { createdAt: "desc" }
            },
            mechanicProfile: true
        },
    });

    if (!user) {
        notFound();
    }

    const t = {
        en: {
            listings: "Active Listings",
            noListings: "No active listings.",
            memberSince: "Member since",
            bikes: "Bikes",
            parts: "Parts",
            mechanic: "Mechanic Profile"
        },
        it: {
            listings: "Annunci Attivi",
            noListings: "Nessun annuncio attivo.",
            memberSince: "Membro dal",
            bikes: "Bici",
            parts: "Ricambi",
            mechanic: "Profilo Meccanico"
        }
    }[lang];

    return (
        <div className="section">
            <div className="container">
                <div className="grid-details">
                    {/* Left: User Info & Reviews */}
                    <div>
                        <FadeIn>
                            <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
                                <div 
                                    className="avatar avatar-xl"
                                    style={{ 
                                        margin: "0 auto var(--space-4)",
                                        background: user.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "3rem",
                                        fontWeight: 700,
                                        color: "white",
                                        overflow: "hidden"
                                    }}
                                >
                                    {user.image ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={user.image} alt={user.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || "U"
                                    )}
                                </div>
                                <h1 className="text-heading-2">{user.name || "User Profile"}</h1>
                                <p className="text-sm text-secondary-color">
                                    {t.memberSince} {new Date(user.createdAt).toLocaleDateString(lang === "it" ? "it-IT" : "en-US")}
                                </p>
                                
                                {user.mechanicProfile && (
                                    <div style={{ marginTop: "var(--space-4)" }}>
                                        <a href={`/mechanics/${user.mechanicProfile.id}`} className="btn btn-secondary btn-sm">
                                            🔧 {t.mechanic}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <ReviewSection targetId={user.id} lang={lang} />
                        </FadeIn>
                    </div>

                    {/* Right: Listings */}
                    <div>
                        <h2 className="text-heading-3" style={{ marginBottom: "var(--space-6)" }}>{t.listings}</h2>
                        
                        {(user.bikeListings.length === 0 && user.partsListings.length === 0) ? (
                            <p className="text-muted">{t.noListings}</p>
                        ) : (
                            <StaggerContainer className="grid-2">
                                {user.bikeListings.map((bike) => (
                                    <FadeIn key={bike.id}>
                                        <ListingCard 
                                            href={`/bikes/${bike.id}`}
                                            image={bike.photos[0]?.url}
                                            title={bike.title}
                                            price={bike.price}
                                            location={bike.location}
                                            badge={t.bikes}
                                            badgeVariant="primary"
                                        />
                                    </FadeIn>
                                ))}
                                {user.partsListings.map((part) => (
                                    <FadeIn key={part.id}>
                                        <ListingCard 
                                            href={`/parts/${part.id}`}
                                            image={part.photos[0]?.url}
                                            title={part.title}
                                            price={part.price}
                                            location={part.location}
                                            badge={t.parts}
                                            badgeVariant="accent"
                                        />
                                    </FadeIn>
                                ))}
                            </StaggerContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
