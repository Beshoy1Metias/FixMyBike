import { getCurrentLanguage } from "@/lib/language";
import FadeIn from "@/components/Animations/FadeIn";

const TEXT = {
    en: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: March 2026",
        content: `At FixMyBike, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information.

        1. Information We Collect
        We collect information you provide directly to us, such as when you create an account, post a listing, or communicate with other users. This includes your name, email address, location, and photos.

        2. How We Use Your Information
        We use your information to operate and improve our services, facilitate connections between users, and provide map-based listing features.

        3. Sharing Your Information
        Your public profile and listings are visible to other users. We do not sell your personal information to third parties.

        4. Map Data
        When you use our map features, your precise coordinates are used to display your listings to others in the Padova community.`,
    },
    it: {
        title: "Informativa sulla Privacy",
        lastUpdated: "Ultimo aggiornamento: Marzo 2026",
        content: `In FixMyBike, la tua privacy è una nostra priorità. Questa informativa descrive come raccogliamo, utilizziamo e gestiamo le tue informazioni personali.

        1. Informazioni raccolte
        Raccogliamo le informazioni fornite direttamente dall'utente, ad esempio durante la creazione di un account, la pubblicazione di un annuncio o la comunicazione con altri utenti. Ciò include nome, indirizzo email, posizione e foto.

        2. Utilizzo delle informazioni
        Utilizziamo i dati per gestire e migliorare i nostri servizi, facilitare i contatti tra gli utenti e fornire funzionalità basate sulla geolocalizzazione degli annunci.

        3. Condivisione dei dati
        Il tuo profilo pubblico e i tuoi annunci sono visibili agli altri utenti della piattaforma. Non vendiamo le tue informazioni personali a terze parti per scopi commerciali.

        4. Dati cartografici
        Quando utilizzi le funzionalità della mappa, le tue coordinate vengono utilizzate per mostrare i tuoi annunci agli altri membri della community di Padova.`,
    }
};

export default async function PrivacyPage() {
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
