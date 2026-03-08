"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import FadeIn from "@/components/Animations/FadeIn";

const LocationPicker = dynamic(() => import("@/components/Map/LocationPicker"), { ssr: false });

const CONDITIONS = [
    { value: "NEW", label: "New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "POOR", label: "Poor" },
];

const CATEGORIES = [
    { value: "BRAKES", label: "Brakes" },
    { value: "DRIVETRAIN", label: "Drivetrain" },
    { value: "WHEELS", label: "Wheels" },
    { value: "HANDLEBARS", label: "Handlebars" },
    { value: "SADDLE", label: "Saddle" },
    { value: "FRAME", label: "Frame" },
    { value: "FORKS", label: "Forks" },
    { value: "PEDALS", label: "Pedals" },
    { value: "LIGHTS", label: "Lights" },
    { value: "ACCESSORIES", label: "Accessories" },
    { value: "OTHER", label: "Other" },
];

export default function NewPartListingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        condition: "GOOD",
        category: "DRIVETRAIN",
        brand: "",
        location: "",
        latitude: null as number | null,
        longitude: null as number | null,
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
                        <p>You need an account to post a part for sale.</p>
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
            const res = await fetch("/api/parts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    photoUrls,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create listing.");
                setLoading(false);
                return;
            }

            router.push(`/parts/${data.listing.id}`);
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || "";
                const country = data.address.country || "";
                const locationStr = city && country ? `${city}, ${country}` : data.display_name;
                setForm(prev => ({ ...prev, location: locationStr }));
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    };

    return (
        <FadeIn className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">⚙️ Sell a Part</span>
                    <h1 className="text-heading-1">Create Parts Listing</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        List a bike component or accessory for sale. Add clear photos and honest details to help buyers decide quickly.
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
                                    placeholder="Shimano 105 R7000 Groupset — 11sp"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="brand" className="form-label">
                                    Brand (optional)
                                </label>
                                <input
                                    id="brand"
                                    className="form-input"
                                    placeholder="Shimano, SRAM, etc."
                                    value={form.brand}
                                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid-3">
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
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location" className="form-label">
                                Location text
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

                        <div className="form-group">
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                placeholder="Describe the condition, usage, and any important details buyers should know."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                                rows={5}
                            />
                        </div>

                        <ImageUploader maxImages={4} onChange={setPhotoUrls} />

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
        </FadeIn>
    );
}
