"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
}

function LocationMarker({ position, setPosition, onLocationSelect, icon }: any) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position && icon ? (
        <Marker position={position} icon={icon} />
    ) : null;
}

export default function LocationPicker({ initialLat, initialLng, onLocationSelect, height = "300px" }: LocationPickerProps) {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<any>(null);
    const [defaultIcon, setDefaultIcon] = useState<any>(null);
    const [L, setL] = useState<any>(null);

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
                setPosition(new Leaflet.LatLng(initialLat, initialLng));
            }
        });
    }, [initialLat, initialLng]);

    // Default center (Padova) if no initial position
    const center: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : [45.4064, 11.8768];

    const handleUseCurrentLocation = () => {
        if (!L) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    onLocationSelect(latitude, longitude);
                    setPosition(new L.LatLng(latitude, longitude));
                },
                (err) => {
                    console.error("Error getting location:", err);
                    alert("Could not get your location. Please select manually on the map.");
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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Location (Click on map)</label>
                <button 
                    type="button" 
                    onClick={handleUseCurrentLocation}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: "12px", padding: "4px 8px" }}
                >
                    📍 Use My Location
                </button>
            </div>
            
            <div style={{ height, width: "100%", position: "relative", zIndex: 1 }}>
                 <MapContainer 
                    center={center} 
                    zoom={13} 
                    style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} icon={defaultIcon} />
                </MapContainer>
            </div>
            <p className="text-xs text-muted">Selected coordinates: {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "None"}</p>
        </div>
    );
}
