import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";

const TEXT = {
    en: {
        title: "About FixMyBike",
        subtitle: "The community-driven marketplace for cyclists in Padova.",
        missionTitle: "Our Mission",
        missionBody: "FixMyBike was born out of a simple idea: making it easier for cyclists to connect with local mechanics and trade parts. Whether you're a professional mechanic or a hobbyist who loves fixing bikes, this platform is for you.",
        storyTitle: "Built for Riders",
        storyBody: "We believe that a strong cycling community needs a dedicated space. By focusing on local connections in Padova, we reduce shipping costs, support local businesses, and get more bikes back on the road.",
        joinTitle: "Join the Community",
        joinBody: "Sign up today to start listing your parts, offering your skills, or finding your next dream bike.",
    },
    it: {
        title: "Su FixMyBike",
        subtitle: "Il marketplace per i ciclisti di Padova, guidato dalla community.",
        missionTitle: "La Nostra Missione",
        missionBody: "FixMyBike nasce da un'idea semplice: facilitare il contatto tra ciclisti e meccanici locali e lo scambio di ricambi. Che tu sia un meccanico professionista o un appassionato che ama riparare bici, questa piattaforma è per te.",
        storyTitle: "Creato per i Ciclisti",
        storyBody: "Crediamo che una forte community ciclistica abbia bisogno di uno spazio dedicato. Focalizzandoci sulle connessioni locali a Padova, riduciamo i costi di spedizione, sosteniamo le attività locali e riportiamo più bici in strada.",
        joinTitle: "Unisciti alla Community",
        joinBody: "Registrati oggi per iniziare a pubblicare i tuoi ricambi, offrire le tue competenze o trovare la tua prossima bici dei sogni.",
    }
};

export default async function AboutPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
                <div className="page-header" style={{ textAlign: "left" }}>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg">{t.subtitle}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
                    <section>
                        <h2 className="text-heading-2" style={{ marginBottom: "var(--space-4)" }}>{t.missionTitle}</h2>
                        <p className="text-body" style={{ lineHeight: 1.7 }}>{t.missionBody}</p>
                    </section>

                    <section>
                        <h2 className="text-heading-2" style={{ marginBottom: "var(--space-4)" }}>{t.storyTitle}</h2>
                        <p className="text-body" style={{ lineHeight: 1.7 }}>{t.storyBody}</p>
                    </section>

                    <section className="card" style={{ background: "var(--surface-2)" }}>
                        <div className="card-body" style={{ textAlign: "center", padding: "var(--space-8)" }}>
                            <h2 className="text-heading-2" style={{ marginBottom: "var(--space-2)" }}>{t.joinTitle}</h2>
                            <p className="text-body" style={{ marginBottom: "var(--space-6)" }}>{t.joinBody}</p>
                            <a href="/auth/register" className="btn btn-primary">Get Started</a>
                        </div>
                    </section>
                </div>
            </div>
        </FadeIn>
    );
}
