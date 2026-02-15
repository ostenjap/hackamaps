import json
import csv

def generate_csv():
    # 1. Load existing event names
    with open("supabase_events.json", "r", encoding="utf-8") as f:
        supabase_data = json.load(f)
    
    existing_names = {s.get("name", "").lower().strip() for s in supabase_data if s.get("name")}

    # 2. List of discovered events (from previous research)
    discovered_events = [
        {"name": "EU Code Week Hackathons", "date": "March 11, 2026 (Finals)", "location": "Online / Multi-city", "url": "https://codeweek.eu"},
        {"name": "EUDIS Defence Hackathon 2026", "date": "March 26-28, 2026", "location": "Multi-city (EU)", "url": "https://eudis-hackathon.eu"},
        {"name": "IWD Global Techathon", "date": "January-April 2026", "location": "Global / Virtual", "url": "https://airmeet.com"},
        {"name": "TPC CINECA Open Hackathon", "date": "March 31 - April 16, 2026", "location": "Hybrid", "url": "https://airmeet.com"},
        {"name": "European Critical Infrastructure Hackathon 2026", "date": "January 23-25, 2026", "location": "Gdańsk, Poland", "url": "https://criticalhackathon.com"},
        {"name": "ISE Hackathon 2026", "date": "February 5-6, 2026", "location": "Barcelona, Spain", "url": "https://iseurope.org"},
        {"name": "VLGE X CES 3D WORLD-BUILDING HACKATHON", "date": "February 12, 2026", "location": "London, UK", "url": "https://lu.ma"},
        {"name": "AI for Quantum Science Hackathon", "date": "February 12, 2026", "location": "Garching Bei München, Germany", "url": "https://lu.ma"},
        {"name": "London AI Hackathon - By Thrad, Lumina House and Vercel", "date": "February 14, 2026", "location": "London, UK", "url": "https://thrad.vercel.app"},
        {"name": "Hacking Smart Cities: Munich", "date": "February 14, 2026", "location": "Munich, Germany", "url": "https://10times.com"},
        {"name": "Vienna CPTO Drinks and AI Talks", "date": "February 16, 2026", "location": "Vienna, Austria", "url": "https://lu.ma"},
        {"name": "Encode AI Series: London", "date": "February 16, 2026", "location": "London, UK", "url": "https://lu.ma"},
        {"name": "MCP Hackathon - Berlin", "date": "February 19, 2026", "location": "Berlin, Germany", "url": "https://lu.ma"},
        {"name": "The London Neurotech Hackathon", "date": "February 20-21, 2026", "location": "London, UK", "url": "https://lu.ma"},
        {"name": "Berlin Bio x AI Hackathon", "date": "February 27, 2026", "location": "Berlin, Germany", "url": "https://lu.ma"},
        {"name": "Hack Esbjerg 2026", "date": "March 19-20, 2026", "location": "Esbjerg, Denmark", "url": "https://dev.events"},
        {"name": "START Hack 2026", "date": "March 18-20, 2026", "location": "St. Gallen, Switzerland", "url": "https://startglobal.org"},
        {"name": "Hack Kosice 2026", "date": "April 18-19, 2026", "location": "Kosice, Slovakia", "url": "https://dev.events"},
        {"name": "Energy Hack Days - Lausanne", "date": "May 7-8, 2026", "location": "Lausanne, Switzerland", "url": "https://dev.events"}
    ]

    # 3. Filter out duplicates
    new_events = []
    for event in discovered_events:
        name_lower = event["name"].lower().strip()
        # Basic contains check to be safer
        is_existing = any(name_lower in existing or existing in name_lower for existing in existing_names)
        if not is_existing:
            new_events.append(event)

    # 4. Write to CSV
    with open("upcoming_europe_hackathons_2026.csv", "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["name", "date", "location", "url"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for event in new_events:
            writer.writerow(event)
    
    print(f"Generated upcoming_europe_hackathons_2026.csv with {len(new_events)} new events.")

if __name__ == "__main__":
    generate_csv()
