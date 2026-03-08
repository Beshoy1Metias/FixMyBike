"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const LocationPicker = dynamic(() => import("@/components/Map/LocationPicker"), { ssr: false });

const BIKE_TYPES = {
    en: [
        { value: "", label: "Any type" },
        { value: "ROAD", label: "Road" },
        { value: "MOUNTAIN", label: "Mountain" },
        { value: "GRAVEL", label: "Gravel" },
        { value: "ELECTRIC", label: "E-Bike" },
        { value: "FOLDING", label: "Folding" },
        { value: "BMX", label: "BMX" },
    ],
    it: [
        { value: "", label: "Qualsiasi tipo" },
        { value: "ROAD", label: "Strada" },
        { value: "MOUNTAIN", label: "MTB" },
        { value: "GRAVEL", label: "Gravel" },
        { value: "ELECTRIC", label: "E-Bike" },
        { value: "FOLDING", label: "Pieghevole" },
        { value: "BMX", label: "BMX" },
    ]
};

const FRAME_SIZES = {
    en: [
        { value: "", label: "Any size" },
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
        { value: "ONE_SIZE", label: "One Size" },
    ],
    it: [
        { value: "", label: "Qualsiasi taglia" },
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
        { value: "ONE_SIZE", label: "Taglia Unica" },
    ]
};

const TEXT = {
    en: {
        eyebrow: "🔍 Wanted Bikes",
        title: "Post a Wanted Ad",
        lead: "Tell sellers exactly what kind of bike you're looking for and your budget. They'll reach out if they have a match.",
        labelTitle: "Title",
        placeholderTitle: "Looking for a Gravel Bike — Size M",
        labelBudget: "Max Budget (€)",
        labelType: "Bike Type",
        labelSize: "Frame Size",
        labelLocation: "Location text",
        placeholderLocation: "City, Country",
        labelDescription: "Description",
        placeholderDescription: "Describe the type of bike, components, and condition you are after.",
        cancel: "Cancel",
        submit: "Post Wanted Ad",
        loading: "Posting...",
        errorAuth: "You need an account to post a wanted ad.",
        errorGeneric: "Failed to create wanted post.",
    },
    it: {
        eyebrow: "🔍 Cerco bici",
        title: "Pubblica una richiesta",
        lead: "Spiega ai venditori esattamente che tipo di bici cerchi e il tuo budget. Ti contatteranno se hanno quello che fa per te.",
        labelTitle: "Titolo",
        placeholderTitle: "Cerco bici Gravel — Taglia M",
        labelBudget: "Budget Massimo (€)",
        labelType: "Tipo di bici",
        labelSize: "Taglia telaio",
        labelLocation: "Località (testo)",
        placeholderLocation: "Città, Paese",
        labelDescription: "Descrizione",
        placeholderDescription: "Descrivi il tipo di bici, i componenti e le condizioni che cerchi.",
        cancel: "Annulla",
        submit: "Pubblica richiesta",
        loading: "Pubblicazione...",
        errorAuth: "Devi aver effettuato l'accesso per pubblicare una richiesta.",
        errorGeneric: "Errore nella creazione della richiesta.",
    }
} as const;

export default function NewWantedPostPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language];

    const [form, setForm] = useState({
        title: "",
        description: "",
        maxBudget: "",
        bikeType: "",
        frameSize: "",
        location: "",
        latitude: null as number | null,
        longitude: null as number | null,
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
                        <p>{t.errorAuth}</p>
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
            const res = await fetch("/api/wanted", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    maxBudget: form.maxBudget ? Number(form.maxBudget) : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || t.errorGeneric);
                setLoading(false);
                return;
            }

            router.push(`/wanted/${data.post.id}`);
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        
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
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">{t.labelTitle}</label>
                            <input
                                id="title"
                                className="form-input"
                                placeholder={t.placeholderTitle}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="maxBudget" className="form-label">{t.labelBudget}</label>
                                <input
                                    id="maxBudget"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-input"
                                    value={form.maxBudget}
                                    onChange={(e) => setForm({ ...form, maxBudget: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bikeType" className="form-label">{t.labelType}</label>
                                <select
                                    id="bikeType"
                                    className="form-select"
                                    value={form.bikeType}
                                    onChange={(e) => setForm({ ...form, bikeType: e.target.value })}
                                >
                                    {BIKE_TYPES[language].map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="frameSize" className="form-label">{t.labelSize}</label>
                                <select
                                    id="frameSize"
                                    className="form-select"
                                    value={form.frameSize}
                                    onChange={(e) => setForm({ ...form, frameSize: e.target.value })}
                                >
                                    {FRAME_SIZES[language].map((size) => (
                                        <option key={size.value} value={size.value}>{size.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

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
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">{t.labelDescription}</label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                placeholder={t.placeholderDescription}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
