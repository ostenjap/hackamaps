export type ViewState = 'home' | 'discover' | 'map' | 'organizers';

export interface HackathonEvent {
    id: string;
    title: string;
    date: string;
    startDate: Date; // For filtering
    location: string;
    country: string; // For filtering
    continent: string; // For filtering
    coords: [number, number];
    prize: string;
    tags: string[];
    type: 'web3' | 'ai' | 'cloud' | 'generic';
}

export interface UserCommand {
    text: string;
    type: 'user' | 'agent';
    timestamp: number;
}

export interface FilterState {
    selectedCategories: string[];
    selectedContinents: string[];
    locationSearch: string;
    selectedWeeksAhead: number;
    isDateFilterEnabled: boolean;
}

export const CATEGORIES = [
    { id: "ai", label: "AI", color: "#3B82F6" }, // Blue
    { id: "web3", label: "Web3/Blockchain", color: "#8B5CF6" }, // Purple
    { id: "fintech", label: "FinTech", color: "#10B981" }, // Emerald
    { id: "gaming", label: "Gaming", color: "#F59E0B" }, // Amber
    { id: "social", label: "Social", color: "#EC4899" }, // Pink
    { id: "cloud", label: "Cloud", color: "#6366F1" }, // Indigo
];

export const CONTINENTS = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Oceania",
];
