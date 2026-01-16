import React, { useEffect, useRef } from 'react';
import type { HackathonEvent } from '../../types';
import { CATEGORIES } from '../../types';
import { Globe } from 'lucide-react';
import { Badge } from '../ui';

interface MapViewProps {
    events: HackathonEvent[];
}

const MapContainer = ({ events }: { events: HackathonEvent[] }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerLayerRef = useRef<any>(null);

    // Initialize Map
    useEffect(() => {
        // If Leaflet is already loaded, init map immediately
        if ((window as any).L) {
            initMap();
        } else {
            // Check if script is already present to avoid duplicates
            if (!document.querySelector('script[src*="leaflet.js"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                script.onload = initMap;
                document.body.appendChild(script);
            } else {
                // Script exists but maybe not loaded? Wait a bit or check L again
                const checkL = setInterval(() => {
                    if ((window as any).L) {
                        clearInterval(checkL);
                        initMap();
                    }
                }, 100);
            }
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerLayerRef.current = null;
            }
        };
    }, []);

    const initMap = () => {
        if (!mapContainer.current || mapInstance.current || !(window as any).L) return;

        const L = (window as any).L;
        const map = L.map(mapContainer.current, {
            zoomControl: false,
            attributionControl: false,
            // Lock the view:
            minZoom: 2,
            maxBounds: [[-90, -180], [90, 180]], // Top-left, Bottom-right
            maxBoundsViscosity: 1.0 // 1.0 = strict solid wall, 0.0 = bouncy
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            noWrap: true // Prevents the map from repeating horizontally
        }).addTo(map);

        const markerLayer = L.layerGroup().addTo(map);
        markerLayerRef.current = markerLayer;

        mapInstance.current = map;
        updateMarkers();
    };

    const updateMarkers = () => {
        if (!markerLayerRef.current || !(window as any).L) return;
        const L = (window as any).L;

        try {
            // console.log("Updating markers. Events count:", events?.length);
            markerLayerRef.current.clearLayers();

            if (!Array.isArray(events)) return;

            events.forEach(ev => {
                if (!ev || !ev.coords || ev.coords.length !== 2) return;

                const lat = Number(ev.coords[0]);
                const lng = Number(ev.coords[1]);
                if (isNaN(lat) || isNaN(lng)) return;

                const categoryColor = CATEGORIES ? (CATEGORIES.find(c => c.id === ev.type)?.color || '#3b82f6') : '#3b82f6';

                try {
                    // Validate logoUrl
                    let safeLogoUrl = '';
                    if (ev.logoUrl) {
                        try {
                            const parsed = new URL(ev.logoUrl);
                            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                                // Escape single quotes to prevent breaking out of CSS string
                                safeLogoUrl = parsed.href.replace(/'/g, "%27");
                            }
                        } catch {
                            // Invalid URL, ignore
                        }
                    }

                    // Create Custom Icon (DivIcon)
                    const iconHtml = safeLogoUrl
                        ? `<div style="
                                width: 100%; height: 100%;
                                background-image: url('${safeLogoUrl}');
                                background-size: cover;
                                background-position: center;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 0 15px ${categoryColor}80;
                           "></div>`
                        : `<div style="
                                width: 100%; height: 100%;
                                background-color: ${categoryColor};
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 0 10px ${categoryColor}, 0 0 20px ${categoryColor}40;
                                transition: transform 0.2s;
                           "></div>`;

                    const customIcon = L.divIcon({
                        className: 'custom-map-marker', // We can add hover effects in CSS if needed
                        html: iconHtml,
                        iconSize: [18, 18], // Standard size
                        iconAnchor: [12, 12], // Centered
                        popupAnchor: [0, -12]
                    });

                    // Create safe popup content using DOM elements
                    const popupContent = document.createElement('div');
                    popupContent.style.fontFamily = "'JetBrains Mono'";
                    popupContent.style.fontSize = "12px";
                    popupContent.style.minWidth = "150px";

                    const titleEl = document.createElement('strong');
                    titleEl.style.fontSize = "14px";
                    titleEl.style.display = "block";
                    titleEl.style.marginBottom = "4px";
                    titleEl.textContent = ev.title || 'Untitled';

                    const locEl = document.createElement('span');
                    locEl.style.color = "#A3A3A3";
                    locEl.textContent = ev.location || 'Unknown Location';

                    popupContent.appendChild(titleEl);
                    popupContent.appendChild(locEl);

                    L.marker([lat, lng], { icon: customIcon })
                        .bindPopup(popupContent)
                        .addTo(markerLayerRef.current);
                } catch (e) {
                    console.error("Marker error", e);
                }
            });
        } catch (err) {
            console.error("Error updating markers", err);
        }
    }

    // Update markers when events change
    useEffect(() => {
        if (mapInstance.current && (window as any).L) {
            updateMarkers();
        }
    }, [events]);

    return (
        <div className="w-full h-[60vh] min-h-[400px] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl bg-neutral-900">
            <div ref={mapContainer} className="w-full h-full z-10" />
            <div className="absolute bottom-4 left-4 z-[400] bg-black/80 backdrop-blur border border-white/10 p-3 rounded-lg">
                <div className="text-[10px] text-gray-400 font-mono mb-1">LIVE FEED</div>
                <div className="text-xs text-green-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    SYSTEM ONLINE
                </div>
            </div>
        </div>
    );
};

export const MapView = ({ events }: MapViewProps) => {
    return (
        <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
            <style>{`
                .leaflet-popup-content-wrapper, .leaflet-popup-tip {
                    background-color: #0A0A0A !important;
                    color: white !important;
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(8px);
                }
                .leaflet-container {
                    background-color: #0A0A0A !important;
                }
            `}</style>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" /> Global Intelligence
                </h2>
                <Badge variant="outline">LIVE MODE</Badge>
            </div>
            <MapContainer events={events} />
        </div>
    );
};
