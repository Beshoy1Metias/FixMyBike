"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

interface Sender {
    id: string;
    name: string | null;
    image?: string | null;
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
    sender: Sender;
}

const TEXT = {
    en: {
        eyebrow: "💬 Conversation",
        chat: "Chat",
        noMessages: "No messages yet. Say hi to start the conversation.",
        placeholder: "Type your message…",
        send: "Send",
        errorLoad: "Failed to load conversation.",
        errorSend: "Failed to send message.",
        signInEyebrow: "💬 Conversation",
        signInTitle: "Sign in to view this conversation",
        signInLead: "You need to be logged in to read and send messages.",
    },
    it: {
        eyebrow: "💬 Conversazione",
        chat: "Chat",
        noMessages: "Ancora nessun messaggio. Saluta per iniziare la conversazione!",
        placeholder: "Scrivi un messaggio…",
        send: "Invia",
        errorLoad: "Impossibile caricare la conversazione.",
        errorSend: "Impossibile inviare il messaggio.",
        signInEyebrow: "💬 Conversazione",
        signInTitle: "Accedi per vedere questa conversazione",
        signInLead: "Devi aver effettuato l'accesso per leggere e inviare messaggi.",
    },
} as const;

export default function ConversationPage() {
    const params = useParams<{ id: string }>();
    const conversationId = params?.id;
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language as keyof typeof TEXT] || TEXT.en;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!conversationId || !session?.user?.id) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/messages?conversationId=${conversationId}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || t.errorLoad);
                } else {
                    setMessages(data);
                }
            } catch (e) {
                setError(t.errorLoad);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [conversationId, session?.user?.id, t.errorLoad]);

    useEffect(() => {
        if (!conversationId || !session?.user?.id) return;

        const client = getPusherClient();
        const channel = client.subscribe(`conversation-${conversationId}`);

        const handler = (message: Message) => {
            setMessages((prev) => {
                if (prev.find(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        };

        channel.bind("new-message", handler);

        return () => {
            channel.unbind("new-message", handler);
            client.unsubscribe(`conversation-${conversationId}`);
        };
    }, [conversationId, session?.user?.id]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !conversationId) return;
        setSending(true);
        setError(null);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim(), conversationId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || t.errorSend);
            } else {
                setText("");
            }
        } catch (e) {
            setError(t.errorSend);
        } finally {
            setSending(false);
        }
    };

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
                </div>
            </div>
        );
    }

    const myId = session.user.id!;

    const otherParticipant = (() => {
        const other = messages.find((m) => m.senderId !== myId)?.sender;
        return other || null;
    })();

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: 760, display: "flex", flexDirection: "column", height: "75vh" }}>
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-8)", paddingBottom: "var(--space-4)" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-2">
                        {otherParticipant?.name || t.chat}
                    </h1>
                </div>

                <div
                    style={{
                        flex: 1,
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        padding: "var(--space-6)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                        overflowY: "auto",
                        backgroundColor: "var(--bg)", // Deeper background for contrast
                        backgroundImage: "radial-gradient(circle at 2px 2px, var(--surface-2) 1px, transparent 0)",
                        backgroundSize: "24px 24px"
                    }}
                >
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-6)" }}>
                            <div className="spinner" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: "center", marginTop: "var(--space-4)" }}>
                            <p className="text-sm text-secondary-color">
                                {t.noMessages}
                            </p>
                        </div>
                    ) : (
                        messages.map((message, index) => {
                            const isMe = message.senderId === myId;
                            const prevMessage = messages[index - 1];
                            const isSameSender = prevMessage?.senderId === message.senderId;
                            
                            const createdAt = new Date(message.createdAt);
                            const time = createdAt.toLocaleTimeString(language === "it" ? "it-IT" : "en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={message.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: isMe ? "flex-end" : "flex-start",
                                        marginTop: isSameSender ? "2px" : "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "85%",
                                            padding: "8px 14px",
                                            borderRadius: isMe 
                                                ? "18px 18px 4px 18px" 
                                                : "18px 18px 18px 4px",
                                            backgroundColor: isMe
                                                ? "var(--color-primary)"
                                                : "var(--surface-2)",
                                            color: isMe ? "white" : "var(--text-primary)",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                            position: "relative"
                                        }}
                                    >
                                        <div style={{ fontSize: "0.92rem", lineHeight: "1.4", wordBreak: "break-word" }}>
                                            {message.text}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.65rem",
                                                opacity: 0.7,
                                                marginTop: 4,
                                                textAlign: "right",
                                                fontWeight: 500
                                            }}
                                        >
                                            {time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {error && (
                    <div className="form-error" style={{ marginTop: "var(--space-3)" }}>
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSend}
                    style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        marginTop: "var(--space-4)",
                        background: "var(--surface)",
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)"
                    }}
                >
                    <input
                        className="form-input"
                        placeholder={t.placeholder}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={sending}
                        style={{ border: "none", background: "transparent", minHeight: "unset", boxShadow: "none" }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={sending || !text.trim()}
                        style={{ minHeight: "44px", borderRadius: "12px" }}
                    >
                        {sending ? <span className="spinner" /> : t.send}
                    </button>
                </form>
            </div>
        </div>
    );
}
