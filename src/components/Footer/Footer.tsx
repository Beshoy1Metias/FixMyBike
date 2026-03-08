import Link from "next/link";
import styles from "./Footer.module.css";

const footerLinks = {
    Marketplace: [
        { href: "/mechanics", label: "Find a Mechanic" },
        { href: "/parts", label: "Parts & Gear" },
        { href: "/bikes", label: "Bikes for Sale" },
        { href: "/wanted", label: "Wanted Bikes" },
        { href: "/community", label: "Community" },
    ],
    Account: [
        { href: "/auth/login", label: "Log In" },
        { href: "/auth/register", label: "Sign Up" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/listings/new", label: "Post a Listing" },
    ],
    Company: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact & Feedback" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
    ],
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <span>🔧</span>
                        <span>Fix<strong>My</strong>Bike</span>
                    </div>
                    <p className={styles.tagline}>
                        The marketplace where bikes get fixed, bought, and sold. Built by riders, for riders.
                    </p>
                    <div className={styles.socials}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.social}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className={styles.social}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.social}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                    </div>
                </div>

                {Object.entries(footerLinks).map(([section, links]) => (
                    <div key={section} className={styles.linkGroup}>
                        <h4 className={styles.groupTitle}>{section}</h4>
                        <ul className={styles.linkList}>
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.footerLink}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={styles.bottom}>
                <div className="container">
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} FixMyBike. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
