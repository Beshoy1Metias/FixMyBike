"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "../auth.module.css";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "1";

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
            setError("Invalid email or password.");
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
                    <Link href="/" className={styles.logoLink}>🔧 FixMyBike</Link>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

                {justRegistered && (
                    <div className={styles.successAlert}>
                        Account created! You can now log in.
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
                    Continue with Google
                </button>

                {/* Divider */}
                <div className={styles.divider}>
                    <span>or sign in with email</span>
                </div>

                {/* Email/Password form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorAlert}>{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
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
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Your password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                        {loading ? <span className="spinner" /> : "Sign In"}
                    </button>
                </form>

                <p className={styles.switchLink}>
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register">Sign up for free</Link>
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
