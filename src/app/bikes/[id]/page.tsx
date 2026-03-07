import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ContactSellerForm from "@/components/ContactSellerForm/ContactSellerForm";
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

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">🚲 Bike Listing</span>
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
                            {lang === "it" ? "Venditore" : "Seller"}
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
                            <div className="price">€{bike.price.toLocaleString()}</div>
                            <div className="text-sm text-secondary-color">
                                Condition: <strong>{bike.condition}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                Type: <strong>{bike.bikeType}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                Frame Size: <strong>{bike.frameSize}</strong>
                            </div>
                            {bike.year && (
                                <div className="text-sm text-secondary-color">
                                    Year: <strong>{bike.year}</strong>
                                </div>
                            )}
                            {bike.brand && (
                                <div className="text-sm text-secondary-color">
                                    Brand: <strong>{bike.brand}</strong>
                                </div>
                            )}
                            {bike.model && (
                                <div className="text-sm text-secondary-color">
                                    Model: <strong>{bike.model}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <ContactSellerForm
                            toUserId={bike.user.id}
                            listing={{ type: "bike", listingId: bike.id }}
                        />
                    </div>

                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <div className="text-sm text-secondary-color">
                                {lang === "it"
                                    ? "Preferisci scrivere direttamente su FixMyBike?"
                                    : "Prefer to chat directly on FixMyBike?"}
                            </div>
                            <MessageInAppButton receiverId={bike.user.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

