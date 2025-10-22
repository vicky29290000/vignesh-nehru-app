'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '../../../lib/supabaseClient'; // Correct import path

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const listenerRef = useRef(null); // Ref to store listener

  // Effect to handle session and listener
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session?.user) {
        console.log('User already logged in:', session.user);
        setIsLoggedIn(true);
        router.push('/'); // Redirect to homepage if already logged in
      }
    };

    checkSession(); // Check session initially

    // Setup the listener for authentication state changes
    listenerRef.current = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('User logged in:', session.user);
        setIsLoggedIn(true);
        router.push('/'); // Redirect to homepage after login
      }
    });

    // Cleanup listener on component unmount
    return () => {
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
      }
    };
  }, [router]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, session, error: loginError } = await supabaseClient.auth.signInWithPassword({
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-md shadow-md bg-white">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Welcome to Our App
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
            <p className="text-red-500 text-sm mt-2">{error}</p>  // Display error if any
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors duration-200"
            disabled={loading}  // Disable button when loading
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
