-- Migration: Add Enriched Columns & Spreadsheet Downloads Table

-- 1. Add enriched data columns to hackathons table
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS discord_url TEXT,
ADD COLUMN IF NOT EXISTS past_winners_repo TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS historical_prize_usd INTEGER;

-- 2. Add enriched data columns to hackathons_staging table (in case it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hackathons_staging') THEN
        ALTER TABLE public.hackathons_staging 
        ADD COLUMN IF NOT EXISTS discord_url TEXT,
        ADD COLUMN IF NOT EXISTS past_winners_repo TEXT,
        ADD COLUMN IF NOT EXISTS contact_email TEXT,
        ADD COLUMN IF NOT EXISTS historical_prize_usd INTEGER;
    END IF;
END $$;

-- 3. Create sheet_downloads table
CREATE TABLE IF NOT EXISTS public.sheet_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    filter_snapshot JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on sheet_downloads
ALTER TABLE public.sheet_downloads ENABLE ROW LEVEL SECURITY;

-- 5. Create policy for Service Role only (fully private, no public read/write)
-- By enabling RLS without any policy, only the service_role key (used by Edge Functions) can read/write to it.
