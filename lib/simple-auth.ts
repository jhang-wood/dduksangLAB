// 완전히 SSR 안전한 인증 시스템 - Context 사용 없음
'use client';

import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// 간단한 상태 관리 - Context 없음
let authState = {
  user: null as User | null,
  userProfile: null as any,
  loading: true,
  mounted: false,
  isAdmin: false,
};

const listeners: Set<() => void> = new Set();

// 상태 업데이트 함수
const updateState = (newState: Partial<typeof authState>) => {
  authState = { ...authState, ...newState };
  listeners.forEach(listener => listener());
};

// 리스너 추가/제거
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// 현재 상태 가져오기
export const getAuthState = () => authState;

// 프로필 가져오기
const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('프로필 가져오기 실패:', error);
    return null;
  }
};

// 프로필 생성
const createUserProfile = async (profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('프로필 생성 실패:', error);
    return null;
  }
};

// 인증 초기화
export const initializeAuth = async () => {
  if (typeof window === 'undefined') return;

  try {
    // 현재 세션 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    let userProfile = null;
    if (session?.user) {
      userProfile = await fetchUserProfile(session.user.id);
      
      // 프로필이 없으면 생성
      if (!userProfile) {
        userProfile = await createUserProfile({
          id: session.user.id,
          email: session.user.email,
          name: session.user.email?.split('@')[0] ?? 'User',
          role: 'user',
        });
      }
    }

    updateState({
      user: session?.user ?? null,
      userProfile,
      loading: false,
      mounted: true,
      isAdmin: userProfile?.role === 'admin'
    });

    // 인증 상태 변경 리스너
    supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      let newUserProfile = null;
      if (session?.user) {
        newUserProfile = await fetchUserProfile(session.user.id);
        if (!newUserProfile) {
          newUserProfile = await createUserProfile({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email?.split('@')[0] ?? 'User',
            role: 'user',
          });
        }
      }

      updateState({
        user: session?.user ?? null,
        userProfile: newUserProfile,
        isAdmin: newUserProfile?.role === 'admin'
      });
    });

  } catch (error) {
    console.error('인증 초기화 실패:', error);
    updateState({
      loading: false,
      mounted: true
    });
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const userProfile = await fetchUserProfile(data.user.id);
      updateState({
        user: data.user,
        userProfile,
        isAdmin: userProfile?.role === 'admin'
      });
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// 회원가입
export const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined
    });

    if (error) return { error };

    if (data.user) {
      const userProfile = await createUserProfile({
        id: data.user.id,
        email: data.user.email,
        name: metadata?.name ?? email.split('@')[0],
        role: 'user',
      });

      updateState({
        user: data.user,
        userProfile,
        isAdmin: false
      });
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// 로그아웃
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    updateState({
      user: null,
      userProfile: null,
      isAdmin: false
    });
    
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};