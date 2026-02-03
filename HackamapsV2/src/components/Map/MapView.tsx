import React, { useEffect, useRef } from 'react';
import type { HackathonEvent } from '../../types';
import { CATEGORIES } from '../../types';
import { Globe, Plus } from 'lucide-react';
import { Badge } from '../ui';

interface MapViewProps {
    events: HackathonEvent[];
    onAddHackathon?: () => void;
    isPremium?: boolean;
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

    function initMap() {
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

        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            noWrap: true, // Prevents the map from repeating horizontally
            bounds: [[-85.0511, -180], [85.0511, 180]] // Standard world bounds to prevent 400 errors for non-existent tiles
        }).addTo(map);

        // Debug: Track tile loading errors
        tileLayer.on('tileerror', (error: any) => {
            console.warn('Map Tile Error captured:', {
                url: error.tile.src,
                coords: error.coords,
                zoom: error.coords.z
            });
        });

        const markerLayer = L.layerGroup().addTo(map);
        markerLayerRef.current = markerLayer;

        mapInstance.current = map;
        updateMarkers();
    }

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
                const isPro = ev.isPro;

                try {
                    // Validate logoUrl
                    let safeLogoUrl = '';
                    if (ev.logoUrl) {
                        try {
                            const parsed = new URL(ev.logoUrl);
                            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                                safeLogoUrl = parsed.href.replace(/'/g, "%27");
                            }
                        } catch {
                            // If not a URL, it might be a Supabase path? 
                            // For simplicity, we assume it's a URL or empty
                        }
                    }

                    // Create Custom Icon (DivIcon)
                    const proEffects = isPro ? `
                        border: 2px solid #FFD700;
                        box-shadow: 0 0 15px #FFD700, 0 0 5px #FFD700 inset;
                        z-index: 1000;
                    ` : `
                        border: 2px solid white;
                        box-shadow: 0 0 15px ${categoryColor}80;
                    `;

                    const iconHtml = safeLogoUrl
                        ? `<div style="
                                width: 100%; height: 100%;
                                background-image: url('${safeLogoUrl}');
                                background-size: cover;
                                background-position: center;
                                border-radius: 50%;
                                ${proEffects}
                           ">
                           </div>`
                        : `<div style="
                                width: 100%; height: 100%;
                                background-color: ${categoryColor};
                                border-radius: 50%;
                                ${proEffects}
                                transition: transform 0.2s;
                           ">
                           </div>`;

                    const customIcon = L.divIcon({
                        className: `custom-map-marker ${isPro ? 'pro-marker' : ''}`,
                        html: iconHtml,
                        iconSize: isPro ? [24, 24] : [18, 18],
                        iconAnchor: isPro ? [12, 12] : [9, 9],
                        popupAnchor: [0, -12]
                    });

                    // Create rich popup content
                    const popupHtml = `
                        <div class="font-sans min-w-[280px] p-1">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-lg font-bold text-gray-100 leading-tight pr-4">
                                    ${ev.title || 'Untitled Event'}
                                    ${isPro ? '<span class="ml-2 text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30 uppercase tracking-tighter">PRO</span>' : ''}
                                </h3>
                            </div>
                            
                            <p class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                                ${ev.description || `Join this exciting hackathon in ${ev.location}.`}
                            </p>
                            
                            <div class="space-y-2 mb-4">
                                <div class="flex items-center gap-2 text-sm text-gray-300">
                                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    ${ev.location}
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-300">
                                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    ${ev.date}
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-4">
                                ${ev.tags.slice(0, 3).map(tag =>
                        `<span class="px-2.5 py-0.5 rounded-full bg-[${categoryColor}]/10 text-[${categoryColor}] text-xs font-medium border border-[${categoryColor}]/20">
                                        ${tag}
                                    </span>`
                    ).join('')}
                                <span class="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                    Hackathon
                                </span>
                            </div>

                            ${ev.website ? `
                                <a href="${ev.website}" target="_blank" rel="noopener noreferrer" style="color: white !important;"
                                   class="block w-full text-center bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-medium py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 text-sm group">
                                   Visit Website
                                   <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </a>
                            ` : `
                                <div class="block w-full text-center bg-white/5 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm border border-white/5">
                                    No Website Available
                                </div>
                            `}
                        </div>
                    `;

                    L.marker([lat, lng], { icon: customIcon })
                        .bindPopup(popupHtml)
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

export const MapView = ({ events, onAddHackathon, isPremium }: MapViewProps) => {
    return (
        <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
            <style>{`
                .leaflet-popup-content-wrapper {
                    background-color: #0A0A0A !important;
                    color: white !important;
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(12px);
                    border-radius: 16px !important;
                    padding: 0 !important;
                    overflow: hidden;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
                }
                .leaflet-popup-content {
                    margin: 16px !important;
                    width: auto !important;
                    line-height: 1.5;
                }
                .leaflet-popup-tip {
                    background-color: #0A0A0A !important;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-container a.leaflet-popup-close-button {
                    color: #6B7280 !important;
                    font-size: 18px !important;
                    padding: 8px !important;
                    right: 4px !important;
                    top: 4px !important;
                    transition: color 0.2s;
                }
                .leaflet-container a.leaflet-popup-close-button:hover {
                    color: white !important;
                }
                .leaflet-container {
                    background-color: #0A0A0A !important;
                }
            `}</style>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 tracking-tight">
                        <Globe className="w-5 h-5 md:w-8 md:h-8 text-blue-500 flex-shrink-0" /> Global Intelligence
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-400 mt-1">Discover hackathons worldwide</p>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onAddHackathon}
                        className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 group text-xs md:text-sm whitespace-nowrap"
                    >
                        {isPremium ? (
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                            <div className="relative">
                                <Plus className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                                <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500 border border-black text-[6px] flex items-center justify-center text-black font-black">★</span>
                                </div>
                            </div>
                        )}
                        ADD HACKATHON
                    </button>
                    <Badge variant="outline" className="text-[10px] md:text-xs">LIVE MODE</Badge>
                </div>
            </div>

            <MapContainer events={events} />
        </div>
    );
};
