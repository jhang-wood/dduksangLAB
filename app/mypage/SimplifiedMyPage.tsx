'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Trophy, Flame, ChevronUp, ChevronDown, Activity, TrendingUp,
  Award, Target, Zap, Heart, MessageSquare, Clock, CheckCircle2,
  Coins, DollarSign, UserPlus, Share2, Copy, Check, Users
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function SimplifiedMyPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // 클라이언트 사이드 렌더링 확인
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="relative z-10">
          <Header currentPage="mypage" />
          <div className="container mx-auto max-w-7xl px-4 pt-20 pb-16">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Mock 데이터 - 실제 구현 전까지 사용
  const [viewCount, setViewCount] = useState(2456);
  const [yesterdayCount] = useState(2222);
  const [rank, setRank] = useState(8);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  // 포인트 및 사용자 통계
  const [userStats] = useState({
    points: 3420,
    todayPoints: 320,
    cashablePoints: 24500, // 현금화 가능 포인트
    totalReferrals: 12,
    paidReferrals: 3 // 결제한 추천인
  });

  // 추천인 코드
  const referralCode = 'DDUK2025ABC';
  
  const topRankings = [
    { rank: 1, name: 'AI마스터', views: 15234 },
    { rank: 2, name: '떡상킹', views: 8901 },
    { rank: 3, name: '노코드신', views: 5432 },
    { rank: 4, name: '프로개발자', views: 4321 },
    { rank: 5, name: '코딩천재', views: 3210 }
  ];

  // 5초마다 조회수 시뮬레이션 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => {
        const increase = Math.floor(Math.random() * 5);
        return prev + increase;
      });
      
      // 가끔 순위 변동
      if (Math.random() > 0.8) {
        setRank(prev => Math.max(1, prev + (Math.random() > 0.5 ? -1 : 1)));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 변화율 계산
  const getChangeRate = () => {
    if (yesterdayCount === 0) return 0;
    return Math.round(((viewCount - yesterdayCount) / yesterdayCount) * 100);
  };

  // 추천인 코드 복사
  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://dduksang.com?ref=${referralCode}`);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  // 로그인 체크 완전 제거 - 안정적인 동작을 위해

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        <div className="container mx-auto max-w-7xl px-4 pt-20 pb-16">
          {/* 상단: 실시간 현황 (가로형, 작게) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 내 순위 */}
              <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-metallicGold-500" />
                    <span className="text-sm text-metallicGold-500 font-medium">현재 순위</span>
                  </div>
                  <div className="text-xl font-bold text-metallicGold-500">#{rank}위</div>
                </div>
              </div>

              {/* 오늘 조회수 */}
              <div className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-offWhite-400">오늘 조회수</span>
                  </div>
                  <div className="text-xl font-bold text-offWhite-200">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={viewCount}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {formatNumber(viewCount)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* 어제 대비 */}
              <div className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-offWhite-400">어제 대비</span>
                  </div>
                  <div className={`flex items-center gap-1 font-bold ${
                    viewCount > yesterdayCount ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {viewCount > yesterdayCount ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(getChangeRate())}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 메인 콘텐츠 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 포인트 & 레벨 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-metallicGold-500" />
                포인트 & 보상
              </h2>

              {/* 포인트 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-deepBlack-900/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-offWhite-400">보유 포인트</span>
                  </div>
                  <span className="font-bold text-yellow-500">{formatNumber(userStats.points)}P</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">현금화 가능</span>
                  </div>
                  <span className="font-bold text-green-500">{formatNumber(userStats.cashablePoints)}P</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-500">오늘 획득</span>
                  </div>
                  <span className="font-bold text-blue-500">+{userStats.todayPoints}P</span>
                </div>
              </div>

              {/* 현금화 버튼 */}
              <button className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-400 hover:to-green-500 transition-all text-sm">
                포인트 현금화 ({(userStats.cashablePoints / 1000).toFixed(1)}만원)
              </button>
            </motion.div>

            {/* 중간: 추천인 제도 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-metallicGold-500" />
                추천인 제도
              </h2>

              {/* 추천 보상 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-offWhite-400">가입 시</span>
                  <span className="text-yellow-500 font-bold">500P</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-offWhite-400">강의 결제 시</span>
                  <span className="text-green-500 font-bold">20,000P</span>
                </div>
              </div>

              {/* 내 추천인 코드 */}
              <div className="bg-deepBlack-900/30 rounded-xl p-3 mb-4">
                <div className="text-xs text-offWhite-500 mb-2">내 추천인 코드</div>
                <div className="flex items-center justify-between">
                  <code className="text-metallicGold-500 font-mono font-bold">{referralCode}</code>
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center gap-1 px-2 py-1 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 rounded text-xs text-metallicGold-500 transition-colors"
                  >
                    {referralCodeCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        복사
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 추천인 통계 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-500">{userStats.totalReferrals}</div>
                  <div className="text-xs text-blue-400">총 추천인</div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-green-500">{userStats.paidReferrals}</div>
                  <div className="text-xs text-green-400">결제 완료</div>
                </div>
              </div>
            </motion.div>

            {/* 오른쪽: 실시간 랭킹 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-metallicGold-500" />
                TOP 5 랭킹
              </h2>

              <div className="space-y-2">
                {topRankings.map((item, index) => (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                      item.rank === rank 
                        ? 'bg-metallicGold-500/10 border border-metallicGold-500/30' 
                        : 'bg-deepBlack-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                        item.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                        item.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                        'bg-deepBlack-900 text-offWhite-500'
                      }`}>
                        {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                      </div>
                      <span className="text-offWhite-200">{item.name}</span>
                    </div>
                    <span className="font-bold text-offWhite-300">{formatNumber(item.views)}</span>
                  </div>
                ))}
                
                {rank > 5 && (
                  <div className="border-t border-metallicGold-900/20 pt-2 mt-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-metallicGold-500/10 border border-metallicGold-500/30 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-metallicGold-500/20 flex items-center justify-center text-xs font-bold text-metallicGold-500">
                          {rank}
                        </div>
                        <span className="text-offWhite-200">나</span>
                        <span className="px-1 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">YOU</span>
                      </div>
                      <span className="font-bold text-offWhite-200">{formatNumber(viewCount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 하단: 커뮤니티 활동 (가로형) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-metallicGold-500" />
              커뮤니티 활동
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                <div className="text-2xl font-bold text-offWhite-200">12</div>
                <div className="text-sm text-offWhite-500">작성글</div>
              </div>
              <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                <div className="text-2xl font-bold text-offWhite-200">45</div>
                <div className="text-sm text-offWhite-500">댓글</div>
              </div>
              <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                <div className="text-2xl font-bold text-offWhite-200">234</div>
                <div className="text-sm text-offWhite-500">받은 좋아요</div>
              </div>
              <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                <div className="text-2xl font-bold text-offWhite-200 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  5
                </div>
                <div className="text-sm text-offWhite-500">연속 출석</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/sites/register')}
                className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
              >
                새 사이트 등록하고 포인트 획득하기
              </button>
            </div>
          </motion.div>

          {/* TOP 5 랭킹 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-offWhite-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-metallicGold-500" />
              실시간 TOP 5
            </h2>

            <div className="space-y-3">
              {topRankings.map((item, index) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    item.rank === rank 
                      ? 'bg-metallicGold-500/10 border border-metallicGold-500/30' 
                      : 'bg-deepBlack-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                      item.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                      item.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                      'bg-deepBlack-900 text-offWhite-500'
                    }`}>
                      {item.rank === 1 ? '🥇' :
                       item.rank === 2 ? '🥈' :
                       item.rank === 3 ? '🥉' :
                       item.rank}
                    </div>
                    <div>
                      <div className="font-medium text-offWhite-200 flex items-center gap-2">
                        {item.name}
                        {item.rank === rank && (
                          <span className="px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-offWhite-200">
                      {formatNumber(item.views)}
                    </div>
                    <div className="text-xs text-offWhite-500">조회</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 내가 TOP 5 밖일 때 */}
            {rank > 5 && (
              <div className="mt-4 pt-4 border-t border-metallicGold-900/20">
                <div className="flex items-center justify-between p-3 rounded-xl bg-metallicGold-500/10 border border-metallicGold-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-metallicGold-500/20 flex items-center justify-center">
                      <span className="font-bold text-metallicGold-500">{rank}</span>
                    </div>
                    <div className="font-medium text-offWhite-200">
                      나 
                      <span className="ml-2 px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                        YOU
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-offWhite-200">
                      {formatNumber(viewCount)}
                    </div>
                    <div className="text-xs text-offWhite-500">조회</div>
                  </div>
                </div>
                <p className="text-center text-sm text-offWhite-500 mt-3">
                  TOP 5까지 <span className="text-metallicGold-500 font-bold">{rank - 5}위</span> 남았습니다!
                </p>
              </div>
            )}
          </motion.div>

          {/* 하단 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => router.push('/sites')}
              className="px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all transform hover:scale-105"
            >
              내 사이트 등록하고 경쟁 시작하기
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}