'use client';

import { logger } from '@/lib/logger';
import { validateRequiredEnvVars } from '@/lib/env';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';
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

  const fetchUserProfile = async (userId: string) => {
    logger.log('[Auth] Fetching profile for user:', userId);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) {
      logger.error('[Auth] Error fetching profile:', error);

      // 프로필이 없는 경우 생성
      if (error.code === 'PGRST116') {
        logger.log('[Auth] Profile not found, creating new profile...');
        const { data: userData } = await supabase.auth.getUser();

        if (userData?.user) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userData.user.email,
              name: userData.user.email?.split('@')[0] ?? 'User',
              role: 'user',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            logger.error('[Auth] Error creating profile:', createError);
            setUserProfile(null);
          } else {
            logger.log('[Auth] Profile created:', newProfile);
            setUserProfile(newProfile as UserProfile);
          }
        }
      } else {
        setUserProfile(null);
      }
    } else if (data) {
      logger.log('[Auth] Profile fetched:', data);
      logger.log('[Auth] User role:', data.role);
      setUserProfile(data as UserProfile);
    }
  };

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
  }, []);

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
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        name: metadata?.name ?? email.split('@')[0],
        phone: metadata?.phone ?? '',
        role: 'user',
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        logger.error('프로필 생성 오류:', profileError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    router.push('/');
  };

  const isAdmin = useMemo(() => {
    const adminStatus = userProfile?.role === 'admin';
    logger.log('[Auth] isAdmin calculation:', {
      userProfile: userProfile,
      role: userProfile?.role,
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
