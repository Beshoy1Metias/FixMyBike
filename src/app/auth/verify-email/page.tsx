"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "../auth.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        title: "Verifying your email",
        loading: "Verifying your email address…",
        successTitle: "Email verified!",
        successBody: "Your account is now active. You can log in.",
        loginBtn: "Go to Login",
        errorTitle: "Verification failed",
        errorBody: "The link is invalid or has expired.",
        retryText: "Register again to get a new link.",
        retryLink: "Create account",
    },
    it: {
        title: "Verifica email",
        loading: "Verifica del tuo indirizzo email in corso…",
        successTitle: "Email verificata!",
        successBody: "Il tuo account è ora attivo. Ora puoi accedere.",
        loginBtn: "Vai al Login",
        errorTitle: "Verifica fallita",
        errorBody: "Il link non è valido o è scaduto.",
        retryText: "Registrati di nuovo per ottenere un nuovo link.",
        retryLink: "Crea account",
    },
} as const;

type State = "loading" | "success" | "error";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const t = TEXT[language];
    const [state, setState] = useState<State>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = searchParams?.get("token");
        if (!token) {
            setState("error");
            setErrorMessage(t.errorBody);
            return;
        }

        fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                if (res.ok) {
                    setState("success");
                } else {
                    const data = await res.json().catch(() => ({}));
                    setErrorMessage(data.error || t.errorBody);
                    setState("error");
                }
            })
            .catch(() => {
                setErrorMessage(t.errorBody);
                setState("error");
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHead}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.svg" alt="FixMyBike" width={40} height={40} priority unoptimized />
                    </Link>
                    <h1 className={styles.title}>{t.title}</h1>
                </div>

                {state === "loading" && (
                    <div style={{ textAlign: "center", padding: "var(--space-10) 0", color: "var(--text-secondary)" }}>
                        <span className="spinner" style={{ display: "inline-block", marginBottom: "var(--space-4)" }} />
                        <p style={{ margin: 0 }}>{t.loading}</p>
                    </div>
                )}

                {state === "success" && (
                    <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
                        <div style={{
                            fontSize: "3rem",
                            marginBottom: "var(--space-4)",
                            lineHeight: 1,
                        }}>✅</div>
                        <h2 style={{ color: "var(--text-primary)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                            {t.successTitle}
                        </h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
                            {t.successBody}
                        </p>
                        <Link href="/auth/login" className="btn btn-primary" style={{ display: "inline-block" }}>
                            {t.loginBtn}
                        </Link>
                    </div>
                )}

                {state === "error" && (
                    <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)", lineHeight: 1 }}>❌</div>
                        <h2 style={{ color: "var(--text-primary)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                            {t.errorTitle}
                        </h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                            {errorMessage || t.errorBody}
                        </p>
                        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
                            {t.retryText}{" "}
                            <Link href="/auth/register" style={{ color: "var(--color-primary)" }}>
                                {t.retryLink}
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
