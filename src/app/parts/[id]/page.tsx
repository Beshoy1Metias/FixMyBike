import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";
import { getCurrentLanguage } from "@/lib/language";
import BuyNowButton from "@/components/BuyNowButton/BuyNowButton";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const part = await prisma.partListing.findUnique({
        where: { id },
        select: { title: true, description: true, photos: { take: 1 } },
    });

    if (!part) return { title: "Not Found" };

    const primaryPhoto = part.photos[0]?.url;

    return {
        title: `${part.title} | FixMyBike`,
        description: part.description,
        openGraph: {
            title: part.title,
            description: part.description,
            images: primaryPhoto ? [{ url: primaryPhoto }] : [],
        },
    };
}

export default async function PartDetailsPage({ params }: Props) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const session = await getServerSession(authOptions);

    const part = await prisma.partListing.findUnique({
        where: { id },
        include: {
            photos: true,
            user: {
                select: { id: true, name: true, image: true, email: true },
            },
        },
    });

    if (!part) {
        notFound();
    }

    const t = {
        en: {
            condition: "Condition",
            brand: "Brand",
            category: "Category",
            location: "Location",
            posted: "Posted on",
            contact: "Contact Seller",
            messageLead: "Message this seller directly inside FixMyBike.",
            details: "Details",
            sold: "SOLD",
            buyNow: "Buy Now"
        },
        it: {
            condition: "Condizione",
            brand: "Marca",
            category: "Categoria",
            location: "Località",
            posted: "Pubblicato il",
            contact: "Contatta il venditore",
            messageLead: "Scrivi al venditore direttamente su FixMyBike.",
            details: "Dettagli",
            sold: "VENDUTA",
            buyNow: "Acquista ora"
        }
    }[lang];

    const isOwner = session?.user?.id === part.user.id;

    return (
        <div className="section">
            <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-10)" }}>
                    {/* Left: Photos */}
                    <div>
                        <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "16/10", background: "var(--surface-2)", marginBottom: "var(--space-4)" }}>
                            {part.photos.length > 0 ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={part.photos.find(p => p.isPrimary)?.url || part.photos[0].url}
                                    alt={part.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
                                    No Image
                                </div>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
                            {part.photos.map((photo) => (
                                <div key={photo.id} style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "1/1", background: "var(--surface-2)" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.url}
                                        alt={part.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h1 className="text-heading-1">{part.title}</h1>
                                {part.isSold && <span className="badge badge-error">{t.sold}</span>}
                            </div>
                            <div className="price-lg" style={{ marginTop: "var(--space-2)" }}>€{part.price.toLocaleString()}</div>
                        </div>

                        <div className="card">
                            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                                    <div
                                        className="avatar avatar-md"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            background: part.user.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                            overflow: "hidden",
                                            color: "white"
                                        }}
                                    >
                                        {part.user.image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img 
                                                src={part.user.image} 
                                                alt={part.user.name || "User"} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                            />
                                        ) : (
                                            part.user.name?.charAt(0).toUpperCase() ?? "U"
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-body">{part.user.name || "FixMyBike user"}</div>
                                        <div className="text-sm text-secondary-color">📍 {part.location}</div>
                                    </div>
                                </div>

                                {!isOwner && !part.isSold && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                                        <BuyNowButton 
                                            listingId={part.id} 
                                            listingType="part" 
                                            price={part.price} 
                                            isSold={part.isSold} 
                                        />
                                        <p className="text-xs text-center text-muted">{t.messageLead}</p>
                                        <MessageInAppButton receiverId={part.user.id} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            <h3 className="text-heading-3">{t.details}</h3>
                            <p style={{ whiteSpace: "pre-wrap" }}>{part.description}</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.condition}:</span> <strong>{part.condition}</strong>
                                </div>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.category}:</span> <strong>{part.category}</strong>
                                </div>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.brand}:</span> <strong>{part.brand}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
