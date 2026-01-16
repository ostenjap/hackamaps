import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        city?: string;
        town?: string;
        village?: string;
        country?: string;
    };
}

interface AddressAutocompleteProps {
    onPlaceSelect: (address: string, lat: number, lng: number, city: string, country: string) => void;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export function AddressAutocomplete({
    onPlaceSelect,
    value,
    onChange,
    label,
    placeholder = "Search for a city or address..."
}: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debounceTimer = useRef<number | undefined>(undefined);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions from Nominatim
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (value.length < 3) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsOpen(true);
        setIsLoading(true);

        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(value)}&` +
                    `format=json&` +
                    `addressdetails=1&` +
                    `limit=5`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'HackerMaps/1.0' // Required by Nominatim usage policy
                        }
                    }
                );

                if (response.ok) {
                    const data: NominatimResult[] = await response.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce to avoid too many requests

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [value]);

    const handleSelect = (result: NominatimResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const city = result.address?.city || result.address?.town || result.address?.village || '';
        const country = result.address?.country || '';

        onChange(result.display_name);
        onPlaceSelect(result.display_name, lat, lng, city, country);
        setIsOpen(false);
        setSuggestions([]);
    };

    return (
        <div ref={wrapperRef} className="relative space-y-1">
            {label && <label className="text-xs text-neutral-400">{label}</label>}

            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 pl-9 text-sm text-white focus:border-blue-500/50 outline-none"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div
                    className="absolute z-[9999] w-full mt-1 bg-[#0a0a0a] border-2 border-blue-500/50 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                    style={{
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    <div className="p-2 border-b border-white/10 bg-neutral-900/50">
                        <div className="text-xs text-neutral-400 font-medium">Select a location:</div>
                    </div>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                            className="w-full text-left px-3 py-3 hover:bg-blue-600/20 text-sm text-white transition-all border-b border-white/5 last:border-b-0 flex items-start gap-3 group"
                        >
                            <div className="p-1.5 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white font-medium line-clamp-1">{suggestion.display_name.split(',')[0]}</div>
                                <div className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{suggestion.display_name}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && value.length >= 3 && !isLoading && suggestions.length === 0 && (
                <div className="absolute z-[9999] w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-4 text-center">
                    <div className="text-xs text-neutral-400">No locations found for "{value}"</div>
                </div>
            )}
        </div>
    );
}
