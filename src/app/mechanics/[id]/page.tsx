import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";
import { getCurrentLanguage } from "@/lib/language";
import ReviewSection from "@/components/ReviewSystem/ReviewSection";

interface MechanicDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MechanicDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const mech = await prisma.mechanicProfile.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!mech) return { title: "Mechanic Not Found" };

    return {
        title: `${mech.user.name || "Mechanic Profile"} - Fix My Bike`,
        description: mech.skills ? `Mechanic specializing in ${mech.skills}` : "Expert bike mechanic services",
        openGraph: {
            title: `${mech.user.name || "Mechanic"} | ${mech.location}`,
            description: mech.skills ? `Specialties: ${mech.skills}` : "Need bike repairs? View this mechanic profile.",
        },
    };
}

const SKILL_BADGE: Record<string, { en: string; it: string }> = {
    BEGINNER: { en: "Beginner", it: "Principiante" },
    INTERMEDIATE: { en: "Intermediate", it: "Intermedio" },
    EXPERT: { en: "Expert", it: "Esperto" },
    PROFESSIONAL: { en: "Pro", it: "Professionista" },
};

export default async function MechanicDetailPage({ params }: MechanicDetailPageProps) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const mech = await prisma.mechanicProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    if (!mech) {
        notFound();
    }

    const t = {
        en: {
            eyebrow: "🔧 Mechanic Profile",
            skills: "Skills",
            hourlyRate: "Hourly Rate",
            phone: "Phone",
            status: "Status",
            available: "Available for work",
            notAvailable: "Not available",
            messageLead: "Message this mechanic directly inside FixMyBike."
        },
        it: {
            eyebrow: "🔧 Profilo Meccanico",
            skills: "Competenze",
            hourlyRate: "Tariffa Oraria",
            phone: "Telefono",
            status: "Stato",
            available: "Disponibile per lavori",
            notAvailable: "Non disponibile",
            messageLead: "Scrivi al meccanico direttamente su FixMyBike."
        }
    }[lang];

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
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
                                background: mech.user.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                overflow: "hidden",
                                color: "white"
                            }}
                        >
                            {mech.user.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img 
                                    src={mech.user.image} 
                                    alt={mech.user.name || "User"} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                            ) : (
                                mech.user.name?.charAt(0).toUpperCase() ?? "M"
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                            <div className="text-body">{mech.user.name || "FixMyBike mechanic"}</div>
                            <div className="text-sm text-secondary-color">📍 {mech.location}</div>
                            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                                <span className="badge badge-primary">{SKILL_BADGE[mech.skillLevel][lang]}</span>
                                {!mech.isAvailable && (
                                    <span className="badge badge-gray">
                                        {lang === "it" ? "Al momento non disponibile" : "Currently unavailable"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {mech.skills && (
                        <div>
                            <h2 className="text-heading-3" style={{ marginBottom: "var(--space-3)" }}>
                                {t.skills}
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

                    <ReviewSection 
                        targetId={mech.user.id} 
                        mechanicId={mech.id} 
                        lang={lang as "en" | "it"} 
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {mech.hourlyRate && (
                                <div className="text-sm text-secondary-color">
                                    {t.hourlyRate}: <strong>€{mech.hourlyRate.toLocaleString()}</strong>
                                </div>
                            )}
                            {mech.phoneNumber && (
                                <div className="text-sm text-secondary-color">
                                    {t.phone}: <strong>{mech.phoneNumber}</strong>
                                </div>
                            )}
                            <div className="text-sm text-secondary-color">
                                {t.status}:{" "}
                                <strong>
                                    {mech.isAvailable ? t.available : t.notAvailable}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <div className="text-sm text-secondary-color">
                                {t.messageLead}
                            </div>
                            <MessageInAppButton receiverId={mech.user.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
