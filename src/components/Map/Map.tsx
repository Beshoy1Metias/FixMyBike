"use client";

import { useState, useMemo, useEffect } from "react";
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";

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

// Helper to fit bounds when listings change
function MapController({ listings, center, zoom, activeId }: { listings: ListingLocation[], center: [number, number], zoom: number, activeId?: string | null }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        
        if (listings.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            listings.forEach(l => {
                bounds.extend({ lat: l.latitude, lng: l.longitude });
            });
            // Only fit bounds if there's more than 1 listing, otherwise center on the single listing at default zoom
            if (listings.length > 1) {
                map.fitBounds(bounds, { bottom: 50, left: 50, right: 50, top: 50 });
            } else {
                map.setCenter({ lat: listings[0].latitude, lng: listings[0].longitude });
                map.setZoom(15);
            }
        } else {
            map.setCenter({ lat: center[0], lng: center[1] });
            map.setZoom(zoom);
        }
    }, [map, listings, center, zoom]);

    // Pan to active item when hovering on cards outside the map
    useEffect(() => {
        if (!map || !activeId) return;
        const activeListing = listings.find(l => l.id === activeId);
        if (activeListing) {
            map.panTo({ lat: activeListing.latitude, lng: activeListing.longitude });
            // Optionally bump zoom if you want: map.setZoom(16);
        }
    }, [map, activeId, listings]);

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
    const defaultCenter = { lat: center[0], lng: center[1] };
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    
    // Track which marker's InfoWindow is open
    const [openInfoWindowId, setOpenInfoWindowId] = useState<string | null>(null);

    // Custom SVG Marker Icon matching exactly the previous style
    const renderCustomIcon = (isActive: boolean) => {
        const color = isActive ? "var(--color-accent)" : "var(--color-primary)";
        const scale = isActive ? 1.2 : 1;
        
        return (
            <div style={{
                transform: `translate(-50%, -100%) scale(${scale})`, // Anchor point is bottom center
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                transition: "transform 0.2s ease",
            }}>
                <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.16344 0 0 7.16344 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16344 24.8366 0 16 0Z" fill={color}/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>
            </div>
        );
    };

    if (!apiKey) {
        return (
            <div style={{ height, width: "100%", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border)" }}>
                <p className="text-muted text-sm">Google Maps API Key missing in .env</p>
            </div>
        );
    }

    return (
        <div style={{ height, width: "100%", position: "relative", zIndex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }} className={className}>
            <APIProvider apiKey={apiKey}>
                <GoogleMap
                    defaultCenter={defaultCenter}
                    defaultZoom={zoom}
                    mapId="fix-my-bike-map-id" // Required for AdvancedMarker
                    disableDefaultUI={false}
                    gestureHandling="greedy"
                    style={{ width: "100%", height: "100%" }}
                >
                    <MapController listings={listings} center={center} zoom={zoom} activeId={activeId} />
                    
                    {listings.map((listing) => {
                        const isActive = listing.id === activeId;
                        const isOpen = openInfoWindowId === listing.id;

                        return (
                            <AdvancedMarker
                                key={listing.id}
                                position={{ lat: listing.latitude, lng: listing.longitude }}
                                onClick={() => {
                                    setOpenInfoWindowId(listing.id);
                                    if (onMarkerClick) onMarkerClick(listing.id);
                                }}
                                onMouseEnter={() => setOpenInfoWindowId(listing.id)}
                            >
                                {renderCustomIcon(isActive)}
                                
                                {isOpen && (
                                    <InfoWindow
                                        position={{ lat: listing.latitude, lng: listing.longitude }}
                                        onCloseClick={() => setOpenInfoWindowId(null)}
                                        headerDisabled={true} // Removes default close button taking up space
                                        pixelOffset={[0, -45]} // Offset to sit above the marker
                                    >
                                        <div style={{ minWidth: "180px", maxWidth: "220px", padding: "8px", fontFamily: "var(--font-sans)" }}>
                                            {listing.image && (
                                                <div style={{ width: "100%", height: "110px", marginBottom: "10px", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-2)" }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={listing.image} 
                                                        alt={listing.title} 
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                                    />
                                                </div>
                                            )}
                                            <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "var(--gray-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                                    </InfoWindow>
                                )}
                            </AdvancedMarker>
                        );
                    })}
                </GoogleMap>
            </APIProvider>
            
            <style jsx global>{`
                /* Override default Google Maps InfoWindow styles to match our design */
                .gm-style-iw-c {
                    padding: 0 !important;
                    border-radius: var(--radius-lg) !important;
                    box-shadow: var(--shadow-lg) !important;
                    overflow: hidden !important;
                }
                .gm-style-iw-d {
                    overflow: hidden !important;
                }
            `}</style>
        </div>
    );
}
