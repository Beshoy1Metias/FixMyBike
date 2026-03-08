"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const CATEGORIES = {
    en: [
        { value: "GENERAL", label: "General Discussion" },
        { value: "APP_FEEDBACK", label: "App Feedback & Suggestions" },
        { value: "BIKE_TALK", label: "Bike Talk (Tech, Rides, etc.)" },
    ],
    it: [
        { value: "GENERAL", label: "Discussione Generale" },
        { value: "APP_FEEDBACK", label: "Feedback e Suggerimenti App" },
        { value: "BIKE_TALK", label: "Parliamo di Bici (Tecnica, Giri, ecc.)" },
    ],
};

const UI_TEXT = {
    en: {
        title: "Start a New Discussion",
        category: "Category",
        subject: "Title",
        placeholder: "What's on your mind?",
        content: "Content",
        contentPlaceholder: "Write your post here...",
        cancel: "Cancel",
        post: "Create Post",
        posting: "Posting...",
        loading: "Loading...",
        signIn: "Please sign in to post.",
    },
    it: {
        title: "Inizia una nuova discussione",
        category: "Categoria",
        subject: "Titolo",
        placeholder: "A cosa stai pensando?",
        content: "Contenuto",
        contentPlaceholder: "Scrivi il tuo post qui...",
        cancel: "Annulla",
        post: "Crea Post",
        posting: "Invio in corso...",
        loading: "Caricamento...",
        signIn: "Per favore, accedi per pubblicare.",
    },
};

export default function NewForumPostPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = UI_TEXT[language];

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "GENERAL",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === "loading") return <div className="section"><div className="container">{t.loading}</div></div>;
    if (!session) return <div className="section"><div className="container">{t.signIn}</div></div>;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/community", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create post.");
                setLoading(false);
                return;
            }

            router.push(`/community/${data.post.id}`);
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
                <div className="page-header" style={{ textAlign: "left" }}>
                    <h1 className="text-heading-1">{t.title}</h1>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-6)" }}>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">{t.category}</label>
                            <select
                                id="category"
                                className="form-select"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORIES[language].map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label">{t.subject}</label>
                            <input
                                id="title"
                                className="form-input"
                                placeholder={t.placeholder}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content" className="form-label">{t.content}</label>
                            <textarea
                                id="content"
                                className="form-textarea"
                                rows={8}
                                placeholder={t.contentPlaceholder}
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                required
                            />
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>{t.cancel}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? t.posting : t.post}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}
