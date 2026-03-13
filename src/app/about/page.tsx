import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";

const TEXT = {
    en: {
        title: "Our Story",
        subtitle: "How a student's struggle turned into a mission to fix every bike in Padova.",
        originTitle: "The Spark",
        originBody: "FixMyBike started with a flat tire and a lot of frustration. As a first-year Information Engineering student from Egypt at the University of Padua, I quickly realized that finding a reliable mechanic or the right spare part wasn't as easy as it should be. I wanted to build something that solved this—not just for me, but for every cyclist navigating the streets of Padova.",
        missionTitle: "The Mission",
        missionBody: "What began as a simple student idea is growing into a dedicated platform to connect cyclists with mechanics and enthusiasts. Our mission is to bridge the gap between people who need help and those with the skills to provide it. We're fostering a culture of repair, reuse, and mutual support, making sure no bike is left abandoned.",
        visionTitle: "A Greener Vision",
        visionBody: "We believe that the future of urban mobility is on two wheels. By making bike maintenance accessible and affordable, we're not just fixing bikes—we're building a stronger, more sustainable cycling community. This is just the beginning of our journey, and we're excited to see how this student-built startup can empower riders everywhere.",
        joinTitle: "Be Part of the Journey",
        joinBody: "Whether you're a professional mechanic or a hobbyist, join us in making cycling better for everyone.",
        cta: "Join the Community",
    },
    it: {
        title: "La Nostra Storia",
        subtitle: "Come la difficoltà di uno studente si è trasformata nella missione di riparare ogni bici a Padova.",
        originTitle: "La Scintilla",
        originBody: "FixMyBike è nata con una gomma a terra e molta frustrazione. Come studente egiziano al primo anno di Ingegneria dell'Informazione all'Università di Padova, ho capito subito che trovare un meccanico affidabile o il pezzo di ricambio giusto non era così facile come dovrebbe essere. Volevo costruire qualcosa che risolvesse questo problema—non solo per me, ma per ogni ciclista che attraversa le strade di Padova.",
        missionTitle: "La Missione",
        missionBody: "Quello che è iniziato come un semplice progetto studentesco sta diventando una piattaforma dedicata per connettere ciclisti, meccanici e appassionati di bici. La nostra missione è colmare il divario tra chi ha bisogno di aiuto e chi ha le competenze per offrirlo, promuovendo una cultura della riparazione, del riutilizzo e del supporto reciproco.",
        visionTitle: "Una Visione più Verde",
        visionBody: "Crediamo che il futuro della mobilità urbana sia su due ruote. Rendendo la manutenzione delle biciclette accessibile e conveniente, non stiamo solo riparando bici—stiamo costruendo una comunità ciclistica più forte e sostenibile. Questo è solo l'inizio del nostro viaggio, e siamo entusiasti di vedere come questa startup nata sui banchi di scuola possa dare forza ai ciclisti ovunque.",
        joinTitle: "Fai parte del Viaggio",
        joinBody: "Che tu sia un meccanico professionista o un appassionato, unisciti a noi per rendere il ciclismo migliore per tutti.",
        cta: "Unisciti alla Community",
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
                        <h2 className="text-heading-2" style={{ marginBottom: "var(--space-4)" }}>{t.originTitle}</h2>
                        <p className="text-body" style={{ lineHeight: 1.7 }}>{t.originBody}</p>
                    </section>

                    <section>
                        <h2 className="text-heading-2" style={{ marginBottom: "var(--space-4)" }}>{t.missionTitle}</h2>
                        <p className="text-body" style={{ lineHeight: 1.7 }}>{t.missionBody}</p>
                    </section>

                    <section>
                        <h2 className="text-heading-2" style={{ marginBottom: "var(--space-4)" }}>{t.visionTitle}</h2>
                        <p className="text-body" style={{ lineHeight: 1.7 }}>{t.visionBody}</p>
                    </section>

                    <section className="card" style={{ background: "var(--surface-2)" }}>
                        <div className="card-body" style={{ textAlign: "center", padding: "var(--space-8)" }}>
                            <h2 className="text-heading-2" style={{ marginBottom: "var(--space-2)" }}>{t.joinTitle}</h2>
                            <p className="text-body" style={{ marginBottom: "var(--space-6)" }}>{t.joinBody}</p>
                            <a href="/auth/register" className="btn btn-primary">{t.cta}</a>
                        </div>
                    </section>
                </div>
            </div>
        </FadeIn>
    );
}
