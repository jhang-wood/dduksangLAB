'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Header from '@/components/Header';

export default function SimpleMyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="mypage" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="mypage" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-offWhite-200 mb-4">로그인이 필요합니다</h2>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="mypage" />
      
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold text-offWhite-200 mb-8">마이페이지</h1>
        
        <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-offWhite-200 mb-2">프로필 정보</h2>
            <p className="text-offWhite-400">이메일: {user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-deepBlack-900/50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-metallicGold-500 mb-2">총 조회수</h3>
              <p className="text-2xl font-bold text-offWhite-200">0</p>
            </div>
            
            <div className="bg-deepBlack-900/50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-yellow-500 mb-2">포인트</h3>
              <p className="text-2xl font-bold text-offWhite-200">0P</p>
            </div>
            
            <div className="bg-deepBlack-900/50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-blue-500 mb-2">등록 사이트</h3>
              <p className="text-2xl font-bold text-offWhite-200">0개</p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/sites/register')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
            >
              사이트 등록하기
            </button>
            
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-bold"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}