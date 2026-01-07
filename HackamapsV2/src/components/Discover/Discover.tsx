import React from 'react';
import { Search, Share2, Calendar, MapPin } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import type { HackathonEvent, ViewState } from '../../types';

interface DiscoverProps {
    events: HackathonEvent[];
    isLoading: boolean;
    setView: (view: ViewState) => void;
}

export const Discover = ({ events, isLoading, setView }: DiscoverProps) => {
    return (
        <div className="max-w-6xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Trending Events</h2>
                    <p className="text-neutral-500 mt-1">Curated list of high-signal hackathons.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Search className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-xl bg-neutral-900/50 animate-pulse border border-white/5" />
                    ))
                ) : (
                    events.map(event => (
                        <Card key={event.id} onClick={() => setView('map')} className="cursor-pointer group relative p-6 flex flex-col justify-between min-h-[280px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant={event.type === 'web3' ? 'default' : event.type === 'ai' ? 'secondary' : 'outline'}>
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
                            </div>

                            <div className="pt-4 border-t border-white/10 mt-4">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Prize Pool</div>
                                <div className="text-lg font-mono text-white font-medium">{event.prize}</div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
