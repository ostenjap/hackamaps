# 🌍 Hackathon Finder

> Find hackathons worldwide, see them on a map, explore prizes and just vibe 🚀

## 🗺️ How does the map work?

The map pulls hackathon data from a **Supabase database** (via Lovable Cloud). Here's the deal:

### Where the data comes from

- All hackathon data is stored in the `hackathons` table in Supabase
- Each hackathon has `latitude` and `longitude` fields that position it on the map
- Data includes: name, location, dates, categories, prize pools, website URLs, etc.

### How to edit data manually

**Option 1: Through Lovable Cloud UI**

1. Open your project in Lovable
2. Go to the backend/database section
3. Find the `hackathons` table
4. Edit records directly in the UI

**Option 2: Via SQL**
You can run SQL queries directly in Lovable Cloud to insert/update data:

```sql
-- Example: Insert a new hackathon
INSERT INTO hackathons (name, location, city, country, continent, latitude, longitude, start_date, end_date, categories, prize_pool, website_url)
VALUES ('My Hackathon', 'Cool Venue', 'San Francisco', 'USA', 'North America', 37.7749, -122.4194, '2025-03-01', '2025-03-03', ARRAY['AI', 'Blockchain'], '$50,000', 'https://example.com');

-- Example: Update coordinates for better accuracy
UPDATE hackathons
SET latitude = 37.7749, longitude = -122.4194
WHERE name = 'My Hackathon';
```

### Getting accurate coordinates

For precise map positioning, use these methods:

1. **Google Maps**: Right-click any location → Copy coordinates
2. **OpenStreetMap**: Click "Show address" → Copy lat/long
3. **geocoding.xyz API**: Convert addresses to coordinates programmatically
4. **Google Geocoding API**: Most accurate but needs API key

Pro tip: Always double-check coordinates match the actual venue location!

## 🎯 What is this?

A simple web app that shows you hackathons happening around the world. You can:

- 🗺️ See hackathons on an interactive map
- 🔍 Filter by category, location, or date
- 💰 Check out prize pools
- 🎨 Switch between light/dark mode
- ✨ Submit your own hackathon

## 🛠️ Built with

- React (for the UI stuff)
- TypeScript (so we don't break things)
- Tailwind CSS (makes it look pretty)
- Leaflet (for the cool map)
- Supabase (database magic ✨)

## 🚀 Want to run this locally?

Super easy. Just:

```sh
# 1. Clone it
git clone <YOUR_GIT_URL>

# 2. Go into the folder
cd <YOUR_PROJECT_NAME>

# 3. Install stuff
npm i

# 4. Run it
npm run dev
```

That's it! Open localhost:8080 and you're good 👍

## 📝 Edit this project

### Option 1: Use Lovable (easiest)

Just go to [your Lovable project](https://lovable.dev/projects/aeab8248-783a-45b4-9ba1-964dd1b30117) and tell the AI what you want. It'll code it for you 🤖

### Option 2: Code it yourself

Clone this repo, make changes, push them. Whatever you push will sync to Lovable automatically 🔄

### Option 3: GitHub web editor

Click the pencil icon on any file in GitHub and edit right there. Super simple.

### Option 4: GitHub Codespaces

Click the green "Code" button → Codespaces → New codespace. It's like VS Code but in your browser 💻

## 🌐 Deploy this thing

1. Open [Lovable](https://lovable.dev/projects/aeab8248-783a-45b4-9ba1-964dd1b30117)
2. Click Share → Publish
3. Done ✅

Your app is now live for the world to see!

## Database jaja

# 🗺️ Hackathon Map Component Documentation

## What Does This Code Do?

Imagine you have a bunch of hackathons happening all around the world. This code creates an interactive map that shows where all these hackathons are located, kind of like how Google Maps shows restaurants near you!

## The Big Picture

This component takes a list of hackathons and puts colorful pins on a world map. When you click on a pin, it shows you all the cool details about that hackathon - like when it starts, how much prize money there is, and a link to register.

---

## How It Works (Step by Step)

### 1. **Getting the Hackathon Data**

The map doesn't connect to Supabase directly. Instead, it receives hackathon data from a **parent component** that already fetched the data from Supabase.

Think of it like this:

- **Supabase** = Your locker at school (stores all the hackathon info)
- **Parent Component** = Your friend who gets the papers from your locker
- **This Map Component** = You, receiving the papers from your friend

```typescript
interface HackathonMapProps {
  hackathons: Hackathon[]; // ← The list gets passed in here!
}
```

### 2. **The Supabase Database Structure**

Your Supabase database has a table called `hackathons` with these columns:

| Column Name          | Type               | What It Stores                     | Example                          |
| -------------------- | ------------------ | ---------------------------------- | -------------------------------- |
| **id**               | string             | Unique identifier (auto-generated) | "abc-123-def-456"                |
| **name**             | string             | Hackathon name                     | "AI Innovation Summit 2025"      |
| **description**      | string (optional)  | Details about the event            | "Build the future of AI..."      |
| **location**         | string             | Full location text                 | "San Francisco, California, USA" |
| **city**             | string             | City name                          | "San Francisco"                  |
| **country**          | string             | Country name                       | "United States"                  |
| **continent**        | string             | Continent name                     | "North America"                  |
| **latitude**         | number             | GPS latitude coordinate            | 37.7749                          |
| **longitude**        | number             | GPS longitude coordinate           | -122.4194                        |
| **start_date**       | string             | When it starts                     | "2025-06-15"                     |
| **end_date**         | string             | When it ends                       | "2025-06-17"                     |
| **categories**       | string[]           | Array of categories                | ["AI/ML", "Healthcare"]          |
| **website_url**      | string (optional)  | Registration link                  | "https://example.com"            |
| **prize_pool**       | string (optional)  | Prize money                        | "$50,000"                        |
| **is_online**        | boolean (optional) | Online or in-person?               | true or false                    |
| **max_participants** | number (optional)  | Maximum attendees                  | 500                              |
| **organizer_email**  | string (optional)  | Contact email                      | "organizer@example.com"          |
| **created_at**       | string             | When added to database             | "2025-01-15T10:30:00Z"           |
| **updated_at**       | string             | Last modified date                 | "2025-01-20T14:45:00Z"           |

### Available Categories:

- AI/ML
- Web3/Blockchain
- Healthcare
- Climate Tech
- FinTech
- Gaming
- Education
- Social Impact
- DateTime
- Open Theme

### 3. **Setting Up the Map**

When the component first loads, it creates a Leaflet map (Leaflet is like Google Maps but free for developers):

```typescript
map.current = L.map(mapContainer.current, {
  center: [20, 20], // Starts in the middle of the world
  zoom: 2, // Zoomed out to see the whole world
  minZoom: 2, // Can't zoom out further
  maxBounds: [
    [-90, -180],
    [90, 180],
  ], // Can't scroll off the map
});
```

### 4. **Dark Mode and Light Mode**

The map changes appearance based on your theme preference:

- **Light mode** = Light colored map (easier to read during the day)
- **Dark mode** = Dark colored map (easier on the eyes at night)

It checks your theme setting and switches the map tiles automatically!

### 5. **The Auto-Panning Feature**

The map slowly moves from left to right automatically (like a screensaver). This makes it look more dynamic and alive!

```typescript
const panInterval = setInterval(() => {
  map.current.panTo([center.lat, center.lng + 0.3]);
}, 3000); // Moves every 3 seconds
```

**But** if you click, drag, or zoom the map, it stops auto-panning so you can explore on your own.

### 6. **Creating the Colorful Pins**

Each hackathon gets a colored pin based on its **primary category**:

| Category        | Color     |
| --------------- | --------- |
| AI/ML           | Blue 🔵   |
| Web3/Blockchain | Purple 🟣 |
| Healthcare      | Green 🟢  |
| Climate Tech    | Teal 🔵   |
| FinTech         | Orange 🟠 |
| Gaming          | Pink 🩷    |
| Education       | Orange 🟠 |
| Social Impact   | Red 🔴    |

The pins have a cool glowing effect with shadows to make them stand out!

### 7. **The Pop-up Info Card**

When you click a pin, a popup appears showing:

- Hackathon name (big and bold)
- Description
- 📍 Location
- 📅 Dates
- 💰 Prize pool (if available)
- 👥 Max participants (if specified)
- Category tags (those little colored pills)
- A "Visit Website" button

---

🗺️ Map Marker Color System Documentation
Overview

The map markers (dots) on HackaMaps.com
are colored based on the first category assigned to each hackathon.
This provides an instant visual cue for users to identify hackathon themes at a glance.

🎨 How Colors Are Determined
Color Selection Logic

Each hackathon has an array of categories (e.g. ["ML/AI", "Social Good"]).

The system uses only the first category (categories[0]) to determine the marker color.

If a hackathon has no categories or the category is unrecognized, the default color is purple (#8b5cf6).

Category-to-Color Mapping
Category Hex Color Visual Description
AI/ML #3b82f6 Blue
Web3 / Blockchain #a855f7 Purple
Healthcare #10b981 Green
Climate Tech #14b8a6 Teal
FinTech #f59e0b Amber / Orange
Gaming #ec4899 Pink
Education #f97316 Orange
Social Impact #f43f5e Rose / Red
DateTime #06b6d4 Cyan
Open Theme #c084fc Light Purple
Default / Unknown #8b5cf6 Purple
🧩 Where Colors Are Applied

The selected color is used across multiple UI elements:

Marker dot background – the main circular marker color

Glow effect – box shadow around the marker for emphasis

Category badges – background tint in popup category pills

“Visit Website” button – background color in the hackathon popup

⚙️ Implementation Details

Location:

src/components/HackathonMap.tsx

Function:

getCategoryColor(categories: string[]): string

Defined around lines 29–46.

Usage:

// Called once per hackathon when rendering markers
// (around line 131 in HackathonMap.tsx)

🧠 Notes

Only the first category determines the color — future iterations may support multi-category blending or user-customizable palettes.

Keep category names consistent across data sources for reliable color mapping.

## Connection to Supabase (The Data Flow)

Here's how the data travels from Supabase to your map:

```
┌─────────────┐
│  Supabase   │  ← Your database storing all hackathons
│  Database   │
└──────┬──────┘
       │
       │ 1. Index component fetches data on page load
       │    (using Supabase client: supabase.from("hackathons").select("*"))
       ↓
┌─────────────────┐
│     Index       │  ← The parent component! (pages/Index.tsx)
│   Component     │     - Fetches all hackathons from Supabase
│                 │     - Applies filters (categories, continents, location)
└──────┬──────────┘     - Stores in state
       │
       │ 2. Passes filtered hackathons as a prop
       │
       ↓
┌─────────────────┐
│ HackathonMap    │  ← This component!
│   Component     │     Just receives and displays the filtered list
└─────────────────┘
```

### How the Index Component Fetches Data:

The **Index component** (located at `pages/Index.tsx`) is the parent that handles everything:

```typescript
// 1. Set up state to store hackathons
const [hackathons, setHackathons] = useState<Hackathon[]>([]);
const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);

// 2. Fetch from Supabase when the page loads
useEffect(() => {
  fetchHackathons();
}, []);

const fetchHackathons = async () => {
  const { data, error } = await supabase
    .from("hackathons") // Table name in Supabase
    .select("*") // Get all columns
    .order("start_date", { ascending: true }); // Sort by start date

  if (error) {
    console.error("Error fetching hackathons:", error);
    return;
  }

  setHackathons(data || []); // Store original list
  setFilteredHackathons(data || []); // Store filtered list
};

// 3. Pass the filtered list to the map
<HackathonMap hackathons={filteredHackathons} />;
```

### What Makes Index Special?

The Index component does MORE than just fetch data - it's like the control center:

1. **Fetches** all hackathons from Supabase on page load
2. **Filters** them based on user selections:
   - Categories (AI/ML, Web3, etc.)
   - Continents (North America, Europe, etc.)
   - Location search (type "San Francisco" to find hackathons there)
3. **Passes** only the filtered hackathons to the map
4. **Shows** a count of how many hackathons are displayed vs total

So if you have 100 hackathons in your database but filter by "AI/ML" and only 20 match, the map will only show those 20 pins!

---

## Cool Features Explained

### 🎨 **Theme Switching**

The map watches for theme changes (light/dark mode) and automatically updates the map tiles. It's like changing your wallpaper when you turn on dark mode!

### 🔄 **Live Updates**

Whenever the parent component passes a new list of hackathons, the map automatically:

1. Removes all old pins
2. Adds new pins for the updated list
3. You see the changes instantly!

### 🎯 **Smart Markers**

Each marker is interactive:

- **Hover** - Your cursor changes to show it's clickable
- **Click** - Opens a popup with all the info
- **Styled** - Has a glowing effect matching its category color

### 📱 **Responsive**

The popup adjusts its size so it looks good on phones, tablets, and computers.

---

## What Libraries Are Used?

1. **Leaflet** - The mapping library (creates the interactive map)
2. **React** - For building the component with hooks like `useEffect` and `useRef`
3. **TypeScript** - Adds type checking so you don't pass the wrong data

---

## Summary

This HackathonMap component is like a smart bulletin board:

- It receives a list of hackathons from a parent component
- It puts colorful pins on a world map showing where each hackathon is
- When you click a pin, it shows you all the juicy details
- It automatically updates when new hackathons are added
- It looks great in both light and dark mode

**It does NOT connect to Supabase itself** - it just displays whatever data is handed to it. The actual database connection happens in a parent component!

## 🎨 Custom domain?

Yeah you can do that. Go to Project → Settings → Domains → Connect Domain

(You need a paid plan tho)

[Read more about domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 💡 Ideas for making this better

- Add more hackathon data sources
- Let people upvote hackathons
- Add notifications for upcoming deadlines
- Make the map even cooler with clusters
- Add user profiles

## 🤝 Contributing

Found a bug? Have an idea? Just open an issue or submit a PR. All contributions welcome! 🎉

write me a email at wiecen@gmail.com

## 📄 License

MIT Licensed - because who has time for legal drama?

Feel free to use, modify, and distribute this code however you like. Just don't sue me if your app becomes sentient and takes over the world.

Built with ❤️ by OJ - a fellow indie hacker trying to make the world a better place, one line of code at a time.

---
