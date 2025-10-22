// src/lib/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr';

export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // Supabase URL from your environment variables
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Supabase Anon Key from your environment variables
);
