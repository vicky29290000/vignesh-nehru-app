import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Dashboard from '@/components/Dashboard'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return <Dashboard />
}