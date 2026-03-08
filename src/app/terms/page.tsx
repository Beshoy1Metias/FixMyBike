import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";

const TEXT = {
    en: {
        title: "Terms of Service",
        lastUpdated: "Last updated: March 2026",
        content: `Welcome to FixMyBike. By using our platform, you agree to the following terms:

        1. Acceptance of Terms
        By accessing or using FixMyBike, you agree to be bound by these Terms of Service and all applicable laws and regulations.

        2. User Responsibilities
        You are responsible for the content you post and the interactions you have with other users. Listings must be accurate and truthful.

        3. Prohibited Conduct
        You agree not to use the service for any illegal purpose, to harass others, or to post fraudulent listings.

        4. Community Guidelines
        Our community forum is a place for respectful discussion. We reserve the right to remove content that violates our standards.

        5. Limitation of Liability
        FixMyBike is a platform for connecting users. We are not responsible for the quality of repairs, the condition of parts sold, or the outcome of transactions between users.`,
    },
    it: {
        title: "Termini di Servizio",
        lastUpdated: "Ultimo aggiornamento: Marzo 2026",
        content: `Benvenuto su FixMyBike. Utilizzando la nostra piattaforma, accetti i seguenti termini:

        1. Accettazione dei Termini
        Accedendo o utilizzando FixMyBike, accetti di essere vincolato da questi Termini di Servizio e da tutte le leggi e i regolamenti applicabili.

        2. Responsabilità dell'Utente
        Sei responsabile dei contenuti che pubblichi e delle interazioni che hai con gli altri utenti. Gli annunci devono essere accurati e veritieri.

        3. Condotta Vietata
        Accetti di non utilizzare il servizio per scopi illegali, per molestare altri o per pubblicare annunci fraudolenti.

        4. Linee Guida della Community
        Il nostro forum della community è un luogo per discussioni rispettose. Ci riserviamo il diritto di rimuovere contenuti che violano i nostri standard.

        5. Limitazione di Responsabilità
        FixMyBike è una piattaforma per connettere gli utenti. Non siamo responsabili della qualità delle riparazioni, delle condizioni dei ricambi venduti o dell'esito delle transazioni tra utenti.`,
    }
};

export default async function TermsPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];

    return (
        <FadeIn className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
                <div className="page-header" style={{ textAlign: "left" }}>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-muted">{t.lastUpdated}</p>
                </div>

                <div className="card">
                    <div className="card-body" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                        {t.content}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
