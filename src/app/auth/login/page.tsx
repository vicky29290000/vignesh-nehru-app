'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  const listenerRef = useRef<any>(null);
  const navigatedRef = useRef(false); // prevent duplicate redirects

  const NAV_KEY = 'app_navigated_v1';
  const hasNavigated = () => typeof window !== 'undefined' && sessionStorage.getItem(NAV_KEY) === '1';
  const markNavigated = () => typeof window !== 'undefined' && sessionStorage.setItem(NAV_KEY, '1');
  const clearNavigated = () => typeof window !== 'undefined' && sessionStorage.removeItem(NAV_KEY);

  // Helper: fetch user role and redirect accordingly
  const redirectByRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('Error fetching user role:', error);
        router.replace('/auth/login');
        return;
      }

      switch (profile.role) {
        case 'super_admin':
          router.replace('/super-admin');
          break;
        case 'architect':
          router.replace('/architect/project');
          break;
        case 'client':
          router.replace('/client');
          break;
        case 'structural_team':
          router.replace('/structural-team');
          break;
        default:
          router.replace('/');
      }
    } catch (err) {
      console.error('Redirect by role error:', err);
      router.replace('/auth/login');
    }
  };

  // Auth listener: update local state only (do NOT navigate here)
  useEffect(() => {
    if (!supabase) return;

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (!session?.user) {
        navigatedRef.current = false;
        clearNavigated();
      }
    });

    listenerRef.current = (res as any)?.data?.subscription ?? res;

    return () => {
      const sub = listenerRef.current;
      if (!sub) return;
      if (typeof sub.unsubscribe === 'function') sub.unsubscribe();
      else if (typeof sub === 'function') sub();
    };
  }, []);

  // Initial session check: navigate once if a session exists
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setIsSessionChecked(true);
        return;
      }

      try {
        const { data, error: getSessionError } = await supabase.auth.getSession();
        const session = data?.session;
        if (getSessionError) {
          console.error('Error fetching session:', getSessionError);
        }
        if (session?.user) {
          setIsLoggedIn(true);
          if (!navigatedRef.current && !hasNavigated()) {
            navigatedRef.current = true;
            markNavigated();
            await redirectByRole(session.user.id);  // Redirect based on role
          }
        } else {
          setIsSessionChecked(true);
        }
      } finally {
        setIsSessionChecked(true);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const user = (data as any)?.user;
      const session = (data as any)?.session;
      setLoading(false);

      if (loginError) {
        setError(`Login failed: ${(loginError as any).message ?? String(loginError)}`);
        console.error('Login Error:', loginError);
        return;
      }

      if (!user || !session) {
        setError('Unexpected error: User or session is undefined.');
        console.error('User or session is undefined.', { user, session });
        return;
      }

      setIsLoggedIn(true);
      if (!navigatedRef.current && !hasNavigated()) {
        navigatedRef.current = true;
        markNavigated();
        await redirectByRole(user.id);  // Redirect based on role
      }
    } catch (err: any) {
      setLoading(false);
      setError(`Error during login: ${err?.message ?? String(err)}`);
      console.error('Error during login:', err);
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
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            className="w-full px-4 py-2 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            className="w-full px-4 py-2 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
