export type ViewState = 'home' | 'discover' | 'map' | 'organizers';

export interface HackathonEvent {
    id: string;
    title: string;
    date: string;
    location: string;
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
