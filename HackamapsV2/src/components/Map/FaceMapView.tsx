import React, { useEffect, useRef, useState } from 'react';
import type { FacePin } from '../../types';
import { User, Plus } from 'lucide-react';
import { Badge } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

interface FaceMapViewProps {
    pins: FacePin[];
    onAddPin: () => void;
}

const FaceMapContainer = ({ pins }: { pins: FacePin[] }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerLayerRef = useRef<any>(null);

    useEffect(() => {
        if ((window as any).L) {
            initMap();
        } else {
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
            minZoom: 2,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0
        }).setView([20, 0], 2);

        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            noWrap: true,
            bounds: [[-85.0511, -180], [85.0511, 180]] // Clamp requests to valid world coordinates
        }).addTo(map);

        // Debug: Log if tiles fail to load (e.g. network issue or invalid coords)
        tileLayer.on('tileerror', (error: any) => {
            console.warn('Face Map Tile Error captured:', {
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

        markerLayerRef.current.clearLayers();

        pins.forEach(pin => {
            if (!pin.latitude || !pin.longitude) return;

            const imageUrl = pin.custom_image_url || pin.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

            const iconHtml = `
                <div class="relative group">
                    <div class="w-10 h-10 rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden bg-neutral-900 transition-transform hover:scale-110">
                        <img src="${imageUrl}" class="w-full h-full object-cover" />
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
                </div>
            `;

            const customIcon = L.divIcon({
                className: 'face-marker',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            const popupHtml = `
                <div class="font-sans min-w-[240px] p-1">
                    <div class="flex items-center gap-3 mb-3">
                        <img src="${imageUrl}" class="w-12 h-12 rounded-full border border-white/20 object-cover" />
                        <div>
                            <h3 class="text-base font-bold text-white leading-tight">@${pin.username || 'user'}</h3>
                            <p class="text-[10px] text-blue-400 font-mono uppercase tracking-wider">Hacker Profile</p>
                        </div>
                    </div>
                    
                    <p class="text-sm text-neutral-300 mb-4 italic leading-relaxed">
                        "${pin.description || 'No description provided.'}"
                    </p>
                    
                    <div class="flex items-center gap-3 border-t border-white/5 pt-3">
                        ${pin.linkedin_url ? `
                            <a href="${pin.linkedin_url}" target="_blank" rel="noopener" class="text-neutral-400 hover:text-blue-400 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        ` : ''}
                        ${pin.x_url ? `
                            <a href="${pin.x_url}" target="_blank" rel="noopener" class="text-neutral-400 hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                        ` : ''}
                        ${!pin.linkedin_url && !pin.x_url ? '<span class="text-[10px] text-neutral-500 italic">No social links</span>' : ''}
                    </div>
                </div>
            `;

            L.marker([pin.latitude, pin.longitude], { icon: customIcon })
                .bindPopup(popupHtml)
                .addTo(markerLayerRef.current);
        });
    }

    useEffect(() => {
        if (mapInstance.current && (window as any).L) {
            updateMarkers();
        }
    }, [pins]);
    // remember this part
    return (
        <div className="w-full h-[60vh] min-h-[400px] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl bg-neutral-900">
            <div ref={mapContainer} className="w-full h-full z-10" />
            <div className="absolute bottom-4 left-4 z-[400] bg-black/80 backdrop-blur border border-white/10 p-3 rounded-lg">
                <div className="text-[10px] text-gray-400 font-mono mb-1">NETWORK ACTIVE</div>
                <div className="text-xs text-blue-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {pins.length} HACKERS ONLINE
                </div>
            </div>
        </div>
    );
};

export const FaceMapView = ({ pins, onAddPin }: FaceMapViewProps) => {
    const { profile } = useAuth();
    const isPremium = profile?.tier === 'elite' || profile?.tier === 'pro' || profile?.is_premium;

    return (
        <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
            <style>{`
                .face-marker {
                    background: none !important;
                    border: none !important;
                }
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
                    margin: 0 !important;
                    width: auto !important;
                }
                .leaflet-popup-tip {
                    background-color: #0A0A0A !important;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-container {
                    background-color: #0A0A0A !important;
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
            `}</style>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 tracking-tight">
                        <User className="w-5 h-5 md:w-8 md:h-8 text-blue-500 flex-shrink-0" /> Face Map
                    </h2>
                    <p className="text-xs md:text-sm text-neutral-400 mt-1">Connect with hackers worldwide</p>
                </div>

                <button
                    onClick={onAddPin}
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 group text-xs md:text-sm whitespace-nowrap w-fit"
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
                    SET MY PIN
                </button>
            </div>

            <FaceMapContainer pins={pins} />
        </div>
    );
};
