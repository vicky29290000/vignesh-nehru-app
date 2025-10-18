import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.role !== 'client') {
    redirect('/auth/login')
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
