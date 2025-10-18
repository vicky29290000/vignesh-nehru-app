// src/app/page.tsx
import { createSupabaseServerClient } from '@/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Create Supabase client for server component (with cookies)
  const supabase = createSupabaseServerClient()

  // Get the session info
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to login page
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.email}</h1>
      {/* Your dashboard or homepage content here */}
    </div>
  )
}
