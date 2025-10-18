import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ArchitectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.role !== 'architect') {
    redirect('/auth/login') // or to a 403 page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">Architect Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
