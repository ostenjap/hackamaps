// Single source of truth for the CARTO dark basemap used by every Leaflet map.
// CARTO now requires an API key; keyless requests still return a PNG but with an
// "API KEY REQUIRED" watermark. Get a key at https://carto.com/basemaps/apikey
// and set VITE_CARTO_API_KEY (restart the dev server after changing .env).
const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY as string | undefined;

const BASE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const CARTO_DARK_URL = CARTO_KEY
    ? `${BASE_URL}?key=${encodeURIComponent(CARTO_KEY)}`
    : BASE_URL;

// Attribution is required by the OSM and CARTO terms on every map.
export const CARTO_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, ' +
    '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';

if (!CARTO_KEY && import.meta.env.DEV) {
    console.warn('VITE_CARTO_API_KEY is not set: CARTO tiles will show an "API KEY REQUIRED" watermark.');
}
