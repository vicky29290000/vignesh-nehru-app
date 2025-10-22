'use client'

import { createBrowserClient } from '@supabase/ssr'

// Create Supabase client using environment variables
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
