'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Trophy, Flame, ChevronUp, ChevronDown, Activity, TrendingUp,
  Award, Target, Zap, Heart, MessageSquare, Clock, CheckCircle2, 
  Circle, Star, Users, Gift, Coins, DollarSign, UserPlus, Share2,
  Copy, Check
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

// 아이콘 매핑 함수
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Eye': return <Eye className="w-4 h-4" />;
    case 'Heart': return <Heart className="w-4 h-4" />;
    case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
    case 'Clock': return <Clock className="w-4 h-4" />;
    case 'Trophy': return <Trophy className="w-4 h-4" />;
    case 'Users': return <Users className="w-4 h-4" />;
    case 'Share2': return <Share2 className="w-4 h-4" />;
    default: return <Circle className="w-4 h-4" />;
  }
};

export default function EnhancedMyPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Mock 데이터
  const [viewCount, setViewCount] = useState(2456);
  const [yesterdayCount] = useState(2222);
  const [rank, setRank] = useState(8);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  // 사용자 통계
  const [userStats] = useState({
    level: 15,
    levelName: '골드',
    levelProgress: 75,
    points: 3420,
    todayPoints: 320,
    cashablePoints: 24500, // 현금화 가능 포인트
    streak: 5,
    totalReferrals: 12,
    paidReferrals: 3, // 결제한 추천인
    totalViews: 3690,
    posts: 12,
    comments: 45,
    likes: 234
  });

  // 미션 데이터
  const [missions] = useState([
    {
      id: '1',
      title: '다른 사이트 방문',
      description: '다른 사람의 사이트 5개 방문하기',
      progress: 3,
      target: 5,
      reward: 10,
      completed: false,
      icon: 'Eye'
    },
    {
      id: '2',
      title: '좋아요 누르기',
      description: '좋아요 10개 누르기',
      progress: 7,
      target: 10,
      reward: 30,
      completed: false,
      icon: 'Heart'
    },
    {
      id: '3',
      title: '댓글 작성',
      description: '댓글 3개 작성하기',
      progress: 1,
      target: 3,
      reward: 50,
      completed: false,
      icon: 'MessageSquare'
    },
    {
      id: '4',
      title: '연속 출석',
      description: '7일 연속 출석',
      progress: 5,
      target: 7,
      reward: 30,
      completed: false,
      icon: 'Clock'
    },
    {
      id: '5',
      title: '추천인 초대',
      description: '친구 1명 초대하기',
      progress: 0,
      target: 1,
      reward: 500,
      completed: false,
      icon: 'Users'
    }
  ]);

  const topRankings = [
    { rank: 1, name: 'AI마스터', views: 15234 },
    { rank: 2, name: '떡상킹', views: 8901 },
    { rank: 3, name: '노코드신', views: 5432 },
    { rank: 4, name: '프로개발자', views: 4321 },
    { rank: 5, name: '코딩천재', views: 3210 }
  ];

  // 추천인 코드
  const referralCode = 'DDUK2025ABC';

  // 5초마다 조회수 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => {
        const increase = Math.floor(Math.random() * 5);
        return prev + increase;
      });
      
      if (Math.random() > 0.8) {
        setRank(prev => Math.max(1, prev + (Math.random() > 0.5 ? -1 : 1)));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 추천인 코드 복사
  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://dduksang.com?ref=${referralCode}`);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 변화율 계산
  const getChangeRate = () => {
    if (yesterdayCount === 0) return 0;
    return Math.round(((viewCount - yesterdayCount) / yesterdayCount) * 100);
  };

  // 레벨 색상 가져오기
  const getLevelColor = (levelName: string) => {
    switch(levelName) {
      case '브론즈': return 'from-orange-600 to-orange-800';
      case '실버': return 'from-gray-400 to-gray-600';
      case '골드': return 'from-yellow-400 to-yellow-600';
      case '플래티넘': return 'from-cyan-400 to-cyan-600';
      case '다이아몬드': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

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
                레벨 & 포인트
              </h2>

              {/* 레벨 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-offWhite-200">Lv.{userStats.level}</span>
                    <span className={`px-2 py-1 bg-gradient-to-r ${getLevelColor(userStats.levelName)} rounded-full text-xs text-white font-medium`}>
                      {userStats.levelName}
                    </span>
                  </div>
                  <span className="text-xs text-offWhite-500">
                    {100 - userStats.levelProgress}% 남음
                  </span>
                </div>
                <div className="w-full h-2 bg-deepBlack-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getLevelColor(userStats.levelName)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.levelProgress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

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
                    <Star className="w-4 h-4 text-blue-500" />
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

            {/* 중간: 일일 미션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-metallicGold-500" />
                일일 미션
              </h2>

              <div className="space-y-3">
                {missions.map((mission, index) => (
                  <div
                    key={mission.id}
                    className={`p-3 rounded-xl border ${
                      mission.completed 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-deepBlack-900/30 border-metallicGold-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          mission.completed ? 'bg-green-500/20' : 'bg-metallicGold-500/20'
                        }`}>
                          {mission.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="text-metallicGold-500">
                              {getIconComponent(mission.icon)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-offWhite-200 text-sm">{mission.title}</div>
                          <div className="text-xs text-offWhite-500">{mission.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          mission.completed ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {mission.completed ? '완료!' : `+${mission.reward}P`}
                        </div>
                      </div>
                    </div>
                    {!mission.completed && (
                      <div className="relative">
                        <div className="w-full h-1.5 bg-deepBlack-900/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 transition-all duration-300"
                            style={{ width: `${Math.min((mission.progress / mission.target) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="absolute -top-1 right-0 text-xs text-offWhite-500">
                          {mission.progress}/{mission.target}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 오른쪽: 추천인 제도 & 랭킹 */}
            <div className="space-y-6">
              {/* 추천인 제도 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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

              {/* 실시간 랭킹 (작게) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-metallicGold-500" />
                  TOP 5
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
          </div>

          {/* 하단: 커뮤니티 활동 (가로형) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-metallicGold-500" />
              커뮤니티 활동
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className="text-2xl font-bold text-offWhite-200 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {userStats.streak}
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
        </div>
      </div>
    </div>
  );
}