'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Skip profile and go directly to dashboard
    router.push('/dashboard');
  }, [router]);

  return null;
}

