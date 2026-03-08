import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";
import { getCurrentLanguage } from "@/lib/language";

interface PartDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PartDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const part = await prisma.partListing.findUnique({
        where: { id },
        include: { photos: { orderBy: { isPrimary: "desc" } } }
    });

    if (!part) return { title: "Part Not Found" };

    const primaryPhoto = part.photos[0]?.url;

    return {
        title: `${part.title} - Fix My Bike`,
        description: part.description.substring(0, 160),
        openGraph: {
            title: `${part.title} | €${part.price}`,
            description: part.description.substring(0, 160),
            images: primaryPhoto ? [{ url: primaryPhoto }] : [],
        },
    };
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const session = await getServerSession(authOptions);
    const part = await prisma.partListing.findUnique({
        where: { id },
        include: {
            photos: {
                orderBy: { isPrimary: "desc" },
            },
            user: {
                select: { id: true, name: true, image: true, email: true },
            },
        },
    });

    if (!part) {
        notFound();
    }

    const primaryPhoto = part.photos[0]?.url ?? null;
    const isSeller = session?.user?.id === part.user.id;

    const t = {
        en: {
            eyebrow: "⚙️ Part Listing",
            seller: "Seller",
            isSeller: "You are the seller of this item.",
            loginToMessage: "Please login to message the seller.",
            condition: "Condition",
            category: "Category",
            brand: "Brand",
            conditionLabels: {
                NEW: "New",
                LIKE_NEW: "Like New",
                GOOD: "Good",
                FAIR: "Fair",
                POOR: "Needs repair"
            }
        },
        it: {
            eyebrow: "⚙️ Annuncio Ricambio",
            seller: "Venditore",
            isSeller: "Sei tu il venditore di questo articolo.",
            loginToMessage: "Accedi per messaggiare il venditore.",
            condition: "Condizione",
            category: "Categoria",
            brand: "Marca",
            conditionLabels: {
                NEW: "Nuovo",
                LIKE_NEW: "Come nuovo",
                GOOD: "Buono",
                FAIR: "Discreto",
                POOR: "Da sistemare"
            }
        }
    }[lang];

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{part.title}</h1>
                        <p className="text-body-lg" style={{ maxWidth: 640 }}>
                            {part.description}
                        </p>
                    </div>

                    {primaryPhoto && (
                        <div
                            style={{
                                borderRadius: "var(--radius-xl)",
                                overflow: "hidden",
                                border: "1px solid var(--border)",
                                maxHeight: 480,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={primaryPhoto}
                                alt={part.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    {part.photos.length > 1 && (
                        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                            {part.photos.slice(1).map((photo) => (
                                <div
                                    key={photo.id}
                                    style={{
                                        width: 96,
                                        height: 96,
                                        borderRadius: "var(--radius)",
                                        overflow: "hidden",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.url}
                                        alt={part.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <h2 className="text-heading-3" style={{ marginBottom: "var(--space-3)" }}>
                            {t.seller}
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                            <div
                                className="avatar avatar-md"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                }}
                            >
                                {part.user.name?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                            <div>
                                <div className="text-body">{part.user.name || "FixMyBike user"}</div>
                                <div className="text-sm text-secondary-color">📍 {part.location}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <div className="price" style={{ marginBottom: "var(--space-2)" }}>€{part.price.toLocaleString()}</div>
                            
                            {!isSeller && (
                                <MessageInAppButton receiverId={part.user.id} />
                            )}
                            {isSeller && (
                                <div className="text-sm text-secondary-color text-center">
                                    {t.isSeller}
                                </div>
                            )}

                            {!session && (
                                <div className="text-xs text-secondary-color text-center">
                                    {lang === "it" ? (
                                        <>Per favore <a href="/auth/login" style={{ color: "var(--color-primary)" }}>accedi</a> per messaggiare il venditore.</>
                                    ) : (
                                        <>Please <a href="/auth/login" style={{ color: "var(--color-primary)" }}>login</a> to message the seller.</>
                                    )}
                                </div>
                            )}

                            <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "var(--space-2) 0" }} />

                            <div className="text-sm text-secondary-color">
                                {t.condition}: <strong>{t.conditionLabels[part.condition as keyof typeof t.conditionLabels] || part.condition}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                {t.category}: <strong>{part.category}</strong>
                            </div>
                            {part.brand && (
                                <div className="text-sm text-secondary-color">
                                    {t.brand}: <strong>{part.brand}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
