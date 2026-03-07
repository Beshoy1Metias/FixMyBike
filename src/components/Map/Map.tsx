"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ListingLocation {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    price?: number;
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

export default function Map({ listings, center = [51.505, -0.09], zoom = 13, className, height = "400px" }: MapProps) {
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
                                <div style={{ minWidth: "150px" }}>
                                    <h3 style={{ margin: "0 0 5px 0", fontSize: "14px", fontWeight: "bold" }}>{listing.title}</h3>
                                    {listing.price && <p style={{ margin: "0 0 5px 0", color: "#FF5C28", fontWeight: "bold" }}>£{listing.price}</p>}
                                    <a href={listing.href} style={{ color: "#0070f3", textDecoration: "none", fontSize: "12px" }}>View Details</a>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
