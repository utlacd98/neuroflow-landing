'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Skip auth and go directly to dashboard
    router.push('/dashboard');
  }, [router]);

  return null;
}

