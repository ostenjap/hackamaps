-- Migration to add source column to hackathons_staging table
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hackathons_staging') THEN
        ALTER TABLE public.hackathons_staging ADD COLUMN IF NOT EXISTS source TEXT;
    END IF;
END $$;
