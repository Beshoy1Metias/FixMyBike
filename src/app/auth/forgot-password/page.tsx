"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../auth.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Forgot password?",
        subtitle: "Enter your email and we'll send you a reset link.",
        labelEmail: "Email",
        submit: "Send Reset Link",
        backToLogin: "Back to login",
        successTitle: "Check your inbox",
        successBody: "If an account with that email exists, you'll receive a password reset link shortly. Check your spam folder if you don't see it.",
    },
    it: {
        title: "Password dimenticata?",
        subtitle: "Inserisci la tua email e ti invieremo un link per reimpostarla.",
        labelEmail: "Email",
        submit: "Invia Link di Reset",
        backToLogin: "Torna al login",
        successTitle: "Controlla la tua casella email",
        successBody: "Se esiste un account con quella email, riceverai a breve un link per reimpostare la password. Controlla anche la cartella spam.",
    },
} as const;

export default function ForgotPasswordPage() {
    const { language } = useLanguage();
    const t = TEXT[language];

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Something went wrong.");
            } else {
                setSubmitted(true);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHead}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.svg" alt="FixMyBike" width={40} height={40} priority unoptimized />
                    </Link>
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>

                {!submitted ? (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && <div className={styles.errorAlert}>{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">{t.labelEmail}</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                            {loading ? <span className="spinner" /> : t.submit}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)", lineHeight: 1 }}>📩</div>
                        <h2 style={{ color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)" }}>
                            {t.successTitle}
                        </h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            {t.successBody}
                        </p>
                    </div>
                )}

                <p className={styles.switchLink}>
                    <Link href="/auth/login">{t.backToLogin}</Link>
                </p>
            </div>
        </div>
    );
}
