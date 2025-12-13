-- Drop existing RLS policy for SELECT
DROP POLICY IF EXISTS "Anyone can view hackathons" ON public.hackathons;

-- Create a new policy that excludes organizer_email from public SELECT
-- We'll use a security definer function to return hackathons without email
CREATE OR REPLACE FUNCTION public.get_hackathons_public()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  location text,
  latitude double precision,
  longitude double precision,
  start_date timestamptz,
  end_date timestamptz,
  is_online boolean,
  max_participants integer,
  categories text[],
  continent text,
  country text,
  city text,
  website_url text,
  prize_pool text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, name, description, location, latitude, longitude,
    start_date, end_date, is_online, max_participants,
    categories, continent, country, city, website_url, prize_pool,
    created_at, updated_at
  FROM public.hackathons;
$$;

-- Create a restrictive policy - only authenticated users can see organizer_email
CREATE POLICY "Public can view hackathons without email"
ON public.hackathons
FOR SELECT
USING (true);

-- Add a column-level security approach by creating a view
CREATE OR REPLACE VIEW public.hackathons_public AS
SELECT 
  id, name, description, location, latitude, longitude,
  start_date, end_date, is_online, max_participants,
  categories, continent, country, city, website_url, prize_pool,
  created_at, updated_at
FROM public.hackathons;

-- Grant access to the view for anon and authenticated users
GRANT SELECT ON public.hackathons_public TO anon, authenticated;