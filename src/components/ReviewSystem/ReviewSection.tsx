"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import styles from "./ReviewSystem.module.css";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface ReviewSectionProps {
    targetId: string;
    mechanicId?: string;
    lang: "en" | "it";
}

const TEXT = {
    en: {
        title: "Reviews",
        writeReview: "Write a Review",
        commentPlaceholder: "Share your experience...",
        submit: "Submit Review",
        submitting: "Submitting...",
        noReviews: "No reviews yet. Be the first to leave one!",
        loginToReview: "Please log in to leave a review.",
        ownProfile: "You cannot review yourself.",
        success: "Review submitted successfully!",
        error: "Failed to submit review."
    },
    it: {
        title: "Recensioni",
        writeReview: "Scrivi una recensione",
        commentPlaceholder: "Condividi la tua esperienza...",
        submit: "Invia recensione",
        submitting: "Invio in corso...",
        noReviews: "Nessuna recensione. Sii il primo a lasciarne una!",
        loginToReview: "Accedi per lasciare una recensione.",
        ownProfile: "Non puoi recensire te stesso.",
        success: "Recensione inviata con successo!",
        error: "Errore durante l'invio della recensione."
    }
};

export default function ReviewSection({ targetId, mechanicId, lang }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const t = TEXT[lang];

    const fetchReviews = useCallback(async () => {
        try {
            const url = new URL("/api/reviews", window.location.origin);
            url.searchParams.append("targetId", targetId);
            if (mechanicId) url.searchParams.append("mechanicId", mechanicId);

            const res = await fetch(url.toString());
            const data = await res.json();
            if (res.ok) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    }, [targetId, mechanicId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId,
                    mechanicId,
                    rating,
                    comment
                })
            });

            if (res.ok) {
                setMessage({ type: "success", text: t.success });
                setComment("");
                setRating(0);
                fetchReviews();
            } else {
                setMessage({ type: "error", text: t.error });
            }
        } catch {
            setMessage({ type: "error", text: t.error });
        } finally {
            setSubmitting(false);
        }
    };

    const isOwnProfile = session?.user?.id === targetId;

    return (
        <div className={styles.section}>
            <h2 className="text-heading-3">{t.title}</h2>

            {/* Review Form */}
            {!isOwnProfile && session ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formHeader}>
                        <label>{t.writeReview}</label>
                        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                    </div>
                    <textarea
                        className="form-input"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t.commentPlaceholder}
                        rows={3}
                    />
                    {message && (
                        <div className={message.type === "success" ? "form-success" : "form-error"}>
                            {message.text}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={submitting || rating === 0}
                        style={{ marginTop: "var(--space-2)" }}
                    >
                        {submitting ? t.submitting : t.submit}
                    </button>
                </form>
            ) : !session ? (
                <p className={styles.infoText}>{t.loginToReview}</p>
            ) : null}

            {/* Review List */}
            {loading ? (
                <div className="spinner" />
            ) : reviews.length > 0 ? (
                <StaggerContainer className={styles.reviewList}>
                    {reviews.map((review) => (
                        <FadeIn key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.author}>
                                    <div 
                                        className="avatar avatar-sm"
                                        style={{ 
                                            background: review.author.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                            overflow: "hidden",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontWeight: 700,
                                            fontSize: "0.7rem"
                                        }}
                                    >
                                        {review.author.image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={review.author.image} alt={review.author.name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            review.author.name?.charAt(0).toUpperCase() || "U"
                                        )}
                                    </div>
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>{review.author.name || "Anonymous"}</span>
                                        <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString(lang === "it" ? "it-IT" : "en-US")}</span>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="sm" />
                            </div>
                            {review.comment && (
                                <p className={styles.comment}>{review.comment}</p>
                            )}
                        </FadeIn>
                    ))}
                </StaggerContainer>
            ) : (
                <p className={styles.emptyText}>{t.noReviews}</p>
            )}
        </div>
    );
}
