-- Create hackathons table with all necessary fields
CREATE TABLE public.hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  continent TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  organizer_email TEXT,
  website_url TEXT,
  prize_pool TEXT,
  is_online BOOLEAN DEFAULT false,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no auth required for viewing)
CREATE POLICY "Anyone can view hackathons"
  ON public.hackathons
  FOR SELECT
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hackathons_updated_at
  BEFORE UPDATE ON public.hackathons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_hackathons_continent ON public.hackathons(continent);
CREATE INDEX idx_hackathons_categories ON public.hackathons USING GIN(categories);
CREATE INDEX idx_hackathons_dates ON public.hackathons(start_date, end_date);

-- Insert sample hackathon data
INSERT INTO public.hackathons (name, description, location, latitude, longitude, start_date, end_date, categories, continent, country, city, website_url, prize_pool, is_online) VALUES
('AI Innovation Summit 2025', 'Build the future of AI with cutting-edge machine learning and LLM technologies', 'San Francisco, CA, USA', 37.7749, -122.4194, '2025-03-15 09:00:00+00', '2025-03-17 18:00:00+00', ARRAY['AI/ML', 'Open Theme'], 'North America', 'United States', 'San Francisco', 'https://example.com/ai-summit', '$50,000', false),
('Web3 Builder Hackathon', 'Decentralized applications and blockchain innovation', 'Berlin, Germany', 52.5200, 13.4050, '2025-04-20 10:00:00+00', '2025-04-22 20:00:00+00', ARRAY['Web3/Blockchain', 'FinTech'], 'Europe', 'Germany', 'Berlin', 'https://example.com/web3', '€30,000', false),
('Healthcare Tech Challenge', 'Revolutionary solutions for modern healthcare', 'Singapore', 1.3521, 103.8198, '2025-05-10 08:00:00+00', '2025-05-12 17:00:00+00', ARRAY['Healthcare', 'AI/ML'], 'Asia', 'Singapore', 'Singapore', 'https://example.com/healthtech', '$40,000', false),
('Climate Action Hackathon', 'Technology for environmental sustainability', 'London, UK', 51.5074, -0.1278, '2025-06-01 09:00:00+00', '2025-06-03 19:00:00+00', ARRAY['Climate Tech', 'Social Impact'], 'Europe', 'United Kingdom', 'London', 'https://example.com/climate', '£25,000', false),
('Global FinTech Virtual', 'Digital banking and payment innovations', 'Online', 40.7128, -74.0060, '2025-04-05 00:00:00+00', '2025-04-07 23:59:00+00', ARRAY['FinTech', 'Web3/Blockchain'], 'North America', 'United States', 'New York', 'https://example.com/fintech', '$60,000', true),
('Gaming Universe Jam', 'Create the next generation of gaming experiences', 'Tokyo, Japan', 35.6762, 139.6503, '2025-07-15 10:00:00+00', '2025-07-17 22:00:00+00', ARRAY['Gaming', 'AI/ML'], 'Asia', 'Japan', 'Tokyo', 'https://example.com/gaming', '¥5,000,000', false),
('EdTech Innovation Lab', 'Transform education through technology', 'Toronto, Canada', 43.6532, -79.3832, '2025-05-25 09:00:00+00', '2025-05-27 18:00:00+00', ARRAY['Education', 'AI/ML'], 'North America', 'Canada', 'Toronto', 'https://example.com/edtech', '$35,000', false),
('Social Impact Hackathon', 'Technology for good and community development', 'Nairobi, Kenya', -1.2921, 36.8219, '2025-08-10 08:00:00+00', '2025-08-12 20:00:00+00', ARRAY['Social Impact', 'Education'], 'Africa', 'Kenya', 'Nairobi', 'https://example.com/social', '$20,000', false),
('DateTime Innovation Challenge', 'Build next-gen time management and scheduling solutions', 'Sydney, Australia', -33.8688, 151.2093, '2025-09-05 09:00:00+00', '2025-09-07 17:00:00+00', ARRAY['DateTime', 'AI/ML'], 'Oceania', 'Australia', 'Sydney', 'https://example.com/datetime', '$45,000', false),
('Open Innovation Marathon', 'Your idea, your rules - build anything!', 'São Paulo, Brazil', -23.5505, -46.6333, '2025-06-20 09:00:00+00', '2025-06-22 21:00:00+00', ARRAY['Open Theme'], 'South America', 'Brazil', 'São Paulo', 'https://example.com/open', '$30,000', false);