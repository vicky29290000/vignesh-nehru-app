import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function StructuralTeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch the current user's details
  const user = await getUser()

  // Redirect if the user is not logged in or does not have the 'structural_team' role
  if (!user || user.role !== 'structural_team') {
    redirect('/auth/login')  // You can also redirect to a 403 page if preferred
    return null  // Explicitly return `null` as the layout won't render after the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">Structural Team Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
