import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import type { ViewState } from '../../types';
import { PricingTable } from '../Premium/PricingTable';

interface HomeProps {
    eventCount: number;
    setView: (view: ViewState) => void;
}

export const Home = ({ eventCount, setView }: HomeProps) => {
    const scrollToPricing = () => {
        const element = document.getElementById('pricing');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex-1 w-full">
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 -translate-y-12 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-900 bg-green-900/10 text-green-400 text-[10px] font-mono mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {eventCount} EVENTS LIVE NOW
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-white">
                    Find Your <br />
                    Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-mono italic">Build</span>.
                </h1>

                <p className="text-neutral-400 max-w-lg mx-auto text-lg leading-relaxed mb-6">
                    Discover live hackathons. Find your <strong>CO-FOUNDER</strong> .<br /> Meet <strong>INVESTORS</strong>. Ship code that matters.                </p>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button onClick={() => setView('discover')} className="h-12 px-8 text-base">
                            Start Exploring <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={() => setView('map')} className="h-12 px-8 text-base font-mono">
                            [M] Map View
                        </Button>
                    </div>

                    <button
                        onClick={scrollToPricing}
                        className="group relative flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500/80 hover:text-yellow-400 transition-all duration-300 text-sm font-medium animate-pulse-gold hover:scale-105 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform" />
                        Check out our upgrade
                    </button>
                </div>
            </div>

            <PricingTable />
        </div>
    );
};
