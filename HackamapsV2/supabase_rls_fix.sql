-- Option A: owner-only access for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Restrict list access to the avatars bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Avatar download by direct URL"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
