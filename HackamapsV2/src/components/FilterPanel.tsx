import React from 'react';
import { X, MapPin, Globe, Filter } from "lucide-react";
import { Button, Badge } from "./ui";
import { CATEGORIES, CONTINENTS } from "../types";
import type { FilterState } from "../types";

interface FilterPanelProps extends FilterState {
    isOpen: boolean;
    onClose: () => void;
    setFilters: (updates: Partial<FilterState>) => void;
}

const formatDateWithOrdinal = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });

    const getOrdinal = (n: number): string => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${getOrdinal(day)} of ${month}`;
};

export function FilterPanel({
    isOpen,
    onClose,
    selectedCategories,
    selectedContinents,
    locationSearch,
    selectedWeeksAhead,
    setFilters,
}: FilterPanelProps) {

    const toggleCategory = (category: string) => {
        setFilters({
            selectedCategories: selectedCategories.includes(category)
                ? selectedCategories.filter((c) => c !== category)
                : [...selectedCategories, category]
        });
    };

    const toggleContinent = (continent: string) => {
        setFilters({
            selectedContinents: selectedContinents.includes(continent)
                ? selectedContinents.filter((c) => c !== continent)
                : [...selectedContinents, continent]
        });
    };

    const clearAllFilters = () => {
        setFilters({
            selectedCategories: [],
            selectedContinents: [],
            locationSearch: "",
            selectedWeeksAhead: 0
        });
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedContinents.length +
        (locationSearch ? 1 : 0) +
        (selectedWeeksAhead > 0 ? 1 : 0);

    const getTargetDate = (): Date => {
        const date = new Date();
        date.setDate(date.getDate() + (selectedWeeksAhead * 7));
        return date;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 left-0 h-full z-50 bg-[#0A0A0A] border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-out flex flex-col
          w-[95%] md:w-1/2 lg:w-1/4
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Filters</h2>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary">{activeFilterCount}</Badge>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">

                    {/* Clear Action */}
                    {activeFilterCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={clearAllFilters}
                            className="w-full border-dashed border-neutral-700 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">Reset All Filters</span>
                        </Button>
                    )}

                    {/* Location Search */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            Location
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search city or country..."
                                value={locationSearch}
                                onChange={(e) => setFilters({ locationSearch: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-300">Categories</label>
                        <div className="grid grid-cols-1 gap-2">
                            {CATEGORIES.map((category) => (
                                <label
                                    key={category.id}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedCategories.includes(category.id)
                                        ? "bg-blue-500/10 border-blue-500/30"
                                        : "bg-white/5 border-transparent hover:bg-white/10"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedCategories.includes(category.id)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-neutral-600 bg-transparent"
                                        }`}>
                                        {selectedCategories.includes(category.id) && (
                                            <X className="w-3 h-3 text-white rotate-45" /> // Makeshift checkmark
                                        )}
                                    </div>
                                    <div className="flex-1 flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                                            style={{ color: category.color, backgroundColor: category.color }}
                                        />
                                        <span className={`text-sm ${selectedCategories.includes(category.id) ? "text-white" : "text-neutral-400"}`}>
                                            {category.label}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Continents */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-500" />
                            Continents
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CONTINENTS.map((continent) => (
                                <button
                                    key={continent}
                                    onClick={() => toggleContinent(continent)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${selectedContinents.includes(continent)
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "bg-transparent border-white/5 text-neutral-500 hover:border-white/10 hover:text-neutral-300"
                                        }`}
                                >
                                    {continent}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Frame */}
                    <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-300">Starting Time</span>
                            <span className="text-xs text-blue-400 font-mono">
                                {selectedWeeksAhead === 0 ? "All Time" : `+${selectedWeeksAhead} Weeks`}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-xs text-neutral-500 font-mono">
                                <span>{selectedWeeksAhead === 0 ? "Showing all events" : `Events starting after ${formatDateWithOrdinal(getTargetDate())}`}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="52"
                                value={selectedWeeksAhead}
                                onChange={(e) => setFilters({ selectedWeeksAhead: Number(e.target.value) })}
                                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </div>

                </div>



            </div>
        </>
    );
}
