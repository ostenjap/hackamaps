import { useState, useEffect } from "react";
import { Filter, Home, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FilterPanel } from "@/components/FilterPanel";
import { HackathonMap } from "@/components/HackathonMap";
import { SubmitHackathonDialog } from "@/components/SubmitHackathonDialog";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface Hackathon {
  id: string;
  name: string;
  description: string | null;
  location: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  categories: string[];
  continent: string;
  country: string;
  city: string;
  website_url: string | null;
  prize_pool: string | null;
  is_online: boolean;
  max_participants: number | null;
}

const Map = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedMonthsAhead, setSelectedMonthsAhead] = useState(0);
  const [isDateFilterEnabled, setIsDateFilterEnabled] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchHackathons();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchHackathons = async () => {
    const { data, error } = await supabase.from("hackathons").select("*").order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching hackathons:", error);
      return;
    }

    console.log("Fetched hackathons:", data?.length, "hackathons");
    setHackathons(data || []);
    setFilteredHackathons(data || []);
  };

  const handleAuthClick = () => {
    if (user) {
      supabase.auth.signOut();
    }
  };

  useEffect(() => {
    let filtered = hackathons;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((h) =>
        Array.isArray(h.categories) && h.categories.some((cat) =>
          selectedCategories.some((selectedCat) =>
            cat.toLowerCase().includes(selectedCat.toLowerCase())
          )
        )
      );
    }

    // Filter by continents usus
    if (selectedContinents.length > 0) {
      filtered = filtered.filter((h) => selectedContinents.includes(h.continent));
    }

    // Filter by location search
    if (locationSearch.trim()) {
      const search = locationSearch.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.location.toLowerCase().includes(search) ||
          h.city.toLowerCase().includes(search) ||
          h.country.toLowerCase().includes(search),
      );
    }
  // Filter by date - show hackathons AFTER the selected date if date filter is enabled
  if (isDateFilterEnabled) {
    const selectedDate = new Date();
    selectedDate.setMonth(selectedDate.getMonth() + selectedMonthsAhead);

    filtered = filtered.filter((h) => {
      const hackathonDate = new Date(h.start_date);
      return hackathonDate >= selectedDate; // Only hackathons AFTER the selected date
    });
  }

  setFilteredHackathons(filtered);
  }, [selectedCategories, selectedContinents, locationSearch, selectedMonthsAhead, isDateFilterEnabled, hackathons]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filters</span>
                {selectedCategories.length + selectedContinents.length + (locationSearch ? 1 : 0) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCategories.length + selectedContinents.length + (locationSearch ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <div>
                <h1 className="text-lg md:text-2xl font-bold font-['Exo_2'] tracking-tight">hackamaps.com</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/home">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 relative overflow-hidden text-white bg-gradient-to-r from-cyan-500 to-blue-500
                    hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800
                    hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-2000
                    px-3.5 md:px-4"
                  >
                  <Home className="h-4 w-4" />
                  <span className="hidden md:inline">Home</span>
                </Button>
              </Link>
              <SubmitHackathonDialog user={user} onSubmitSuccess={fetchHackathons} />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleAuthClick}
                title={user ? "Sign out" : "Sign in"}
              >
                {user ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen">
        <div className="relative h-full flex">
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedContinents={selectedContinents}
            setSelectedContinents={setSelectedContinents}
            locationSearch={locationSearch}
            setLocationSearch={setLocationSearch}
            selectedMonthsAhead={selectedMonthsAhead}
            setSelectedMonthsAhead={setSelectedMonthsAhead}
            isDateFilterEnabled={isDateFilterEnabled}
            setIsDateFilterEnabled={setIsDateFilterEnabled}
          />

          <div className="flex-1 h-full">
            <div className="h-full p-4 relative z-10">
              <div className="h-full rounded-xl overflow-hidden shadow-2xl border border-border">
                <HackathonMap hackathons={filteredHackathons} />
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute bottom-8 right-8 glass-card rounded-lg p-4 z-20 stats-badge">
              <div className="text-sm font-medium">
                Showing {filteredHackathons.length} of {hackathons.length} hackathons
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
