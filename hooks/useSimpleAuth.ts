'use client';

import { useState, useEffect } from 'react';
import { subscribe, getAuthState, initializeAuth, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '@/lib/simple-auth';

// Context 없는 인증 훅
export const useSimpleAuth = () => {
  const [state, setState] = useState(getAuthState);

  useEffect(() => {
    // 구독하여 상태 변경 감지
    const unsubscribe = subscribe(() => {
      setState(getAuthState());
    });

    // 마운트 시 인증 초기화
    if (!getAuthState().mounted) {
      initializeAuth();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user: state.user,
    userProfile: state.userProfile,
    loading: state.loading,
    mounted: state.mounted,
    isAdmin: state.isAdmin,
    signIn: authSignIn,
    signUp: authSignUp,
    signOut: authSignOut,
  };
};