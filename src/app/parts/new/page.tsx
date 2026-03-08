"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const LocationPicker = dynamic(() => import("@/components/Map/LocationPicker"), { ssr: false });

const CONDITIONS = {
    en: [
        { value: "NEW", label: "New" },
        { value: "LIKE_NEW", label: "Like New" },
        { value: "GOOD", label: "Good" },
        { value: "FAIR", label: "Fair" },
        { value: "POOR", label: "Poor" },
    ],
    it: [
        { value: "NEW", label: "Nuovo" },
        { value: "LIKE_NEW", label: "Come nuovo" },
        { value: "GOOD", label: "Buono" },
        { value: "FAIR", label: "Discreto" },
        { value: "POOR", label: "Da sistemare" },
    ]
};

const CATEGORIES = {
    en: [
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
    ],
    it: [
        { value: "BRAKES", label: "Freni" },
        { value: "DRIVETRAIN", label: "Trasmissione" },
        { value: "WHEELS", label: "Ruote" },
        { value: "HANDLEBARS", label: "Manubri" },
        { value: "SADDLE", label: "Sella" },
        { value: "FRAME", label: "Telaio" },
        { value: "FORKS", label: "Forcelle" },
        { value: "PEDALS", label: "Pedali" },
        { value: "LIGHTS", label: "Luci" },
        { value: "ACCESSORIES", label: "Accessori" },
        { value: "OTHER", label: "Altro" },
    ]
};

const TEXT = {
    en: {
        eyebrow: "⚙️ Sell a Part",
        title: "Create Parts Listing",
        lead: "List a bike component or accessory for sale. Add clear photos and honest details to help buyers decide quickly.",
        labelTitle: "Title",
        placeholderTitle: "Shimano 105 R7000 Groupset — 11sp",
        labelBrand: "Brand (optional)",
        placeholderBrand: "Shimano, SRAM, etc.",
        labelPrice: "Price (€)",
        labelCondition: "Condition",
        labelCategory: "Category",
        labelLocation: "Location text",
        placeholderLocation: "City, Country",
        labelDescription: "Description",
        placeholderDescription: "Describe the condition, usage, and any important details buyers should know.",
        cancel: "Cancel",
        submit: "Post Listing",
        loading: "Posting...",
        errorAuth: "You need an account to post a part for sale.",
        errorGeneric: "Failed to create listing.",
    },
    it: {
        eyebrow: "⚙️ Vendi un ricambio",
        title: "Crea annuncio ricambio",
        lead: "Metti in vendita un componente o accessorio per bici. Aggiungi foto chiare e dettagli onesti per aiutare gli acquirenti.",
        labelTitle: "Titolo",
        placeholderTitle: "Gruppo Shimano 105 R7000 — 11v",
        labelBrand: "Marca (opzionale)",
        placeholderBrand: "Shimano, SRAM, ecc.",
        labelPrice: "Prezzo (€)",
        labelCondition: "Condizione",
        labelCategory: "Categoria",
        labelLocation: "Località (testo)",
        placeholderLocation: "Città, Paese",
        labelDescription: "Descrizione",
        placeholderDescription: "Descrivi la condizione, l'usura e ogni dettaglio importante per l'acquirente.",
        cancel: "Annulla",
        submit: "Pubblica annuncio",
        loading: "Pubblicazione...",
        errorAuth: "Devi aver effettuato l'accesso per vendere un ricambio.",
        errorGeneric: "Errore nella creazione dell'annuncio.",
    }
} as const;

export default function NewPartListingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language];

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
                setError(data.error || t.errorGeneric);
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
                        <div className="grid-2">
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
                            <div className="form-group">
                                <label htmlFor="brand" className="form-label">{t.labelBrand}</label>
                                <input
                                    id="brand"
                                    className="form-input"
                                    placeholder={t.placeholderBrand}
                                    value={form.brand}
                                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="price" className="form-label">{t.labelPrice}</label>
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
                                <label htmlFor="condition" className="form-label">{t.labelCondition}</label>
                                <select
                                    id="condition"
                                    className="form-select"
                                    value={form.condition}
                                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                                    required
                                >
                                    {CONDITIONS[language].map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">{t.labelCategory}</label>
                                <select
                                    id="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    {CATEGORIES[language].map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
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

                        <ImageUploader maxImages={4} onChange={setPhotoUrls} />

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
