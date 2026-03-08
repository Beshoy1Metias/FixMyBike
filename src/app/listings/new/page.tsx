import Link from "next/link";
import { getCurrentLanguage } from "@/lib/language";

const TEXT = {
    en: {
        eyebrow: "📝 Create Listing",
        title: "What would you like to post?",
        lead: "Choose the type of listing you want to create. You can always come back and add more later.",
        cards: [
            {
                href: "/parts/new",
                icon: "⚙️",
                title: "Sell a Part",
                description: "List a component, wheelset, or accessory for sale.",
            },
            {
                href: "/bikes/new",
                icon: "🚲",
                title: "Sell a Bike",
                description: "Post a complete bike with photos and specs.",
            },
            {
                href: "/wanted/new",
                icon: "🔍",
                title: "Post a Wanted Ad",
                description: "Tell sellers what kind of bike you are looking for.",
            },
            {
                href: "/mechanics/new",
                icon: "🔧",
                title: "Offer Mechanic Services",
                description: "Create a profile so riders can book you for work.",
            },
        ]
    },
    it: {
        eyebrow: "📝 Crea Annuncio",
        title: "Cosa vorresti pubblicare?",
        lead: "Scegli il tipo di annuncio che vuoi creare. Puoi sempre tornare e aggiungerne altri in seguito.",
        cards: [
            {
                href: "/parts/new",
                icon: "⚙️",
                title: "Vendi un ricambio",
                description: "Metti in vendita un componente, ruote o accessori.",
            },
            {
                href: "/bikes/new",
                icon: "🚲",
                title: "Vendi una bici",
                description: "Pubblica una bici completa con foto e specifiche.",
            },
            {
                href: "/wanted/new",
                icon: "🔍",
                title: "Cerco una bici",
                description: "Spiega ai venditori che tipo di bici stai cercando.",
            },
            {
                href: "/mechanics/new",
                icon: "🔧",
                title: "Offri servizi da meccanico",
                description: "Crea un profilo così i ciclisti possono richiedere il tuo aiuto.",
            },
        ]
    }
} as const;

export default async function NewListingHubPage() {
    const lang = await getCurrentLanguage();
    const t = TEXT[lang];

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">{t.eyebrow}</span>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        {t.lead}
                    </p>
                </div>

                <div className="grid-2">
                    {t.cards.map((card) => (
                        <Link key={card.href} href={card.href} className="card">
                            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                                <div style={{ fontSize: "1.8rem" }}>{card.icon}</div>
                                <div>
                                    <h2 className="text-heading-3" style={{ marginBottom: "var(--space-2)" }}>
                                        {card.title}
                                    </h2>
                                    <p className="text-sm text-secondary-color">{card.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
