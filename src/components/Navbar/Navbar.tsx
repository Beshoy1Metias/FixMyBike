"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import styles from "./Navbar.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const NAV_TEXT = {
    en: {
        mechanics: "Find a Mechanic",
        parts: "Parts & Gear",
        bikes: "Bikes for Sale",
        wanted: "Wanted Bikes",
        dashboard: "Dashboard",
        postListing: "Post a Listing",
        messages: "Messages",
        profile: "Profile",
        signOut: "Sign Out",
        logIn: "Log In",
        signUp: "Sign Up",
        signUpFree: "Sign Up Free",
    },
    it: {
        mechanics: "Trova un meccanico",
        parts: "Ricambi & accessori",
        bikes: "Bici in vendita",
        wanted: "Cerco bici",
        dashboard: "Dashboard",
        postListing: "Pubblica un annuncio",
        messages: "Messaggi",
        profile: "Profilo",
        signOut: "Esci",
        logIn: "Accedi",
        signUp: "Registrati",
        signUpFree: "Registrati gratis",
    },
} as const;

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const { language } = useLanguage();
    const t = NAV_TEXT[language];

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.inner}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🔧</span>
                    <span className={styles.logoText}>
                        Fix<span className={styles.logoBold}>My</span>Bike
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className={styles.links}>
                    <li>
                        <Link href="/mechanics" className={styles.link}>
                            <span className={styles.linkIcon}>🔧</span>
                            {t.mechanics}
                        </Link>
                    </li>
                    <li>
                        <Link href="/parts" className={styles.link}>
                            <span className={styles.linkIcon}>⚙️</span>
                            {t.parts}
                        </Link>
                    </li>
                    <li>
                        <Link href="/bikes" className={styles.link}>
                            <span className={styles.linkIcon}>🚲</span>
                            {t.bikes}
                        </Link>
                    </li>
                    <li>
                        <Link href="/wanted" className={styles.link}>
                            <span className={styles.linkIcon}>🔍</span>
                            {t.wanted}
                        </Link>
                    </li>
                </ul>

                {/* Auth Area */}
                <div className={styles.authArea}>
                    <LanguageSwitcher />
                    {status === "loading" ? (
                        <div className="spinner" />
                    ) : session ? (
                        <div className={styles.userMenu}>
                            <Link href="/messages" className={styles.userBtn} aria-label="Messages">
                                💬
                            </Link>
                            <Link href="/dashboard" className={styles.userBtn}>
                                <span>{session.user.name?.charAt(0).toUpperCase() ?? "U"}</span>
                            </Link>
                            <div className={styles.dropdown}>
                                <Link href="/dashboard" className={styles.dropdownItem}>{t.dashboard}</Link>
                                <Link href="/listings/new" className={styles.dropdownItem}>{t.postListing}</Link>
                                <Link href="/messages" className={styles.dropdownItem}>{t.messages}</Link>
                                <Link href="/profile" className={styles.dropdownItem}>{t.profile}</Link>
                                <button
                                    className={`${styles.dropdownItem} ${styles.signOutBtn}`}
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    {t.signOut}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn btn-secondary btn-sm">
                                {t.logIn}
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary btn-sm">
                                {t.signUp}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={menuOpen ? styles.barOpen : styles.bar} />
                    <span className={menuOpen ? styles.barHide : styles.bar} />
                    <span className={menuOpen ? styles.barOpenBottom : styles.bar} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <Link
                        href="/mechanics"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        🔧 {t.mechanics}
                    </Link>
                    <Link
                        href="/parts"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        ⚙️ {t.parts}
                    </Link>
                    <Link
                        href="/bikes"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        🚲 {t.bikes}
                    </Link>
                    <Link
                        href="/wanted"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        🔍 {t.wanted}
                    </Link>
                    <hr className="divider" />
                    {session ? (
                        <>
                            <Link
                                href="/messages"
                                className={styles.mobileLink}
                                onClick={() => setMenuOpen(false)}
                            >
                                💬 {t.messages}
                            </Link>
                            <button
                                className={styles.mobileLink}
                                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                            >
                                {t.signOut}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.logIn}</Link>
                            <Link href="/auth/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>{t.signUpFree}</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
