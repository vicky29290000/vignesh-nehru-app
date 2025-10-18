import { redirect } from 'next/navigation'
import { supabaseClient } from '@/utils/supabase/client'

export default async function HomePage() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: user } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  switch (user?.role) {
    case 'super_admin':
      redirect('/superadmin/dashboard')
    case 'architect':
      redirect('/architect/projects')
    case 'structural_team':
      redirect('/structural-team')
    case 'client':
      redirect('/client')
    default:
      redirect('/auth/login')
  }
}
