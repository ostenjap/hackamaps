import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Using Mapbox's demo token - for production, get your own at https://mapbox.com
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

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

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
  }, []);

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
}
