export interface CityConfig {
  name: string;
  slug: string;
  coords: [number, number];
  zoom: number;
  country: string;
  description: string;
}

export const SEO_CITIES: Record<string, CityConfig> = {
  "berlin": {
    name: "Berlin",
    slug: "berlin",
    coords: [52.5200, 13.4050],
    zoom: 11,
    country: "Germany",
    description: "Discover the best hackathons in Germany's startup capital. From AI builders to blockchain pioneers."
  },
  "london": {
    name: "London",
    slug: "london",
    coords: [51.5074, -0.1278],
    zoom: 11,
    country: "United Kingdom",
    description: "Find upcoming hackathons in London. Join the UK's thriving tech ecosystem and build the future."
  },
  "paris": {
    name: "Paris",
    slug: "paris",
    coords: [48.8566, 2.3522],
    zoom: 12,
    country: "France",
    description: "The heart of European AI. Discover hackathons and builder events in the City of Light."
  },
  "new-york": {
    name: "New York",
    slug: "new-york",
    coords: [40.7128, -74.0060],
    zoom: 11,
    country: "USA",
    description: "The city that never sleeps. Explore NYC's high-energy hackathons across Manhattan and Brooklyn."
  },
  "san-francisco": {
    name: "San Francisco",
    slug: "san-francisco",
    coords: [37.7749, -122.4194],
    zoom: 12,
    country: "USA",
    description: "The ground zero of AI innovation. Find the most competitive hackathons in SF and the Bay Area."
  },
  "tokyo": {
    name: "Tokyo",
    slug: "tokyo",
    coords: [35.6762, 139.6503],
    zoom: 11,
    country: "Japan",
    description: "Experience the fusion of tech and culture. Discover upcoming hackathons in Tokyo."
  },
  "singapore": {
    name: "Singapore",
    slug: "singapore",
    coords: [1.3521, 103.8198],
    zoom: 12,
    country: "Singapore",
    description: "Asia's leading tech hub. Find world-class hackathons and developer events in Singapore."
  }
};
