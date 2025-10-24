import { X, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "AI/ML", label: "AI/ML", color: "hsl(var(--category-ai))" },
  { id: "Web3/Blockchain", label: "Web3/Blockchain", color: "hsl(var(--category-web3))" },
  { id: "Healthcare", label: "Healthcare", color: "hsl(var(--category-healthcare))" },
  { id: "Climate Tech", label: "Climate Tech", color: "hsl(var(--category-climate))" },
  { id: "FinTech", label: "FinTech", color: "hsl(var(--category-fintech))" },
  { id: "Gaming", label: "Gaming", color: "hsl(var(--category-gaming))" },
  { id: "Education", label: "Education", color: "hsl(var(--category-education))" },
  { id: "Social Impact", label: "Social Impact", color: "hsl(var(--category-social))" },
  { id: "DateTime", label: "DateTime", color: "hsl(var(--category-datetime))" },
  { id: "Open Theme", label: "Open Theme", color: "hsl(var(--category-open))" },
];

const CONTINENTS = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedContinents: string[];
  setSelectedContinents: (continents: string[]) => void;
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  selectedMonthsAhead: number;
  setSelectedMonthsAhead: (months: number) => void;
  isDateFilterEnabled: boolean;
  setIsDateFilterEnabled: (enabled: boolean) => void;
}

export function FilterPanel({
  isOpen,
  onClose,
  selectedCategories,
  setSelectedCategories,
  selectedContinents,
  setSelectedContinents,
  locationSearch,
  setLocationSearch,
  selectedMonthsAhead,
  setSelectedMonthsAhead,
  isDateFilterEnabled,
  setIsDateFilterEnabled,
}: FilterPanelProps) {
  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleContinent = (continent: string) => {
    setSelectedContinents(
      selectedContinents.includes(continent)
        ? selectedContinents.filter((c) => c !== continent)
        : [...selectedContinents, continent]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedContinents([]);
    setLocationSearch("");
    setSelectedMonthsAhead(0);
    setIsDateFilterEnabled(false);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedContinents.length +
    (locationSearch ? 1 : 0) +
    (isDateFilterEnabled ? 1 : 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel - slides in from left */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-card/95 backdrop-blur-xl border-r border-border z-50 overflow-y-auto shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}

          {/* Location Search */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Search Location
            </Label>
            <Input
              placeholder="City or country..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Continents */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Continents
            </Label>
            <div className="space-y-2">
              {CONTINENTS.map((continent) => (
                <div key={continent} className="flex items-center space-x-2">
                  <Checkbox
                    id={`continent-${continent}`}
                    checked={selectedContinents.includes(continent)}
                    onCheckedChange={() => toggleContinent(continent)}
                  />
                  <label
                    htmlFor={`continent-${continent}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {continent}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Time Frame</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Filter by date</span>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDateFilterEnabled ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => setIsDateFilterEnabled(!isDateFilterEnabled)}
                >
                  <span className="sr-only">Toggle date filter</span>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDateFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className={`space-y-2 ${!isDateFilterEnabled ? 'opacity-50' : ''}`}>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Next {selectedMonthsAhead} month{selectedMonthsAhead !== 1 ? 's' : ''}</span>
                <span>
                  Until {new Date(new Date().setMonth(new Date().getMonth() + selectedMonthsAhead)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={selectedMonthsAhead}
                onChange={(e) => setSelectedMonthsAhead(Number(e.target.value))}
                disabled={!isDateFilterEnabled}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary ${
                  isDateFilterEnabled ? 'bg-gray-200' : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Today</span>
                <span>6 months</span>
              </div>
              {!isDateFilterEnabled && (
                <p className="text-xs text-muted-foreground mt-1">
                  Toggle date filter to enable time frame selection
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base">Categories</Label>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
