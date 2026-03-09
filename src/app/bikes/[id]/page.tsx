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
    const bike = await prisma.bikeListing.findUnique({
        where: { id },
        select: { title: true, description: true, photos: { take: 1 } },
    });

    if (!bike) return { title: "Not Found" };

    const primaryPhoto = bike.photos[0]?.url;

    return {
        title: `${bike.title} | FixMyBike`,
        description: bike.description,
        openGraph: {
            title: bike.title,
            description: bike.description,
            images: primaryPhoto ? [{ url: primaryPhoto }] : [],
        },
    };
}

export default async function BikeDetailsPage({ params }: Props) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const session = await getServerSession(authOptions);

    const bike = await prisma.bikeListing.findUnique({
        where: { id },
        include: {
            photos: true,
            user: {
                select: { id: true, name: true, image: true, email: true },
            },
        },
    });

    if (!bike) {
        notFound();
    }

    const t = {
        en: {
            condition: "Condition",
            brand: "Brand",
            model: "Model",
            year: "Year",
            type: "Type",
            frame: "Frame Size",
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
            model: "Modello",
            year: "Anno",
            type: "Tipo",
            frame: "Taglia Telaio",
            location: "Località",
            posted: "Pubblicato il",
            contact: "Contatta il venditore",
            messageLead: "Scrivi al venditore direttamente su FixMyBike.",
            details: "Dettagli",
            sold: "VENDUTA",
            buyNow: "Acquista ora"
        }
    }[lang];

    const isOwner = session?.user?.id === bike.user.id;

    return (
        <div className="section">
            <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-10)" }}>
                    {/* Left: Photos */}
                    <div>
                        <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "16/10", background: "var(--surface-2)", marginBottom: "var(--space-4)" }}>
                            {bike.photos.length > 0 ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={bike.photos.find(p => p.isPrimary)?.url || bike.photos[0].url}
                                    alt={bike.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
                                    No Image
                                </div>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
                            {bike.photos.map((photo) => (
                                <div key={photo.id} style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "1/1", background: "var(--surface-2)" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.url}
                                        alt={bike.title}
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
                                <h1 className="text-heading-1">{bike.title}</h1>
                                {bike.isSold && <span className="badge badge-error">{t.sold}</span>}
                            </div>
                            <div className="price-lg" style={{ marginTop: "var(--space-2)" }}>€{bike.price.toLocaleString()}</div>
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
                                            background: bike.user.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                            overflow: "hidden",
                                            color: "white"
                                        }}
                                    >
                                        {bike.user.image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img 
                                                src={bike.user.image} 
                                                alt={bike.user.name || "User"} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                            />
                                        ) : (
                                            bike.user.name?.charAt(0).toUpperCase() ?? "U"
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-body">{bike.user.name || "FixMyBike user"}</div>
                                        <div className="text-sm text-secondary-color">📍 {bike.location}</div>
                                    </div>
                                </div>

                                {!isOwner && !bike.isSold && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                                        <BuyNowButton 
                                            listingId={bike.id} 
                                            listingType="bike" 
                                            price={bike.price} 
                                            isSold={bike.isSold} 
                                        />
                                        <p className="text-xs text-center text-muted">{t.messageLead}</p>
                                        <MessageInAppButton receiverId={bike.user.id} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            <h3 className="text-heading-3">{t.details}</h3>
                            <p style={{ whiteSpace: "pre-wrap" }}>{bike.description}</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.condition}:</span> <strong>{bike.condition}</strong>
                                </div>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.type}:</span> <strong>{bike.bikeType}</strong>
                                </div>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.frame}:</span> <strong>{bike.frameSize}</strong>
                                </div>
                                <div className="text-sm">
                                    <span className="text-secondary-color">{t.brand}:</span> <strong>{bike.brand}</strong>
                                </div>
                                {bike.model && (
                                    <div className="text-sm">
                                        <span className="text-secondary-color">{t.model}:</span> <strong>{bike.model}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
