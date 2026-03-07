"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher";

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

export default function ConversationPage() {
    const params = useParams<{ id: string }>();
    const conversationId = params.id;
    const { data: session, status } = useSession();
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
                    setError(data.error || "Failed to load conversation.");
                } else {
                    setMessages(data);
                }
            } catch (e) {
                setError("Failed to load conversation.");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [conversationId, session?.user?.id]);

    useEffect(() => {
        if (!conversationId || !session?.user?.id) return;

        const client = getPusherClient();
        const channel = client.subscribe(`conversation-${conversationId}`);

        const handler = (message: Message) => {
            setMessages((prev) => [...prev, message]);
        };

        channel.bind("new-message", handler);

        return () => {
            channel.unbind("new-message", handler);
            client.unsubscribe(`conversation-${conversationId}`);
            client.disconnect();
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
                setError(data.error || "Failed to send message.");
            } else {
                setText("");
                // Optimistic update is handled via Pusher event; no need to push here.
            }
        } catch (e) {
            setError("Failed to send message.");
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
                        <span className="page-header__eyebrow">💬 Conversation</span>
                        <h1 className="text-heading-1">Sign in to view this conversation</h1>
                        <p className="text-body-lg">
                            You need to be logged in to read and send messages.
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
            <div className="container" style={{ maxWidth: 760, display: "flex", flexDirection: "column", height: "70vh" }}>
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-8)", paddingBottom: "var(--space-4)" }}>
                    <span className="page-header__eyebrow">💬 Conversation</span>
                    <h1 className="text-heading-2">
                        {otherParticipant?.name || "Chat"}
                    </h1>
                </div>

                <div
                    style={{
                        flex: 1,
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border)",
                        padding: "var(--space-4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-3)",
                        overflowY: "auto",
                        backgroundColor: "var(--surface-subtle)",
                    }}
                >
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-6)" }}>
                            <div className="spinner" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: "center", marginTop: "var(--space-4)" }}>
                            <p className="text-sm text-secondary-color">
                                No messages yet. Say hi to start the conversation.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMe = message.senderId === myId;
                            const createdAt = new Date(message.createdAt);
                            const time = createdAt.toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                            return (
                                <div
                                    key={message.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: isMe ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "70%",
                                            padding: "var(--space-2) var(--space-3)",
                                            borderRadius: "999px",
                                            backgroundColor: isMe
                                                ? "var(--color-primary)"
                                                : "var(--surface-elevated)",
                                            color: isMe ? "white" : "inherit",
                                        }}
                                    >
                                        <div style={{ fontSize: "0.9rem" }}>{message.text}</div>
                                        <div
                                            style={{
                                                fontSize: "0.7rem",
                                                opacity: 0.75,
                                                marginTop: 4,
                                                textAlign: "right",
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
                        marginTop: "var(--space-3)",
                    }}
                >
                    <input
                        className="form-input"
                        placeholder="Type your message…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={sending || !text.trim()}
                    >
                        {sending ? <span className="spinner" /> : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

