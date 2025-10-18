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
            cursor: pointer;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Format dates
      const startDate = new Date(hackathon.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const endDate = new Date(hackathon.end_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Create popup content
      const popupContent = `
        <div style="min-width: 280px; color: #000000; font-family: system-ui;">
          <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0; color: #000000;">
            ${hackathon.name}
          </h3>
          ${hackathon.description ? `
            <p style="font-size: 14px; margin: 0 0 12px 0; color: #1a1a1a; line-height: 1.5;">
              ${hackathon.description}
            </p>
          ` : ''}
          
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <div style="display: flex; gap: 8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 2px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>${hackathon.location}${hackathon.is_online ? ' (Online)' : ''}</span>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 2px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>${startDate} - ${endDate}</span>
            </div>
            
            ${hackathon.prize_pool ? `
              <div style="display: flex; gap: 8px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 2px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                </svg>
                <span><strong>Prize:</strong> ${hackathon.prize_pool}</span>
              </div>
            ` : ''}
            
            ${hackathon.max_participants ? `
              <div style="display: flex; gap: 8px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0; margin-top: 2px;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Max ${hackathon.max_participants} participants</span>
              </div>
            ` : ''}
          </div>

          <div style="display: flex; flex-wrap: gap: 6px; margin-top: 12px;">
            ${hackathon.categories.map(cat => `
              <span style="
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                background: ${color}33;
                color: ${color};
                border: 1px solid ${color}66;
              ">
                ${cat}
              </span>
            `).join('')}
          </div>

          ${hackathon.website_url ? `
            <a 
              href="${hackathon.website_url}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-top: 16px;
                padding: 10px 16px;
                background: ${color};
                color: white;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                transition: opacity 0.2s;
              "
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              Visit Website
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ` : ''}
        </div>
      `;

      const marker = L.marker([hackathon.latitude, hackathon.longitude], {
        icon,
      })
        .bindPopup(popupContent, {
          maxWidth: 400,
          className: 'custom-popup',
        })
        .addTo(map.current!);

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
