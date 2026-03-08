"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";

export default function ContactOwnerPage() {
    const { data: session } = useSession();
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to send message.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "600px" }}>
                <div className="page-header" style={{ textAlign: "left" }}>
                    <h1 className="text-heading-1">Contact the Owner</h1>
                    <p className="text-body-lg">
                        Have a suggestion for FixMyBike? Found a bug? Or just want to say hi? Send a message below.
                    </p>
                </div>

                {success ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: "center", padding: "var(--space-10)" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📬</div>
                            <h2 className="text-heading-2">Message Sent!</h2>
                            <p className="text-muted">Thanks for reaching out. Your feedback helps make FixMyBike better.</p>
                            <button className="btn btn-primary" onClick={() => setSuccess(false)} style={{ marginTop: "var(--space-6)" }}>
                                Send another message
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-5)" }}>
                            {!session && (
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            className="form-input"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    className="form-input"
                                    placeholder="Suggestion, Bug, Feature Request..."
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-textarea"
                                    rows={6}
                                    placeholder="Tell me what's on your mind..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                />
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
