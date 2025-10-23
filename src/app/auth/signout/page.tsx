// src/app/auth/signout/page.tsx
'use client'

import { useEffect } from 'react'
import { supabaseClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { showSuccess, showError } from '@/utils/toast'

export default function SignoutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        showError('Error signing out: ' + error.message)
        return
      }

      showSuccess('Successfully signed out.')
      router.push('/auth/login')
    }

    signOut()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Signing you out...
        </h2>
      </div>
    </div>
  )
}
