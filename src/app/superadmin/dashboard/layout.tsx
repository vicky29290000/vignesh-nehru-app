import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.role !== 'super_admin') {
    redirect('/auth/login') // optional: redirect to a "403 Unauthorized" page
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h2 className="text-xl font-semibold">Quad+ Super Admin</h2>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
