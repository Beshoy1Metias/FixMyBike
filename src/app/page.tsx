import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className="page-header__eyebrow">🚲 The Bike Community Marketplace</span>
            <h1 className={`text-display ${styles.heroTitle}`}>
              Fix, Buy & Sell<br />
              <span className="gradient-text">Your Bike.</span>
            </h1>
            <p className="text-body-lg">
              Connect with skilled local mechanics, buy and sell parts, or find the bike you&apos;ve always wanted. Everything bikes, all in one place.
            </p>
            <div className={styles.heroCta}>
              <Link href="/mechanics" className="btn btn-primary btn-lg">
                🔧 Find a Mechanic
              </Link>
              <Link href="/auth/register" className="btn btn-secondary btn-lg">
                Post a Listing
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageBlob} />
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>2,400+</span>
                <span className={styles.statLabel}>Mechanics</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>12k+</span>
                <span className={styles.statLabel}>Parts Listed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>3,800+</span>
                <span className={styles.statLabel}>Bikes Sold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CATEGORIES ---- */}
      <section className={`section ${styles.categories}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="text-heading-1">What are you looking for?</h2>
            <p className="text-body-lg">Everything bikes, in one marketplace.</p>
          </div>
          <div className={styles.categoryGrid}>
            <Link href="/mechanics" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🔧</div>
              <h3 className="text-heading-3">Find a Mechanic</h3>
              <p className="text-sm text-secondary-color">
                Browse skilled local mechanics and DIY fixers. Get quotes and book repairs.
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/parts" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>⚙️</div>
              <h3 className="text-heading-3">Parts & Accessories</h3>
              <p className="text-sm text-secondary-color">
                Buy and sell bike parts, gear, and accessories. New and used.
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/bikes" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🚲</div>
              <h3 className="text-heading-3">Bikes for Sale</h3>
              <p className="text-sm text-secondary-color">
                Browse full bikes for sale from private sellers. Road, MTB, gravel, and more.
              </p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
            <Link href="/wanted" className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🔍</div>
              <h3 className="text-heading-3">Looking to Buy</h3>
              <p className="text-sm text-secondary-color">
                Post your wishlist with specs and budget. Let sellers come to you.
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
            <h2 className="text-heading-1">How it works</h2>
            <p className="text-body-lg">Get started in minutes.</p>
          </div>
          <div className="grid-3">
            {[
              { step: "01", title: "Create an account", desc: "Sign up for free in under a minute. No credit card required." },
              { step: "02", title: "Post or browse", desc: "List your skills, parts, or bike — or search thousands of listings." },
              { step: "03", title: "Connect & transact", desc: "Message directly, agree on terms, and close the deal safely." },
            ].map((item) => (
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
              Ready to get your bike fixed?
            </h2>
            <p className="text-body-lg">
              Join thousands of cyclists who trust FixMyBike.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
