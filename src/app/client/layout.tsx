import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch user data
  const user = await getUser()

  // Redirect to login if user doesn't exist or role is not 'client'
  if (!user || user.role !== 'client') {
    return redirect('/auth/login')  // Ensure this handles the redirection properly.
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">Client Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
