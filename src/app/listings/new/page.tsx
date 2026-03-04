import Link from "next/link";

const CARDS = [
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
];

export default function NewListingHubPage() {
    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">📝 Create Listing</span>
                    <h1 className="text-heading-1">What would you like to post?</h1>
                    <p className="text-body-lg" style={{ maxWidth: 560 }}>
                        Choose the type of listing you want to create. You can always come back and add more later.
                    </p>
                </div>

                <div className="grid-2">
                    {CARDS.map((card) => (
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

