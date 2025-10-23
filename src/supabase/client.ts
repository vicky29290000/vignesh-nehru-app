'use client'

import { createBrowserClient } from '@supabase/ssr'

// Check if the necessary environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing in environment variables');
}

export const supabaseClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
