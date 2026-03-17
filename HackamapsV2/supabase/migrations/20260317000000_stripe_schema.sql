-- Add tier and is_premium columns to profiles if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'hobby';

-- Create user_secrets table for secure Stripe data
CREATE TABLE IF NOT EXISTS user_secrets (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_id TEXT,
  premium_since TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on user_secrets (No public access policies means it's fully locked down to Service Role)
ALTER TABLE user_secrets ENABLE ROW LEVEL SECURITY;
