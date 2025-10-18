import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with elevated privileges (service role key)
export const supabaseServerClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false, // No local session storage on server
  },
})

/**
 * Fetch user info by their user ID from the 'users' table.
 * @param userId - Supabase auth.uid() value (UUID string)
 * @returns user object or null if not found
 */
export async function getUser(userId: string | null) {
  if (!userId) return null

  const { data, error } = await supabaseServerClient
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}
