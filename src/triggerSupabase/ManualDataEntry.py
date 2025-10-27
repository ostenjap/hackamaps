#!/usr/bin/env python3
"""
Manual Hackathon Data Entry Script
===================================
This script allows you to manually add hackathon data to the database.

Instructions:
1. Fill in the HACKATHONS_DATA list below with your hackathon information
2. Set your Supabase credentials as environment variables:
   - SUPABASE_URL
   - oj1
3. Run: python ManualDataEntry.py

Dependencies:
- pip install supabase python-dotenv
"""

import os
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================================================
# CONFIGURATION - ADD YOUR HACKATHON DATA HERE
# ============================================================================

HACKATHONS_DATA = [
    {
        "name": "Example Hackathon 2025",
        "description": "A 48-hour hackathon focused on building innovative AI solutions",
        "location": "San Francisco, CA, USA",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "start_date": "2025-03-15T09:00:00Z",
        "end_date": "2025-03-17T18:00:00Z",
        "continent": "North America",
        "country": "USA",
        "city": "San Francisco",
        "categories": ["AI", "Web3", "Healthcare"],
        "website_url": "https://example.com",
        "prize_pool": "$50,000",
        "organizer_email": "organizer@example.com",
        "is_online": False,
        "max_participants": 200
    },
    # Add more hackathons here following the same format
    # {
    #     "name": "Another Hackathon",
    #     "description": "Description here",
    #     "location": "City, Country",
    #     "latitude": 0.0,
    #     "longitude": 0.0,
    #     "start_date": "2025-04-01T09:00:00Z",
    #     "end_date": "2025-04-03T18:00:00Z",
    #     "continent": "Europe",
    #     "country": "Germany",
    #     "city": "Berlin",
    #     "categories": ["FinTech", "Mobile"],
    #     "website_url": "https://example.com",
    #     "prize_pool": "$25,000",
    #     "organizer_email": "contact@example.com",
    #     "is_online": False,
    #     "max_participants": 150
    # },
]

# ============================================================================
# SCRIPT LOGIC - DO NOT MODIFY BELOW THIS LINE
# ============================================================================

def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("oj1")
    
    if not url or not key:
        raise ValueError(
            "Missing Supabase credentials!\n"
            "Please set SUPABASE_URL and oj1 environment variables.\n"
            "You can find these in your Lovable Cloud backend settings."
        )
    
    return create_client(url, key)

def validate_hackathon(hackathon: dict) -> tuple[bool, str]:
    """Validate hackathon data"""
    required_fields = [
        "name", "location", "latitude", "longitude", 
        "start_date", "end_date", "continent", "country", "city", "categories"
    ]
    
    for field in required_fields:
        if field not in hackathon or hackathon[field] is None:
            return False, f"Missing required field: {field}"
    
    if not isinstance(hackathon["categories"], list) or len(hackathon["categories"]) == 0:
        return False, "categories must be a non-empty list"
    
    try:
        datetime.fromisoformat(hackathon["start_date"].replace("Z", "+00:00"))
        datetime.fromisoformat(hackathon["end_date"].replace("Z", "+00:00"))
    except ValueError:
        return False, "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"
    
    return True, ""

def insert_hackathons(supabase: Client, hackathons: list) -> None:
    """Insert hackathons into the database"""
    print(f"\n{'='*60}")
    print(f"Starting to insert {len(hackathons)} hackathon(s)...")
    print(f"{'='*60}\n")
    
    success_count = 0
    error_count = 0
    
    for idx, hackathon in enumerate(hackathons, 1):
        print(f"[{idx}/{len(hackathons)}] Processing: {hackathon.get('name', 'Unknown')}")
        
        # Validate data
        is_valid, error_msg = validate_hackathon(hackathon)
        if not is_valid:
            print(f"  ❌ Validation Error: {error_msg}")
            error_count += 1
            continue
        
        # Insert into database
        try:
            response = supabase.table("hackathons").insert(hackathon).execute()
            print(f"  ✅ Successfully inserted!")
            success_count += 1
        except Exception as e:
            print(f"  ❌ Database Error: {str(e)}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  ✅ Successful: {success_count}")
    print(f"  ❌ Failed: {error_count}")
    print(f"  📊 Total: {len(hackathons)}")
    print(f"{'='*60}\n")

def main():
    """Main execution function"""
    try:
        # Check if there's data to insert
        if not HACKATHONS_DATA:
            print("⚠️  No hackathon data found in HACKATHONS_DATA list!")
            print("Please add your hackathon data to the configuration section at the top of this script.")
            return
        
        # Initialize Supabase client
        print("🔌 Connecting to database...")
        supabase = get_supabase_client()
        print("✅ Connected successfully!\n")
        
        # Insert hackathons
        insert_hackathons(supabase, HACKATHONS_DATA)
        
        print("✨ Script completed!")
        
    except Exception as e:
        print(f"\n❌ Fatal Error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()
