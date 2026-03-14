"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Navbar.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";
import { getPusherClient } from "@/lib/pusher";
import NotificationToast from "@/components/NotificationToast/NotificationToast";

const NAV_TEXT = {
    en: {
        mechanics: "Mechanics",
        parts: "Parts",
        bikes: "Bikes",
        wanted: "Wanted",
        community: "Community",
        shops: "Shops",
        dashboard: "Dashboard",
        postListing: "Post a Listing",
        messages: "Messages",
        profile: "Profile",
        signOut: "Sign Out",
        logIn: "Log In",
        signUp: "Sign Up",
        signUpFree: "Sign up free",
    },
    it: {
        mechanics: "Meccanici",
        parts: "Ricambi",
        bikes: "Bici",
        wanted: "Cerco",
        community: "Community",
        shops: "Negozi",
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

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await fetch("/api/messages/unread-count");
            const data = await res.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (session?.user?.id) {
            const init = async () => {
                await fetchUnreadCount();
            };
            init();
            
            const pusher = getPusherClient();
            const channel = pusher.subscribe(`user-${session.user.id}`);
            
            channel.bind("new-notification", (data: { type: string; text: string; senderName: string; conversationId: string }) => {
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
    }, [session?.user?.id, fetchUnreadCount]);

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
        <AnimatePresence>
            {menuOpen && (
                <>
                    <motion.div 
                        className={styles.backdrop} 
                        onClick={() => setMenuOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div 
                        className={styles.mobileMenu}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className={styles.mobileMenuHeader}>
                            <span className={styles.mobileMenuTitle}>Menu</span>
                            <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
                        </div>
                        <div className={styles.mobileMenuBody}>
                            <Link href="/mechanics" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.mechanics}</Link>
                            <Link href="/parts" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.parts}</Link>
                            <Link href="/bikes" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.bikes}</Link>
                            <Link href="/wanted" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.wanted}</Link>
                            <Link href="/shops" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.shops}</Link>
                            <Link href="/community" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.community}</Link>
                            
                            <div className={styles.mobileDivider} />
                            
                            {session ? (
                                <>
                                    <Link href="/listings/new" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.postListing}</Link>
                                    <Link href="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.dashboard}</Link>
                                    <Link href="/messages" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                                        {t.messages}
                                        {unreadCount > 0 && <span className={styles.badge} style={{ position: "static", marginLeft: "8px", transform: "none" }}>{unreadCount}</span>}
                                    </Link>
                                    <Link href="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.profile}</Link>
                                    <button
                                        className={`${styles.mobileLink} ${styles.signOutBtnMobile}`}
                                        onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                                    >
                                        {t.signOut}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t.logIn}</Link>
                                    <Link href="/auth/register" className={`${styles.mobileLink} ${styles.mobileLinkPrimary}`} onClick={() => setMenuOpen(false)}>{t.signUpFree}</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.inner}`}>
                    <Link href="/" className={styles.logo}>
                        <Image 
                            src="/logo.svg" 
                            alt="FixMyBike" 
                            width={32} 
                            height={32} 
                            className={styles.logoImage}
                            priority
                            unoptimized
                        />
                        <span className={styles.logoText}>
                            Fix<span className={styles.logoBold}>My</span>Bike
                        </span>
                    </Link>

                    <div className={styles.navSection}>
                        <ul className={styles.links}>
                            <li><Link href="/mechanics" className={styles.link}>{t.mechanics}</Link></li>
                            <li><Link href="/bikes" className={styles.link}>{t.bikes}</Link></li>
                            <li><Link href="/parts" className={styles.link}>{t.parts}</Link></li>
                            <li><Link href="/wanted" className={styles.link}>{t.wanted}</Link></li>
                            <li><Link href="/shops" className={styles.link}>{t.shops}</Link></li>
                        </ul>

                        <div className={styles.userActions}>
                            <Link href="/community" className={styles.link}>{t.community}</Link>
                            <div style={{ height: "20px", width: "1px", background: "var(--border)" }} />
                            
                            <div className={styles.authArea} style={{ gap: "var(--space-4)" }}>
                                <LanguageSwitcher />
                                {status === "loading" ? (
                                    <div className="spinner" />
                                ) : session ? (
                                    <div className={styles.userRow}>
                                        <Link href="/messages" className={styles.userBtn} aria-label="Messages" style={{ background: "none", color: "var(--text-secondary)" }}>
                                            <div className={styles.msgIconWrapper}>
                                                <div className={styles.messageIcon} />
                                                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                                            </div>
                                        </Link>
                                        <div className={styles.userMenu}>
                                            <motion.div 
                                                className={styles.userBtn}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ 
                                                    background: session.user.image ? "none" : "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                                    overflow: "hidden",
                                                    width: "36px",
                                                    height: "36px"
                                                }}
                                            >
                                                {session.user.image ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={session.user.image} alt={session.user.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <span style={{ fontSize: "0.9rem" }}>{session.user.name?.charAt(0).toUpperCase() ?? "U"}</span>
                                                )}
                                            </motion.div>
                                            <div className={styles.dropdown}>
                                                <Link href="/dashboard" className={styles.dropdownItem}>{t.dashboard}</Link>
                                                <Link href="/listings/new" className={styles.dropdownItem}>{t.postListing}</Link>
                                                <Link href="/messages" className={styles.dropdownItem}>{t.messages}</Link>
                                                <Link href="/profile" className={styles.dropdownItem}>{t.profile}</Link>
                                                <button className={`${styles.dropdownItem} ${styles.signOutBtn}`} onClick={() => signOut({ callbackUrl: "/" })}>{t.signOut}</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.authButtons}>
                                        <Link href="/auth/login" className="btn btn-ghost btn-sm">{t.logIn}</Link>
                                        <Link href="/auth/register" className="btn btn-primary btn-sm">{t.signUp}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.mobileActions}>
                        <LanguageSwitcher />
                        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
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
