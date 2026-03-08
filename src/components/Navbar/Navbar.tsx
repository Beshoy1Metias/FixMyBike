"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";
import { getPusherClient } from "@/lib/pusher";
import NotificationToast from "@/components/NotificationToast/NotificationToast";

const NAV_TEXT = {
    en: {
        mechanics: "Find a Mechanic",
        parts: "Parts & Gear",
        bikes: "Bikes for Sale",
        wanted: "Wanted Bikes",
        community: "Community",
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
        community: "Community",
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
    const [mounted, setMounted] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notification, setNotification] = useState<{ text: string; senderName: string; conversationId: string } | null>(null);
    const { language } = useLanguage();
    const t = NAV_TEXT[language];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (session?.user?.id) {
            fetchUnreadCount();
            
            // Subscribe to personal pusher channel for notifications
            const pusher = getPusherClient();
            const channel = pusher.subscribe(`user-${session.user.id}`);
            
            channel.bind("new-notification", (data: any) => {
                if (data.type === "MESSAGE") {
                    setNotification({
                        text: data.text,
                        senderName: data.senderName,
                        conversationId: data.conversationId
                    });
                    setUnreadCount(prev => prev + 1);
                }
            });

            return () => {
                pusher.unsubscribe(`user-${session.user.id}`);
            };
        }
    }, [session?.user?.id]);

    const fetchUnreadCount = async () => {
        try {
            const res = await fetch("/api/messages/unread-count");
            const data = await res.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    const mobileMenuContent = (
        <>
            <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
            <div className={styles.mobileMenu}>
                <div className={styles.mobileMenuHeader}>
                    <span className={styles.mobileMenuTitle}>Menu</span>
                    <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
                </div>
                <div className={styles.mobileMenuBody}>
                    <Link href="/mechanics" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        🔧 {t.mechanics}
                    </Link>
                    <Link href="/parts" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        ⚙️ {t.parts}
                    </Link>
                    <Link href="/bikes" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        🚲 {t.bikes}
                    </Link>
                    <Link href="/wanted" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        🔍 {t.wanted}
                    </Link>
                    <Link href="/community" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                        💬 {t.community}
                    </Link>
                    
                    <div className={styles.mobileDivider} />
                    
                    {session ? (
                        <>
                            <Link href="/listings/new" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                ➕ {t.postListing}
                            </Link>
                            <Link href="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                👤 {t.dashboard}
                            </Link>
                            <Link href="/messages" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                <div className={styles.msgIconWrapper}>
                                    💬 {t.messages}
                                    {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                                </div>
                            </Link>
                            <Link href="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                ⚙️ {t.profile}
                            </Link>
                            <button
                                className={`${styles.mobileLink} ${styles.signOutBtnMobile}`}
                                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                            >
                                🚪 {t.signOut}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔑 {t.logIn}</Link>
                            <Link href="/auth/register" className={`${styles.mobileLink} ${styles.mobileLinkPrimary}`} onClick={() => setMenuOpen(false)}>✨ {t.signUpFree}</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
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
                        <li>
                            <Link href="/community" className={styles.link}>
                                <span className={styles.linkIcon}>💬</span>
                                {t.community}
                            </Link>
                        </li>
                    </ul>

                    {/* Auth Area */}
                    <div className={styles.authArea}>
                        <LanguageSwitcher />
                        {status === "loading" ? (
                            <div className="spinner" />
                        ) : session ? (
                            <div className={styles.userRow}>
                                <Link href="/messages" className={styles.userBtn} aria-label="Messages">
                                    <div className={styles.msgIconWrapper}>
                                        💬
                                        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                                    </div>
                                </Link>
                                <div className={styles.userMenu}>
                                    <div className={styles.userBtn}>
                                        <span>{session.user.name?.charAt(0).toUpperCase() ?? "U"}</span>
                                    </div>
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
                            </div>
                        ) : (
                            <div className={styles.authButtons}>
                                <Link href="/auth/login" className="btn btn-secondary btn-sm">
                                    {t.logIn}
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary btn-sm">
                                    {t.signUp}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Actions (Visible on small screens) */}
                    <div className={styles.mobileActions}>
                        <LanguageSwitcher />
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
                </div>

                {mounted && menuOpen && createPortal(mobileMenuContent, document.body)}
            </nav>

            <AnimatePresence>
                {notification && (
                    <NotificationToast
                        message={notification.text}
                        senderName={notification.senderName}
                        conversationId={notification.conversationId}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
