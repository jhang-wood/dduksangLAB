'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function BasicMyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="mypage" />
      
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold text-offWhite-200 mb-8">마이페이지</h1>
        
        <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-8">
          <p className="text-offWhite-200 mb-4">마이페이지가 준비 중입니다.</p>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}