'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Trophy, Coins, DollarSign, UserPlus, Share2, Copy, Check,
  TrendingUp, Flame, Star, Gift, Zap, Award, Users, MessageSquare
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function UserFriendlyMyPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  
  // 클라이언트 사이드 렌더링 확인
  const [mounted, setMounted] = useState(false);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 실제 사용자 데이터 (fallback으로 기본값 제공)
  const [userStats] = useState({
    // 기본 정보
    name: userProfile?.name || user?.email?.split('@')[0] || '사용자',
    email: user?.email || '',
    
    // 포인트 시스템
    points: 3420,
    todayEarned: 50,
    cashablePoints: 24500,
    
    // 사이트 정보
    viewsToday: 2456,
    viewsYesterday: 2222,
    rank: 8,
    totalViews: 15432,
    
    // 커뮤니티 활동
    posts: 12,
    comments: 45,
    likes: 234,
    streak: 5,
    
    // 추천인 정보
    totalReferrals: 12,
    paidReferrals: 3,
    referralEarnings: 65000
  });

  // 추천인 코드
  const referralCode = `DDUK2025${user?.id?.slice(-3).toUpperCase() || 'ABC'}`;

  // 상위 랭킹 (실제로는 DB에서 가져와야 함)
  const topRankings = [
    { rank: 1, name: 'AI마스터', views: 15234, isOnline: true },
    { rank: 2, name: '떡상킹', views: 8901, isOnline: false },
    { rank: 3, name: '노코드신', views: 5432, isOnline: true },
    { rank: 4, name: '프로개발자', views: 4321, isOnline: false },
    { rank: 5, name: '코딩천재', views: 3210, isOnline: true }
  ];

  // 추천인 코드 복사
  const copyReferralCode = () => {
    const fullLink = `https://dduksang.com?ref=${referralCode}`;
    navigator.clipboard.writeText(fullLink);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 변화율 계산
  const getChangeRate = () => {
    if (userStats.viewsYesterday === 0) return 0;
    return Math.round(((userStats.viewsToday - userStats.viewsYesterday) / userStats.viewsYesterday) * 100);
  };

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

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        <div className="container mx-auto max-w-7xl px-4 pt-20 pb-16">
          {/* 환영 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-offWhite-200 mb-2">
              안녕하세요, <span className="text-metallicGold-500">{userStats.name}</span>님! 👋
            </h1>
            <p className="text-offWhite-500">오늘도 멋진 하루 되세요</p>
          </motion.div>

          {/* 메인 대시보드 - 4개 카드 가로 배치 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* 포인트 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                  오늘 +{userStats.todayEarned}P
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-500 mb-1">
                {formatNumber(userStats.points)}P
              </div>
              <div className="text-sm text-offWhite-500">보유 포인트</div>
            </motion.div>

            {/* 현금화 가능 포인트 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <button className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full hover:bg-green-500/30 transition-colors">
                  출금
                </button>
              </div>
              <div className="text-2xl font-bold text-green-500 mb-1">
                {(userStats.cashablePoints / 1000).toFixed(1)}만원
              </div>
              <div className="text-sm text-offWhite-500">현금화 가능</div>
            </motion.div>

            {/* 순위 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-600/5 border border-metallicGold-500/30 rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-metallicGold-500/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-metallicGold-500" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  getChangeRate() > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {Math.abs(getChangeRate())}%
                </div>
              </div>
              <div className="text-2xl font-bold text-metallicGold-500 mb-1">
                #{userStats.rank}위
              </div>
              <div className="text-sm text-offWhite-500">전체 순위</div>
            </motion.div>

            {/* 조회수 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  오늘
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {formatNumber(userStats.viewsToday)}
              </div>
              <div className="text-sm text-offWhite-500">조회수</div>
            </motion.div>
          </div>

          {/* 하단 섹션 - 2개 컬럼 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 추천인 제도 + 커뮤니티 활동 */}
            <div className="space-y-6">
              {/* 추천인 제도 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-offWhite-200 flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-metallicGold-500" />
                    친구 초대하기
                  </h2>
                  <div className="text-sm text-green-400 font-bold">
                    +{formatNumber(userStats.referralEarnings)}P 획득
                  </div>
                </div>

                {/* 보상 정보 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-lg font-bold text-blue-500">500P</div>
                    <div className="text-xs text-offWhite-500">친구 가입시</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-lg font-bold text-green-500">20,000P</div>
                    <div className="text-xs text-offWhite-500">강의 결제시</div>
                  </div>
                </div>

                {/* 추천인 코드 */}
                <div className="bg-deepBlack-900/30 rounded-xl p-4 mb-4">
                  <div className="text-xs text-offWhite-500 mb-2">내 추천 링크</div>
                  <div className="flex items-center justify-between">
                    <code className="text-metallicGold-500 font-mono text-sm">{referralCode}</code>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center gap-2 px-3 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 rounded-lg text-xs text-metallicGold-500 transition-colors"
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

                {/* 추천인 통계 */}
                <div className="flex justify-between text-center">
                  <div>
                    <div className="text-lg font-bold text-offWhite-200">{userStats.totalReferrals}</div>
                    <div className="text-xs text-offWhite-500">총 추천인</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">{userStats.paidReferrals}</div>
                    <div className="text-xs text-offWhite-500">결제 완료</div>
                  </div>
                </div>
              </motion.div>

              {/* 커뮤니티 활동 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-metallicGold-500" />
                  나의 활동
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-offWhite-200">{userStats.posts}</div>
                    <div className="text-sm text-offWhite-500">작성글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-offWhite-200">{userStats.comments}</div>
                    <div className="text-sm text-offWhite-500">댓글</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-offWhite-200">{userStats.likes}</div>
                    <div className="text-sm text-offWhite-500">받은 좋아요</div>
                  </div>
                  <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl">
                    <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5" />
                      {userStats.streak}
                    </div>
                    <div className="text-sm text-offWhite-500">연속 출석</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 오른쪽: 실시간 랭킹 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-metallicGold-500" />
                실시간 TOP 랭킹
              </h2>

              <div className="space-y-3">
                {topRankings.map((item) => (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                      item.rank === userStats.rank 
                        ? 'bg-metallicGold-500/10 border border-metallicGold-500/30' 
                        : 'bg-deepBlack-900/30 hover:bg-deepBlack-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                        item.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                        item.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                        'bg-deepBlack-900 text-offWhite-500'
                      }`}>
                        {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                      </div>
                      <div>
                        <div className="font-medium text-offWhite-200 flex items-center gap-2">
                          {item.name}
                          {item.rank === userStats.rank && (
                            <span className="px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                              YOU
                            </span>
                          )}
                          {item.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-offWhite-200">
                        {formatNumber(item.views)}
                      </div>
                      <div className="text-xs text-offWhite-500">조회수</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 내 순위 (TOP 5 밖일 때) */}
              {userStats.rank > 5 && (
                <div className="mt-4 pt-4 border-t border-metallicGold-900/20">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-metallicGold-500/10 border border-metallicGold-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-metallicGold-500/20 flex items-center justify-center font-bold text-metallicGold-500">
                        {userStats.rank}
                      </div>
                      <div>
                        <div className="font-medium text-offWhite-200 flex items-center gap-2">
                          {userStats.name}
                          <span className="px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                            YOU
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-offWhite-200">
                        {formatNumber(userStats.viewsToday)}
                      </div>
                      <div className="text-xs text-offWhite-500">조회수</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push('/sites/register')}
                  className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                >
                  새 사이트 등록하기
                </button>
                <button
                  onClick={() => router.push('/community')}
                  className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-bold hover:bg-deepBlack-600/50 transition-all"
                >
                  커뮤니티 참여하기
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}