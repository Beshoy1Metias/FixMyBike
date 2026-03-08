import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";
import { getCurrentLanguage } from "@/lib/language";

interface BikeDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BikeDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const bike = await prisma.bikeListing.findUnique({
        where: { id },
        include: { photos: { orderBy: { isPrimary: "desc" } } }
    });

    if (!bike) return { title: "Bike Not Found" };

    const primaryPhoto = bike.photos[0]?.url;

    return {
        title: `${bike.title} - Fix My Bike`,
        description: bike.description.substring(0, 160),
        openGraph: {
            title: `${bike.title} | €${bike.price}`,
            description: bike.description.substring(0, 160),
            images: primaryPhoto ? [{ url: primaryPhoto }] : [],
        },
    };
}

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const session = await getServerSession(authOptions);
    const bike = await prisma.bikeListing.findUnique({
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

    if (!bike) {
        notFound();
    }

    const primaryPhoto = bike.photos[0]?.url ?? null;
    const isSeller = session?.user?.id === bike.user.id;

    const t = {
        en: {
            eyebrow: "🚲 Bike Listing",
            seller: "Seller",
            isSeller: "You are the seller of this item.",
            loginToMessage: "Please login to message the seller.",
            condition: "Condition",
            type: "Type",
            frameSize: "Frame Size",
            year: "Year",
            brand: "Brand",
            model: "Model",
            conditionLabels: {
                NEW: "New",
                LIKE_NEW: "Like New",
                GOOD: "Good",
                FAIR: "Fair",
                POOR: "Needs repair"
            }
        },
        it: {
            eyebrow: "🚲 Annuncio Bici",
            seller: "Venditore",
            isSeller: "Sei tu il venditore di questo articolo.",
            loginToMessage: "Accedi per messaggiare il venditore.",
            condition: "Condizione",
            type: "Tipo",
            frameSize: "Taglia Telaio",
            year: "Anno",
            brand: "Marca",
            model: "Modello",
            conditionLabels: {
                NEW: "Nuova",
                LIKE_NEW: "Come nuova",
                GOOD: "Buona",
                FAIR: "Discreta",
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
                        <h1 className="text-heading-1">{bike.title}</h1>
                        <p className="text-body-lg" style={{ maxWidth: 640 }}>
                            {bike.description}
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
                                alt={bike.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    {bike.photos.length > 1 && (
                        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                            {bike.photos.slice(1).map((photo) => (
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
                                        alt={bike.title}
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
                                {bike.user.name?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                            <div>
                                <div className="text-body">{bike.user.name || "FixMyBike user"}</div>
                                <div className="text-sm text-secondary-color">📍 {bike.location}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <div className="price" style={{ marginBottom: "var(--space-2)" }}>€{bike.price.toLocaleString()}</div>
                            
                            {!isSeller && (
                                <MessageInAppButton receiverId={bike.user.id} />
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
                                {t.condition}: <strong>{t.conditionLabels[bike.condition as keyof typeof t.conditionLabels] || bike.condition}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                {t.type}: <strong>{bike.bikeType}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                {t.frameSize}: <strong>{bike.frameSize}</strong>
                            </div>
                            {bike.year && (
                                <div className="text-sm text-secondary-color">
                                    {t.year}: <strong>{bike.year}</strong>
                                </div>
                            )}
                            {bike.brand && (
                                <div className="text-sm text-secondary-color">
                                    {t.brand}: <strong>{bike.brand}</strong>
                                </div>
                            )}
                            {bike.model && (
                                <div className="text-sm text-secondary-color">
                                    {t.model}: <strong>{bike.model}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
