import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

// Component to handle map animations
function MapController() {
  const map = useMap();

  useEffect(() => {
    // Smooth panning animation
    const rotate = () => {
      const center = map.getCenter();
      const newLng = center.lng + 0.15;
      map.panTo([center.lat, newLng], {
        animate: true,
        duration: 1.5,
        noMoveStart: true,
      });
    };

    const interval = setInterval(rotate, 3000);

    return () => clearInterval(interval);
  }, [map]);

  return null;
}

export function HackathonMap({ hackathons }: HackathonMapProps) {
  const mapCenter: L.LatLngExpression = [20, 20];
  const mapBounds: L.LatLngBoundsExpression = [[-90, -180], [90, 180]];

  return (
    <MapContainer
      {...{
        center: mapCenter,
        zoom: 2,
        minZoom: 2,
        maxBounds: mapBounds,
        maxBoundsViscosity: 1.0,
        style: { background: '#1a1625', width: '100%', height: '100%' },
      }}
    >
      <TileLayer
        {...{
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        }}
      />

      <MapController />

      {hackathons.map((hackathon) => {
        const color = getCategoryColor(hackathon.categories);
        
        const customIcon = L.divIcon({
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
              transition: all 0.3s ease;
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const position: L.LatLngExpression = [hackathon.latitude, hackathon.longitude];

        return (
          <Marker
            key={hackathon.id}
            {...{
              position,
              icon: customIcon,
            }}
          />
        );
      })}
    </MapContainer>
  );
}
