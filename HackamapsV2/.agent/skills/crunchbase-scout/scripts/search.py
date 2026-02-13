import sys
from crawlee import HttpCrawler # Common in 2026 Antigravity setups

async def main():
    query = sys.argv[1]
    # The agent will pass "Early Stage + Geography" here
    print(f"Searching Crunchbase for: {query}...")
    # Logic to interface with a scraper like Scrapfly or Crawlee
    # ... (Actual scraping code goes here)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())

# the activation script looks like this:

# I need to start a data collection strategy. Use 
# scripts
#   to find early-stage, active startups in the AI infrastructure space located in DACH region