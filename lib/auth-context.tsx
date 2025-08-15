'use client';

import { logger } from '@/lib/logger';
import { validateRequiredEnvVars } from '@/lib/env';
import { createUserProfile, getUserProfile, validateSignupData } from '@/lib/auth-utils';

import { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from './supabase-client';
import { useRouter } from 'next/navigation';
import { UserProfile, SignUpMetadata } from '@/types';

// Validate environment variables at module load
// 브라우저 환경에서만 검증 (서버 사이드 렌더링 시 스킵)
if (typeof window !== 'undefined') {
  try {
    // 개발 환경에서만 엄격한 검증
    if (process.env.NODE_ENV === 'development') {
      validateRequiredEnvVars();
    }
  } catch (error) {
    logger.error('Environment validation failed:', error);
    // 프로덕션에서는 에러를 무시하고 계속 진행
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using fallback environment configuration');
    }
  }
}

// Types are now imported from @/types

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: SupabaseAuthError | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ) => Promise<{ error: SupabaseAuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 프로필 캐시를 위한 ref
  const profileCacheRef = useRef<Map<string, { profile: UserProfile; timestamp: number }>>(new Map());
  const fetchingProfileRef = useRef<Map<string, Promise<void>>>(new Map());
  
  // 캐시 유효기간 (5분)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchUserProfile = useCallback(async (userId: string) => {
    // 캐시 확인
    const cached = profileCacheRef.current.get(userId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      logger.log('[Auth] Using cached profile for user:', userId);
      setUserProfile(cached.profile);
      return;
    }

    // 중복 요청 방지
    const existingFetch = fetchingProfileRef.current.get(userId);
    if (existingFetch) {
      logger.log('[Auth] Profile fetch already in progress for user:', userId);
      await existingFetch;
      return;
    }

    const fetchPromise = (async () => {
      logger.log('[Auth] Fetching profile for user:', userId);
      
      const result = await getUserProfile(userId);
    
      if (result.success && result.profile) {
        logger.log('[Auth] Profile fetched:', result.profile);
        const profile = result.profile as UserProfile;
        setUserProfile(profile);
        
        // 캐시에 저장
        profileCacheRef.current.set(userId, {
          profile,
          timestamp: Date.now()
        });
      } else {
        // 프로필이 없는 경우 생성 시도
        logger.log('[Auth] Profile not found, creating new profile...');
        const { data: userData } = await supabase.auth.getUser();

        if (userData?.user) {
          const createResult = await createUserProfile({
            id: userId,
            email: userData.user.email!,
            name: userData.user.email?.split('@')[0] ?? 'User',
            role: 'user',
          });

          if (createResult.success && createResult.profile) {
            logger.log('[Auth] Profile created:', createResult.profile);
            const profile = createResult.profile as UserProfile;
            setUserProfile(profile);
            
            // 캐시에 저장
            profileCacheRef.current.set(userId, {
              profile,
              timestamp: Date.now()
            });
          } else {
            logger.error('[Auth] Failed to create profile:', createResult.error);
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
    })();

    // 진행 중인 요청 추적
    fetchingProfileRef.current.set(userId, fetchPromise);
    
    try {
      await fetchPromise;
    } finally {
      fetchingProfileRef.current.delete(userId);
    }
  }, [CACHE_DURATION]);

  useEffect(() => {
    
    // 초기 세션 확인
    void supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);


  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    // 입력 데이터 검증
    const validation = validateSignupData({
      email,
      password,
      name: metadata?.name,
      phone: metadata?.phone,
    });

    if (!validation.isValid) {
      return {
        error: {
          message: validation.errors[0],
        } as SupabaseAuthError,
      };
    }

    const { data, error } = await supabase.auth.signUp(
      metadata
        ? {
            email,
            password,
            options: {
              data: metadata,
            },
          }
        : {
            email,
            password,
          }
    );

    if (data.user && !error) {
      // 사용자 프로필 생성
      const createResult = await createUserProfile({
        id: data.user.id,
        email: data.user.email!,
        name: metadata?.name ?? email.split('@')[0],
        phone: metadata?.phone,
        role: 'user',
      });

      if (!createResult.success) {
        logger.error('프로필 생성 오류:', createResult.error);
        // 프로필 생성 실패 시에도 회원가입은 완료된 상태이므로 계속 진행
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    router.push('/');
  };

  // Hook을 조건문 밖에서 호출
  const isAdmin = useMemo(() => {
    if (!userProfile) return false;
    const adminStatus = userProfile.role === 'admin';
    logger.log('[Auth] isAdmin calculation:', {
      userProfile: userProfile,
      role: userProfile.role,
      isAdmin: adminStatus,
    });
    return adminStatus;
  }, [userProfile]);

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
