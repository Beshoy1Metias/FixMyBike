"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

function LocationMarker({ position, setPosition, onLocationSelect, icon, language }: any) {
    const map = useMapEvents({
        async click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            
            // Get address for the clicked point
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=${language}&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                const data = await res.json();
                const address = data.display_name || `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
                onLocationSelect(e.latlng.lat, e.latlng.lng, address);
            } catch (err) {
                onLocationSelect(e.latlng.lat, e.latlng.lng, `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
            }
        },
    });

    return position && icon ? (
        <Marker position={position} icon={icon} />
    ) : null;
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
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
    const [position, setPosition] = useState<any>(null);
    const [defaultIcon, setDefaultIcon] = useState<any>(null);
    const [L, setL] = useState<any>(null);
    
    const [searchQuery, setSearchTerm] = useState(initialAddress);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([45.4064, 11.8768]);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        import("leaflet").then((Leaflet) => {
            setL(Leaflet);
            const icon = Leaflet.icon({
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });
            setDefaultIcon(icon);
            
            if (initialLat && initialLng) {
                const pos = new Leaflet.LatLng(initialLat, initialLng);
                setPosition(pos);
                setMapCenter([initialLat, initialLng]);
            }
        });
    }, [initialLat, initialLng]);

    const handleSearch = async (query: string) => {
        setSearchTerm(query);
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=${language}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const selectSuggestion = (s: any) => {
        const lat = parseFloat(s.lat);
        const lon = parseFloat(s.lon);
        const newPos = new L.LatLng(lat, lon);
        
        setPosition(newPos);
        setMapCenter([lat, lon]);
        setSuggestions([]);
        setSearchTerm(s.display_name);
        onLocationSelect(lat, lon, s.display_name);
    };

    const handleUseCurrentLocation = () => {
        if (!L) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = new L.LatLng(latitude, longitude);
                    setPosition(newPos);
                    setMapCenter([latitude, longitude]);
                    
                    // Get address
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=${language}&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        setSearchTerm(address);
                        onLocationSelect(latitude, longitude, address);
                    } catch (err) {
                        const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        setSearchTerm(fallback);
                        onLocationSelect(latitude, longitude, fallback);
                    }
                },
                (err) => {
                    console.error("Error getting location:", err);
                    alert("Could not get your location. Please search or select manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    if (!mounted || !defaultIcon) {
        return <div style={{ height, background: "var(--surface-2)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>;
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
                            type="text"
                            className={`form-input ${error && !position ? "border-error" : ""}`}
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ paddingRight: "40px" }}
                        />
                        {isSearching && (
                            <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                                <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                            </div>
                        )}
                    </div>

                    {suggestions.length > 0 && (
                        <div style={{ 
                            position: "absolute", 
                            top: "100%", 
                            left: 0, 
                            right: 0, 
                            background: "#1e1e21", /* solid background */
                            border: "1px solid var(--border)", 
                            borderRadius: "var(--radius)",
                            marginTop: "4px",
                            zIndex: 1000,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                            maxHeight: "250px",
                            overflowY: "auto"
                        }}>
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => selectSuggestion(s)}
                                    style={{ 
                                        width: "100%", 
                                        textAlign: "left", 
                                        padding: "12px 16px", 
                                        borderBottom: i === suggestions.length - 1 ? "none" : "1px solid var(--border)",
                                        fontSize: "0.9rem",
                                        color: "var(--text-primary)",
                                        backgroundColor: "transparent",
                                        display: "block"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--surface-2)"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    {s.display_name}
                                </button>
                            ))}
                        </div>
                    )}
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
                 <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={mapCenter} />
                    <LocationMarker 
                        position={position} 
                        setPosition={setPosition} 
                        onLocationSelect={onLocationSelect} 
                        icon={defaultIcon}
                        language={language}
                    />
                </MapContainer>
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
