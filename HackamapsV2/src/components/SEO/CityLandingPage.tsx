import React, { useEffect, useRef, useMemo } from 'react';
import type { HackathonEvent } from '../../types';
import { CATEGORIES } from '../../types';
import { MapPin, ArrowRight, Globe, Zap, Users } from 'lucide-react';
import { Badge } from '../ui';
import { useEvents } from '../../hooks/useEvents';
import { Helmet } from 'react-helmet-async';
import { SEO_CITIES, type CityConfig } from '../../config/cities';

const CityMapContainer = ({ events, cityConfig }: { events: HackathonEvent[], cityConfig: CityConfig }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerLayerRef = useRef<any>(null);

    // Initialize Map
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
    }, [cityConfig.slug]); // Re-init if city changes

    function initMap() {
        if (!mapContainer.current || mapInstance.current || !(window as any).L) return;

        const L = (window as any).L;
        const map = L.map(mapContainer.current, {
            zoomControl: true,
            attributionControl: false,
            minZoom: 3,
        }).setView(cityConfig.coords, cityConfig.zoom);

        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            noWrap: true,
            bounds: [[-85.0511, -180], [85.0511, 180]]
        }).addTo(map);

        const markerLayer = L.layerGroup().addTo(map);
        markerLayerRef.current = markerLayer;

        mapInstance.current = map;

        // Draw radius circle if applicable
        if (cityConfig.radius) {
            L.circle(cityConfig.coords, {
                radius: cityConfig.radius * 1000, // convert to meters
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.05,
                weight: 1,
                dashArray: '5, 10'
            }).addTo(map);
        }

        updateMarkers();
    }


    const updateMarkers = () => {
        if (!markerLayerRef.current || !(window as any).L) return;
        const L = (window as any).L;

        try {
            markerLayerRef.current.clearLayers();

            if (!Array.isArray(events)) return;

            events.forEach(ev => {
                if (!ev || !ev.coords || ev.coords.length !== 2) {
                    console.error(`Error: Hackathon "${ev?.title || 'Unknown'}" (ID: ${ev?.id || 'Unknown'}) is missing latitude/longitude coordinates and will not be displayed on the city map.`);
                    return;
                }

                const lat = ev.coords[0];
                const lng = ev.coords[1];
                if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
                    console.error(`Error: Hackathon "${ev.title}" (ID: ${ev.id}) has invalid coordinates [${lat}, ${lng}] and will not be displayed on the city map.`);
                    return;
                }

                const categoryColor = CATEGORIES ? (CATEGORIES.find(c => c.id === ev.type)?.color || '#3b82f6') : '#3b82f6';
                const isPro = ev.isPro;

                let safeLogoUrl = '';
                if (ev.logoUrl) {
                    try {
                        const parsed = new URL(ev.logoUrl);
                        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                            safeLogoUrl = parsed.href.replace(/'/g, "%27");
                        }
                    } catch {
                        // ignore
                    }
                }

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
                       "></div>`
                    : `<div style="
                            width: 100%; height: 100%;
                            background-color: ${categoryColor};
                            border-radius: 50%;
                            ${proEffects}
                            transition: transform 0.2s;
                       "></div>`;

                const customIcon = L.divIcon({
                    className: `custom-map-marker ${isPro ? 'pro-marker' : ''}`,
                    html: iconHtml,
                    iconSize: isPro ? [24, 24] : [18, 18],
                    iconAnchor: isPro ? [12, 12] : [9, 9],
                    popupAnchor: [0, -12]
                });

                const popupHtml = `
                    <div class="font-sans min-w-[280px] p-1">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-lg font-bold text-gray-100 leading-tight pr-4">
                                ${ev.title || 'Untitled Event'}
                            </h3>
                        </div>
                        <p class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                            ${ev.description || `Join this exciting hackathon in ${ev.location}.`}
                        </p>
                        ${ev.website ? `
                            <a href="${ev.website}" target="_blank" rel="noopener noreferrer" style="color: white !important;"
                               class="block w-full text-center bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-medium py-2 px-4 rounded-lg transition-all text-sm">
                                Visit Website
                            </a>
                        ` : ''}
                    </div>
                `;

                L.marker([lat, lng], { icon: customIcon })
                    .bindPopup(popupHtml)
                    .addTo(markerLayerRef.current);
            });
        } catch (err) {
            console.error("Error updating markers", err);
        }
    };

    useEffect(() => {
        if (mapInstance.current && (window as any).L) {
            updateMarkers();
        }
    }, [events]);

    return (
        <div className="w-full h-full rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl bg-neutral-900">
            <div ref={mapContainer} className="w-full h-full z-10" />
            <div className="absolute bottom-4 left-4 z-[400] bg-black/80 backdrop-blur border border-white/10 p-3 rounded-lg">
                <div className="text-[10px] text-gray-400 font-mono mb-1 uppercase">${cityConfig.name}, ${cityConfig.country}</div>
                <div className="text-xs text-blue-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {events.length} Hackathons Found
                </div>
            </div>
        </div>
    );
};

export const CityLandingPage = ({ cityKey }: { cityKey: string }) => {
    const cityConfig = SEO_CITIES[cityKey];
    const { data: events, isLoading } = useEvents();

    if (!cityConfig) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">City not found</div>;
    }

    // Helper for distance calculation
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Filter events to only show those in or near this city/region
    const cityEvents = useMemo(() => {
        if (!events) return [];
        const cityName = cityConfig.name.toLowerCase();
        const keywords = cityConfig.keywords || [cityName];
        const cityLat = cityConfig.coords[0];
        const cityLng = cityConfig.coords[1];
        const radius = cityConfig.radius;
        
        return events.filter(ev => {
            // 1. Keyword check
            const searchStr = `${ev.location || ''} ${ev.title || ''} ${ev.description || ''}`.toLowerCase();
            const matchesKeywords = keywords.some(keyword => searchStr.includes(keyword.toLowerCase()));
            
            if (matchesKeywords) return true;

            // 2. Radius check (if applicable)
            if (radius && ev.coords && ev.coords.length === 2) {
                const dist = calculateDistance(cityLat, cityLng, ev.coords[0], ev.coords[1]);
                if (dist <= radius) return true;
            }

            return false;
        });
    }, [events, cityConfig]);



    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex flex-col items-center">
            <Helmet>
                <title>{cityConfig.slug === 'asia' ? 'Hackathons in Asia (2026) | India, China, Thailand, Singapore & more' : `Upcoming Hackathons in ${cityConfig.name} (2026) | Hackamaps`}</title>
                <meta name="description" content={cityConfig.slug === 'asia' ? "Discover the best upcoming hackathons in India, China, Thailand, Singapore and across Asia. Filter by date and location on our interactive developer event map." : `Find the best upcoming in-person hackathons, AI builder events, and coding competitions in ${cityConfig.name}. Map view, dates, and registration links.`} />
                <meta property="og:title" content={cityConfig.slug === 'asia' ? 'Asia Hackathons Map - India, Singapore, Thailand, China' : `${cityConfig.name} Hackathons Map - Hackamaps`} />
                <meta property="og:description" content={cityConfig.slug === 'asia' ? 'Explore the vibrant tech scene across Asia. Find hackathons in major hubs like Bengaluru, Singapore, Bangkok, and Shanghai.' : `Discover tech events and hackathons in ${cityConfig.name} on our interactive map.`} />

                <meta name="twitter:card" content="summary_large_image" />

                
                {/* Event Schema: JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": cityEvents.slice(0, 3).map((ev, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Event",
                                "name": ev.title,
                                "startDate": ev.startDate instanceof Date ? ev.startDate.toISOString().split('T')[0] : "2026-05-04",
                                "location": {
                                    "@type": "Place",
                                    "name": ev.location || `${cityConfig.name}, ${cityConfig.country}`,
                                    "address": {
                                        "@type": "PostalAddress",
                                        "addressLocality": cityConfig.name,
                                        "addressCountry": cityConfig.country === 'USA' ? 'US' : cityConfig.country.slice(0, 2).toUpperCase()
                                    }
                                },
                                "description": ev.description
                            }
                        }))
                    })}
                </script>
            </Helmet>

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
                }
                .leaflet-container a.leaflet-popup-close-button:hover {
                    color: white !important;
                }
                .leaflet-container {
                    background-color: #0A0A0A !important;
                    z-index: 0 !important;
                }
            `}</style>
            
            {/* Header / Hero Section */}
            <header className="w-full max-w-6xl mx-auto pt-24 pb-12 px-6 flex flex-col items-center text-center relative z-10">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
                
                <Badge variant="outline" className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 text-sm uppercase tracking-widest font-semibold">
                    {cityConfig.name}'s Tech Hub
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">
                    Upcoming Hackathons in {cityConfig.name} (2026)
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed">
                    {cityConfig.description} Discover the most exciting builder events, coding competitions, and tech gatherings in {cityConfig.name}.
                </p>

                <a 
                    href="https://hackamaps.com" 
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10">Explore Hackamaps</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
            </header>

            {/* Map Section */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-24 relative z-10">
                <div className="w-full h-[600px] relative rounded-3xl p-2 bg-gradient-to-b from-white/10 to-transparent">
                    <div className="absolute inset-0 bg-neutral-900 rounded-3xl -z-10" />
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                            Loading map...
                        </div>
                    ) : (
                        <CityMapContainer events={cityEvents} cityConfig={cityConfig} />
                    )}
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="w-full max-w-4xl mx-auto px-6 mb-24 text-neutral-300 prose prose-invert prose-lg relative z-10">
                <h2 className="text-3xl font-bold text-white mb-6">{cityConfig.slug === 'asia' ? 'Why Build in Asia?' : `Why Attend a Hackathon in ${cityConfig.name}?`}</h2>
                <p className="mb-6">
                    {cityConfig.slug === 'asia' 
                        ? "Asia is the world's most dynamic tech frontier. From India's massive developer ecosystem and China's AI-driven innovation to Singapore's global financial tech and Thailand's growing builder communities, the continent offers unparalleled opportunities for builders."
                        : `${cityConfig.name} is a world-class destination for developers and builders. From innovative startups to global tech giants, the city offers unparalleled opportunities to network, learn, and showcase your skills.`}
                </p>

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12 not-prose">
                    <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl">
                        <Globe className="w-8 h-8 text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Global Impact</h3>
                        <p className="text-sm text-neutral-400">Events in {cityConfig.name === 'Asia' ? 'major Asian hubs' : cityConfig.name} often attract global attention and high-tier sponsors.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl">
                        <Zap className="w-8 h-8 text-purple-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Innovation Hub</h3>
                        <p className="text-sm text-neutral-400">Collaborate with the brightest minds in {cityConfig.name === 'Asia' ? 'Asia\'s' : `${cityConfig.name}'s`} tech ecosystem.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl">
                        <Users className="w-8 h-8 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Strong Community</h3>
                        <p className="text-sm text-neutral-400">Build lasting connections with the local developer and founder community.</p>
                    </div>
                </div>

                {cityConfig.slug === 'asia' && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-white mb-4">Top Destinations for Hackathons in Asia</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                            <li className="bg-neutral-900/30 p-4 rounded-xl border border-white/5">
                                <strong>🇸🇬 Singapore:</strong> The gateway to SE Asia and a world-class hub for Fintech and Web3.
                            </li>
                            <li className="bg-neutral-900/30 p-4 rounded-xl border border-white/5">
                                <strong>🇹🇭 Thailand (Bangkok):</strong> A rapidly growing hub for AI builders and digital nomads.
                            </li>
                            <li className="bg-neutral-900/30 p-4 rounded-xl border border-white/5">
                                <strong>🇨🇳 China (Shanghai/Shenzhen):</strong> The heart of hardware and AI innovation.
                            </li>
                            <li className="bg-neutral-900/30 p-4 rounded-xl border border-white/5">
                                <strong>🇮🇳 India (Bengaluru):</strong> Home to one of the world's largest developer populations.
                            </li>
                        </ul>
                    </div>
                )}


                <h2 className="text-3xl font-bold text-white mb-6">Find Your Next Event</h2>
                <p>
                    Whether you are a seasoned full-stack developer, a designer, or just starting out, {cityConfig.name} has an event for you. Use Hackamaps to discover the next hackathon near you and register today.
                </p>
                <div className="mt-8 flex justify-center not-prose">
                    <a href="https://hackamaps.com" className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4">
                        View all events on Hackamaps
                    </a>
                </div>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6 not-prose">
                    <div>
                        <h3 className="text-xl font-bold text-white">Are hackathons in {cityConfig.name} free?</h3>
                        <p className="text-neutral-400">Most community-driven hackathons are free. Some specialized or corporate events might have a small commitment fee or registration process.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">How do I find teams for {cityConfig.name} events?</h3>
                        <p className="text-neutral-400">Hackathons usually have dedicated Discord servers or on-site team-matching sessions to help solo participants find teammates.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
