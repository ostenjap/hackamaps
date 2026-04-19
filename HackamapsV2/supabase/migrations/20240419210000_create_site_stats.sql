-- Create site_stats table
CREATE TABLE IF NOT EXISTS public.site_stats (
    id TEXT PRIMARY KEY DEFAULT 'global',
    founder_spots_sold INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize the global stats row if it doesn't exist
INSERT INTO public.site_stats (id, founder_spots_sold)
VALUES ('global', 0)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security)
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for site_stats"
ON public.site_stats
FOR SELECT
TO public
USING (true);

-- Only service role can update (handled by edge functions)
CREATE POLICY "Service role update access for site_stats"
ON public.site_stats
FOR UPDATE
TO service_role
USING (true);

-- Function to increment founder spots safely
CREATE OR REPLACE FUNCTION public.increment_founder_spots()
RETURNS void AS $$
BEGIN
    UPDATE public.site_stats
    SET founder_spots_sold = founder_spots_sold + 1,
        last_updated = NOW()
    WHERE id = 'global';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
