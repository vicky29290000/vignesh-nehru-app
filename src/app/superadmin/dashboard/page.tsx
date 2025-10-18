import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuperAdminDashboard() {
  const user = await getUser()

  if (!user || user.role !== 'super_admin') {
    return redirect('/auth/login') // or a 403 page
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
      <p className="mt-4">Welcome, {user.full_name}</p>
      {/* Add dashboard widgets or data */}
    </div>
  )
}
