import React, { useEffect, useRef } from 'react';
import type { HackathonEvent } from '../../types';
import { Globe } from 'lucide-react';
import { Badge } from '../ui';

interface MapViewProps {
    events: HackathonEvent[];
}

const MapContainer = ({ events }: { events: HackathonEvent[] }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    const markerLayerRef = useRef<any>(null);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const initMap = () => {
        if (!mapContainer.current || mapInstance.current || !(window as any).L) return;

        const L = (window as any).L;
        const map = L.map(mapContainer.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        const markerLayer = L.layerGroup().addTo(map);
        markerLayerRef.current = markerLayer;

        mapInstance.current = map;
        updateMarkers(); // Initial render of markers
    };

    const updateMarkers = () => {
        if (!markerLayerRef.current || !(window as any).L) return;

        const L = (window as any).L;
        markerLayerRef.current.clearLayers();

        events.forEach(ev => {
            L.circleMarker(ev.coords, {
                radius: 6,
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.8
            })
                .bindPopup(`
        <div style="font-family: 'JetBrains Mono'; font-size: 12px;">
          <strong>${ev.title}</strong><br/>
          ${ev.location}
        </div>
      `)
                .addTo(markerLayerRef.current);
        });
    }

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
