'use client'

import { useState } from 'react'
import { supabaseClient } from '@/supabase/client' // make sure path is correct
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (loginError) {
      setError(loginError.message)
    } else {
      // Redirect to home/dashboard after successful login
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input sm:text-sm"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input sm:text-sm"
          required
        />

        {error && (
          <p className="text-red-600 mb-4 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
