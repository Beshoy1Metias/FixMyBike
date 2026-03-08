"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import styles from "../community.module.css";
import MessageInAppButton from "@/components/MessageInAppButton/MessageInAppButton";

interface PostClientProps {
    post: any;
    lang: "en" | "it";
}

const UI_TEXT = {
    en: {
        postedBy: "Posted by",
        comments: "Comments",
        addComment: "Add a comment...",
        postComment: "Post Comment",
        posting: "Posting...",
        noComments: "No comments yet. Be the first to reply!",
        signInToJoin: "Please sign in to join the discussion.",
        anonymous: "User",
    },
    it: {
        postedBy: "Pubblicato da",
        comments: "Commenti",
        addComment: "Aggiungi un commento...",
        postComment: "Invia Commento",
        posting: "Invio in corso...",
        noComments: "Ancora nessun commento. Sii il primo a rispondere!",
        signInToJoin: "Per favore, accedi per partecipare alla discussione.",
        anonymous: "Utente",
    },
};

const CATEGORIES = {
    en: {
        GENERAL: "General",
        APP_FEEDBACK: "App Feedback",
        BIKE_TALK: "Bike Talk",
    },
    it: {
        GENERAL: "Generale",
        APP_FEEDBACK: "Feedback App",
        BIKE_TALK: "Parliamo di Bici",
    },
};

export default function PostClient({ post, lang }: PostClientProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [messageLoading, setMessageLoading] = useState<string | null>(null);
    const t = UI_TEXT[lang];

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/community/${post.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const data = await res.json();
                setComments([...comments, data.comment]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDirectMessage = async (userId: string) => {
        if (!session?.user?.id) {
            router.push("/auth/login");
            return;
        }

        setMessageLoading(userId);
        try {
            const res = await fetch("/api/conversations/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otherUserId: userId }),
            });

            const data = await res.json();
            if (res.ok && data.conversationId) {
                router.push(`/messages/${data.conversationId}`);
            }
        } catch (err) {
            console.error("Failed to start DM", err);
        } finally {
            setMessageLoading(null);
        }
    };

    const getCategoryLabel = (key: string) => {
        const catMap = CATEGORIES[lang] as Record<string, string>;
        return catMap[key] || key;
    };

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: "900px" }}>
                <FadeIn>
                    <div className="card" style={{ marginBottom: "var(--space-8)" }}>
                        <div className="card-body">
                            <div className={styles.postTop}>
                                <span className={styles.postCategory}>{getCategoryLabel(post.category)}</span>
                                <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString(lang === "it" ? "it-IT" : "en-US")}</span>
                            </div>
                            <h1 className="text-heading-1" style={{ margin: "var(--space-2) 0" }}>{post.title}</h1>
                            <div className={styles.postFooter} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-4)", marginBottom: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>{t.postedBy} <strong>{post.user.name || t.anonymous}</strong></span>
                                {session?.user?.id !== post.user.id && (
                                    <MessageInAppButton receiverId={post.user.id} />
                                )}
                            </div>
                            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {post.content}
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <div className={styles.commentsSection}>
                    <h3 className="text-heading-3" style={{ marginBottom: "var(--space-4)" }}>
                        {t.comments} ({comments.length})
                    </h3>

                    {session ? (
                        <form onSubmit={handleSubmitComment} style={{ marginBottom: "var(--space-8)" }}>
                            <textarea
                                className="form-textarea"
                                placeholder={t.addComment}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                required
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
                                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                    {submitting ? t.posting : t.postComment}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.sidebarBox} style={{ marginBottom: "var(--space-8)" }}>
                            <p>{t.signInToJoin}</p>
                        </div>
                    )}

                    <StaggerContainer className={styles.commentList}>
                        {comments.length > 0 ? (
                            comments.map((comment: any) => (
                                <FadeIn key={comment.id} className={styles.commentCard} style={{ 
                                    padding: "var(--space-4)", 
                                    background: "var(--surface)",
                                    borderRadius: "var(--radius)",
                                    marginBottom: "var(--space-3)",
                                    border: "1px solid var(--border)",
                                    borderLeft: "4px solid var(--color-primary)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{comment.user.name || t.anonymous}</span>
                                            {session?.user?.id !== comment.user.id && (
                                                <button 
                                                    className="btn btn-ghost btn-xs" 
                                                    onClick={() => handleDirectMessage(comment.user.id)}
                                                    disabled={messageLoading === comment.user.id}
                                                    title="Send Direct Message"
                                                    style={{ padding: "2px 6px", fontSize: "0.7rem", minHeight: "24px" }}
                                                >
                                                    {messageLoading === comment.user.id ? "..." : "💬"}
                                                </button>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                                            {new Date(comment.createdAt).toLocaleDateString(lang === "it" ? "it-IT" : "en-US")}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "0.95rem" }}>{comment.content}</p>
                                </FadeIn>
                            ))
                        ) : (
                            <p className="text-muted">{t.noComments}</p>
                        )}
                    </StaggerContainer>
                </div>
            </div>
        </div>
    );
}
