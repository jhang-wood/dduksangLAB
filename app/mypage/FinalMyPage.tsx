'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Trophy, Coins, DollarSign, UserPlus, Copy, Check,
  TrendingUp, Flame, Star, Zap, Users, MessageSquare,
  ArrowUp, ArrowDown, Gift, Award, Target, Activity
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function FinalMyPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  
  // 클라이언트 렌더링 상태
  const [mounted, setMounted] = useState(false);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 실제 사용자 데이터만 사용 (Mock 데이터 완전 제거)
  const userName = mounted ? (userProfile?.name || user?.email?.split('@')[0] || '사용자') : '로딩중...';
  const userEmail = mounted ? (user?.email || '') : '';
  const referralCode = mounted ? `DDUK${user?.id?.slice(-4).toUpperCase() || '2025'}` : 'DDUK2025';

  // 실제 사용자 기반 기본 통계 (하드코딩 제거)
  const userStats = mounted ? {
    // 기본 포인트 시스템 - 실제로는 DB에서 가져와야 함
    points: 0,           // 신규 사용자 기본값
    todayEarned: 0,     // 오늘 획득 포인트
    cashablePoints: 0,   // 현금화 가능 포인트
    // 커뮤니티 활동 - 실제로는 DB에서 가져와야 함  
    posts: 0,           // 작성글 수
    comments: 0,        // 댓글 수
    likes: 0,           // 받은 좋아요
    streak: 1,          // 연속 출석 (기본 1일)
    // 사이트 통계 - 실제로는 DB에서 가져와야 함
    viewsToday: 0,      // 오늘 조회수
    viewsYesterday: 0,  // 어제 조회수
    rank: 999,          // 순위 (신규 사용자)
    // 추천인 정보 - 실제로는 DB에서 가져와야 함
    totalReferrals: 0,  // 총 추천인
    paidReferrals: 0    // 결제 완료 추천인
  } : {
    points: 0, todayEarned: 0, cashablePoints: 0, posts: 0, comments: 0, 
    likes: 0, streak: 1, viewsToday: 0, viewsYesterday: 0, rank: 999, 
    totalReferrals: 0, paidReferrals: 0
  };

  // 추천인 코드 복사
  const copyReferralCode = () => {
    if (!mounted) return;
    const fullLink = `https://dduksang.com?ref=${referralCode}`;
    navigator.clipboard.writeText(fullLink);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');
  
  const getChangeRate = () => {
    if (!mounted || userStats.viewsYesterday === 0) return 0;
    return Math.round(((userStats.viewsToday - userStats.viewsYesterday) / userStats.viewsYesterday) * 100);
  };

  const changeRate = getChangeRate();

  // 로딩 상태
  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        {/* 메인 컨텐츠 */}
        <div className="container mx-auto max-w-7xl px-4 py-8 pt-24">
          
          {/* 웰컴 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-offWhite-200">환영합니다, </span>
              <span className="text-metallicGold-500">{userName}</span>
              <span className="text-offWhite-200">님! 🎉</span>
            </h1>
            <p className="text-offWhite-500">실시간으로 업데이트되는 나의 성과를 확인하세요</p>
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
                <div className={`flex items-center gap-1 text-sm font-bold ${changeRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {changeRate >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(changeRate)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-metallicGold-500 mb-2">#{userStats.rank}</div>
              <div className="text-sm text-offWhite-500">전체 순위</div>
            </motion.div>

            {/* 오늘 조회수 카드 */}
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
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatNumber(userStats.viewsToday)}
              </div>
              <div className="text-sm text-offWhite-500">오늘 조회수</div>
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
                  +{userStats.todayEarned}P
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatNumber(userStats.points)}P
              </div>
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
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(userStats.cashablePoints / 1000).toFixed(1)}만
              </div>
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
                    <div className="text-lg font-bold text-green-400">+{formatNumber(userStats.paidReferrals * 20000)}P</div>
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
                      <code className="text-metallicGold-500 font-mono text-lg font-bold">{referralCode}</code>
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
                    <div className="text-2xl font-bold text-offWhite-200 mb-1">{userStats.totalReferrals}</div>
                    <div className="text-sm text-offWhite-500">총 추천인</div>
                  </div>
                  <div className="bg-deepBlack-900/30 rounded-xl p-4 flex-1 ml-2">
                    <div className="text-2xl font-bold text-green-400 mb-1">{userStats.paidReferrals}</div>
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
                    <div className="text-xl font-bold text-offWhite-200">{userStats.posts}</div>
                    <div className="text-sm text-offWhite-500">작성글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">{userStats.comments}</div>
                    <div className="text-sm text-offWhite-500">댓글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">{userStats.likes}</div>
                    <div className="text-sm text-offWhite-500">좋아요</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-offWhite-200">{userStats.streak}</div>
                    <div className="text-sm text-offWhite-500">연속출석</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 오른쪽 영역 (2/5) - 랭킹 */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6 sticky top-8"
              >
                <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                  <Trophy className="w-7 h-7 text-metallicGold-500" />
                  실시간 랭킹
                </h2>

                {/* 랭킹 안내 (실제 DB 연결 전까지) */}
                <div className="space-y-3 mb-6">
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="text-lg font-bold text-offWhite-200 mb-2">실시간 랭킹</h3>
                    <p className="text-sm text-offWhite-500 mb-4">
                      사이트를 등록하고 랭킹에 참여해보세요
                    </p>
                    <div className="bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-metallicGold-500/30 flex items-center justify-center font-bold text-metallicGold-400">
                          {userStats.rank}
                        </div>
                        <div>
                          <div className="font-medium text-offWhite-200 flex items-center gap-2">
                            {userName}
                            <span className="px-2 py-0.5 bg-metallicGold-500/30 rounded text-xs text-metallicGold-400 font-bold">
                              YOU
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-2">
                        <div className="font-bold text-offWhite-200">{formatNumber(userStats.viewsToday)}</div>
                        <div className="text-xs text-offWhite-500">오늘 조회수</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/sites/register')}
                    className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all duration-200 hover:scale-105"
                  >
                    사이트 등록하기
                  </button>
                  <button
                    onClick={() => router.push('/community')}
                    className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-bold hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all duration-200"
                  >
                    커뮤니티 참여
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