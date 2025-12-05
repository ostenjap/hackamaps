-- Insert in-person hackathon events (with coordinates)
INSERT INTO hackathons (name, description, location, latitude, longitude, start_date, end_date, continent, country, city, categories, website_url, is_online) VALUES
('European Defense Tech Hackathon – Warsaw', 'Join 200+ hackers from across Europe for a defense tech hackathon co-organized with Polish Development Fund (PFR). Bridge gaps between technologists, public sector, investors, and operators in dual-use and defense technology. Develop solutions for European defense and security challenges.', 'Warsaw', 52.2297, 21.0122, '2025-12-05T12:00:00Z', '2025-12-07T23:59:59Z', 'Europe', 'Poland', 'Warsaw', ARRAY['Hackathon', 'Defense Tech', 'Dual-Use'], 'https://luma.com/edth-2025-warsaw', false),
('European Defense Tech Hackathon – Munich', 'Europe''s largest defense tech hackathon alongside Munich Security Conference. Join 200+ builders and visionaries for three days of developing drone defense solutions and dual-use technologies. Co-hosted with TUM Venture Labs, DroneAid Collective, and Inflection.', 'Munich', 48.1351, 11.5820, '2025-10-24T12:00:00Z', '2025-10-26T23:59:59Z', 'Europe', 'Germany', 'Munich', ARRAY['Hackathon', 'Defense Tech', 'Drone Defense'], 'https://luma.com/edth-2025-munich', false),
('European Defense Tech Hackathon – Munich (February)', 'Third edition of European Defense Tech Hackathon during Munich Security Conference. Gather with 200+ hackers to develop solutions for battlefield challenges with feedback from frontline operators. Put teams in position to continue toward deployment.', 'Munich', 48.1351, 11.5820, '2026-02-13T12:00:00Z', '2026-02-16T23:59:59Z', 'Europe', 'Germany', 'Munich', ARRAY['Hackathon', 'Defense Tech', 'Dual-Use'], 'https://luma.com/hlzlyfvd', false),
('European Defense Tech Hackathon – Tallinn', 'European defense tech hackathon focused on dual-use technologies and defense innovation in Estonia. Bridge gaps between technologists, public sector, and defense operators.', 'Tallinn', 59.4370, 24.7536, '2026-01-15T10:00:00Z', '2026-01-17T23:59:59Z', 'Europe', 'Estonia', 'Tallinn', ARRAY['Hackathon', 'Defense Tech'], 'https://luma.com/eurodefensetech', false),
('Australian Defense Tech Hackathon', 'First edition of Australian Defense Tech Hackathon gathering 100+ hackers in Canberra. Address Indo-Pacific security challenges through public-private collaboration. Develop solutions with mentorship from military operators and defense technologists.', 'Canberra', -35.2809, 149.1300, '2026-02-06T09:00:00Z', '2026-02-08T18:00:00Z', 'Oceania', 'Australia', 'Canberra', ARRAY['Hackathon', 'Defense Tech', 'Dual-Use'], 'https://lu.ma/adth-2026', false),
('European Defense Tech Hackathon – Athens', 'Defense technology hackathon in Athens focusing on dual-use and defense innovation. Connect with European defense tech ecosystem and develop solutions for security challenges.', 'Athens', 37.9838, 23.7275, '2026-03-20T10:00:00Z', '2026-03-22T23:59:59Z', 'Europe', 'Greece', 'Athens', ARRAY['Hackathon', 'Defense Tech'], 'https://luma.com/eurodefensetech', false),
('European Defense Tech Hackathon - Netherlands', 'European defense tech hackathon in the Netherlands. Develop dual-use technologies and defense solutions while bridging gaps between technologists and defense operators.', 'Location TBA', 52.3676, 4.9041, '2026-04-10T10:00:00Z', '2026-04-12T23:59:59Z', 'Europe', 'Netherlands', 'Amsterdam', ARRAY['Hackathon', 'Defense Tech'], 'https://luma.com/eurodefensetech', false),
('European Critical Infrastructure Hackathon', 'Hackathon focused on European critical infrastructure protection and cybersecurity. Co-organized by Vidoc Security Labs and EDTH in Gdańsk.', 'Gdańsk', 54.3520, 18.6466, '2026-05-15T10:00:00Z', '2026-05-17T23:59:59Z', 'Europe', 'Poland', 'Gdańsk', ARRAY['Hackathon', 'Cybersecurity', 'Infrastructure'], 'https://luma.com/eurodefensetech', false),
('MCP Connect with Anthropic, Zoopla & Alpic', 'Connect with Anthropic, Zoopla, and Alpic to explore Model Context Protocol (MCP) and AI agent development. Networking event for AI and tech professionals in London.', 'London', 51.5074, -0.1278, '2025-12-10T18:00:00Z', '2025-12-10T21:00:00Z', 'Europe', 'United Kingdom', 'London', ARRAY['Meetup', 'Machine Learning/AI', 'Networking'], 'https://luma.com/tech-europe', false),
('Happy Holiday Hack by Heartcore & Hera', 'Holiday-themed hackathon organized by Heartcore and Hera in Berlin. Festive coding event bringing together developers and innovators.', 'Berlin', 52.5200, 13.4050, '2025-12-20T10:00:00Z', '2025-12-21T23:59:59Z', 'Europe', 'Germany', 'Berlin', ARRAY['Hackathon', 'Holiday Theme'], 'https://luma.com/tech-europe', false),
('Engineering LAN Party + League of Legends Tournament by Peec AI', 'Engineering-focused LAN party with League of Legends tournament organized by Peec AI. Combine gaming and tech networking in Berlin.', 'Berlin', 52.5200, 13.4050, '2025-12-15T14:00:00Z', '2025-12-15T23:59:59Z', 'Europe', 'Germany', 'Berlin', ARRAY['Gaming', 'Networking', 'LAN Party'], 'https://luma.com/tech-europe', false),
('BuildLikeaPro Manchester', 'Two-day hackathon by Antler in Manchester for builders and entrepreneurs. Develop startup ideas and prototypes with mentorship and resources.', 'Manchester', 53.4808, -2.2426, '2026-01-06T09:00:00Z', '2026-01-07T18:00:00Z', 'Europe', 'United Kingdom', 'Manchester', ARRAY['Hackathon', 'Startup', 'Entrepreneurship'], 'https://luma.com/tech-europe', false),
('Applied AI Conf', 'Conference focused on applied artificial intelligence, machine learning, and AI implementation. Explore real-world AI applications and connect with AI practitioners at The Delta Campus.', 'The Delta Campus', 52.5200, 13.4050, '2026-01-20T09:00:00Z', '2026-01-20T18:00:00Z', 'Europe', 'Germany', 'Berlin', ARRAY['Conference', 'Machine Learning/AI', 'Applied AI'], 'https://luma.com/tech-europe', false),
('European Defense Tech Meetup – Berlin', 'In-person meetup for defense innovators, founders, VCs, and industry experts in Berlin. Network with the European defense tech ecosystem and discuss latest developments.', 'Berlin', 52.5200, 13.4050, '2026-01-15T18:00:00Z', '2026-01-15T21:00:00Z', 'Europe', 'Germany', 'Berlin', ARRAY['Meetup', 'Defense Tech', 'Networking'], 'https://luma.com/eurodefensetech', false)
ON CONFLICT DO NOTHING;

-- Remove duplicates keeping oldest record (using created_at to determine oldest)
DELETE FROM hackathons h1
WHERE h1.id IN (
  SELECT h2.id FROM hackathons h2
  WHERE EXISTS (
    SELECT 1 FROM hackathons h3
    WHERE h3.name = h2.name
      AND h3.location = h2.location
      AND h3.start_date = h2.start_date
      AND h3.end_date = h2.end_date
      AND h3.created_at < h2.created_at
  )
);

-- Offset stacking coordinates using spiral pattern
WITH ranked AS (
  SELECT id, latitude, longitude,
    ROW_NUMBER() OVER (PARTITION BY ROUND(latitude::numeric, 3), ROUND(longitude::numeric, 3) ORDER BY start_date) as rn
  FROM hackathons
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL
)
UPDATE hackathons h
SET 
  latitude = h.latitude + (r.rn - 1) * 0.008 * COS((r.rn - 1) * 2.39996),
  longitude = h.longitude + (r.rn - 1) * 0.008 * SIN((r.rn - 1) * 2.39996)
FROM ranked r
WHERE h.id = r.id AND r.rn > 1;