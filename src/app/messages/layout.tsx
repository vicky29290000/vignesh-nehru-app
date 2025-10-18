import { getUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const allowedRoles = ['client', 'architect', 'structural_team', 'admin', 'super_admin']

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold">Messages</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
