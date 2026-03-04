"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

const CONDITIONS = [
    { value: "NEW", label: "New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "POOR", label: "Poor" },
];

const BIKE_TYPES = [
    { value: "ROAD", label: "Road" },
    { value: "MOUNTAIN", label: "Mountain" },
    { value: "GRAVEL", label: "Gravel" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "CITY", label: "City" },
    { value: "BMX", label: "BMX" },
    { value: "ELECTRIC", label: "E-Bike" },
    { value: "FOLDING", label: "Folding" },
    { value: "KIDS", label: "Kids" },
    { value: "OTHER", label: "Other" },
];

const FRAME_SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "ONE_SIZE",
];

export default function NewBikeListingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        condition: "GOOD",
        brand: "",
        model: "",
        year: "",
        bikeType: "ROAD",
        frameSize: "M",
        wheelSize: "",
        color: "",
        location: "",
    });
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === "loading") {
        return (
            <div className="section">
                <div className="container">
                    <div className="empty-state">
                        <span className="spinner" />
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="section">
                <div className="container">
                    <div className="empty-state">
                        <p className="empty-state__icon">🔒</p>
                        <p>You need an account to sell a bike.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/bikes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    year: form.year ? Number(form.year) : undefined,
                    photoUrls,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create listing.");
                setLoading(false);
                return;
            }

            router.push(`/bikes/${data.listing.id}`);
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">🚲 Sell a Bike</span>
                    <h1 className="text-heading-1">Create Bike Listing</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        List your complete bike for sale. Add clear photos and all key specs so buyers can quickly see if it&apos;s the right fit.
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-6)" }}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    className="form-input"
                                    placeholder="Trek Domane SL 7 2023 — Size M"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="brand" className="form-label">
                                    Brand
                                </label>
                                <input
                                    id="brand"
                                    className="form-input"
                                    placeholder="Trek, Specialized, Canyon..."
                                    value={form.brand}
                                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="model" className="form-label">
                                    Model (optional)
                                </label>
                                <input
                                    id="model"
                                    className="form-input"
                                    value={form.model}
                                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year" className="form-label">
                                    Year (optional)
                                </label>
                                <input
                                    id="year"
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    className="form-input"
                                    value={form.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price" className="form-label">
                                    Price (€)
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-input"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="bikeType" className="form-label">
                                    Bike Type
                                </label>
                                <select
                                    id="bikeType"
                                    className="form-select"
                                    value={form.bikeType}
                                    onChange={(e) => setForm({ ...form, bikeType: e.target.value })}
                                    required
                                >
                                    {BIKE_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="frameSize" className="form-label">
                                    Frame Size
                                </label>
                                <select
                                    id="frameSize"
                                    className="form-select"
                                    value={form.frameSize}
                                    onChange={(e) => setForm({ ...form, frameSize: e.target.value })}
                                    required
                                >
                                    {FRAME_SIZES.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="condition" className="form-label">
                                    Condition
                                </label>
                                <select
                                    id="condition"
                                    className="form-select"
                                    value={form.condition}
                                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                                    required
                                >
                                    {CONDITIONS.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="wheelSize" className="form-label">
                                    Wheel Size (optional)
                                </label>
                                <input
                                    id="wheelSize"
                                    className="form-input"
                                    placeholder='e.g. "700c", "29\""'
                                    value={form.wheelSize}
                                    onChange={(e) => setForm({ ...form, wheelSize: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="color" className="form-label">
                                    Color (optional)
                                </label>
                                <input
                                    id="color"
                                    className="form-input"
                                    value={form.color}
                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location" className="form-label">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    className="form-input"
                                    placeholder="City, Country"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                placeholder="Describe the bike, recent service history, and anything buyers should know."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                                rows={5}
                            />
                        </div>

                        <ImageUploader maxImages={6} onChange={setPhotoUrls} />

                        {error && <div className="form-error">{error}</div>}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner" /> : "Post Listing"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

