'use client'

import { useState } from 'react'
import { supabaseClient } from '@/supabase/client'
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
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light text-brand-text">
      <div className="w-full max-w-md p-8 border border-brand-medium rounded-md shadow-md bg-white">
        <h1 className="text-3xl font-extrabold text-brand-base text-center mb-2">
          Welcome to Quad Plus Architects
        </h1>
        <p className="text-center text-brand-text text-sm mb-6">
          Turn Your Dreams Into Design
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-brand-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-brand-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-base"
            required
          />

          {error && (
            <p className="text-brand-dark text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-base hover:bg-brand-dark text-white py-2 rounded font-medium transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
