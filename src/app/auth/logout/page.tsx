// src/app/logout/page.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.replace('/auth/login'); // Redirect to login after logging out
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-md shadow-md bg-white">
        <p className="text-center text-lg text-gray-600">Logging you out...</p>
      </div>
    </div>
  );
}
