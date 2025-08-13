'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/stores/auth-store';
import { logger } from '@/lib/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin, mounted } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // SSR 안전성: 마운트되지 않았거나 로딩 중인 경우 대기
    if (!mounted || loading) return;

    // 사용자가 로그인하지 않은 경우
    if (!user) {
      logger.log('[ProtectedRoute] User not logged in, redirecting to login');
      router.push(redirectTo);
      return;
    }

    // 관리자 권한이 필요한 경우
    if (requireAdmin && !isAdmin) {
      logger.log('[ProtectedRoute] Admin access required but user is not admin');
      router.push('/');
      return;
    }

    // 프로필이 없는 경우 (비정상적인 상태)
    if (!userProfile) {
      logger.log('[ProtectedRoute] User profile not found');
      router.push('/');
      return;
    }

    logger.log('[ProtectedRoute] Access granted');
    setIsAuthorized(true);
  }, [user, userProfile, loading, isAdmin, requireAdmin, router, redirectTo, mounted]);

  // 마운트되지 않았거나 로딩 중이거나 권한 검사 중
  if (!mounted || loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500 mx-auto mb-4"></div>
          <p className="text-offWhite-600">
            {!mounted 
              ? '초기화 중...' 
              : loading 
              ? '인증 정보를 확인하고 있습니다...' 
              : '권한을 확인하고 있습니다...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
