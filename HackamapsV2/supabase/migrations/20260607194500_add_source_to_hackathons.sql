-- Migration to add source column to hackathons table
ALTER TABLE public.hackathons ADD COLUMN IF NOT EXISTS source TEXT;
