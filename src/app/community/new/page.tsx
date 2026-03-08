"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";

const CATEGORIES = [
    { value: "GENERAL", label: "General Discussion" },
    { value: "APP_FEEDBACK", label: "App Feedback & Suggestions" },
    { value: "BIKE_TALK", label: "Bike Talk (Tech, Rides, etc.)" },
];

export default function NewForumPostPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "GENERAL",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === "loading") return <div className="section"><div className="container">Loading...</div></div>;
    if (!session) return <div className="section"><div className="container">Please sign in to post.</div></div>;

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
                    <h1 className="text-heading-1">Start a New Discussion</h1>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-6)" }}>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                id="category"
                                className="form-select"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                id="title"
                                className="form-input"
                                placeholder="What's on your mind?"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content" className="form-label">Content</label>
                            <textarea
                                id="content"
                                className="form-textarea"
                                rows={8}
                                placeholder="Write your post here..."
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                required
                            />
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Posting..." : "Create Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}
