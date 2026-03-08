import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";
import { getCurrentLanguage } from "@/lib/language";

interface WantedDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WantedDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await prisma.wantedPost.findUnique({ where: { id } });

    if (!post) return { title: "Wanted Post Not Found" };

    return {
        title: `Wanted: ${post.title} - Fix My Bike`,
        description: post.description.substring(0, 160),
        openGraph: {
            title: `Wanted: ${post.title}`,
            description: post.description.substring(0, 160),
        },
    };
}

export default async function WantedDetailPage({ params }: WantedDetailPageProps) {
    const { id } = await params;
    const lang = await getCurrentLanguage();
    const post = await prisma.wantedPost.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
    });

    if (!post) {
        notFound();
    }

    const t = {
        en: {
            eyebrow: "🔍 Wanted Bike",
            buyer: "Buyer",
            maxBudget: "Max Budget",
            bikeType: "Bike Type",
            frameSize: "Frame Size",
            messageLead: "If you have a matching bike, message the buyer directly in app."
        },
        it: {
            eyebrow: "🔍 Cerco Bici",
            buyer: "Acquirente",
            maxBudget: "Budget Massimo",
            bikeType: "Tipo di Bici",
            frameSize: "Taglia Telaio",
            messageLead: "Se pensi di avere la bici giusta, scrivi all'acquirente direttamente in app."
        }
    }[lang];

    return (
        <div className="section">
            <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                    <div className="page-header" style={{ textAlign: "left", paddingTop: 0, paddingBottom: 0 }}>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{post.title}</h1>
                        <p className="text-body-lg" style={{ maxWidth: 640 }}>
                            {post.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-heading-3" style={{ marginBottom: "var(--space-3)" }}>
                            {t.buyer}
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
                                {post.user.name?.charAt(0).toUpperCase() ?? "B"}
                            </div>
                            <div>
                                <div className="text-body">{post.user.name || "FixMyBike buyer"}</div>
                                <div className="text-sm text-secondary-color">📍 {post.location}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {post.maxBudget && (
                                <div className="text-sm text-secondary-color">
                                    {t.maxBudget}: <strong>€{post.maxBudget.toLocaleString()}</strong>
                                </div>
                            )}
                            {post.bikeType && (
                                <div className="text-sm text-secondary-color">
                                    {t.bikeType}: <strong>{post.bikeType}</strong>
                                </div>
                            )}
                            {post.frameSize && (
                                <div className="text-sm text-secondary-color">
                                    {t.frameSize}: <strong>{post.frameSize}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            <div className="text-sm text-secondary-color">
                                {t.messageLead}
                            </div>
                            <MessageInAppButton receiverId={post.user.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
