import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ListingCard from "@/components/ListingCard/ListingCard";
import ContactSellerForm from "@/components/ContactSellerForm/ContactSellerForm";

interface PartDetailPageProps {
    params: { id: string };
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
    const part = await prisma.partListing.findUnique({
        where: { id: params.id },
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

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">⚙️ Part Listing</span>
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
                            Seller
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
                            <div className="price">€{part.price.toLocaleString()}</div>
                            <div className="text-sm text-secondary-color">
                                Condition: <strong>{part.condition}</strong>
                            </div>
                            <div className="text-sm text-secondary-color">
                                Category: <strong>{part.category}</strong>
                            </div>
                            {part.brand && (
                                <div className="text-sm text-secondary-color">
                                    Brand: <strong>{part.brand}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <ContactSellerForm
                            toUserId={part.user.id}
                            listing={{ type: "part", listingId: part.id }}
                        />
                    </div>

                    {/* Simple suggestion: show other recent parts */}
                    <div>
                        {/* This is a lightweight server-side recommendation using the same component styling */}
                        {/* In a fuller implementation we might query related items here. */}
                    </div>
                </div>
            </div>
        </div>
    );
}

