'use client';

import { useEffect, useState } from 'react';
import { useAuthInitialization } from '@/lib/stores/auth-store';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const mounted = useAuthInitialization();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // On server side, just render children
  if (!isClient) {
    return <>{children}</>;
  }
  
  // Show loading during client-side hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="text-offWhite-400">초기화 중...</div>
      </div>
    );
  }
  
  return <>{children}</>;
}