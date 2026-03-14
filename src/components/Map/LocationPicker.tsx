"use client";

import { useEffect, useState, useRef } from "react";
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    initialAddress?: string;
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    height?: string;
    required?: boolean;
    error?: boolean;
}

const TEXT = {
    en: {
        label: "Location",
        useMyLocation: "📍 Use My Location",
        searchPlaceholder: "Search for a street, city...",
        searching: "Searching...",
        noResults: "No results found",
        requiredError: "Please select a location on the map",
        coords: "Selected coordinates",
        none: "None",
        selectedAddress: "Selected Address"
    },
    it: {
        label: "Posizione",
        useMyLocation: "📍 Usa la mia posizione",
        searchPlaceholder: "Cerca una via, città...",
        searching: "Ricerca in corso...",
        noResults: "Nessun risultato trovato",
        requiredError: "Per favore seleziona una posizione sulla mappa",
        coords: "Coordinate selezionate",
        none: "Nessuna",
        selectedAddress: "Indirizzo selezionato"
    }
};

function MapController({ center }: { center: google.maps.LatLngLiteral }) {
    const map = useMap();
    useEffect(() => {
        if (map && center.lat && center.lng) {
            map.panTo(center);
            map.setZoom(15);
        }
    }, [center, map]);
    return null;
}

export default function LocationPicker({ 
    initialLat, 
    initialLng, 
    initialAddress = "",
    onLocationSelect, 
    height = "350px",
    required = false,
    error = false
}: LocationPickerProps) {
    const { language } = useLanguage();
    const t = TEXT[language as keyof typeof TEXT] || TEXT.en;
    
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 45.4064, lng: 11.8768 }); // Default Padova
    
    // Autocomplete state
    const [searchQuery, setSearchTerm] = useState(initialAddress);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    useEffect(() => {
        setMounted(true);
        if (initialLat && initialLng) {
            const pos = { lat: initialLat, lng: initialLng };
            setPosition(pos);
            setMapCenter(pos);
        }
    }, [initialLat, initialLng]);

    // Initialize Autocomplete once the Google Maps script is loaded globally by APIProvider
    const initAutocomplete = () => {
        if (!inputRef.current || !window.google || autocompleteRef.current) return;

        geocoderRef.current = new window.google.maps.Geocoder();

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "it" }, // Force Italy
            fields: ["geometry", "formatted_address", "name"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address || place.name || "";
                
                const newPos = { lat, lng };
                setPosition(newPos);
                setMapCenter(newPos);
                setSearchTerm(address);
                onLocationSelect(lat, lng, address);
            }
        });
    };

    const handleMapClick = (e: MapMouseEvent) => {
        const detail = (e as any).detail;
        if (!detail?.latLng || !geocoderRef.current) return;
        const lat = detail.latLng.lat;
        const lng = detail.latLng.lng;
        const newPos = { lat, lng };
        
        setPosition(newPos);
        
        // Reverse geocode the click
        geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const address = results[0].formatted_address;
                setSearchTerm(address);
                onLocationSelect(lat, lng, address);
            } else {
                const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setSearchTerm(fallback);
                onLocationSelect(lat, lng, fallback);
            }
        });
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                const newPos = { lat, lng };
                setPosition(newPos);
                setMapCenter(newPos);
                
                // Reverse geocode
                if (geocoderRef.current) {
                    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === "OK" && results && results[0]) {
                            const address = results[0].formatted_address;
                            setSearchTerm(address);
                            onLocationSelect(lat, lng, address);
                        } else {
                            const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                            setSearchTerm(fallback);
                            onLocationSelect(lat, lng, fallback);
                        }
                    });
                } else {
                    const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    setSearchTerm(fallback);
                    onLocationSelect(lat, lng, fallback);
                }
            },
            (err) => {
                console.error("Error getting location:", err);
                alert("Could not get your location. Please check browser permissions.");
            }
        );
    };

    if (!mounted) {
        return <div style={{ height, background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Component...</div>;
    }

    if (!apiKey) {
        return (
            <div style={{ height, width: "100%", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border)", flexDirection: "column", gap: "10px" }}>
                <p className="text-muted text-sm">Google Maps API Key missing in .env</p>
                <p className="text-muted text-xs">Cannot load location picker</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
                    <label className="form-label" style={{ display: "block", marginBottom: "6px" }}>
                        {t.label} {required && <span style={{ color: "var(--color-error)" }}>*</span>}
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            ref={inputRef}
                            type="text"
                            className={`form-input ${error && !position ? "border-error" : ""}`}
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchTerm(e.target.value)} // Let user type, autocomplete handles the dropdown natively
                        />
                    </div>
                </div>
                <button 
                    type="button" 
                    onClick={handleUseCurrentLocation}
                    className="btn btn-secondary"
                    style={{ fontSize: "13px", height: "48px", minHeight: "48px" }}
                >
                    {t.useMyLocation}
                </button>
            </div>
            
            <div style={{ 
                height, 
                width: "100%", 
                position: "relative", 
                zIndex: 1, 
                border: error && !position ? "2px solid var(--color-error)" : "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden"
            }}>
                <APIProvider apiKey={apiKey} onLoad={initAutocomplete}>
                    <GoogleMap 
                        defaultCenter={mapCenter} 
                        defaultZoom={13} 
                        mapId="fix-my-bike-picker-id" // Required for AdvancedMarker
                        disableDefaultUI={false}
                        gestureHandling="greedy"
                        onClick={handleMapClick}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <MapController center={mapCenter} />
                        {position && (
                            <AdvancedMarker position={position}>
                                <div style={{
                                    transform: `translate(-50%, -100%) scale(1.2)`,
                                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                                }}>
                                    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 0C7.16344 0 0 7.16344 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16344 24.8366 0 16 0Z" fill="var(--color-accent)"/>
                                        <circle cx="16" cy="16" r="6" fill="white"/>
                                    </svg>
                                </div>
                            </AdvancedMarker>
                        )}
                    </GoogleMap>
                </APIProvider>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="text-xs text-muted" style={{ maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {position ? `${t.selectedAddress}: ${searchQuery}` : `${t.coords}: ${t.none}`}
                </p>
                {error && !position && (
                    <p style={{ color: "var(--color-error)", fontSize: "0.75rem", fontWeight: "600" }}>{t.requiredError}</p>
                )}
            </div>
        </div>
    );
}
