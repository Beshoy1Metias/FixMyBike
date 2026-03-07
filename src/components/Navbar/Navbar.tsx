"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
    { href: "/mechanics", label: "Find a Mechanic", icon: "🔧" },
    { href: "/parts", label: "Parts & Gear", icon: "⚙️" },
    { href: "/bikes", label: "Bikes for Sale", icon: "🚲" },
    { href: "/wanted", label: "Wanted Bikes", icon: "🔍" },
];

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

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
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className={styles.link}>
                                <span className={styles.linkIcon}>{link.icon}</span>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Auth Area */}
                <div className={styles.authArea}>
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
                                <Link href="/dashboard" className={styles.dropdownItem}>Dashboard</Link>
                                <Link href="/listings/new" className={styles.dropdownItem}>Post a Listing</Link>
                                <Link href="/messages" className={styles.dropdownItem}>Messages</Link>
                                <Link href="/profile" className={styles.dropdownItem}>Profile</Link>
                                <button
                                    className={`${styles.dropdownItem} ${styles.signOutBtn}`}
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn btn-secondary btn-sm">
                                Log In
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary btn-sm">
                                Sign Up
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
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    <hr className="divider" />
                    {session ? (
                        <>
                            <Link
                                href="/messages"
                                className={styles.mobileLink}
                                onClick={() => setMenuOpen(false)}
                            >
                                💬 Messages
                            </Link>
                            <button
                                className={styles.mobileLink}
                                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log In</Link>
                            <Link href="/auth/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
