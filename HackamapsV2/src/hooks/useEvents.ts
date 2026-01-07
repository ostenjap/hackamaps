import { useState, useEffect } from 'react';
import type { HackathonEvent } from '../types';

export const MOCK_EVENTS: HackathonEvent[] = [
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
        coords: [37.7749, -122.4194],
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

export function useEvents() {
    const [data, setData] = useState<HackathonEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
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
