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
                    .from('hackathons')
                    .select('*');

                if (error) {
                    console.error('Supabase Error fetching events:', error);
                    console.error('Error Details:', error.message, error.details, error.hint);
                    return;
                }

                console.log("Raw Supabase Data:", events);

                if (events) {
                    const mappedEvents: HackathonEvent[] = events.map((event) => {
                        try {
                            return {
                                id: event.id,
                                title: event.name,
                                date: new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                location: event.is_online ? 'Remote' : `${event.city || ''}, ${event.country || ''}`,
                                coords: [event.latitude || 0, event.longitude || 0],
                                prize: event.prize_pool || 'N/A',
                                tags: event.categories || [],
                                type: determineType(event.categories)
                            };
                        } catch (mapErr) {
                            console.error("Error mapping event:", event, mapErr);
                            return null;
                        }
                    }).filter(Boolean) as HackathonEvent[]; // Type assertion to remove nulls

                    console.log("Mapped Events:", mappedEvents);
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
function determineType(categories: string[] | null): 'web3' | 'ai' | 'cloud' | 'generic' {
    if (!categories || categories.length === 0) return 'generic';
    const lowerCats = categories.map(c => c.toLowerCase());

    if (lowerCats.some(c => c.includes('web3') || c.includes('blockchain') || c.includes('crypto'))) return 'web3';
    if (lowerCats.some(c => c.includes('ai') || c.includes('ml') || c.includes('llm'))) return 'ai';
    if (lowerCats.some(c => c.includes('cloud') || c.includes('devops'))) return 'cloud';

    return 'generic';
}
