import Link from "next/link";
import styles from "./Footer.module.css";

const footerLinks = {
    Marketplace: [
        { href: "/mechanics", label: "Find a Mechanic" },
        { href: "/parts", label: "Parts & Gear" },
        { href: "/bikes", label: "Bikes for Sale" },
        { href: "/wanted", label: "Wanted Bikes" },
    ],
    Account: [
        { href: "/auth/login", label: "Log In" },
        { href: "/auth/register", label: "Sign Up" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/listings/new", label: "Post a Listing" },
    ],
    Company: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
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
                        <a href="#" aria-label="Instagram" className={styles.social}>📸</a>
                        <a href="#" aria-label="Twitter/X" className={styles.social}>🐦</a>
                        <a href="#" aria-label="Facebook" className={styles.social}>👥</a>
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
