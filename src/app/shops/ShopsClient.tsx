"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import StarRating from "@/components/ReviewSystem/StarRating";

// Dynamic import for Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map/Map"), { 
    ssr: false,
    loading: () => <div style={{ height: "100%", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>
});

interface Shop {
    id: string;
    name: string;
    address: string;
    rating: number;
    image_url: string;
    lat: number;
    lng: number;
    phone?: string;
    distance?: number;
}

interface ShopsClientProps {
    initialShops: Shop[];
    lang: "en" | "it";
}

const UI_TEXT = {
    en: {
        title: "Bike Shops & Repair",
        subtitle: "Expert bike services across Padova.",
        nearMe: "Near Me",
        allShops: "All Shops",
        openNow: "Open Now",
        km: "km",
        viewOnMap: "Map",
        directions: "Directions",
        call: "Call",
        noShops: "No shops found.",
        loadingLocation: "Locating...",
        searchPlaceholder: "Search by name or street...",
        open: "Open",
        closed: "Closed",
    },
    it: {
        title: "Negozi e Riparazioni",
        subtitle: "Servizi esperti per la tua bici a Padova.",
        nearMe: "Vicino a Me",
        allShops: "Tutti i Negozi",
        openNow: "Aperti Ora",
        km: "km",
        viewOnMap: "Mappa",
        directions: "Indicazioni",
        call: "Chiama",
        noShops: "Nessun negozio trovato.",
        loadingLocation: "Localizzazione...",
        searchPlaceholder: "Cerca per nome o via...",
        open: "Aperto",
        closed: "Chiuso",
    }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function isShopOpen() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const mins = now.getMinutes();
    const time = hour + mins / 60;
    
    if (day === 0) return false;
    
    // Typical Italian shop hours: 09:00-13:00, 15:30-19:30
    const morningOpen = 9;
    const morningClose = 13;
    const afternoonOpen = 15.5;
    const afternoonClose = 19.5;
    
    return (time >= morningOpen && time < morningClose) || (time >= afternoonOpen && time < afternoonClose);
}

function getDirectionsUrl(lat: number, lng: number, address: string) {
    const isIOS = typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
        return `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(address)}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function ShopsClient({ initialShops, lang }: ShopsClientProps) {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortByDistance, setSortByDistance] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const t = UI_TEXT[lang];

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        // Geolocation requires HTTPS on most mobile browsers
        if (typeof window !== "undefined" && window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
            alert("Location services require a secure connection (HTTPS). Please ensure you are using a secure link.");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setSortByDistance(true);
                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);
                console.error("Geolocation Error:", error);
                
                let msg = "Could not get your location.";
                if (error.code === 1) {
                    msg = "Location permission denied. Please:\n1. Check your browser settings\n2. Ensure 'Location Services' is ON in iPhone Settings > Privacy\n3. Refresh and 'Allow' when prompted.";
                } else if (error.code === 2) {
                    msg = "Location unavailable. Your device couldn't find a signal.";
                } else if (error.code === 3) {
                    msg = "Location request timed out. Try again.";
                }
                alert(msg);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const filteredShops = useMemo(() => {
        let result = initialShops.map(shop => ({
            ...shop,
            distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng) : undefined
        }));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
        }

        const openStatus = isShopOpen();
        if (filterOpen && !openStatus) return [];

        if (sortByDistance && userLocation) {
            result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [initialShops, userLocation, filterOpen, sortByDistance, searchQuery]);

    const mapListings = useMemo(() => {
        return filteredShops.map(shop => ({
            id: shop.id,
            title: shop.name,
            latitude: shop.lat,
            longitude: shop.lng,
            image: shop.image_url,
            href: getDirectionsUrl(shop.lat, shop.lng, shop.address),
            price: `⭐ ${shop.rating}`
        }));
    }, [filteredShops]);

    const openNow = isShopOpen();

    return (
        <div className="section">
            <div className="container">
                <div style={{ marginBottom: "var(--space-8)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-4)" }}>
                        <div>
                            <h1 className="text-heading-1">{t.title}</h1>
                            <p className="text-body-lg">{t.subtitle}</p>
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                            <button 
                                className={`btn btn-sm ${sortByDistance ? "btn-primary" : "btn-secondary"}`}
                                onClick={handleNearMe}
                                disabled={loadingLocation}
                            >
                                {loadingLocation ? t.loadingLocation : `📍 ${t.nearMe}`}
                            </button>
                            <button 
                                className={`btn btn-sm ${filterOpen ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setFilterOpen(!filterOpen)}
                            >
                                🕒 {t.openNow}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: "var(--space-6)" }}>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ maxWidth: "500px" }}
                        />
                    </div>
                </div>

                <div className="grid-details">
                    <div style={{ maxHeight: "800px", overflowY: "auto", paddingRight: "var(--space-2)" }}>
                        <StaggerContainer style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            {filteredShops.length > 0 ? (
                                filteredShops.map((shop) => (
                                    <FadeIn key={shop.id}>
                                        <div className="card" style={{ padding: "var(--space-4)" }}>
                                            <div style={{ display: "flex", gap: "var(--space-4)" }}>
                                                <div style={{ width: "100px", height: "100px", flexShrink: 0, borderRadius: "var(--radius)", overflow: "hidden", position: "relative" }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={shop.image_url} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                        <h3 className="text-heading-3">{shop.name}</h3>
                                                        <span className={`badge ${openNow ? "badge-success" : "badge-gray"}`}>
                                                            {openNow ? t.open : t.closed}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", margin: "4px 0" }}>
                                                        <StarRating rating={shop.rating} size="sm" />
                                                        <span className="text-sm" style={{ fontWeight: 600 }}>{shop.rating}</span>
                                                    </div>
                                                    <p className="text-xs text-secondary-color">📍 {shop.address}</p>
                                                    
                                                    {shop.distance !== undefined && (
                                                        <div style={{ marginTop: "4px" }}>
                                                            <span className="text-xs" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                                                                {shop.distance.toFixed(1)} {t.km}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                                                <a href={getDirectionsUrl(shop.lat, shop.lng, shop.address)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ minHeight: "36px", fontSize: "0.8rem" }}>
                                                    🗺️ {t.directions}
                                                </a>
                                                {shop.phone && (
                                                    <a href={`tel:${shop.phone.replace(/\s+/g, '')}`} className="btn btn-secondary btn-sm" style={{ minHeight: "36px", fontSize: "0.8rem" }}>
                                                        📞 {t.call}
                                                    </a>
                                                )}
                                                <button 
                                                    className="btn btn-ghost btn-sm" 
                                                    style={{ minHeight: "36px", fontSize: "0.8rem" }}
                                                    onClick={() => {
                                                        const el = document.querySelector(".leaflet-container") as HTMLElement;
                                                        if (el) {
                                                            window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
                                                        }
                                                    }}
                                                >
                                                    📍 {t.viewOnMap}
                                                </button>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))
                            ) : (
                                <div className="empty-state">{t.noShops}</div>
                            )}
                        </StaggerContainer>
                    </div>

                    <div style={{ height: "600px", position: "sticky", top: "var(--space-4)" }}>
                        <Map 
                            listings={mapListings} 
                            height="100%" 
                            center={userLocation ? [userLocation.lat, userLocation.lng] : [45.4111, 11.8805]}
                            zoom={userLocation ? 14 : 13}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
