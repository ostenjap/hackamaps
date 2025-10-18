import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";

// Mapbox token - user needs to add their own from https://mapbox.com
const DEFAULT_TOKEN = "";

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

interface HackathonMapProps {
  hackathons: Hackathon[];
}

const getCategoryColor = (categories: string[]): string => {
  if (categories.length === 0) return "#8b5cf6";
  
  const categoryColors: Record<string, string> = {
    "AI/ML": "hsl(210, 100%, 65%)",
    "Web3/Blockchain": "hsl(280, 80%, 65%)",
    "Healthcare": "hsl(140, 60%, 50%)",
    "Climate Tech": "hsl(170, 70%, 50%)",
    "FinTech": "hsl(45, 100%, 55%)",
    "Gaming": "hsl(330, 80%, 60%)",
    "Education": "hsl(25, 100%, 60%)",
    "Social Impact": "hsl(340, 75%, 55%)",
    "DateTime": "hsl(200, 90%, 55%)",
    "Open Theme": "hsl(280, 100%, 70%)",
  };

  return categoryColors[categories[0]] || "#8b5cf6";
};

export function HackathonMap({ hackathons }: HackathonMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem("mapbox_token") || DEFAULT_TOKEN;
  });
  const [tokenInput, setTokenInput] = useState("");

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [20, 20],
        zoom: 2.5,
        projection: { name: "globe" },
        renderWorldCopies: false,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        "top-right"
      );

      // Add fog and atmosphere
      map.current.on("style.load", () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: "rgb(50, 40, 80)",
          "high-color": "rgb(30, 20, 50)",
          "horizon-blend": 0.1,
          "space-color": "rgb(10, 5, 20)",
          "star-intensity": 0.6,
        });
      });

      // Slow rotation
      let userInteracting = false;
      const spinGlobe = () => {
        if (!map.current || userInteracting) return;
        const center = map.current.getCenter();
        center.lng -= 0.2;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      };

      map.current.on("mousedown", () => { userInteracting = true; });
      map.current.on("mouseup", () => { userInteracting = false; spinGlobe(); });
      map.current.on("dragstart", () => { userInteracting = true; });
      map.current.on("dragend", () => { userInteracting = false; spinGlobe(); });
      map.current.on("moveend", spinGlobe);
      
      spinGlobe();

    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers - simple dots without hover popups
    hackathons.forEach((hackathon) => {
      const color = getCategoryColor(hackathon.categories);

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "3px solid rgba(255, 255, 255, 0.8)";
      el.style.boxShadow = `0 0 20px ${color}, 0 4px 12px rgba(0,0,0,0.5)`;
      el.style.cursor = "pointer";
      el.style.transition = "all 0.3s ease";
      el.style.opacity = "0.9";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hackathon.longitude, hackathon.latitude])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [hackathons]);

  // Show token input if no token is set
  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center glass-card p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Mapbox Token Required</h3>
            <p className="text-muted-foreground">
              To display the interactive 3D globe, you need a free Mapbox API token.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token" className="text-base font-semibold">
                Steps to get your token:
              </Label>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Visit Mapbox and create a free account</li>
                <li>Go to your Account → Tokens</li>
                <li>Copy your "Default public token"</li>
                <li>Paste it below</li>
              </ol>
            </div>

            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Get your free token at mapbox.com
            </a>

            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={saveToken} 
              className="w-full"
              disabled={!tokenInput.trim()}
            >
              Save Token & Load Map
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your token is stored locally and never sent to our servers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
}
