'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type AuthStore, createAuthStore } from '@/lib/stores/auth-store';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | null>(null);

export interface AuthStoreProviderProps {
  children: ReactNode;
}

// Next.js App Router용 Zustand Context Provider
export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi>();
  
  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

// useContext 에러 방지용 안전한 훅 - null 체크 개선
export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);
  
  // Context가 null이면 기본값 반환 (에러 던지지 않음)
  if (!authStoreContext) {
    // 안전한 기본값으로 완전한 AuthStore 구조 반환
    const defaultStore: AuthStore = {
      user: null,
      userProfile: null,
      loading: false,
      mounted: false,
      isAdmin: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      setMounted: () => {},
      setUser: () => {},
      setUserProfile: () => {},
      setLoading: () => {},
      fetchUserProfile: async () => {},
      initializeAuth: async () => {},
    };
    
    return selector(defaultStore);
  }

  return useStore(authStoreContext, selector);
};

// 편의성을 위한 useAuth 훅 추가 (기존 컴포넌트들과의 호환성)
export const useAuth = () => {
  return useAuthStore((state) => ({
    user: state.user,
    userProfile: state.userProfile,
    loading: state.loading,
    mounted: state.mounted,
    isAdmin: state.isAdmin,
    signIn: state.signIn,
    signUp: state.signUp,
    signOut: state.signOut,
    setMounted: state.setMounted,
  }));
};