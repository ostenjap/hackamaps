-- Drop the security definer view that was causing warnings
DROP VIEW IF EXISTS public.hackathons_public;

-- The function get_hackathons_public already exists and is the secure way to access hackathon data without emails
-- No changes needed to the function as it's already set up correctly