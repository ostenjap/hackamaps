-- ========================================================
-- Secure view for Face Map pins and profile data (GDPR Compliant)
-- Combines pins with safe public profile data.
-- Bypasses general profiles RLS by running as the view owner.
-- ========================================================

CREATE OR REPLACE VIEW public.face_pins_public AS
SELECT 
    fp.id,
    fp.user_id,
    fp.description,
    fp.latitude,
    fp.longitude,
    fp.linkedin_url,
    fp.x_url,
    fp.custom_image_url,
    fp.updated_at,
    p.username,
    p.avatar_url
FROM public.face_pins fp
INNER JOIN public.profiles p ON fp.user_id = p.id;

-- Explicitly allow authenticated and anonymous users to query this restricted view
GRANT SELECT ON public.face_pins_public TO authenticated;
GRANT SELECT ON public.face_pins_public TO anon;
