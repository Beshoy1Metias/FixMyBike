import Link from "next/link";
import styles from "./page.module.css";
import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";

const TEXT = {
  en: {
    heroEyebrow: "Student-built for the Padova cycling community",
    heroTitleLine1: "The Future of Bike",
    heroTitleLine2: "Care in Padova.",
    heroBody:
      "A platform born out of necessity at the University of Padua. Connect with expert mechanics, find quality parts, and discover local bike shops — all in one place.",
    heroPrimaryCta: "Explore Marketplace",
    heroSecondaryCta: "Find a Shop",
    heroStats: [
      { num: "Local", label: "Focused on Padova" },
      { num: "Direct", label: "No middleman fees" },
      { num: "Student", label: "Built with passion" },
    ],
    categoriesTitle: "Everything for your ride",
    categoriesBody: "A complete ecosystem for the modern cyclist.",
    catMechanicTitle: "Mechanics",
    catMechanicBody: "Professional repair services and local bike fixers near you.",
    catPartsTitle: "Parts & Gear",
    catPartsBody: "Buy and sell quality components, accessories, and tools.",
    catBikesTitle: "Bikes",
    catBikesBody: "Browse second-hand bikes from trusted local riders.",
    catShopsTitle: "Bike Shops",
    catShopsBody: "Discover and locate the best professional bike shops in town.",
    catWantedTitle: "Wanted",
    catWantedBody: "Can't find it? Post what you're looking for and get offers.",
    founderTitle: "A Note from the Founder",
    founderBody: "I started FixMyBike during my first year of Information Engineering at the University of Padua. After struggling to find reliable parts and mechanics for my own bike, I realized our community needed a dedicated space. What began as a student project is now growing into a platform to empower every cyclist in Padova.",
    founderName: "Beshoy Bassem",
    founderRole: "Founder & Engineering Student",
    howTitle: "How it works",
    howBody: "Simple, transparent, and local.",
    steps: [
      {
        step: "01",
        title: "Join",
        desc: "Create your profile and join the largest bike network in Padova.",
      },
      {
        step: "02",
        title: "Discover",
        desc: "Find exactly what you need, from a rare derailleur to a local shop.",
      },
      {
        step: "03",
        title: "Connect",
        desc: "Message directly, visit shops, and get back on the road safely.",
      },
    ],
    ctaTitle: "Ready to ride better?",
    ctaBody: "Join hundreds of cyclists and mechanics in the Padova community today.",
    ctaButton: "Join FixMyBike",
  },
  it: {
    heroEyebrow: "Creato da studenti per i ciclisti di Padova",
    heroTitleLine1: "Il Futuro della Cura",
    heroTitleLine2: "della Bici a Padova.",
    heroBody:
      "Una piattaforma nata per necessità all'Università di Padova. Connettiti con meccanici esperti, trova ricambi di qualità e scopri i negozi locali — tutto in un unico posto.",
    heroPrimaryCta: "Esplora Marketplace",
    heroSecondaryCta: "Trova un Negozio",
    heroStats: [
      { num: "Locale", label: "Focalizzato su Padova" },
      { num: "Diretto", label: "Nessuna commissione" },
      { num: "Student", label: "Creato con passione" },
    ],
    categoriesTitle: "Tutto per la tua bici",
    categoriesBody: "Un ecosistema completo per il ciclista moderno.",
    catMechanicTitle: "Meccanici",
    catMechanicBody: "Servizi di riparazione professionali e riparatori locali vicino a te.",
    catPartsTitle: "Ricambi",
    catPartsBody: "Compra e vendi componenti, accessori e attrezzatura di qualità.",
    catBikesTitle: "Bici",
    catBikesBody: "Sfoglia bici usate da venditori locali affidabili.",
    catShopsTitle: "Negozi",
    catShopsBody: "Scopri e localizza i migliori negozi di bici professionali in città.",
    catWantedTitle: "Cerco",
    catWantedBody: "Non trovi quello che cerchi? Pubblica un annuncio e ricevi offerte.",
    founderTitle: "Una nota dal fondatore",
    founderBody: "Ho iniziato FixMyBike durante il mio primo anno di Ingegneria dell'Informazione all'Università di Padova. Dopo aver faticato a trovare pezzi di ricambio e meccanici affidabili per la mia bici, ho capito che la nostra comunità aveva bisogno di uno spazio dedicato. Quello che era un progetto studentesco sta diventando una piattaforma per ogni ciclista a Padova.",
    founderName: "Beshoy Bassem",
    founderRole: "Fondatore e Studente di Ingegneria",
    howTitle: "Come funziona",
    howBody: "Semplice, trasparente e locale.",
    steps: [
      {
        step: "01",
        title: "Unisciti",
        desc: "Crea il tuo profilo e unisciti alla più grande rete ciclistica di Padova.",
      },
      {
        step: "02",
        title: "Scopri",
        desc: "Trova esattamente ciò di cui hai bisogno, da un cambio raro a un negozio locale.",
      },
      {
        step: "03",
        title: "Connettiti",
        desc: "Contatta direttamente, visita i negozi e torna in strada in sicurezza.",
      },
    ],
    ctaTitle: "Pronto a pedalare meglio?",
    ctaBody: "Unisciti a centinaia di ciclisti e meccanici della comunità di Padova oggi stesso.",
    ctaButton: "Unisciti a FixMyBike",
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
          <FadeIn className={styles.heroContent} direction="right">
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
              <Link href="/bikes" className="btn btn-primary btn-lg">
                {t.heroPrimaryCta}
              </Link>
              <Link href="/shops" className="btn btn-secondary btn-lg">
                {t.heroSecondaryCta}
              </Link>
            </div>
          </FadeIn>
          <FadeIn className={styles.heroImage} direction="left" delay={0.2}>
            <div className={styles.heroImageBlob} />
            <div className={styles.heroStats}>
              {t.heroStats.map((stat, i) => (
                <div key={i} className={styles.stat}>
                  <span className={styles.statNum}>{stat.num}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---- CATEGORIES ---- */}
      <section className={`section ${styles.categories}`}>
        <div className="container">
          <FadeIn className={styles.sectionHead} direction="up">
            <h2 className="text-heading-1">{t.categoriesTitle}</h2>
            <p className="text-body-lg">{t.categoriesBody}</p>
          </FadeIn>
          <StaggerContainer className={styles.categoryGrid} stagger={0.1}>
            <FadeIn>
              <Link href="/mechanics" className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ background: "rgba(255, 92, 40, 0.1)", color: "var(--color-primary)" }}>🔧</div>
                <h3 className="text-heading-3">{t.catMechanicTitle}</h3>
                <p className="text-sm text-secondary-color">
                  {t.catMechanicBody}
                </p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            </FadeIn>
            <FadeIn>
              <Link href="/parts" className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ background: "rgba(255, 184, 0, 0.1)", color: "var(--color-accent)" }}>⚙️</div>
                <h3 className="text-heading-3">{t.catPartsTitle}</h3>
                <p className="text-sm text-secondary-color">
                  {t.catPartsBody}
                </p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            </FadeIn>
            <FadeIn>
              <Link href="/bikes" className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>🚲</div>
                <h3 className="text-heading-3">{t.catBikesTitle}</h3>
                <p className="text-sm text-secondary-color">
                  {t.catBikesBody}
                </p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            </FadeIn>
            <FadeIn>
              <Link href="/shops" className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>📍</div>
                <h3 className="text-heading-3">{t.catShopsTitle}</h3>
                <p className="text-sm text-secondary-color">
                  {t.catShopsBody}
                </p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            </FadeIn>
            <FadeIn>
              <Link href="/wanted" className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>🔍</div>
                <h3 className="text-heading-3">{t.catWantedTitle}</h3>
                <p className="text-sm text-secondary-color">
                  {t.catWantedBody}
                </p>
                <span className={styles.categoryArrow}>→</span>
              </Link>
            </FadeIn>
          </StaggerContainer>
        </div>
      </section>

      {/* ---- FOUNDER NOTE ---- */}
      <section className="section" style={{ background: "var(--surface-2)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <FadeIn className={styles.founderNote}>
            <div className={styles.founderContent}>
              <h2 className="text-heading-1">{t.founderTitle}</h2>
              <p className="text-body" style={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                &quot;{t.founderBody}&quot;
              </p>
              <div style={{ marginTop: "var(--space-6)" }}>
                <p className="text-heading-3" style={{ marginBottom: "2px" }}>{t.founderName}</p>
                <p className="text-sm text-secondary-color">{t.founderRole}</p>
              </div>
            </div>
            <div className={styles.founderImageContainer}>
               <div className={styles.founderAvatarPlaceholder}>
                  {t.founderName.charAt(0)}
               </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className={`section ${styles.howItWorks}`}>
        <div className="container">
          <FadeIn className={styles.sectionHead}>
            <h2 className="text-heading-1">{t.howTitle}</h2>
            <p className="text-body-lg">{t.howBody}</p>
          </FadeIn>
          <StaggerContainer className="grid-3" stagger={0.2}>
            {t.steps.map((item) => (
              <FadeIn key={item.step} className={styles.step}>
                <span className={styles.stepNum}>{item.step}</span>
                <h3 className="text-heading-3">{item.title}</h3>
                <p className="text-sm text-secondary-color">{item.desc}</p>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container">
          <FadeIn className={styles.ctaCard} distance={40}>
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
          </FadeIn>
        </div>
      </section>
    </>
  );
}
