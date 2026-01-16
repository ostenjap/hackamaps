import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Mic,
    ChevronRight,
    Filter
} from 'lucide-react';
import type { ViewState, UserCommand, FilterState } from './types';
import { useEvents } from './hooks/useEvents';
import { Home } from './components/Home/Home';
import { Discover } from './components/Discover/Discover';
import { MapView } from './components/Map/MapView';
import { FilterPanel } from './components/FilterPanel';
import { UserMenu } from './components/Auth/UserMenu';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfileModal } from './components/Auth/ProfileModal';

export default function AppContent() {
    const [view, setView] = useState<ViewState>('home');
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [captions, setCaptions] = useState<UserCommand[]>([]);
    const { data: events, isLoading } = useEvents();

    // --- Auth State ---
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // --- Filter State ---
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        selectedCategories: [],
        selectedContinents: [],
        locationSearch: "",
        selectedWeeksAhead: 0
    });

    const handleSetFilters = (updates: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...updates }));
    };

    // --- FILTERING LOGIC ---
    const filteredEvents = React.useMemo(() => events.filter(event => {
        // 1. Categories
        if (filters.selectedCategories.length > 0) {
            const typeMatch = filters.selectedCategories.includes(event.type);
            if (!typeMatch) return false;
        }

        // 2. Continents
        if (filters.selectedContinents.length > 0) {
            if (!event.continent || !filters.selectedContinents.includes(event.continent)) {
                return false;
            }
        }

        // 3. Location / Search
        if (filters.locationSearch) {
            const search = filters.locationSearch.toLowerCase();
            const matches =
                (event.title || '').toLowerCase().includes(search) ||
                (event.location || '').toLowerCase().includes(search) ||
                (event.country || '').toLowerCase().includes(search);

            if (!matches) return false;
        }

        // 4. Time Frame (Start Date Threshold)
        if (filters.selectedWeeksAhead > 0) {
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() + (filters.selectedWeeksAhead * 7));

            // Show events that start AFTER this future threshold
            if (event.startDate < thresholdDate) {
                return false;
            }
        }

        return true;
    }), [events, filters]);


    // --- Keyboard Navigation & Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isInputOpen) return; // Disable shortcuts when typing

            switch (e.key) {
                case 'ArrowRight':
                    if (view === 'home') setView('discover');
                    else if (view === 'discover') setView('map');
                    else if (view === 'map') setView('organizers');
                    break;
                case 'ArrowLeft':
                    if (view === 'organizers') setView('map');
                    else if (view === 'map') setView('discover');
                    else if (view === 'discover') setView('home');
                    break;
                case 'm':
                    setView('map');
                    break;
                case 'h':
                    setView('home');
                    break;
                case 'f':
                    setIsFilterOpen(prev => !prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [view, isInputOpen]);

    // --- Voice/Agent Logic Simulation ---
    const handleCommand = (text: string) => {
        const lower = text.toLowerCase();
        let response = "";

        if (lower.includes('map') || lower.includes('where')) {
            response = "Opening global map view.";
            setView('map');
        } else if (lower.includes('list') || lower.includes('event')) {
            response = "Accessing event directory.";
            setView('discover');
        } else if (lower.includes('home')) {
            response = "Returning to dashboard.";
            setView('home');
        } else if (lower.includes('filter')) {
            response = "Opening filter panel.";
            setIsFilterOpen(true);
        } else if (lower.includes('login') || lower.includes('sign in')) {
            response = "Opening authentication portal.";
            setIsAuthOpen(true);
        } else {
            response = "Command not recognized. Try 'Show Map' or 'List Events'.";
        }

        addCaption(text, 'user');
        setTimeout(() => addCaption(response, 'agent'), 400);

        // TTS
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(response);
            u.rate = 1.1;
            u.pitch = 0.9;
            window.speechSynthesis.speak(u);
        }
    };

    const addCaption = (text: string, type: 'user' | 'agent') => {
        const newCap = { text, type, timestamp: Date.now() };
        setCaptions(prev => [...prev, newCap]);
        setTimeout(() => {
            setCaptions(prev => prev.filter(c => c.timestamp !== newCap.timestamp));
        }, 4000);
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleCommand(inputText);
        setInputText('');
    };

    useEffect(() => {
        if (isInputOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInputOpen]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            {/* FILTER PANEL */}
            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                {...filters}
                setFilters={handleSetFilters}
            />

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] opacity-[0.03] bg-cover bg-center" />
            </div>

            {/* HEADER / NAV */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex items-center justify-between pointer-events-none">
                <div className="bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent absolute inset-0 z-0 h-32" />

                <div className="relative z-10 pointer-events-auto cursor-pointer flex items-center gap-4">
                    <div onClick={() => setView('home')} className="px-3 py-1 bg-white/5 border border-white/10 rounded backdrop-blur-md hover:bg-white/10 transition-colors">
                        <span className="font-mono font-bold text-xs tracking-widest">HACKA_MAPS</span>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-600/20 hover:border-blue-500/40 transition-all text-xs font-mono"
                    >
                        <Filter className="w-3 h-3" />
                        FILTER
                    </button>
                </div>

                <nav className="relative z-10 pointer-events-auto hidden md:flex items-center gap-1 bg-neutral-900/50 border border-white/5 p-1 rounded-full backdrop-blur-md">
                    <button
                        onClick={() => setView('home')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === 'home' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setView('discover')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === 'discover' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                        Discover
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === 'map' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                        Map
                    </button>
                </nav>

                <div className="relative z-10 pointer-events-auto flex items-center gap-4">
                    <a href="#" className="text-xs font-mono text-neutral-500 hover:text-white transition-colors hidden md:block">GITHUB</a>
                    <UserMenu
                        onOpenAuth={() => setIsAuthOpen(true)}
                        onOpenProfile={() => setIsProfileOpen(true)}
                    />
                </div>
            </header>


            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 w-full h-full pt-32 pb-24 px-4 overflow-y-auto scrollbar-none">
                <div className="max-w-7xl mx-auto min-h-full flex flex-col">
                    {view === 'home' && <Home eventCount={filteredEvents.length} setView={setView} />}
                    {view === 'discover' && <Discover events={filteredEvents} isLoading={isLoading} setView={setView} onOpenFilter={() => setIsFilterOpen(true)} />}
                    {view === 'map' && <MapView events={filteredEvents} />}
                    {view === 'organizers' && (
                        <div className="text-center animate-in fade-in flex-1 flex flex-col justify-center">
                            <h1 className="text-4xl font-bold mb-4">Organizer Portal</h1>
                            <p className="text-neutral-400">Restricted Access. Login required.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* FLOATING HUD / CAPTIONS */}
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
                {captions.map(cap => (
                    <div key={cap.timestamp} className={`px-4 py-2 rounded-xl backdrop-blur-md border text-sm shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300 ${cap.type === 'agent'
                        ? 'bg-neutral-900/90 border-white/10 text-white'
                        : 'bg-blue-900/80 border-blue-500/30 text-blue-100 font-mono text-xs'
                        }`}>
                        {cap.text}
                    </div>
                ))}
            </div>

            {/* COMMAND INTERFACE (Simulated Chat Input) */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
                <div className={`transition-all duration-500 ease-out origin-right overflow-hidden ${isInputOpen ? 'w-[320px] opacity-100' : 'w-0 opacity-0'}`}>
                    <form onSubmit={handleInputSubmit} className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full p-1 pl-4 flex items-center shadow-2xl">
                        <Terminal className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask agent..."
                            className="bg-transparent border-none outline-none text-sm font-mono text-white w-full placeholder:text-neutral-600 h-10"
                        />
                        <button type="button" onClick={() => setIsInputOpen(false)} className="p-2 hover:text-white text-neutral-500">
                            <ChevronRight className="w-4 h-6" />
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => setIsInputOpen(!isInputOpen)}
                    className={`h-14 w-14 rounded-full flex items-center justify-center border transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isInputOpen
                        ? 'bg-blue-600 border-blue-400 text-white rotate-90'
                        : 'bg-neutral-900/80 border-white/10 text-blue-500 hover:scale-110 hover:border-blue-500/50'
                        }`}
                >
                    {isInputOpen ? <ChevronRight className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
            </div>

        </div>
    );
}
