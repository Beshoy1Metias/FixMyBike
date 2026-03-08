"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import FadeIn from "@/components/Animations/FadeIn";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Contact the Owner",
        lead: "Have a suggestion for FixMyBike? Found a bug? Or just want to say hi? Send a message below.",
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
        title: "Contatta il proprietario",
        lead: "Hai un suggerimento per FixMyBike? Hai trovato un bug? O vuoi solo salutarci? Invia un messaggio qui sotto.",
        successTitle: "Messaggio inviato!",
        successBody: "Grazie per averci contattato. Il tuo feedback aiuta a migliorare FixMyBike.",
        sendAnother: "Invia un altro messaggio",
        labelName: "Nome",
        labelEmail: "Email",
        labelSubject: "Oggetto",
        placeholderSubject: "Suggerimento, Bug, Richiesta funzionalità...",
        labelMessage: "Messaggio",
        placeholderMessage: "Dimmi cosa ne pensi...",
        submit: "Invia Messaggio",
        loading: "Invio in corso...",
        errorGeneric: "Qualcosa è andato storto. Riprova più tardi.",
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
        } catch (err) {
            setError(t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "600px" }}>
                <div className="page-header" style={{ textAlign: "left" }}>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg">
                        {t.lead}
                    </p>
                </div>

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
                                <div className="grid-2">
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
        </FadeIn>
    );
}
