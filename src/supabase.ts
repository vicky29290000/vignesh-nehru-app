// src/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Fetch environment variables and handle missing keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if necessary environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
