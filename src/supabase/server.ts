import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Type for user data returned by getUser
type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

/**
 * Factory to create a Supabase client for server components (with session from cookies)
 */
export const createSupabaseServerClient = () =>
  createServerComponentClient({
    cookies,
  })

/**
 * Fetch user details by user ID from 'users' table
 * @param userId - Supabase auth user id (UUID string)
 */
export async function getUser(userId: string | null): Promise<User | null> {
  if (!userId) return null

  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('getUser error:', error.message)
    return null
  }

  return data
}
