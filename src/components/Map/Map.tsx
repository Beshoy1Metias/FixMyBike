"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface ListingLocation {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    price?: number | string;
    image?: string | null;
    type?: "bike" | "part" | "mechanic" | "shop";
    href: string;
}

interface MapProps {
    listings: ListingLocation[];
    center?: [number, number]; // [lat, lng]
    zoom?: number;
    className?: string;
    height?: string;
    activeId?: string | null;
    onMarkerClick?: (id: string) => void;
}

// Helper component to handle map view changes and bounds fitting
function MapController({ center, zoom, listings, activeId }: { center: [number, number], zoom: number, listings: ListingLocation[], activeId?: string | null }) {
    const map = useMap();

    // Pan to center when it changes (external control)
    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);

    // Fit bounds when listings change
    useEffect(() => {
        if (listings.length > 0) {
            const points = listings.map(l => [l.latitude, l.longitude] as [number, number]);
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
        }
    }, [listings, map]);

    // Pan to active marker
    useEffect(() => {
        if (activeId) {
            const activeListing = listings.find(l => l.id === activeId);
            if (activeListing) {
                map.setView([activeListing.latitude, activeListing.longitude], 16, { animate: true });
            }
        }
    }, [activeId, listings, map]);

    return null;
}

export default function Map({ 
    listings, 
    center = [45.4064, 11.8768], 
    zoom = 13, 
    className, 
    height = "400px",
    activeId,
    onMarkerClick
}: MapProps) {
    // Custom SVG Marker Icon
    const createCustomIcon = (isActive: boolean) => {
        const color = isActive ? "var(--color-accent)" : "var(--color-primary)";
        const scale = isActive ? 1.2 : 1;
        
        const svgHtml = `
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scale(${scale}); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                <path d="M16 0C7.16344 0 0 7.16344 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
        `;

        return L.divIcon({
            className: "custom-marker-icon",
            html: svgHtml,
            iconSize: [32, 42],
            iconAnchor: [16, 42],
            popupAnchor: [0, -40],
        });
    };

    const markers = useMemo(() => {
        return listings.map((listing) => {
            const isActive = listing.id === activeId;
            return (
                <Marker 
                    key={listing.id} 
                    position={[listing.latitude, listing.longitude]}
                    icon={createCustomIcon(isActive)}
                    eventHandlers={{
                        click: () => {
                            if (onMarkerClick) onMarkerClick(listing.id);
                        },
                        mouseover: (e) => {
                            e.target.openPopup();
                        }
                    }}
                >
                    <Popup closeButton={false} autoPan={true} offset={[0, -5]}>
                        <div style={{ minWidth: "180px", maxWidth: "220px", padding: "4px" }}>
                            {listing.image && (
                                <div style={{ width: "100%", height: "110px", marginBottom: "10px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={listing.image} 
                                        alt={listing.title} 
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                    />
                                </div>
                            )}
                            <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {listing.title}
                            </h3>
                            {listing.price && (
                                <p style={{ margin: "0 0 10px 0", color: "var(--color-primary)", fontWeight: "800", fontSize: "16px" }}>
                                    {typeof listing.price === 'number' ? `€${listing.price.toLocaleString()}` : listing.price}
                                </p>
                            )}
                            <a 
                                href={listing.href} 
                                style={{ 
                                    display: "block",
                                    textAlign: "center",
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                                    color: "white",
                                    padding: "8px 0",
                                    borderRadius: "var(--radius-md)",
                                    textDecoration: "none", 
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    transition: "opacity 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                            >
                                {listing.type === 'shop' ? 'Visit Shop' : 'View Details'}
                            </a>
                        </div>
                    </Popup>
                </Marker>
            );
        });
    }, [listings, activeId, onMarkerClick]);

    return (
        <div style={{ height, width: "100%", position: "relative", zIndex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }} className={className}>
             <MapContainer 
                center={center} 
                zoom={zoom} 
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <ZoomControl position="bottomright" />
                <MapController center={center} zoom={zoom} listings={listings} activeId={activeId} />
                {markers}
            </MapContainer>

            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    border-radius: var(--radius-lg);
                    padding: 0;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                }
                .leaflet-popup-content {
                    margin: 8px;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
                .custom-marker-icon {
                    background: none;
                    border: none;
                }
            `}</style>
        </div>
    );
}
