"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../auth.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Reset your password",
        subtitle: "Enter your new password below.",
        labelPassword: "New Password",
        labelConfirm: "Confirm Password",
        placeholderPassword: "Min. 8 characters",
        placeholderConfirm: "Repeat your new password",
        submit: "Reset Password",
        errorNoToken: "Invalid or missing reset token.",
        errorMismatch: "Passwords do not match.",
        errorShort: "Password must be at least 8 characters.",
    },
    it: {
        title: "Reimposta la tua password",
        subtitle: "Inserisci la tua nuova password qui sotto.",
        labelPassword: "Nuova Password",
        labelConfirm: "Conferma Password",
        placeholderPassword: "Almeno 8 caratteri",
        placeholderConfirm: "Ripeti la nuova password",
        submit: "Reimposta Password",
        errorNoToken: "Token di reset non valido o mancante.",
        errorMismatch: "Le password non corrispondono.",
        errorShort: "La password deve contenere almeno 8 caratteri.",
    },
} as const;

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const t = TEXT[language];

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = searchParams?.get("token");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError(t.errorNoToken);
            return;
        }

        if (form.password.length < 8) {
            setError(t.errorShort);
            return;
        }

        if (form.password !== form.confirm) {
            setError(t.errorMismatch);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: form.password }),
            });

            if (res.ok) {
                router.push("/auth/login?reset=1");
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Something went wrong.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.cardHead}>
                        <Link href="/" className={styles.logoLink}>
                            <Image src="/logo.svg" alt="FixMyBike" width={40} height={40} priority unoptimized />
                        </Link>
                        <h1 className={styles.title}>{t.title}</h1>
                    </div>
                    <div className={styles.errorAlert}>{t.errorNoToken}</div>
                    <p className={styles.switchLink}>
                        <Link href="/auth/forgot-password">Request a new link</Link>
                    </p>
                </div>
            </div>
        );
    }

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

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorAlert}>{error}</div>}

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">{t.labelPassword}</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder={t.placeholderPassword}
                            autoComplete="new-password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm" className="form-label">{t.labelConfirm}</label>
                        <input
                            id="confirm"
                            type="password"
                            className="form-input"
                            placeholder={t.placeholderConfirm}
                            autoComplete="new-password"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                        {loading ? <span className="spinner" /> : t.submit}
                    </button>
                </form>

                <p className={styles.switchLink}>
                    <Link href="/auth/forgot-password">Request a new link</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    );
}
