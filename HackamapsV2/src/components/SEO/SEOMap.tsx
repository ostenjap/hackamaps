import { useEffect, useRef } from 'react';
import type { HackathonEvent } from '../../types';
import { CATEGORIES } from '../../types';

/**
 * Lightweight, data-driven Leaflet map for programmatic SEO pages.
 *
 * Unlike the hardcoded-config city map, this takes a centre + events directly,
 * so it works for any DB-derived city or tag page. Loads Leaflet from CDN once
 * (matching the existing CSP allowlist) and renders one marker per event.
 */
export function SEOMap({
    events,
    center,
    zoom = 5,
    label,
}: {
    events: HackathonEvent[];
    center: [number, number] | null;
    zoom?: number;
    label?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    // Init map once.
    useEffect(() => {
        function ensureLeaflet(cb: () => void) {
            if ((window as any).L) return cb();
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
            let script = document.querySelector<HTMLScriptElement>('script[src*="leaflet.js"]');
            if (!script) {
                script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                document.body.appendChild(script);
            }
            script.addEventListener('load', cb, { once: true });
        }

        ensureLeaflet(() => {
            if (!containerRef.current || mapRef.current) return;
            const L = (window as any).L;
            const map = L.map(containerRef.current, {
                zoomControl: true,
                attributionControl: false,
                minZoom: 2,
            }).setView(center ?? [20, 0], center ? zoom : 2);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                noWrap: true,
                bounds: [[-85.0511, -180], [85.0511, 180]],
            }).addTo(map);

            layerRef.current = L.layerGroup().addTo(map);
            mapRef.current = map;
            drawMarkers();
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                layerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redraw when events change.
    useEffect(() => {
        if (mapRef.current && (window as any).L) drawMarkers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events]);

    function drawMarkers() {
        const L = (window as any).L;
        if (!layerRef.current || !L) return;
        layerRef.current.clearLayers();

        const latlngs: [number, number][] = [];
        for (const ev of events) {
            if (!ev.coords || ev.coords.length !== 2) continue;
            const [lat, lng] = ev.coords;
            if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) continue;
            latlngs.push([lat, lng]);

            const color = CATEGORIES.find(c => c.id === ev.type)?.color || '#3b82f6';
            const icon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="width:100%;height:100%;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 0 12px ${color}80;"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
                popupAnchor: [0, -12],
            });

            // Title is escaped to avoid stored-XSS via event data in the popup.
            const safeTitle = (ev.title || 'Untitled Event').replace(/[<>&"]/g, ch =>
                ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[ch] as string),
            );
            const safeHref = (() => {
                try {
                    const u = new URL(ev.website || '');
                    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '';
                } catch {
                    return '';
                }
            })();
            const popup = `<div class="font-sans min-w-[220px] p-1"><h3 class="text-base font-bold text-gray-100 mb-2">${safeTitle}</h3>${
                safeHref
                    ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="color:white !important;" class="block w-full text-center bg-[#8B5CF6] hover:bg-[#7c3aed] py-1.5 px-3 rounded-lg text-sm">Visit Website</a>`
                    : ''
            }</div>`;

            L.marker([lat, lng], { icon }).bindPopup(popup).addTo(layerRef.current);
        }

        // Fit to markers when we have several and no explicit centre.
        if (!center && latlngs.length > 1) {
            mapRef.current.fitBounds(latlngs, { padding: [40, 40] });
        }
    }

    return (
        <div className="w-full h-full rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl bg-neutral-900">
            <div ref={containerRef} className="w-full h-full z-10" />
            {label && (
                <div className="absolute bottom-4 left-4 z-[400] bg-black/80 backdrop-blur border border-white/10 p-3 rounded-lg">
                    <div className="text-xs text-blue-400 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        {label}
                    </div>
                </div>
            )}
        </div>
    );
}
