import Link from "next/link";
import styles from "./page.module.css";
import { getCurrentLanguage } from "@/lib/language";

const TEXT = {
  en: {
    heroEyebrow: "🚲 Padova's Bike Community Marketplace",
    heroTitleLine1: "Fix, Buy & Sell",
    heroTitleLine2: "Your Bike in Padova.",
    heroBody:
      "Connect with skilled local mechanics, buy and sell parts, or find the bike you've always wanted — all based right here in Padova.",
    heroPrimaryCta: "🔧 Find a Mechanic",
    heroSecondaryCta: "Post a Listing",
    categoriesTitle: "What are you looking for?",
    categoriesBody: "Everything bikes, in one marketplace.",
    catMechanicTitle: "Find a Mechanic",
    catMechanicBody:
      "Browse skilled local mechanics and DIY fixers. Get quotes and book repairs.",
    catPartsTitle: "Parts & Accessories",
    catPartsBody:
      "Buy and sell bike parts, gear, and accessories. New and used.",
    catBikesTitle: "Bikes for Sale",
    catBikesBody:
      "Browse full bikes for sale from private sellers. Road, MTB, gravel, and more.",
    catWantedTitle: "Looking to Buy",
    catWantedBody:
      "Post your wishlist with specs and budget. Let sellers come to you.",
    howTitle: "How it works",
    howBody: "Get started in minutes.",
    steps: [
      {
        step: "01",
        title: "Create an account",
        desc: "Sign up for free in under a minute. No credit card required.",
      },
      {
        step: "02",
        title: "Post or browse",
        desc: "List your skills, parts, or bike — or search thousands of listings.",
      },
      {
        step: "03",
        title: "Connect & transact",
        desc: "Message directly, agree on terms, and close the deal safely.",
      },
    ],
    ctaTitle: "Padova's bike community starts here.",
    ctaBody:
      "Join local cyclists, mechanics, and sellers across Padova. It's free to get started.",
    ctaButton: "Get Started — It's Free",
  },
  it: {
    heroEyebrow: "🚲 Il marketplace delle bici di Padova",
    heroTitleLine1: "Ripara, compra e vendi",
    heroTitleLine2: "la tua bici a Padova.",
    heroBody:
      "Metti in contatto ciclisti e meccanici locali, compra e vendi ricambi oppure trova la bici che hai sempre voluto — tutto qui, a Padova.",
    heroPrimaryCta: "🔧 Trova un meccanico",
    heroSecondaryCta: "Pubblica un annuncio",
    categoriesTitle: "Cosa stai cercando?",
    categoriesBody: "Tutto il mondo bici, in un unico marketplace.",
    catMechanicTitle: "Trova un meccanico",
    catMechanicBody:
      "Scopri meccanici e smanettoni di fiducia vicino a te. Chiedi preventivi e prenota riparazioni.",
    catPartsTitle: "Ricambi e accessori",
    catPartsBody:
      "Compra e vendi componenti, abbigliamento e accessori. Nuovo e usato.",
    catBikesTitle: "Bici in vendita",
    catBikesBody:
      "Sfoglia le bici in vendita da privati: strada, MTB, gravel, e‑bike e altro.",
    catWantedTitle: "Cerchi una bici",
    catWantedBody:
      "Pubblica cosa stai cercando, con budget e dettagli. Lascia che siano i venditori a contattarti.",
    howTitle: "Come funziona",
    howBody: "Inizia in pochi minuti.",
    steps: [
      {
        step: "01",
        title: "Crea un account",
        desc: "Registrati gratis in meno di un minuto. Nessuna carta richiesta.",
      },
      {
        step: "02",
        title: "Pubblica o cerca",
        desc: "Metti online le tue competenze, ricambi o bici — oppure cerca tra gli annunci.",
      },
      {
        step: "03",
        title: "Mettiti d'accordo",
        desc: "Scrivi in chat, concorda i dettagli e chiudi l'affare in sicurezza.",
      },
    ],
    ctaTitle: "La community ciclistica di Padova parte da qui.",
    ctaBody:
      "Unisciti a ciclisti, meccanici e venditori della zona. Iniziare è gratis.",
    ctaButton: "Inizia ora — è gratis",
  },
} as const;

export default async function Home() {
  const lang = await getCurrentLanguage();
  const t = TEXT[lang];

  return (
    <>
      {/* ---- HERO ---- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className="page-header__eyebrow">{t.heroEyebrow}</span>
            <h1 className={`text-display ${styles.heroTitle}`}>
              {t.heroTitleLine1}
              <br />
              <span className="gradient-text">{t.heroTitleLine2}</span>
            </h1>
            <p className="text-body-lg">
              {t.heroBody}
            </p>
            <div className={styles.heroCta}>
              <Link href="/mechanics" className="btn btn-primary btn-lg">
                {t.heroPrimaryCta}
              </Link>
              <Link href="/auth/register" className="btn btn-secondary btn-lg">
                {t.heroSecondaryCta}
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageBlob} />
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>Padova</span>
                <span className={styles.statLabel}>
                  {lang === "it" ? "Città di riferimento" : "Based & Focused"}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  {lang === "it" ? "Gratis" : "Free"}
                </span>
                <span className={styles.statLabel}>
                  {lang === "it" ? "Per annunci e ricerche" : "To List & Browse"}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  {lang === "it" ? "Locale" : "Local"}
                </span>
                <span className={styles.statLabel}>
                  {lang === "it"
                    ? "Meccanici e venditori della zona"
                    : "Mechanics & Sellers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CATEGORIES ---- */}
      <section className={`section ${styles.categories}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="text-heading-1">{t.categoriesTitle}</h2>
            <p className="text-body-lg">{t.categoriesBody}</p>
          </div>
          <div className={styles.categoryGrid}>
            <Link href="/mechanics" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🔧</div>
              <h3 className="text-heading-3">{t.catMechanicTitle}</h3>
              <p className="text-sm text-secondary-color">
                {t.catMechanicBody}
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/parts" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>⚙️</div>
              <h3 className="text-heading-3">{t.catPartsTitle}</h3>
              <p className="text-sm text-secondary-color">
                {t.catPartsBody}
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/bikes" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🚲</div>
              <h3 className="text-heading-3">{t.catBikesTitle}</h3>
              <p className="text-sm text-secondary-color">
                {t.catBikesBody}
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/wanted" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🔍</div>
              <h3 className="text-heading-3">{t.catWantedTitle}</h3>
              <p className="text-sm text-secondary-color">
                {t.catWantedBody}
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className={`section ${styles.howItWorks}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="text-heading-1">{t.howTitle}</h2>
            <p className="text-body-lg">{t.howBody}</p>
          </div>
          <div className="grid-3">
            {t.steps.map((item) => (
              <div key={item.step} className={styles.step}>
                <span className={styles.stepNum}>{item.step}</span>
                <h3 className="text-heading-3">{item.title}</h3>
                <p className="text-sm text-secondary-color">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaGlow} />
            <h2 className="text-heading-1">
              {t.ctaTitle}
            </h2>
            <p className="text-body-lg">
              {t.ctaBody}
            </p>
            <div className={styles.ctaActions}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                {t.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
