// dashboard/page.tsx
import { createSupabaseServerClient } from '@/supabase/server'

export default async function Dashboard() {
  const supabase = createSupabaseServerClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please login to access the dashboard.</div>
  }

  // Fetch user role from 'users' table
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    return <div>Error loading user role.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <p>Your role: {userData?.role || 'No role assigned'}</p>

      {/* Add role-based content here */}
    </div>
  )
}
