import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { HackathonEvent } from '../types';

export function useEvents() {
    const [data, setData] = useState<HackathonEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            console.log("Attempting to fetch events from Supabase...");
            try {
                const { data: events, error } = await supabase
                    .from('hackathons_staging')
                    .select('*');

                if (error) {
                    console.error('Supabase Error fetching events:', error);
                    return;
                }

                if (events) {
                    const mappedEvents: HackathonEvent[] = events.map((event: any) => {
                        try {
                            // Handle categories that might be JSON strings or arrays
                            let parsedCategories: string[] = [];
                            if (Array.isArray(event.categories)) {
                                parsedCategories = event.categories;
                            } else if (typeof event.categories === 'string') {
                                try {
                                    parsedCategories = JSON.parse(event.categories);
                                } catch (e) {
                                    console.warn(`Failed to parse categories for event ${event.id}:`, event.categories);
                                    parsedCategories = [];
                                }
                            }

                            return {
                                id: event.id,
                                title: event.name || 'Untitled Event',
                                date: event.start_date ? new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA',
                                startDate: new Date(event.start_date || Date.now()),
                                location: event.is_online ? 'Remote' : `${event.city || ''}, ${event.country || ''}`,
                                country: event.country || '',
                                continent: determineContinent(event.country || event.continent, event.city),
                                coords: [Number(event.latitude) || 0, Number(event.longitude) || 0],
                                prize: event.prize_pool || 'N/A',
                                tags: parsedCategories,
                                type: determineType(parsedCategories),
                                website: event.website_url || '',
                                description: event.description || '',
                                logoUrl: event.logo_url || '',
                                isPro: event.profiles?.is_premium || false
                            };
                        } catch (mapErr) {
                            console.error("Error mapping event:", event, mapErr);
                            return null;
                        }
                    }).filter(Boolean) as HackathonEvent[];
                    
                    console.log(`Successfully mapped ${mappedEvents.length} events.`);
                    setData(mappedEvents);
                } else {
                    console.warn("No events found in Supabase (data is null or empty).");
                }
            } catch (err) {
                console.error('Unexpected error in fetchEvents:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return { data, isLoading };
}

// Helper to map DB categories to the UI 'type' (used for icon/color logic if needed)
function determineType(categories: any): 'web3' | 'ai' | 'cloud' | 'generic' {
    if (!Array.isArray(categories) || categories.length === 0) return 'generic';
    const lowerCats = categories.map(c => String(c).toLowerCase());

    if (lowerCats.some(c => c.includes('web3') || c.includes('blockchain') || c.includes('crypto'))) return 'web3';
    if (lowerCats.some(c => c.includes('ai') || c.includes('ml') || c.includes('llm'))) return 'ai';
    if (lowerCats.some(c => c.includes('cloud') || c.includes('devops'))) return 'cloud';

    return 'generic';
}

function determineContinent(country?: string, city?: string): string {
    if (!country && !city) return 'Unknown';
    const combined = `${country || ''} ${city || ''}`.toLowerCase();

    const northAmerica = ['united states', 'usa', 'canada', 'mexico', 'puerto rico'];
    const europe = ['united kingdom', 'uk', 'germany', 'france', 'spain', 'italy', 'poland', 'netherlands', 'sweden', 'switzerland', 'austria', 'belgium', 'norway', 'denmark', 'finland', 'ireland', 'portugal', 'greece', 'czech', 'slovakia', 'slovensko', 'hungary', 'romania', 'bulgaria', 'estonia', 'latvia', 'lithuania', 'ukraine'];
    const asia = ['china', 'japan', 'india', 'singapore', 'korea', 'thailand', 'vietnam', 'uae', 'dubai', 'indonesia', 'malaysia', 'philippines', 'taiwan', 'hong kong', 'israel', 'turkey', 'saudi arabia', 'pakistan'];
    const southAmerica = ['brazil', 'argentina', 'colombia', 'peru', 'chile', 'ecuador', 'venezuela'];
    const oceania = ['australia', 'new zealand', 'fiji'];
    const africa = ['nigeria', 'kenya', 'south africa', 'egypt', 'ghana', 'morocco', 'ethiopia', 'tanzania'];

    if (northAmerica.some(x => combined.includes(x))) return 'North America';
    if (europe.some(x => combined.includes(x))) return 'Europe';
    if (asia.some(x => combined.includes(x))) return 'Asia';
    if (southAmerica.some(x => combined.includes(x))) return 'South America';
    if (oceania.some(x => combined.includes(x))) return 'Oceania';
    if (africa.some(x => combined.includes(x))) return 'Africa';

    return 'Other';
}
