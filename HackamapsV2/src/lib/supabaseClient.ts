import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://neueevrpztrqfrbvhoib.supabase.co") as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_BttD7SaaOtlgnmYJ4Bl5HA_H03lOGze") as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
