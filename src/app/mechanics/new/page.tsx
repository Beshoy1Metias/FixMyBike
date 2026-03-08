"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const LocationPicker = dynamic(() => import("@/components/Map/LocationPicker"), { ssr: false });

const SKILL_LEVELS = {
    en: [
        { value: "BEGINNER", label: "Beginner" },
        { value: "INTERMEDIATE", label: "Intermediate" },
        { value: "EXPERT", label: "Expert" },
        { value: "PROFESSIONAL", label: "Professional" },
    ],
    it: [
        { value: "BEGINNER", label: "Principiante" },
        { value: "INTERMEDIATE", label: "Intermedio" },
        { value: "EXPERT", label: "Esperto" },
        { value: "PROFESSIONAL", label: "Professionista" },
    ]
};

const TEXT = {
    en: {
        eyebrow: "🔧 Service Marketplace",
        title: "Offer Your Mechanic Skills",
        lead: "Create a mechanic profile so riders can find you, see your skills, and request work.",
        labelLocation: "Location text",
        placeholderLocation: "City, Country",
        labelPhone: "Phone Number (optional)",
        labelSkill: "Skill Level",
        labelRate: "Hourly Rate (€)",
        labelAvailability: "Availability",
        optionAvailable: "Available",
        optionNotAvailable: "Not Available",
        labelSkills: "Skills (comma separated)",
        placeholderSkills: "Brakes, Wheels, Suspension...",
        labelBio: "Bio",
        placeholderBio: "Tell riders about your experience and workshop setup.",
        cancel: "Cancel",
        submit: "Save Profile",
        loading: "Saving...",
        errorAuth: "You need an account to offer mechanic services.",
        errorGeneric: "Failed to save profile.",
        errorLocation: "Please select a location on the map.",
    },
    it: {
        eyebrow: "🔧 Marketplace dei servizi",
        title: "Offri le tue competenze da meccanico",
        lead: "Crea un profilo meccanico così i ciclisti possono trovarti, vedere le tue abilità e richiedere lavori.",
        labelLocation: "Località (testo)",
        placeholderLocation: "Città, Paese",
        labelPhone: "Numero di telefono (opzionale)",
        labelSkill: "Livello di abilità",
        labelRate: "Tariffa oraria (€)",
        labelAvailability: "Disponibilità",
        optionAvailable: "Disponibile",
        optionNotAvailable: "Non disponibile",
        labelSkills: "Competenze (separate da virgola)",
        placeholderSkills: "Freni, Ruote, Sospensioni...",
        labelBio: "Biografia",
        placeholderBio: "Racconta ai ciclisti la tua esperienza e la tua officina.",
        cancel: "Annulla",
        submit: "Salva profilo",
        loading: "Salvataggio...",
        errorAuth: "Devi aver effettuato l'accesso per offrire servizi da meccanico.",
        errorGeneric: "Errore nel salvataggio del profilo.",
        errorLocation: "Per favore seleziona una posizione sulla mappa.",
    }
} as const;

export default function NewMechanicProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language as keyof typeof TEXT] || TEXT.en;

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
    const [locationError, setLocationError] = useState(false);

    if (status === "loading") {
        return (
            <div className="section">
                <div className="container">
                    <div className="spinner" />
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
                        <p>{t.errorAuth}</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLocationError(false);

        if (!form.latitude || !form.longitude) {
            setLocationError(true);
            setError(t.errorLocation);
            return;
        }

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
                setError(data.error || t.errorGeneric);
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

    const handleLocationSelect = async (lat: number, lng: number, address?: string) => {
        setForm(prev => ({ 
            ...prev, 
            latitude: lat, 
            longitude: lng,
            location: address || prev.location 
        }));
        setLocationError(false);
        
        if (!address) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=${language}&lat=${lat}&lon=${lng}`);
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
        }
    };

    return (
        <FadeIn className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        {t.lead}
                    </p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-6)" }}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label htmlFor="location" className="form-label">{t.labelLocation}</label>
                                <input
                                    id="location"
                                    className="form-input"
                                    placeholder={t.placeholderLocation}
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber" className="form-label">{t.labelPhone}</label>
                                <input
                                    id="phoneNumber"
                                    className="form-input"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <LocationPicker 
                                onLocationSelect={handleLocationSelect} 
                                required 
                                error={locationError}
                            />
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="skillLevel" className="form-label">{t.labelSkill}</label>
                                <select
                                    id="skillLevel"
                                    className="form-select"
                                    value={form.skillLevel}
                                    onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                                >
                                    {SKILL_LEVELS[language as keyof typeof SKILL_LEVELS]?.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hourlyRate" className="form-label">{t.labelRate}</label>
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
                                <label className="form-label">{t.labelAvailability}</label>
                                <select
                                    className="form-select"
                                    value={form.isAvailable ? "true" : "false"}
                                    onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "true" })}
                                >
                                    <option value="true">{t.optionAvailable}</option>
                                    <option value="false">{t.optionNotAvailable}</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="skills" className="form-label">{t.labelSkills}</label>
                            <input
                                id="skills"
                                className="form-input"
                                placeholder={t.placeholderSkills}
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio" className="form-label">{t.labelBio}</label>
                            <textarea
                                id="bio"
                                className="form-textarea"
                                placeholder={t.placeholderBio}
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
                                {t.cancel}
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner" /> : t.submit}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}
