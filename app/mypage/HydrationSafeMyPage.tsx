'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Trophy, Coins, DollarSign, UserPlus, Copy, Check,
  Flame, Star, Users, MessageSquare, Gift, Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HydrationSafeMyPage() {
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 추천인 코드 복사
  const copyReferralCode = () => {
    const fullLink = `https://dduksang.com?ref=DDUK2025`;
    navigator.clipboard.writeText(fullLink);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  // 로딩 상태 - 완전히 정적인 로딩 화면
  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative">
      {/* 간단한 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900"></div>
      
      <div className="relative z-10">
        {/* 간단한 헤더 */}
        <header className="bg-deepBlack-800/50 border-b border-metallicGold-900/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-metallicGold-500">떡상랩</div>
              <nav className="hidden md:flex items-center space-x-6">
                <button onClick={() => router.push('/ai-trends')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">AI 트렌드</button>
                <button onClick={() => router.push('/sites')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">사이트홍보관</button>
                <button onClick={() => router.push('/community')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">커뮤니티</button>
                <button onClick={() => router.push('/lectures')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">강의</button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          
          {/* 웰컴 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-offWhite-200">환영합니다, </span>
              <span className="text-metallicGold-500">사용자</span>
              <span className="text-offWhite-200">님! 🎉</span>
            </h1>
            <p className="text-offWhite-500">나만의 디지털 공간을 확인하세요</p>
          </motion.div>

          {/* 메인 통계 카드들 - 가로 4개 배치 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* 순위 카드 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border-2 border-metallicGold-500/40 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-metallicGold-500" />
                <div className="text-xs bg-metallicGold-500/20 text-metallicGold-300 px-2 py-1 rounded-full">
                  신규
                </div>
              </div>
              <div className="text-3xl font-bold text-metallicGold-500 mb-2">#999</div>
              <div className="text-sm text-offWhite-500">현재 순위</div>
            </motion.div>

            {/* 조회수 카드 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8 text-blue-500" />
                <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  오늘
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
              <div className="text-sm text-offWhite-500">조회수</div>
            </motion.div>

            {/* 포인트 카드 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Coins className="w-8 h-8 text-yellow-500" />
                <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                  +0P
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">0P</div>
              <div className="text-sm text-offWhite-500">보유 포인트</div>
            </motion.div>

            {/* 현금화 가능 포인트 카드 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <button className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full hover:bg-green-500/30 transition-colors">
                  출금하기
                </button>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">0원</div>
              <div className="text-sm text-offWhite-500">현금화 가능</div>
            </motion.div>
          </div>

          {/* 하단 섹션 - 2열 레이아웃 */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            
            {/* 왼쪽 영역 (3/5) */}
            <div className="xl:col-span-3 space-y-8">
              
              {/* 추천인 제도 섹션 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-offWhite-200 flex items-center gap-3">
                    <UserPlus className="w-7 h-7 text-metallicGold-500" />
                    친구 초대하고 포인트 받기
                  </h2>
                  <div className="text-right">
                    <div className="text-sm text-offWhite-500">총 수익</div>
                    <div className="text-lg font-bold text-green-400">+0P</div>
                  </div>
                </div>

                {/* 보상 안내 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
                    <Gift className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400 mb-1">500P</div>
                    <div className="text-sm text-offWhite-500">친구 가입 시</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400 mb-1">20,000P</div>
                    <div className="text-sm text-offWhite-500">강의 결제 시</div>
                  </div>
                </div>

                {/* 추천인 링크 */}
                <div className="bg-deepBlack-900/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-offWhite-500 mb-1">내 추천 코드</div>
                      <code className="text-metallicGold-500 font-mono text-lg font-bold">DDUK2025</code>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center gap-2 px-4 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 rounded-lg text-sm text-metallicGold-500 transition-all hover:scale-105"
                    >
                      {referralCodeCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          복사완료!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          링크 복사
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 추천인 현황 */}
                <div className="flex justify-between text-center">
                  <div className="bg-deepBlack-900/30 rounded-xl p-4 flex-1 mr-2">
                    <div className="text-2xl font-bold text-offWhite-200 mb-1">0</div>
                    <div className="text-sm text-offWhite-500">총 추천인</div>
                  </div>
                  <div className="bg-deepBlack-900/30 rounded-xl p-4 flex-1 ml-2">
                    <div className="text-2xl font-bold text-green-400 mb-1">0</div>
                    <div className="text-sm text-offWhite-500">결제 완료</div>
                  </div>
                </div>
              </motion.div>

              {/* 커뮤니티 활동 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                  <Activity className="w-7 h-7 text-metallicGold-500" />
                  나의 커뮤니티 활동
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">0</div>
                    <div className="text-sm text-offWhite-500">작성글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">0</div>
                    <div className="text-sm text-offWhite-500">댓글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">0</div>
                    <div className="text-sm text-offWhite-500">좋아요</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">1</div>
                    <div className="text-sm text-offWhite-500">연속출석</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 오른쪽 영역 (2/5) - 시작 가이드 */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6 sticky top-8"
              >
                <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                  <Trophy className="w-7 h-7 text-metallicGold-500" />
                  시작하기
                </h2>

                {/* 시작 안내 */}
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-lg font-bold text-offWhite-200 mb-2">
                    새로운 여정이 시작됩니다!
                  </h3>
                  <p className="text-sm text-offWhite-500 mb-6">
                    사이트를 등록하고 커뮤니티에 참여해보세요
                  </p>
                  
                  <div className="bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-8 h-8 rounded-full bg-metallicGold-500/30 flex items-center justify-center font-bold text-metallicGold-400">
                        999
                      </div>
                      <div>
                        <div className="font-medium text-offWhite-200 flex items-center gap-2">
                          사용자
                          <span className="px-2 py-0.5 bg-metallicGold-500/30 rounded text-xs text-metallicGold-400 font-bold">
                            YOU
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-sm text-offWhite-500">현재 순위</div>
                      <p className="text-xs text-offWhite-500 mt-2">
                        사이트 등록으로 랭킹 참여하기
                      </p>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/sites/register')}
                    className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all duration-200 hover:scale-105"
                  >
                    첫 사이트 등록하기
                  </button>
                  <button
                    onClick={() => router.push('/community')}
                    className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-bold hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all duration-200"
                  >
                    커뮤니티 둘러보기
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}