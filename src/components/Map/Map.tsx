"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ListingLocation {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    price?: number | string;
    image?: string | null;
    type?: "bike" | "part" | "mechanic";
    href: string;
}

interface MapProps {
    listings: ListingLocation[];
    center?: [number, number]; // [lat, lng]
    zoom?: number;
    className?: string;
    height?: string;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (map) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default function Map({ listings, center = [45.4064, 11.8768], zoom = 13, className, height = "400px" }: MapProps) {
    const [mounted, setMounted] = useState(false);
    const [defaultIcon, setDefaultIcon] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        // Import Leaflet only on client side to avoid window is not defined error
        import("leaflet").then((L) => {
            const icon = L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });
            setDefaultIcon(icon);
        });
    }, []);

    if (!mounted || !defaultIcon) {
        return <div style={{ height, background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>Loading Map...</div>;
    }

    return (
        <div style={{ height, width: "100%", position: "relative", zIndex: 1 }} className={className}>
             <MapContainer 
                center={center} 
                zoom={zoom} 
                style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={center} zoom={zoom} />
                
                {listings.map((listing) => (
                    listing.latitude && listing.longitude ? (
                        <Marker 
                            key={listing.id} 
                            position={[listing.latitude, listing.longitude]}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <div style={{ minWidth: "180px", maxWidth: "220px" }}>
                                    {listing.image && (
                                        <div style={{ width: "100%", height: "120px", marginBottom: "8px", borderRadius: "8px", overflow: "hidden" }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={listing.image} 
                                                alt={listing.title} 
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                    <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {listing.title}
                                    </h3>
                                    {listing.price && (
                                        <p style={{ margin: "0 0 8px 0", color: "var(--color-primary)", fontWeight: "bold", fontSize: "16px" }}>
                                            {typeof listing.price === 'number' ? `€${listing.price.toLocaleString()}` : listing.price}
                                        </p>
                                    )}
                                    <a 
                                        href={listing.href} 
                                        style={{ 
                                            display: "block",
                                            textAlign: "center",
                                            background: "var(--color-primary)",
                                            color: "white",
                                            padding: "6px 0",
                                            borderRadius: "6px",
                                            textDecoration: "none", 
                                            fontSize: "12px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        View Details
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
