'use client';  // This marks the component as a Client Component

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';  // Adjust path based on where you placed supabase.ts

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const listenerRef = useRef<any>(null);  // Define `listenerRef` with a type

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('User logged in:', session.user);
        setIsLoggedIn(true);
        router.push('/'); // Redirect after login
      } else {
        setIsLoggedIn(false); // Handle logout
      }
    });

    listenerRef.current = res?.data?.subscription ?? res;

    return () => {
      const sub = listenerRef.current;
      if (!sub) return;
      if (typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      } else if (typeof sub === 'function') {
        sub();
      }
    };
  }, [router]);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      if (session?.user) {
        setIsLoggedIn(true);
        router.push('/'); // Redirect if user is already logged in
      }
      setIsSessionChecked(true);
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, session, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (loginError) {
        setError(`Login failed: ${loginError.message}`);
        console.error('Login Error:', loginError.message);
        return;
      }

      if (!user || !session) {
        setError('Unexpected error: User or session is undefined.');
        console.error('User or session is undefined.', { user, session });
        return;
      }

      console.log('Login successful. User:', user);
      setIsLoggedIn(true);
      router.push('/'); // Redirect after successful login
    } catch (error) {
      setLoading(false);
      setError(`Error during login: ${error.message}`);
      console.error('Error during login:', error);
    }
  };

  if (!isSessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 border border-gray-300 rounded-md shadow-md bg-white">
          <p className="text-center text-gray-600 text-lg">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-md shadow-md bg-white">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Welcome to Quad Plus Architects
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">Your gateway to greatness</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
