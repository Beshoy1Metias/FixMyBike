"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Create your account",
        subtitle: "Join the cycling community",
        googleBtn: "Continue with Google",
        divider: "or sign up with email",
        labelName: "Full Name",
        placeholderName: "John Smith",
        labelEmail: "Email",
        labelPassword: "Password",
        placeholderPassword: "Min. 8 characters",
        submit: "Create Account",
        switchText: "Already have an account?",
        switchLink: "Log in",
        errorGeneric: "Something went wrong.",
    },
    it: {
        title: "Crea il tuo account",
        subtitle: "Unisciti alla community ciclistica",
        googleBtn: "Continua con Google",
        divider: "o registrati con la tua email",
        labelName: "Nome Completo",
        placeholderName: "Mario Rossi",
        labelEmail: "Email",
        labelPassword: "Password",
        placeholderPassword: "Min. 8 caratteri",
        submit: "Crea Account",
        switchText: "Hai già un account?",
        switchLink: "Accedi",
        errorGeneric: "Qualcosa è andato storto.",
    },
} as const;

export default function RegisterPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const t = TEXT[language];

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogle = async () => {
        setGoogleLoading(true);
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || t.errorGeneric);
            setLoading(false);
            return;
        }

        router.push("/auth/login?registered=1");
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHead}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.png" alt="FixMyBike" width={40} height={40} priority unoptimized />
                    </Link>
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>

                {/* Google Sign-In */}
                <button
                    className={styles.googleBtn}
                    onClick={handleGoogle}
                    disabled={googleLoading}
                    type="button"
                >
                    {googleLoading ? (
                        <span className="spinner" style={{ borderTopColor: "#333" }} />
                    ) : (
                        <GoogleIcon />
                    )}
                    {t.googleBtn}
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                    <span>{t.divider}</span>
                </div>

                {/* Email/Password form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorAlert}>{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">{t.labelName}</label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            placeholder={t.placeholderName}
                            autoComplete="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">{t.labelEmail}</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

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

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                        {loading ? <span className="spinner" /> : t.submit}
                    </button>
                </form>

                <p className={styles.switchLink}>
                    {t.switchText}{" "}
                    <Link href="/auth/login">{t.switchLink}</Link>
                </p>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    );
}
