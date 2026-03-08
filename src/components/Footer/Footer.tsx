"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

const TEXT = {
    en: {
        tagline: "The marketplace where bikes get fixed, bought, and sold. Built by riders, for riders.",
        copyright: "All rights reserved.",
        sections: {
            Marketplace: "Marketplace",
            Account: "Account",
            Company: "Company",
        },
        links: {
            mechanics: "Find a Mechanic",
            parts: "Parts & Gear",
            bikes: "Bikes for Sale",
            wanted: "Wanted Bikes",
            community: "Community",
            login: "Log In",
            register: "Sign Up",
            dashboard: "Dashboard",
            post: "Post a Listing",
            about: "About Us",
            contact: "Contact & Feedback",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
        }
    },
    it: {
        tagline: "Il marketplace dove le bici vengono riparate, comprate e vendute. Creato dai ciclisti, per i ciclisti.",
        copyright: "Tutti i diritti riservati.",
        sections: {
            Marketplace: "Marketplace",
            Account: "Profilo",
            Company: "Azienda",
        },
        links: {
            mechanics: "Trova un meccanico",
            parts: "Ricambi e accessori",
            bikes: "Bici in vendita",
            wanted: "Cerco bici",
            community: "Community",
            login: "Accedi",
            register: "Registrati",
            dashboard: "Dashboard",
            post: "Pubblica un annuncio",
            about: "Chi siamo",
            contact: "Contatti e Feedback",
            privacy: "Privacy Policy",
            terms: "Termini di Servizio",
        }
    }
} as const;

export default function Footer() {
    const { language } = useLanguage();
    const t = TEXT[language];

    const footerSections = [
        {
            title: t.sections.Marketplace,
            links: [
                { href: "/mechanics", label: t.links.mechanics },
                { href: "/parts", label: t.links.parts },
                { href: "/bikes", label: t.links.bikes },
                { href: "/wanted", label: t.links.wanted },
                { href: "/community", label: t.links.community },
            ]
        },
        {
            title: t.sections.Account,
            links: [
                { href: "/auth/login", label: t.links.login },
                { href: "/auth/register", label: t.links.register },
                { href: "/dashboard", label: t.links.dashboard },
                { href: "/listings/new", label: t.links.post },
            ]
        },
        {
            title: t.sections.Company,
            links: [
                { href: "/about", label: t.links.about },
                { href: "/contact", label: t.links.contact },
                { href: "/privacy", label: t.links.privacy },
                { href: "/terms", label: t.links.terms },
            ]
        }
    ];

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <span>🔧</span>
                        <span>Fix<strong>My</strong>Bike</span>
                    </div>
                    <p className={styles.tagline}>
                        {t.tagline}
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

                {footerSections.map((section) => (
                    <div key={section.title} className={styles.linkGroup}>
                        <h4 className={styles.groupTitle}>{section.title}</h4>
                        <ul className={styles.linkList}>
                            {section.links.map((link) => (
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
                        © {new Date().getFullYear()} FixMyBike. {t.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
