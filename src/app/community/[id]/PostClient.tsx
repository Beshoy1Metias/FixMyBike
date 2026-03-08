"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import styles from "../community.module.css";

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
    },
    it: {
        postedBy: "Pubblicato da",
        comments: "Commenti",
        addComment: "Aggiungi un commento...",
        postComment: "Invia Commento",
        posting: "Invio in corso...",
        noComments: "Ancora nessun commento. Sii il primo a rispondere!",
        signInToJoin: "Per favore, accedi per partecipare alla discussione.",
    },
};

export default function PostClient({ post, lang }: PostClientProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
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

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: "900px" }}>
                <FadeIn>
                    <div className="card" style={{ marginBottom: "var(--space-8)" }}>
                        <div className="card-body">
                            <div className={styles.postTop}>
                                <span className={styles.postCategory}>{post.category}</span>
                                <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString(lang === "it" ? "it-IT" : "en-US")}</span>
                            </div>
                            <h1 className="text-heading-1" style={{ margin: "var(--space-2) 0" }}>{post.title}</h1>
                            <div className={styles.postFooter} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                                <span>{t.postedBy} <strong>{post.user.name || "User"}</strong></span>
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
                                    borderLeft: "3px solid var(--color-primary)",
                                    background: "var(--surface)",
                                    borderRadius: "0 var(--radius) var(--radius) 0",
                                    marginBottom: "var(--space-3)",
                                    border: "1px solid var(--border)",
                                    borderLeftWidth: "4px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
                                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{comment.user.name || "User"}</span>
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
