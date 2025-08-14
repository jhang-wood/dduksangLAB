'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Heart, MessageSquare, Award, Target, 
  Zap, Trophy, Flame, ChevronUp, ChevronDown, Clock,
  CheckCircle2, Circle, Star, Activity, Loader2, Plus
} from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useMyPageData } from '@/lib/hooks/useMyPageData';

// 아이콘 매핑 함수
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Eye': return <Eye className="w-4 h-4" />;
    case 'Heart': return <Heart className="w-4 h-4" />;
    case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
    case 'Clock': return <Clock className="w-4 h-4" />;
    case 'Trophy': return <Trophy className="w-4 h-4" />;
    case 'Plus': return <Plus className="w-4 h-4" />;
    case 'User': return <Star className="w-4 h-4" />;
    default: return <Circle className="w-4 h-4" />;
  }
};

export default function MyPageClient() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    userSites, 
    missions, 
    userStats, 
    rankings, 
    loading, 
    error,
    updateMissionProgress 
  } = useMyPageData();

  // 레벨 색상 가져오기
  const getLevelColor = (colorScheme?: string) => {
    return colorScheme || 'from-gray-400 to-gray-600';
  };

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 변화율 계산
  const getChangeRate = (today: number, yesterday: number) => {
    if (yesterday === 0) return 0;
    return Math.round(((today - yesterday) / yesterday) * 100);
  };

  // 레벨 진행도 계산
  const getLevelProgress = () => {
    if (!userStats?.levelInfo) return 0;
    const { min_experience, max_experience } = userStats.levelInfo;
    const range = max_experience - min_experience;
    const progress = userStats.experience_points - min_experience;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  if (!user) {
    React.useEffect(() => {
      router.push('/auth/login');
    }, [router]);
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden flex items-center justify-center">
        <NeuralNetworkBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-metallicGold-500 animate-spin" />
          <p className="text-offWhite-400">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="relative z-10">
          <Header currentPage="mypage" />
          <div className="container mx-auto max-w-6xl px-4 pt-24 pb-20">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-offWhite-200 transition-colors"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 기본값 사용
  const sites = userSites || [];
  const missionList = missions || [];
  const stats = userStats || {
    level: 1,
    experience_points: 0,
    total_points: 0,
    points_today: 0,
    streak_days: 0,
    total_views_received: 0,
    total_posts: 0,
    total_comments: 0,
    total_likes_received: 0
  };
  const rankingList = rankings || [];

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        <div className="container mx-auto max-w-6xl px-4 pt-24 pb-20">
          {/* 내 사이트 실시간 현황 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-metallicGold-500" />
              실시간 사이트 현황
            </h1>

            {sites.length > 0 ? (
              <>
                {/* 베스트 사이트 하이라이트 */}
                <div className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-metallicGold-500" />
                        <span className="text-sm text-metallicGold-500 font-medium">내 베스트 사이트</span>
                        {sites[0].is_hot && (
                          <span className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-500 flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-offWhite-200 mb-1">{sites[0].name}</h2>
                      <p className="text-sm text-offWhite-500">{sites[0].url}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-metallicGold-500">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={sites[0].views_today}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {formatNumber(sites[0].views_today)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-offWhite-500">
                        <Eye className="w-4 h-4" />
                        오늘 조회수
                      </div>
                    </div>
                  </div>

                  {/* 통계 바 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-offWhite-500 mb-1">어제 대비</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-offWhite-200">
                          {formatNumber(sites[0].views_today - sites[0].views_yesterday)}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${
                          sites[0].views_today > sites[0].views_yesterday ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {sites[0].views_today > sites[0].views_yesterday ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          {Math.abs(getChangeRate(sites[0].views_today, sites[0].views_yesterday))}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-offWhite-500 mb-1">이번주 누적</div>
                      <div className="text-lg font-bold text-offWhite-200">
                        {formatNumber(sites[0].views_week)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-offWhite-500 mb-1">전체 순위</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-offWhite-200">#{sites[0].rank_today || '-'}위</span>
                        {sites[0].rank_change && sites[0].rank_change > 0 && (
                          <span className="text-sm text-green-500 flex items-center gap-1">
                            <ChevronUp className="w-3 h-3" />
                            {sites[0].rank_change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 나머지 사이트 목록 */}
                <div className="grid gap-4">
                  {sites.slice(1).map((site, index) => (
                    <motion.div
                      key={site.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-offWhite-200 mb-1">{site.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-offWhite-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {formatNumber(site.views_today)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {site.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {site.comments}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-offWhite-400">#{site.rank_today || '-'}위</div>
                          {site.rank_change !== 0 && (
                            <div className={`text-xs flex items-center gap-1 ${
                              site.rank_change > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {site.rank_change > 0 ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                              {Math.abs(site.rank_change)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-8 text-center">
                <p className="text-offWhite-400 mb-4">아직 등록된 사이트가 없습니다</p>
                <button
                  onClick={() => router.push('/sites/register')}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                >
                  첫 사이트 등록하기
                </button>
              </div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 왼쪽: 미션 & 포인트 */}
            <div className="space-y-6">
              {/* 포인트 & 레벨 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-metallicGold-500" />
                  내 레벨 & 포인트
                </h2>

                {/* 레벨 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-offWhite-200">Lv.{stats.level}</span>
                      {stats.levelInfo && (
                        <span className={`px-3 py-1 bg-gradient-to-r ${getLevelColor(stats.levelInfo.color_scheme)} rounded-full text-xs text-white font-medium`}>
                          {stats.levelInfo.name}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-offWhite-500">
                      다음 레벨까지 {100 - getLevelProgress()}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-deepBlack-900/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getLevelColor(stats.levelInfo?.color_scheme)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getLevelProgress()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* 포인트 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-deepBlack-900/30 rounded-xl p-3">
                    <div className="text-sm text-offWhite-500 mb-1">보유 포인트</div>
                    <div className="text-xl font-bold text-metallicGold-500">{formatNumber(stats.total_points)}P</div>
                  </div>
                  <div className="bg-deepBlack-900/30 rounded-xl p-3">
                    <div className="text-sm text-offWhite-500 mb-1">오늘 획득</div>
                    <div className="text-xl font-bold text-green-500">+{stats.points_today}P</div>
                  </div>
                </div>

                {/* 연속 출석 */}
                <div className="mt-4 flex items-center justify-center gap-2 text-offWhite-400">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">연속 출석 {stats.streak_days}일째</span>
                </div>
              </motion.div>

              {/* 일일 미션 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-metallicGold-500" />
                  일일 미션
                </h2>

                <div className="space-y-3">
                  {missionList.map((item, index) => {
                    const mission = item.mission;
                    if (!mission) return null;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={`p-3 rounded-xl border ${
                          item.is_completed 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-deepBlack-900/30 border-metallicGold-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.is_completed ? 'bg-green-500/20' : 'bg-metallicGold-500/20'
                            }`}>
                              {item.is_completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className={item.is_completed ? 'text-green-500' : 'text-metallicGold-500'}>
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
                              item.is_completed ? 'text-green-500' : 'text-metallicGold-500'
                            }`}>
                              {item.is_completed ? '완료!' : `+${mission.reward_points}P`}
                            </div>
                          </div>
                        </div>
                        {!item.is_completed && (
                          <div className="relative">
                            <div className="w-full h-2 bg-deepBlack-900/50 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((item.progress / mission.target_value) * 100, 100)}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <div className="absolute -top-1 right-0 text-xs text-offWhite-500">
                              {item.progress}/{mission.target_value}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* 오른쪽: 랭킹 & 활동 */}
            <div className="space-y-6">
              {/* 실시간 랭킹 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-metallicGold-500" />
                  오늘의 조회수 랭킹
                </h2>

                <div className="space-y-3">
                  {rankingList.map((user, index) => (
                    <motion.div
                      key={`${user.rank}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        user.isMe 
                          ? 'bg-metallicGold-500/10 border border-metallicGold-500/30' 
                          : 'bg-deepBlack-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                          user.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                          user.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-deepBlack-900 text-offWhite-500'
                        }`}>
                          {user.rank === 1 ? '🥇' :
                           user.rank === 2 ? '🥈' :
                           user.rank === 3 ? '🥉' :
                           user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-offWhite-200 flex items-center gap-2">
                            {user.name}
                            {user.isMe && (
                              <span className="px-2 py-0.5 bg-metallicGold-500/20 rounded text-xs text-metallicGold-500">
                                YOU
                              </span>
                            )}
                          </div>
                          {user.siteName && (
                            <div className="text-xs text-offWhite-500">{user.siteName}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-offWhite-200">{formatNumber(user.views)}</div>
                        <div className="text-xs text-offWhite-500">조회</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 커뮤니티 활동 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-metallicGold-500" />
                  커뮤니티 활동
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-offWhite-200">{stats.total_posts}</div>
                    <div className="text-sm text-offWhite-500">작성글</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-offWhite-200">{stats.total_comments}</div>
                    <div className="text-sm text-offWhite-500">댓글</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-offWhite-200">{stats.total_likes_received}</div>
                    <div className="text-sm text-offWhite-500">받은 좋아요</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-metallicGold-900/20">
                  <button
                    onClick={() => router.push('/sites/register')}
                    className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    새 사이트 등록하기
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