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

## 📄 License

MIT - do whatever you want with this

---

Made with 💜 and lots of ☕
