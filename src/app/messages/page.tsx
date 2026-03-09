"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

interface ConversationUser {
    id: string;
    name: string | null;
    image?: string | null;
}

interface Conversation {
    id: string;
    participant1: ConversationUser;
    participant2: ConversationUser;
    messages: {
        id: string;
        text: string;
        createdAt: string;
        senderId: string;
    }[];
}

const TEXT = {
    en: {
        eyebrow: "💬 Inbox",
        title: "Your Conversations",
        lead: "Chat with buyers, sellers, and mechanics directly inside FixMyBike.",
        signInEyebrow: "💬 Messages",
        signInTitle: "Sign in to view your messages",
        signInLead: "Create an account or log in to see your conversations with buyers, sellers, and mechanics.",
        logIn: "Log In",
        signUp: "Sign Up Free",
        noConversations: "You don't have any conversations yet.",
        startByContacting: "Start by contacting a seller or mechanic from a listing page.",
        error: "Failed to load conversations.",
        loading: "Loading...",
        anonymous: "FixMyBike user"
    },
    it: {
        eyebrow: "💬 Messaggi",
        title: "Le tue conversazioni",
        lead: "Chatta con acquirenti, venditori e meccanici direttamente su FixMyBike.",
        signInEyebrow: "💬 Messaggi",
        signInTitle: "Accedi per vedere i tuoi messaggi",
        signInLead: "Crea un account o accedi per vedere le tue conversazioni con acquirenti, venditori e meccanici.",
        logIn: "Accedi",
        signUp: "Registrati gratis",
        noConversations: "Non hai ancora nessuna conversazione.",
        startByContacting: "Inizia contattando un venditore o un meccanico da un annuncio.",
        error: "Errore nel caricamento delle conversazioni.",
        loading: "Caricamento...",
        anonymous: "Utente FixMyBike"
    },
} as const;

export default function MessagesPage() {
    const { data: session, status } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();
    const t = TEXT[language];

    useEffect(() => {
        if (!session?.user?.id) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/conversations");
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || t.error);
                } else {
                    setConversations(data);
                }
            } catch {
                setError(t.error);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [session?.user?.id, t.error]);

    if (status === "loading") {
        return (
            <div className="section">
                <div className="container">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="section">
                <div className="container" style={{ maxWidth: 640 }}>
                    <div className="page-header" style={{ textAlign: "left" }}>
                        <span className="page-header__eyebrow">{t.signInEyebrow}</span>
                        <h1 className="text-heading-1">{t.signInTitle}</h1>
                        <p className="text-body-lg">
                            {t.signInLead}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
                        <Link href="/auth/login" className="btn btn-primary">
                            {t.logIn}
                        </Link>
                        <Link href="/auth/register" className="btn btn-secondary">
                            {t.signUp}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: 760 }}>
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg">
                        {t.lead}
                    </p>
                </div>

                {error && (
                    <div className="form-error" style={{ marginBottom: "var(--space-4)" }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-8)" }}>
                        <div className="spinner" />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: "center" }}>
                            <p className="empty-state__icon">💬</p>
                            <p>{t.noConversations}</p>
                            <p className="text-sm text-secondary-color">
                                {t.startByContacting}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        {conversations.map((conv) => {
                            const me = session.user!.id;
                            const other =
                                conv.participant1.id === me ? conv.participant2 : conv.participant1;
                            const lastMessage = conv.messages[0];
                            return (
                                <Link
                                    key={conv.id}
                                    href={`/messages/${conv.id}`}
                                    className="card"
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        className="card-body"
                                        style={{
                                            display: "flex",
                                            gap: "var(--space-4)",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            className="avatar avatar-md"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                background: other.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                                overflow: "hidden",
                                                color: "white"
                                            }}
                                        >
                                            {other.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img 
                                                    src={other.image} 
                                                    alt={other.name || "User"} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                                />
                                            ) : (
                                                other.name?.charAt(0).toUpperCase() ?? "U"
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="text-body">
                                                {other.name || t.anonymous}
                                            </div>
                                            {lastMessage && (
                                                <div className="text-sm text-secondary-color" style={{ marginTop: 4 }}>
                                                    {lastMessage.text.length > 80
                                                        ? `${lastMessage.text.slice(0, 80)}…`
                                                        : lastMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
