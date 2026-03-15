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

const BIKE_TYPES = {
    en: [
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
    ],
    it: [
        { value: "ROAD", label: "Strada" },
        { value: "MOUNTAIN", label: "Mountain Bike" },
        { value: "GRAVEL", label: "Gravel" },
        { value: "HYBRID", label: "Ibrida" },
        { value: "CITY", label: "Città" },
        { value: "BMX", label: "BMX" },
        { value: "ELECTRIC", label: "E-Bike" },
        { value: "FOLDING", label: "Pieghevole" },
        { value: "KIDS", label: "Bambino" },
        { value: "OTHER", label: "Altro" },
    ]
};

const FRAME_SIZES = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "ONE_SIZE",
];

const TEXT = {
    en: {
        eyebrow: "🚲 Sell a Bike",
        title: "Create Bike Listing",
        lead: "List your complete bike for sale. Add clear photos and all key specs so buyers can quickly see if it's the right fit.",
        labelTitle: "Title",
        placeholderTitle: "Trek Domane SL 7 2023 — Size M",
        labelBrand: "Brand",
        placeholderBrand: "Trek, Specialized, Canyon...",
        labelModel: "Model (optional)",
        labelYear: "Year (optional)",
        labelPrice: "Price (€)",
        labelType: "Bike Type",
        labelSize: "Frame Size",
        labelCondition: "Condition",
        labelWheel: "Wheel Size (optional)",
        placeholderWheel: 'e.g. "700c", "29"',
        labelColor: "Color (optional)",
        labelDescription: "Description",
        placeholderDescription: "Describe the bike, recent service history, and anything buyers should know.",
        cancel: "Cancel",
        submit: "Post Listing",
        loading: "Posting...",
        errorAuth: "You need an account to sell a bike.",
        errorGeneric: "Failed to create listing.",
        errorLocation: "Please select a location on the map.",
    },
    it: {
        eyebrow: "🚲 Vendi una bici",
        title: "Crea annuncio bici",
        lead: "Metti in vendita la tua bici completa. Aggiungi foto chiare e tutte le specifiche principali per aiutare gli acquirenti.",
        labelTitle: "Titolo",
        placeholderTitle: "Trek Domane SL 7 2023 — Taglia M",
        labelBrand: "Marca",
        placeholderBrand: "Trek, Specialized, Canyon...",
        labelModel: "Modello (opzionale)",
        labelYear: "Anno (opzionale)",
        labelPrice: "Prezzo (€)",
        labelType: "Tipo di bici",
        labelSize: "Taglia telaio",
        labelCondition: "Condizione",
        labelWheel: "Dimensione ruote (opzionale)",
        placeholderWheel: 'es. "700c", "29"',
        labelColor: "Colore (opzionale)",
        labelDescription: "Descrizione",
        placeholderDescription: "Descrivi la bici, la manutenzione recente e tutto ciò che un acquirente dovrebbe sapere.",
        cancel: "Annulla",
        submit: "Pubblica annuncio",
        loading: "Pubblicazione...",
        errorAuth: "Devi aver effettuato l'accesso per vendere una bici.",
        errorGeneric: "Errore nella creazione dell'annuncio.",
        errorLocation: "Per favore seleziona una posizione sulla mappa.",
    }
} as const;

export default function NewBikeListingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language as keyof typeof TEXT] || TEXT.en;

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
        latitude: null as number | null,
        longitude: null as number | null,
    });
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState(false);

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
        setLocationError(false);

        if (!form.latitude || !form.longitude) {
            setLocationError(true);
            setError(t.errorLocation);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/bikes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    year: form.year ? Number(form.year) : undefined,
                    photos: photoUrls,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || t.errorGeneric);
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

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setForm(prev => ({ 
            ...prev, 
            latitude: lat, 
            longitude: lng,
            location: address 
        }));
        setLocationError(false);
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="model" className="form-label">{t.labelModel}</label>
                                <input
                                    id="model"
                                    className="form-input"
                                    value={form.model}
                                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year" className="form-label">{t.labelYear}</label>
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
                        </div>

                        <div className="grid-3">
                            <div className="form-group">
                                <label htmlFor="bikeType" className="form-label">{t.labelType}</label>
                                <select
                                    id="bikeType"
                                    className="form-select"
                                    value={form.bikeType}
                                    onChange={(e) => setForm({ ...form, bikeType: e.target.value })}
                                    required
                                >
                                    {BIKE_TYPES[language as keyof typeof BIKE_TYPES]?.map((type) => (
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
                                    required
                                >
                                    {FRAME_SIZES.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
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
                                    {CONDITIONS[language as keyof typeof CONDITIONS]?.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label htmlFor="wheelSize" className="form-label">{t.labelWheel}</label>
                                <input
                                    id="wheelSize"
                                    className="form-input"
                                    placeholder={t.placeholderWheel}
                                    value={form.wheelSize}
                                    onChange={(e) => setForm({ ...form, wheelSize: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="color" className="form-label">{t.labelColor}</label>
                                <input
                                    id="color"
                                    className="form-input"
                                    value={form.color}
                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
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

                        <ImageUploader maxImages={6} onChange={setPhotoUrls} />

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
