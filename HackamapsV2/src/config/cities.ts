export interface CityConfig {
  name: string;
  slug: string;
  coords: [number, number];
  zoom: number;
  country: string;
  description: string;
  keywords?: string[];
  radius?: number; // in kilometers
}

export const SEO_CITIES: Record<string, CityConfig> = {
  "berlin": {
    name: "Berlin",
    slug: "berlin",
    coords: [52.5200, 13.4050],
    zoom: 10,
    country: "Germany",
    description: "Discover the best hackathons in Germany's startup capital. From AI builders to blockchain pioneers.",
    keywords: ["berlin", "germany", "deutschland"],
    radius: 40
  },
  "london": {
    name: "London",
    slug: "london",
    coords: [51.5074, -0.1278],
    zoom: 10,
    country: "United Kingdom",
    description: "Find upcoming hackathons in London. Join the UK's thriving tech ecosystem and build the future.",
    keywords: ["london", "uk", "united kingdom"],
    radius: 50
  },
  "paris": {
    name: "Paris",
    slug: "paris",
    coords: [48.8566, 2.3522],
    zoom: 10,
    country: "France",
    description: "The heart of European AI. Discover hackathons and builder events in the City of Light.",
    keywords: ["paris", "france"],
    radius: 60
  },
  "new-york": {
    name: "New York",
    slug: "new-york",
    coords: [40.7128, -74.0060],
    zoom: 10,
    country: "USA",
    description: "The city that never sleeps. Explore NYC's high-energy hackathons across Manhattan and Brooklyn.",
    keywords: ["new york", "nyc", "manhattan", "brooklyn"],
    radius: 70
  },
  "san-francisco": {
    name: "San Francisco",
    slug: "san-francisco",
    coords: [37.7749, -122.4194],
    zoom: 9,
    country: "USA",
    description: "The ground zero of AI innovation. Find the most competitive hackathons in SF and the Bay Area.",
    keywords: ["san francisco", "sf", "bay area", "silicon valley"],
    radius: 80 // Captures Palo Alto, San Jose, etc.
  },
  "los-angeles": {
    name: "Los Angeles",
    slug: "los-angeles",
    coords: [34.0522, -118.2437],
    zoom: 9,
    country: "USA",
    description: "The creative capital of tech. Discover hackathons in 'Silicon Beach', Santa Monica, and across Greater LA.",
    keywords: ["los angeles", "la", "santa monica", "irvine", "silicon beach", "orange county"],
    radius: 90
  },
  "tokyo": {

    name: "Tokyo",
    slug: "tokyo",
    coords: [35.6762, 139.6503],
    zoom: 10,
    country: "Japan",
    description: "Experience the fusion of tech and culture. Discover upcoming hackathons in Tokyo.",
    keywords: ["tokyo", "japan"],
    radius: 50
  },

  "asia": {
    name: "Asia",
    slug: "asia",
    coords: [15.87, 100.99],
    zoom: 4,
    country: "Region",
    description: "The fast-growing frontier of tech innovation. Discover world-class hackathons and developer events across Singapore, Thailand, China, India and beyond.",
    keywords: ["asia", "singapore", "thailand", "bangkok", "china", "shanghai", "beijing", "shenzhen", "vietnam", "indonesia", "india", "bengaluru", "mumbai", "delhi", "hyderabad"]
  },
  "india": {
    name: "India",
    slug: "india",
    coords: [12.9716, 77.5946], // Centered on Bengaluru
    zoom: 5,
    country: "India",
    description: "The world's largest developer ecosystem. Find massive hackathons and coding competitions in Bengaluru, Mumbai, Delhi, and across India.",
    keywords: ["india", "bengaluru", "bangalore", "mumbai", "delhi", "ncr", "hyderabad", "pune", "chennai", "kolkata"]
  }
};



