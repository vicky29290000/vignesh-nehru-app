// src/app/logout/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase'

export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      // Sign out the user
      await supabase.auth.signOut()
      // Redirect to login page
      router.replace('/auth/login')
    }

    logout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-md shadow-md bg-white">
        <p className="text-center text-lg text-gray-600">Logging you out...</p>
      </div>
    </div>
  )
}
