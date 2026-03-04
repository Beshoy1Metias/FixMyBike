"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

type ListingContext =
    | { type: "part"; listingId: string }
    | { type: "bike"; listingId: string }
    | { type: "mechanic"; profileId: string }
    | { type: "wanted"; wantedPostId: string };

interface ContactSellerFormProps {
    toUserId: string;
    listing: ListingContext;
}

export default function ContactSellerForm({ toUserId, listing }: ContactSellerFormProps) {
    const { data: session } = useSession();
    const [form, setForm] = useState({
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const payload: any = {
                toUserId,
                subject: form.subject || undefined,
                message: form.message,
            };

            if (!session?.user?.id) {
                payload.email = form.email;
                payload.name = form.name;
            }

            if (listing.type === "part") {
                payload.partListingId = listing.listingId;
            } else if (listing.type === "bike") {
                payload.bikeListingId = listing.listingId;
            } else if (listing.type === "mechanic") {
                payload.mechanicProfileId = listing.profileId;
            } else if (listing.type === "wanted") {
                payload.wantedPostId = listing.wantedPostId;
            }

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
            setForm((prev) => ({ ...prev, subject: "", message: "" }));
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {!session?.user && (
                <div style={{ display: "grid", gap: "var(--space-3)" }}>
                    <div className="form-group">
                        <label htmlFor="contact-name" className="form-label">
                            Your Name
                        </label>
                        <input
                            id="contact-name"
                            className="form-input"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-email" className="form-label">
                            Your Email
                        </label>
                        <input
                            id="contact-email"
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
                <label htmlFor="contact-subject" className="form-label">
                    Subject (optional)
                </label>
                <input
                    id="contact-subject"
                    className="form-input"
                    placeholder="Interested in your listing"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                    Message
                </label>
                <textarea
                    id="contact-message"
                    className="form-textarea"
                    placeholder="Hi, I'm interested in this. Is it still available?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                />
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && (
                <div style={{ fontSize: "0.85rem", color: "var(--color-success)" }}>
                    Message sent successfully.
                </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : "Send Message"}
            </button>
        </form>
    );
}

