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
 * Fetch user details by user ID from the 'users' table
 * @param userId - Supabase auth user id (UUID string)
 */
export async function getUser(userId: string | null): Promise<User | null> {
  if (!userId) {
    console.error('No user ID provided')
    return null
  }

  const supabase = createSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (err: any) {
    console.error('getUser error:', err.message || err)
    return null
  }
}
