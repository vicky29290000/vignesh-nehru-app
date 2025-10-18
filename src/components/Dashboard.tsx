'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState('')

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        if (user) {
          setUser(user)
          const { data, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          if (roleError) {
            console.error('Error fetching role:', roleError)
            return
          }

          if (data?.role) {
            setRole(data.role)
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    fetchUserAndRole()
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <p>Your role: {role}</p>

      {/* Role-based content will go here */}
    </div>
  )
}
