"use client";

import Link from "next/link";
import Image from "next/image";
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
        tagline: "Il marketplace per riparare, comprare e vendere bici. Creato dai ciclisti, per i ciclisti.",
        copyright: "Tutti i diritti riservati.",
        sections: {
            Marketplace: "Marketplace",
            Account: "Account",
            Company: "Azienda",
        },
        links: {
            mechanics: "Trova un Meccanico",
            parts: "Ricambi e Accessori",
            bikes: "Bici in Vendita",
            wanted: "Annunci di Ricerca",
            community: "Community",
            login: "Accedi",
            register: "Registrati",
            dashboard: "Dashboard",
            post: "Pubblica un Annuncio",
            about: "Chi Siamo",
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
                        <Image
                            src="/logo.svg"
                            alt="FixMyBike Logo"
                            width={24}
                            height={24}
                            style={{ objectFit: "contain" }}
                        />
                        <span>Fix<strong>My</strong>Bike</span>
                    </div>
                    <p className={styles.tagline}>
                        {t.tagline}
                    </p>
                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/fixmybike.it/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.social}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://www.linkedin.com/company/fix-mybike" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.social}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
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
