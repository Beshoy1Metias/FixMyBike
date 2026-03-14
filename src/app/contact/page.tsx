"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Contact & Feedback",
        lead: "Have a suggestion for FixMyBike? Found a bug? Or just want to say hi? Send a message below or reach out directly.",
        directTitle: "Direct Contact",
        successTitle: "Message Sent!",
        successBody: "Thanks for reaching out. Your feedback helps make FixMyBike better.",
        sendAnother: "Send another message",
        labelName: "Name",
        labelEmail: "Email",
        labelSubject: "Subject",
        placeholderSubject: "Suggestion, Bug, Feature Request...",
        labelMessage: "Message",
        placeholderMessage: "Tell me what's on your mind...",
        submit: "Send Message",
        loading: "Sending...",
        errorGeneric: "Something went wrong. Please try again.",
    },
    it: {
        title: "Contatti e Suggerimenti",
        lead: "Hai un suggerimento per FixMyBike? Hai trovato un bug o vuoi semplicemente salutarci? Inviaci un messaggio o contattaci direttamente.",
        directTitle: "Contatto Diretto",
        successTitle: "Messaggio inviato!",
        successBody: "Grazie per averci contattato. Il tuo feedback è prezioso per migliorare FixMyBike.",
        sendAnother: "Invia un altro messaggio",
        labelName: "Nome",
        labelEmail: "Email",
        labelSubject: "Oggetto",
        placeholderSubject: "Suggerimento, Bug, Nuova idea...",
        labelMessage: "Messaggio",
        placeholderMessage: "Scrivici cosa ne pensi...",
        submit: "Invia Messaggio",
        loading: "Invio in corso...",
        errorGeneric: "Si è verificato un errore. Riprova più tardi.",
    },
} as const;

export default function ContactOwnerPage() {
    const { data: session } = useSession();
    const { language } = useLanguage();
    const t = TEXT[language];

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
                setError(data.error || t.errorGeneric);
            }
        } catch {
            setError(t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-12)" }}>
                    {/* Left side: Text and Direct links */}
                    <div>
                        <div className="page-header" style={{ textAlign: "left", paddingTop: 0 }}>
                            <h1 className="text-heading-1">{t.title}</h1>
                            <p className="text-body-lg" style={{ marginBottom: "var(--space-8)" }}>
                                {t.lead}
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            <h2 className="text-heading-3">{t.directTitle}</h2>
                            
                            <a 
                                href="https://wa.me/message/HZHCTUFOXQFKL1" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-secondary" 
                                style={{ justifyContent: "flex-start", width: "100%" }}
                            >
                                <span style={{ fontSize: "1.2rem" }}>📱</span> WhatsApp
                            </a>
                            
                            <a 
                                href="mailto:beshoybassem1@gmail.com" 
                                className="btn btn-secondary" 
                                style={{ justifyContent: "flex-start", width: "100%" }}
                            >
                                <span style={{ fontSize: "1.2rem" }}>✉️</span> Email
                            </a>
                            
                            <a 
                                href="https://www.instagram.com/beshoy__bassem/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-secondary" 
                                style={{ justifyContent: "flex-start", width: "100%" }}
                            >
                                <span style={{ fontSize: "1.2rem" }}>📸</span> Instagram
                            </a>
                        </div>
                    </div>

                    {/* Right side: Form */}
                    <div>
                        {success ? (
                            <div className="card">
                                <div className="card-body" style={{ textAlign: "center", padding: "var(--space-10)" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📬</div>
                                    <h2 className="text-heading-2">{t.successTitle}</h2>
                                    <p className="text-muted">{t.successBody}</p>
                                    <button className="btn btn-primary" onClick={() => setSuccess(false)} style={{ marginTop: "var(--space-6)" }}>
                                        {t.sendAnother}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card">
                                <form onSubmit={handleSubmit} className="card-body" style={{ display: "grid", gap: "var(--space-5)" }}>
                                    {!session && (
                                        <div style={{ display: "grid", gap: "var(--space-4)" }}>
                                            <div className="form-group">
                                                <label className="form-label">{t.labelName}</label>
                                                <input
                                                    className="form-input"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{t.labelEmail}</label>
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
                                        <label className="form-label">{t.labelSubject}</label>
                                        <input
                                            className="form-input"
                                            placeholder={t.placeholderSubject}
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t.labelMessage}</label>
                                        <textarea
                                            className="form-textarea"
                                            rows={6}
                                            placeholder={t.placeholderMessage}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {error && <div className="form-error">{error}</div>}

                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? t.loading : t.submit}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
