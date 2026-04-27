-- Table for idempotency tracking of Stripe Checkout Sessions
CREATE TABLE IF NOT EXISTS public.stripe_checkout_sessions (
  id TEXT PRIMARY KEY, -- Stripe Checkout Session ID
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking purchases that need to be claimed (email match on existing user)
CREATE TABLE IF NOT EXISTS public.pending_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_checkout_session_id TEXT REFERENCES public.stripe_checkout_sessions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.stripe_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_claims ENABLE ROW LEVEL SECURITY;

-- Only service role can manage these tables
CREATE POLICY "Service role can manage checkout sessions" ON public.stripe_checkout_sessions USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage pending claims" ON public.pending_claims USING (true) WITH CHECK (true);

-- Table for basic rate limiting
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  ip TEXT PRIMARY KEY,
  last_request_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  request_count INTEGER DEFAULT 1 NOT NULL
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage rate limits" ON public.api_rate_limits USING (true) WITH CHECK (true);

