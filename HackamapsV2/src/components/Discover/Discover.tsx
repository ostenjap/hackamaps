import React from 'react';
import { Search, Share2, Calendar, MapPin } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import type { HackathonEvent, ViewState, FilterState } from '../../types';
import { CATEGORIES } from '../../types';
import { ExportButton } from '../Export/ExportButton';
import { trackEvent } from '../../lib/posthog';

interface DiscoverProps {
    events: HackathonEvent[];
    isLoading: boolean;
    setView: (view: ViewState) => void;
    onOpenFilter: () => void;
    onSelectEvent?: (id: string) => void;
    filters: FilterState;
}

export const Discover = ({ events, isLoading, setView, onOpenFilter, onSelectEvent, filters }: DiscoverProps) => {
    return (
        <div className="max-w-6xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Events</h2>
                    <p className="text-sm md:text-base text-neutral-500 mt-1">Curated list of high-signal hackathons.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <Button variant="outline" size="sm" className="hidden md:flex" onClick={onOpenFilter}>
                        <Search className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <ExportButton filters={filters} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-xl bg-neutral-900/50 animate-pulse border border-white/5" />
                    ))
                ) : (
                    events.map(event => {
                        const cat = CATEGORIES.find(c => c.id === event.type);
                        return (
                            <Card 
                                key={event.id} 
                                onClick={() => {
                                    trackEvent('hackathon_selected', {
                                        event_id: event.id,
                                        title: event.title,
                                        location: event.location,
                                        prize: event.prize,
                                        date: event.date,
                                        source: event.source || 'user'
                                    });
                                    onSelectEvent?.(event.id);
                                }} 
                                className="cursor-pointer group relative p-6 flex flex-col justify-between min-h-[280px]"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge style={{ backgroundColor: cat?.color ? `${cat.color}20` : undefined, color: cat?.color, borderColor: cat?.color }}>
                                            {event.tags[0]}
                                        </Badge>
                                        <Share2 className="w-4 h-4 text-neutral-600 hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                                    <div className="flex items-center text-neutral-400 text-sm gap-2 mb-1">
                                        <Calendar className="w-4 h-4" /> {event.date}
                                    </div>
                                    <div className="flex items-center text-neutral-400 text-sm gap-2">
                                        <MapPin className="w-4 h-4" /> {event.location}
                                    </div>
                                    {event.source && (
                                        <div className="text-[11px] text-neutral-500 mt-2 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                            Source: {event.source}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/10 mt-4">
                                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Prize Pool</div>
                                    <div className="text-lg font-mono text-white font-medium">{event.prize}</div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};
