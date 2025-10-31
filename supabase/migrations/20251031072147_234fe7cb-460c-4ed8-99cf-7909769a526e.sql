-- Allow authenticated users to insert hackathons
CREATE POLICY "Authenticated users can insert hackathons"
ON public.hackathons
FOR INSERT
TO authenticated
WITH CHECK (true);