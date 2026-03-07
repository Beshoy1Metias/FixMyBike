"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LocationPicker from "@/components/Map/LocationPicker";
import FadeIn from "@/components/Animations/FadeIn";

const SKILL_LEVELS = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "EXPERT", label: "Expert" },
    { value: "PROFESSIONAL", label: "Professional" },
];

export default function NewMechanicProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [form, setForm] = useState({
        bio: "",
        location: "",
        latitude: null as number | null,
        longitude: null as number | null,
        phoneNumber: "",
        skillLevel: "INTERMEDIATE",
        hourlyRate: "",
        skills: "",
        isAvailable: true,
    });
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
                        <p>You need an account to offer mechanic services.</p>
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
            const res = await fetch("/api/mechanics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to save profile.");
                setLoading(false);
                return;
            }

            router.push(`/mechanics/${data.profile.id}`);
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
                    <span className="page-header__eyebrow">🔧 Service Marketplace</span>
                    <h1 className="text-heading-1">Offer Your Mechanic Skills</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        Create a mechanic profile so riders can find you, see your skills, and request work.
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-6)" }}>
                        <div className="grid-2">
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
                                <label htmlFor="phoneNumber" className="form-label">
                                    Phone Number (optional)
                                </label>
                                <input
                                    id="phoneNumber"
                                    className="form-input"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="skillLevel" className="form-label">
                                    Skill Level
                                </label>
                                <select
                                    id="skillLevel"
                                    className="form-select"
                                    value={form.skillLevel}
                                    onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                                >
                                    {SKILL_LEVELS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hourlyRate" className="form-label">
                                    Hourly Rate (€)
                                </label>
                                <input
                                    id="hourlyRate"
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="form-input"
                                    value={form.hourlyRate}
                                    onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Availability
                                </label>
                                <select
                                    className="form-select"
                                    value={form.isAvailable ? "true" : "false"}
                                    onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "true" })}
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="skills" className="form-label">
                                Skills (comma separated)
                            </label>
                            <input
                                id="skills"
                                className="form-input"
                                placeholder="Brakes, Wheels, Suspension..."
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio" className="form-label">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                className="form-textarea"
                                placeholder="Tell riders about your experience and workshop setup."
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                required
                                rows={5}
                            />
                        </div>

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
                                {loading ? <span className="spinner" /> : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}

