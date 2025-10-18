import { redirect } from 'next/navigation';
import { supabaseServerClient } from '@/utils/supabase/server';
import Dashboard from '@/components/Dashboard';

export default async function HomePage() {
  // Fetch the current session from Supabase
  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  if (error) {
    // Handle potential error (optional)
    console.error('Error fetching session:', error);
  }

  // If no active session, redirect to login page
  if (!session) {
    redirect('/auth/login');
  }

  // If logged in, render the Dashboard component
  return <Dashboard />;
}
