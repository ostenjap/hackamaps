import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    "AI/ML": "#3b82f6",
    "Web3/Blockchain": "#a855f7",
    "Healthcare": "#10b981",
    "Climate Tech": "#14b8a6",
    "FinTech": "#f59e0b",
    "Gaming": "#ec4899",
    "Education": "#f97316",
    "Social Impact": "#f43f5e",
    "DateTime": "#06b6d4",
    "Open Theme": "#c084fc",
  };

  return categoryColors[categories[0]] || "#8b5cf6";
};

export function HackathonMap({ hackathons }: HackathonMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [20, 20],
      zoom: 2,
      minZoom: 2,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
    });

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
    }).addTo(map.current);

    // Auto-pan animation
    let isPanning = true;
    const panInterval = setInterval(() => {
      if (map.current && isPanning) {
        const center = map.current.getCenter();
        map.current.panTo([center.lat, center.lng + 0.3], {
          animate: true,
          duration: 2,
        });
      }
    }, 3000);

    // Pause panning on interaction
    map.current.on('mousedown', () => { isPanning = false; });
    map.current.on('dragstart', () => { isPanning = false; });
    map.current.on('zoomstart', () => { isPanning = false; });

    return () => {
      clearInterval(panInterval);
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for each hackathon
    hackathons.forEach((hackathon) => {
      const color = getCategoryColor(hackathon.categories);

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 20px ${color}, 0 4px 12px rgba(0,0,0,0.5);
            opacity: 0.95;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([hackathon.latitude, hackathon.longitude], {
        icon,
      }).addTo(map.current!);

      markers.current.push(marker);
    });
  }, [hackathons]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ background: '#1a1625' }}
    />
  );
}
