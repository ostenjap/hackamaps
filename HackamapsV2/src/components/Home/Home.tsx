import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui';
import type { ViewState } from '../../types';

interface HomeProps {
    eventCount: number;
    setView: (view: ViewState) => void;
}

export const Home = ({ eventCount, setView }: HomeProps) => {
    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-900 bg-green-900/10 text-green-400 text-[10px] font-mono mb-8">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {eventCount} EVENTS LIVE NOW
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
                Find Your <br />
                Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-mono italic">Build</span>.
            </h1>

            <p className="text-neutral-400 max-w-lg mx-auto text-lg leading-relaxed mb-10">
                The real-time global directory for hackers. Discover hackathons, find teammates, and ship code.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={() => setView('discover')} className="h-12 px-8 text-base">
                    Start Exploring <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setView('map')} className="h-12 px-8 text-base font-mono">
                    [M] Map View
                </Button>
            </div>
        </div>
    );
};
