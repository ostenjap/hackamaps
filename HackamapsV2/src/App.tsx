import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Map as MapIcon,
  List,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Globe,
  Cpu,
  Search,
  Mic,
  Calendar,
  Trophy,
  MapPin,
  Share2,
  Clock
} from 'lucide-react';

/**
 * ==========================================
 * TYPES & INTERFACES (TypeScript)
 * ==========================================
 */

type ViewState = 'home' | 'discover' | 'map' | 'organizers';

interface HackathonEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  coords: [number, number];
  prize: string;
  tags: string[];
  type: 'web3' | 'ai' | 'cloud' | 'generic';
}

interface UserCommand {
  text: string;
  type: 'user' | 'agent';
  timestamp: number;
}

/**
 * ==========================================
 * MOCK SUPABASE / DATA SERVICE
 * Simulating Supabase + TanStack Query
 * ==========================================
 */

const MOCK_EVENTS: HackathonEvent[] = [
  {
    id: '1',
    title: 'ETHGlobal London',
    date: 'Mar 15-17',
    location: 'London, UK',
    coords: [51.5074, -0.1278],
    prize: '$250,000',
    tags: ['Web3', 'Ethereum'],
    type: 'web3'
  },
  {
    id: '2',
    title: 'OpenAI Hack',
    date: 'Apr 05',
    location: 'Remote',
    coords: [37.7749, -122.4194], // Centered on SF for remote/HQ
    prize: '$1M Credits',
    tags: ['AI', 'LLM'],
    type: 'ai'
  },
  {
    id: '3',
    title: 'Tokyo CyberSummit',
    date: 'May 20-22',
    location: 'Tokyo, Japan',
    coords: [35.6762, 139.6503],
    prize: '¥10,000,000',
    tags: ['Cybersec', 'IoT'],
    type: 'generic'
  }
];

// Simulating a useQuery hook
function useEvents() {
  const [data, setData] = useState<HackathonEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      // In a real app: const { data } = await supabase.from('events').select('*')
      const stored = localStorage.getItem('hackamaps_events');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        setData(MOCK_EVENTS);
        localStorage.setItem('hackamaps_events', JSON.stringify(MOCK_EVENTS));
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

/**
 * ==========================================
 * UI COMPONENTS (shadcn/ui style)
 * ==========================================
 */

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-800/80 hover:-translate-y-1 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'outline' | 'secondary' }) => {
  const styles = {
    default: "bg-blue-900/30 text-blue-400 border-blue-800/50",
    outline: "border-white/20 text-neutral-400",
    secondary: "bg-purple-900/30 text-purple-400 border-purple-800/50"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${styles[variant]} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]",
    ghost: "hover:bg-white/10 text-neutral-300 hover:text-white",
    outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

/**
 * ==========================================
 * FEATURE: MAP COMPONENT (Leaflet wrapper)
 * ==========================================
 */
const MapView = ({ events }: { events: HackathonEvent[] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  // Load Leaflet resources dynamically
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
      // Cleanup if needed
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
        .addTo(map);
    });

    mapInstance.current = map;
  };

  // Update map when events change
  useEffect(() => {
    if (mapInstance.current && (window as any).L) {
      // Logic to update markers would go here in a real app
      // For now, we rely on the initial load or a full remount for simplicity
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

/**
 * ==========================================
 * MAIN APP COMPONENT
 * ==========================================
 */
export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [captions, setCaptions] = useState<UserCommand[]>([]);
  const { data: events, isLoading } = useEvents();

  const inputRef = useRef<HTMLInputElement>(null);

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
    // Optional: Keep input open or close it
    // setIsInputOpen(false); 
  };

  useEffect(() => {
    if (isInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputOpen]);

  // --- Render Helpers ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-900 bg-green-900/10 text-green-400 text-[10px] font-mono mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        {events.length} EVENTS LIVE NOW
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

  const renderDiscover = () => (
    <div className="max-w-6xl mx-auto w-full animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Trending Events</h2>
          <p className="text-neutral-500 mt-1">Curated list of high-signal hackathons.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex"><Search className="w-4 h-4 mr-2" /> Filter</Button>
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

  const renderMap = () => (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" /> Global Intelligence
        </h2>
        <Badge variant="outline">LIVE MODE</Badge>
      </div>
      <MapView events={events} />
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] opacity-[0.03] bg-cover bg-center" />
      </div>

      {/* HEADER / NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
        <div className="pointer-events-auto cursor-pointer" onClick={() => setView('home')}>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded backdrop-blur-md hover:bg-white/10 transition-colors">
            <span className="font-mono font-bold text-xs tracking-widest">HACKA_MAPS</span>
          </div>
        </div>

        <nav className="pointer-events-auto hidden md:flex items-center gap-1 bg-neutral-900/50 border border-white/5 p-1 rounded-full backdrop-blur-md">
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

        <div className="pointer-events-auto flex items-center gap-4">
          <a href="#" className="text-xs font-mono text-neutral-500 hover:text-white transition-colors hidden md:block">GITHUB</a>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20" />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full h-full pt-20 pb-24 px-4 overflow-y-auto scrollbar-none">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
          {view === 'home' && renderHome()}
          {view === 'discover' && renderDiscover()}
          {view === 'map' && renderMap()}
          {view === 'organizers' && (
            <div className="text-center animate-in fade-in">
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

// Global styles for custom scrollbar
const style = document.createElement('style');
style.textContent = `
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);
