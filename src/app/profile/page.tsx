"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        eyebrow: "My Account",
        title: "Profile Settings",
        lead: "Update your personal information and profile picture.",
        nameLabel: "Display Name",
        emailLabel: "Email Address",
        profilePicLabel: "Profile Picture",
        saveBtn: "Save Changes",
        savingBtn: "Saving...",
        successMsg: "Profile updated successfully!",
        errorMsg: "Failed to update profile.",
        unauthorized: "Please log in to view this page.",
    },
    it: {
        eyebrow: "Il mio account",
        title: "Impostazioni Profilo",
        lead: "Aggiorna le tue informazioni personali e l'immagine del profilo.",
        nameLabel: "Nome Visualizzato",
        emailLabel: "Indirizzo Email",
        profilePicLabel: "Immagine del Profilo",
        saveBtn: "Salva Modifiche",
        savingBtn: "Salvataggio...",
        successMsg: "Profilo aggiornato con successo!",
        errorMsg: "Impossibile aggiornare il profilo.",
        unauthorized: "Effettua l'accesso per visualizzare questa pagina.",
    },
} as const;

export default function ProfilePage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const { language } = useLanguage();
    const t = TEXT[language];

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
            return;
        }

        if (session?.user) {
            const fetchProfile = async () => {
                try {
                    const res = await fetch("/api/user/profile");
                    const data = await res.json();
                    if (res.ok) {
                        setName(data.user.name || "");
                        setEmail(data.user.email || "");
                        setImage(data.user.image || null);
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: t.successMsg });
                // Update the next-auth session
                await updateSession({ name, image });
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || t.errorMsg });
            }
        } catch {
            setMessage({ type: "error", text: t.errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: 640 }}>
                <FadeIn>
                    <div className="page-header" style={{ textAlign: "left" }}>
                        <span className="page-header__eyebrow">{t.eyebrow}</span>
                        <h1 className="text-heading-1">{t.title}</h1>
                        <p className="text-body-lg">
                            {t.lead}
                        </p>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                                {message && (
                                    <div className={message.type === "success" ? "form-success" : "form-error"}>
                                        {message.text}
                                    </div>
                                )}

                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-2)" }}>
                                    <div 
                                        className="avatar avatar-xl"
                                        style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            background: image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                            fontWeight: 700,
                                            fontSize: "3rem",
                                            color: "white"
                                        }}
                                    >
                                        {image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img 
                                                src={image} 
                                                alt={name} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                            />
                                        ) : (
                                            name.charAt(0).toUpperCase() || "U"
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <ImageUploader 
                                            label={t.profilePicLabel}
                                            maxImages={1}
                                            onChange={(urls) => setImage(urls[0])}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t.nameLabel}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t.emailLabel}</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={email}
                                        disabled
                                        style={{ background: "var(--surface-2)", cursor: "not-allowed" }}
                                    />
                                    <p className="text-xs text-secondary-color" style={{ marginTop: "var(--space-1)" }}>
                                        Email cannot be changed.
                                    </p>
                                </div>

                                <div style={{ marginTop: "var(--space-2)" }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "100%" }}>
                                        {saving ? t.savingBtn : t.saveBtn}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
