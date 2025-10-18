import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { ExternalLink, MapPin, Calendar, Trophy, Users } from "lucide-react";

// You'll need to add your Mapbox token here
// Get it from https://mapbox.com
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

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
  const [mapboxToken, setMapboxToken] = useState(MAPBOX_TOKEN);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [20, 20],
        zoom: 2,
        projection: "globe" as any,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("style.load", () => {
        map.current?.setFog({
          color: "rgb(50, 40, 80)",
          "high-color": "rgb(30, 20, 50)",
          "horizon-blend": 0.1,
        });
      });
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

    // Add new markers
    hackathons.forEach((hackathon) => {
      const color = getCategoryColor(hackathon.categories);

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.3s";

      // Hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
        el.style.zIndex = "1000";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.zIndex = "1";
      });

      // Create popup content
      const popupContent = `
        <div class="p-4 min-w-[300px]">
          <h3 class="text-lg font-bold mb-2 text-foreground">${hackathon.name}</h3>
          ${hackathon.description ? `<p class="text-sm text-muted-foreground mb-3">${hackathon.description}</p>` : ""}
          
          <div class="space-y-2 text-sm">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>${hackathon.location}${hackathon.is_online ? " (Online)" : ""}</span>
            </div>
            
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>${format(new Date(hackathon.start_date), "MMM d")} - ${format(new Date(hackathon.end_date), "MMM d, yyyy")}</span>
            </div>
            
            ${hackathon.prize_pool ? `
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                </svg>
                <span>Prize: ${hackathon.prize_pool}</span>
              </div>
            ` : ""}
            
            ${hackathon.max_participants ? `
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Max ${hackathon.max_participants} participants</span>
              </div>
            ` : ""}
          </div>

          <div class="flex flex-wrap gap-1 mt-3">
            ${hackathon.categories.map(cat => `
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                ${cat}
              </span>
            `).join("")}
          </div>

          ${hackathon.website_url ? `
            <a href="${hackathon.website_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
              Visit Website
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ` : ""}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "400px",
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hackathon.longitude, hackathon.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [hackathons]);

  // Show token input if no token is set
  if (!mapboxToken || mapboxToken.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card p-8">
        <div className="max-w-md text-center space-y-4">
          <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            Please enter your Mapbox public token to display the map. Get one at{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
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
