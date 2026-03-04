import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ContactSellerForm from "@/components/ContactSellerForm/ContactSellerForm";

interface MechanicDetailPageProps {
    params: { id: string };
}

const SKILL_BADGE: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
    PROFESSIONAL: "Pro",
};

export default async function MechanicDetailPage({ params }: MechanicDetailPageProps) {
    const mech = await prisma.mechanicProfile.findUnique({
        where: { id: params.id },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
    });

    if (!mech) {
        notFound();
    }

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">🔧 Mechanic Profile</span>
                        <h1 className="text-heading-1">{mech.user.name || "Mechanic"}</h1>
                        <p className="text-body-lg" style={{ maxWidth: 640 }}>
                            {mech.bio}
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                        <div
                            className="avatar avatar-lg"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "1.8rem",
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                            }}
                        >
                            {mech.user.name?.charAt(0).toUpperCase() ?? "M"}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                            <div className="text-body">{mech.user.name || "FixMyBike mechanic"}</div>
                            <div className="text-sm text-secondary-color">📍 {mech.location}</div>
                            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                                <span className="badge badge-primary">{SKILL_BADGE[mech.skillLevel]}</span>
                                {!mech.isAvailable && <span className="badge badge-gray">Currently unavailable</span>}
                            </div>
                        </div>
                    </div>

                    {mech.skills && (
                        <div>
                            <h2 className="text-heading-3" style={{ marginBottom: "var(--space-3)" }}>
                                Skills
                            </h2>
                            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                                {mech.skills.split(",").map((s) => (
                                    <span key={s.trim()} className="badge badge-gray">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {mech.hourlyRate && (
                                <div className="text-sm text-secondary-color">
                                    Hourly Rate: <strong>€{mech.hourlyRate.toLocaleString()}</strong>
                                </div>
                            )}
                            {mech.phoneNumber && (
                                <div className="text-sm text-secondary-color">
                                    Phone: <strong>{mech.phoneNumber}</strong>
                                </div>
                            )}
                            <div className="text-sm text-secondary-color">
                                Status:{" "}
                                <strong>{mech.isAvailable ? "Available for work" : "Not available"}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <ContactSellerForm
                            toUserId={mech.user.id}
                            listing={{ type: "mechanic", profileId: mech.id }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

