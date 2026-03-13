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
    distance?: number;
}

interface ShopsClientProps {
    initialShops: Shop[];
    lang: "en" | "it";
}

const UI_TEXT = {
    en: {
        title: "Bike Shops in Padova",
        subtitle: "Find professional repair services and quality parts near you.",
        nearMe: "Near Me",
        allShops: "All Shops",
        openNow: "Open Now",
        km: "km away",
        viewOnMap: "View on Map",
        noShops: "No shops found matching your criteria.",
        loadingLocation: "Getting your location...",
    },
    it: {
        title: "Negozi di Bici a Padova",
        subtitle: "Trova servizi di riparazione professionali e ricambi di qualità vicino a te.",
        nearMe: "Vicino a Me",
        allShops: "Tutti i Negozi",
        openNow: "Aperti Ora",
        km: "km di distanza",
        viewOnMap: "Vedi sulla Mappa",
        noShops: "Nessun negozio trovato con i tuoi criteri.",
        loadingLocation: "Ottenendo la tua posizione...",
    }
};

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Helper to check if a shop is "Open Now" (Mock logic: 9 AM - 7 PM, Mon-Sat)
function isShopOpen() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    
    // Closed on Sundays
    if (day === 0) return false;
    
    // Open 09:00 to 19:00
    return hour >= 9 && hour < 19;
}

export default function ShopsClient({ initialShops, lang }: ShopsClientProps) {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortByDistance, setSortByDistance] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const t = UI_TEXT[lang];

    const handleNearMe = () => {
        if (navigator.geolocation) {
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
                    console.error("Geolocation error:", error);
                    setLoadingLocation(false);
                    alert("Could not get your location. Please ensure location services are enabled.");
                }
            );
        }
    };

    const shopsWithDistance = useMemo(() => {
        const result = initialShops.map(shop => {
            if (userLocation) {
                return {
                    ...shop,
                    distance: calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng)
                };
            }
            return shop;
        });

        if (filterOpen) {
            const isOpen = isShopOpen();
            if (!isOpen) return []; // If globally closed (e.g. Sunday or night), show none
        }

        if (sortByDistance && userLocation) {
            result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else {
            // Default sort by rating
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [initialShops, userLocation, filterOpen, sortByDistance]);

    const mapListings = useMemo(() => {
        return shopsWithDistance.map(shop => ({
            id: shop.id,
            title: shop.name,
            latitude: shop.lat,
            longitude: shop.lng,
            image: shop.image_url,
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`,
            price: `⭐ ${shop.rating}`
        }));
    }, [shopsWithDistance]);

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left", paddingBottom: "var(--space-8)" }}>
                    <h1 className="text-heading-1">{t.title}</h1>
                    <p className="text-body-lg">{t.subtitle}</p>
                    
                    <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-6)", flexWrap: "wrap" }}>
                        <button 
                            className={`btn ${sortByDistance ? "btn-primary" : "btn-secondary"}`}
                            onClick={handleNearMe}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? t.loadingLocation : `📍 ${t.nearMe}`}
                        </button>
                        <button 
                            className={`btn ${filterOpen ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            🕒 {t.openNow}
                        </button>
                        {sortByDistance && (
                            <button className="btn btn-ghost" onClick={() => {setSortByDistance(false); setUserLocation(null);}}>
                                ✕ {t.allShops}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid-details">
                    {/* Left: List of shops */}
                    <div style={{ maxHeight: "800px", overflowY: "auto", paddingRight: "var(--space-2)" }}>
                        <StaggerContainer style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            {shopsWithDistance.length > 0 ? (
                                shopsWithDistance.map((shop) => (
                                    <FadeIn key={shop.id}>
                                        <div className="card" style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)" }}>
                                            <div style={{ width: "120px", height: "120px", flexShrink: 0, borderRadius: "var(--radius)", overflow: "hidden", position: "relative" }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={shop.image_url} 
                                                    alt={shop.name} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                                />
                                            </div>
                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <div>
                                                    <h3 className="text-heading-3" style={{ marginBottom: "2px" }}>{shop.name}</h3>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                                                        <StarRating rating={shop.rating} size="sm" />
                                                        <span className="text-sm" style={{ fontWeight: 600 }}>{shop.rating}</span>
                                                    </div>
                                                    <p className="text-xs text-secondary-color" style={{ marginBottom: "var(--space-2)" }}>
                                                        📍 {shop.address}
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                    {shop.distance !== undefined && (
                                                        <span className="badge badge-accent">
                                                            {shop.distance.toFixed(1)} {t.km}
                                                        </span>
                                                    )}
                                                    <a 
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ padding: "0 var(--space-2)", minHeight: "32px" }}
                                                    >
                                                        {t.viewOnMap} ↗
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>{t.noShops}</p>
                                </div>
                            )}
                        </StaggerContainer>
                    </div>

                    {/* Right: Map view */}
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
