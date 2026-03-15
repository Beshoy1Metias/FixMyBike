"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "../auth.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Welcome back",
        subtitle: "Sign in to your account",
        successAlert: "Account created! You can now log in.",
        resetAlert: "Password reset successfully. You can now log in.",
        googleBtn: "Continue with Google",
        divider: "or sign in with email",
        labelEmail: "Email",
        labelPassword: "Password",
        placeholderPassword: "Your password",
        forgotPassword: "Forgot password?",
        submit: "Sign In",
        switchText: "Don't have an account?",
        switchLink: "Sign up for free",
        errorInvalid: "Invalid email or password.",
    },
    it: {
        title: "Bentornato",
        subtitle: "Accedi al tuo account per continuare",
        successAlert: "Account creato con successo! Ora puoi accedere.",
        resetAlert: "Password reimpostata con successo. Ora puoi accedere.",
        googleBtn: "Continua con Google",
        divider: "oppure accedi con l'email",
        labelEmail: "Email",
        labelPassword: "Password",
        placeholderPassword: "La tua password",
        forgotPassword: "Password dimenticata?",
        submit: "Accedi",
        switchText: "Non hai ancora un account?",
        switchLink: "Registrati gratis",
        errorInvalid: "Email o password non valide.",
    },
} as const;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams?.get("registered") === "1";
    const justReset = searchParams?.get("reset") === "1";
    const { language } = useLanguage();
    const t = TEXT[language];

    const [form, setForm] = useState({ email: "", password: "" });
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

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        if (res?.error) {
            setError(t.errorInvalid);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
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

                {justRegistered && (
                    <div className={styles.successAlert}>
                        {t.successAlert}
                    </div>
                )}

                {justReset && (
                    <div className={styles.successAlert}>
                        {t.resetAlert}
                    </div>
                )}

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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                            <label htmlFor="password" className="form-label" style={{ margin: 0 }}>{t.labelPassword}</label>
                            <Link href="/auth/forgot-password" style={{ fontSize: "0.85rem", color: "var(--color-primary)", textDecoration: "none" }}>
                                {t.forgotPassword}
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder={t.placeholderPassword}
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                        {loading ? <span className="spinner" /> : t.submit}
                    </button>
                </form>

                <p className={styles.switchLink}>
                    {t.switchText}{" "}
                    <Link href="/auth/register">{t.switchLink}</Link>
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

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
