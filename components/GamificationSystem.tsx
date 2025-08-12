'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Target,
  Award,
  Flame,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';

// 배지 시스템
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function BadgeSystem({ userId: _ }: { userId?: string }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // 더미 배지 데이터 - useMemo로 최적화
  const mockBadges: Badge[] = useMemo(() => [
    {
      id: 'first-steps',
      name: '첫 발걸음',
      description: '첫 강의를 완료했습니다',
      icon: '👶',
      color: 'from-green-500 to-emerald-500',
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      rarity: 'common',
    },
    {
      id: 'ai-explorer',
      name: 'AI 탐험가',
      description: 'AI 관련 강의 3개를 완료했습니다',
      icon: '🤖',
      color: 'from-blue-500 to-cyan-500',
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      progress: 3,
      maxProgress: 3,
      rarity: 'rare',
    },
    {
      id: 'speed-learner',
      name: '스피드 러너',
      description: '하루에 3시간 이상 학습했습니다',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      isUnlocked: false,
      progress: 2.5,
      maxProgress: 3,
      rarity: 'rare',
    },
    {
      id: 'streak-master',
      name: '연속 학습 마스터',
      description: '7일 연속 학습했습니다',
      icon: '🔥',
      color: 'from-red-500 to-pink-500',
      isUnlocked: false,
      progress: 5,
      maxProgress: 7,
      rarity: 'epic',
    },
    {
      id: 'perfectionist',
      name: '완벽주의자',
      description: '모든 퀴즈를 100% 정답으로 통과했습니다',
      icon: '💎',
      color: 'from-purple-500 to-indigo-500',
      isUnlocked: false,
      progress: 8,
      maxProgress: 10,
      rarity: 'legendary',
    },
  ], []);

  useEffect(() => {
    setBadges(mockBadges);

    // 새 배지 획득 시뮬레이션
    const interval = setInterval(() => {
      setBadges(prev =>
        prev.map(badge => {
          if (!badge.isUnlocked && badge.progress && badge.maxProgress && Math.random() > 0.7) {
            const newProgress = Math.min(badge.progress + 0.5, badge.maxProgress);

            if (newProgress >= badge.maxProgress && !badge.isUnlocked) {
              const unlockedBadge = {
                ...badge,
                isUnlocked: true,
                unlockedAt: new Date(),
                progress: badge.maxProgress,
              };

              setNewBadges(prev => [...prev, unlockedBadge]);
              setTimeout(() => {
                setNewBadges(prev => prev.filter(b => b.id !== badge.id));
              }, 5000);

              return unlockedBadge;
            }

            return { ...badge, progress: newProgress };
          }
          return badge;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [mockBadges]);

  const rarityStyles = {
    common: {
      border: 'border-gray-500/30',
      bg: 'from-gray-500/10 to-gray-600/10',
      glow: 'shadow-gray-500/20',
    },
    rare: {
      border: 'border-blue-500/30',
      bg: 'from-blue-500/10 to-blue-600/10',
      glow: 'shadow-blue-500/20',
    },
    epic: {
      border: 'border-purple-500/30',
      bg: 'from-purple-500/10 to-purple-600/10',
      glow: 'shadow-purple-500/20',
    },
    legendary: {
      border: 'border-yellow-500/30',
      bg: 'from-yellow-500/10 to-yellow-600/10',
      glow: 'shadow-yellow-500/20',
    },
  };

  return (
    <div className="space-y-6">
      {/* 새 배지 알림 */}
      <AnimatePresence>
        {newBadges.map(badge => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 backdrop-blur-sm border border-metallicGold-500/40 rounded-2xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                className="text-6xl mb-4"
              >
                {badge.icon}
              </motion.div>

              <h3 className="text-2xl font-bold text-metallicGold-500 mb-2">새 배지 획득!</h3>

              <h4 className="text-xl font-semibold text-offWhite-200 mb-2">{badge.name}</h4>

              <p className="text-offWhite-400">{badge.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 배지 컬렉션 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {badges.map((badge, index) => {
          const style = rarityStyles[badge.rarity];

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative group cursor-pointer
                ${badge.isUnlocked ? '' : 'opacity-60'}
              `}
            >
              <div
                className={`
                bg-gradient-to-br ${style.bg} backdrop-blur-sm 
                border ${style.border} rounded-2xl p-4 
                hover:${style.glow} hover:shadow-xl transition-all duration-300
                ${badge.isUnlocked ? 'hover:scale-105' : 'hover:scale-102'}
              `}
              >
                {/* 잠김/해제 아이콘 */}
                <div className="absolute top-2 right-2">
                  {badge.isUnlocked ? (
                    <Unlock className="w-4 h-4 text-green-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-offWhite-600" />
                  )}
                </div>

                {/* 배지 아이콘 */}
                <div
                  className={`
                  text-4xl mb-3 text-center 
                  ${badge.isUnlocked ? '' : 'grayscale'}
                `}
                >
                  {badge.icon}
                </div>

                {/* 배지 정보 */}
                <h4
                  className={`
                  font-bold text-center mb-2 text-sm
                  ${badge.isUnlocked ? 'text-offWhite-200' : 'text-offWhite-500'}
                `}
                >
                  {badge.name}
                </h4>

                <p
                  className={`
                  text-xs text-center
                  ${badge.isUnlocked ? 'text-offWhite-400' : 'text-offWhite-600'}
                `}
                >
                  {badge.description}
                </p>

                {/* 진행률 바 */}
                {!badge.isUnlocked && badge.progress && badge.maxProgress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-offWhite-600 mb-1">
                      <span>{badge.progress}</span>
                      <span>{badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1 bg-deepBlack-600 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* 획득 일자 */}
                {badge.isUnlocked && badge.unlockedAt && (
                  <div className="mt-2 text-xs text-center text-metallicGold-500">
                    {badge.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* 호버 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-deepBlack-300 text-offWhite-200 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                {badge.isUnlocked ? '획득 완료!' : '진행 중...'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 연속 학습 일수 추적
export function StreakTracker({
  currentStreak = 5,
  bestStreak = 12,
}: {
  currentStreak?: number;
  bestStreak?: number;
}) {
  const [streak] = useState(currentStreak);
  const [showCelebration, setShowCelebration] = useState(false);

  const getStreakColor = (days: number) => {
    if (days >= 30) {
      return 'from-purple-500 to-indigo-500';
    }
    if (days >= 14) {
      return 'from-red-500 to-pink-500';
    }
    if (days >= 7) {
      return 'from-orange-500 to-yellow-500';
    }
    if (days >= 3) {
      return 'from-green-500 to-emerald-500';
    }
    return 'from-gray-500 to-gray-600';
  };

  const getStreakTitle = (days: number) => {
    if (days >= 30) {
      return '레전드 학습자';
    }
    if (days >= 14) {
      return '학습 마스터';
    }
    if (days >= 7) {
      return '꾸준함의 달인';
    }
    if (days >= 3) {
      return '성실한 학습자';
    }
    return '시작하는 학습자';
  };

  useEffect(() => {
    if (streak > currentStreak) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [streak, currentStreak]);

  return (
    <div className="space-y-4">
      {/* 메인 스트릭 표시 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          bg-gradient-to-br ${getStreakColor(streak)} p-6 rounded-2xl text-white text-center relative overflow-hidden
        `}
      >
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        <div className="relative z-10">
          <motion.div
            animate={showCelebration ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            className="text-4xl mb-2"
          >
            🔥
          </motion.div>

          <div className="text-3xl font-bold mb-2">{streak}일</div>

          <div className="text-lg font-semibold mb-1">{getStreakTitle(streak)}</div>

          <div className="text-sm opacity-90">연속 학습 중</div>
        </div>

        {/* 축하 효과 */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: 1,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                  }}
                  transition={{ duration: 2 }}
                  className="absolute text-2xl"
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 스트릭 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-offWhite-200">{bestStreak}</div>
          <div className="text-sm text-offWhite-600">최고 기록</div>
        </div>

        <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4 text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-offWhite-200">
            {Math.ceil((streak / 30) * 100)}%
          </div>
          <div className="text-sm text-offWhite-600">이번 달 완주율</div>
        </div>
      </div>

      {/* 일별 학습 현황 */}
      <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
        <h4 className="font-semibold text-offWhite-200 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          최근 7일 학습 현황
        </h4>

        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, index) => {
            const isStudied = index < streak || Math.random() > 0.3;
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));

            return (
              <div key={index} className="text-center">
                <div className="text-xs text-offWhite-600 mb-1">
                  {date.toLocaleDateString('ko', { weekday: 'short' })}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${
                      isStudied
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-deepBlack-600'
                    }
                  `}
                >
                  {isStudied ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-offWhite-600 rounded-full" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 학습 목표 설정 및 추적
export function LearningGoals() {
  const [goals] = useState([
    {
      id: 'daily-study',
      title: '매일 1시간 학습하기',
      target: 60,
      current: 45,
      unit: '분',
      icon: Clock,
      color: 'blue',
      period: 'daily',
    },
    {
      id: 'weekly-completion',
      title: '주간 강의 3개 완료',
      target: 3,
      current: 2,
      unit: '강의',
      icon: Target,
      color: 'green',
      period: 'weekly',
    },
    {
      id: 'monthly-certificate',
      title: '이번 달 수료증 1개 획득',
      target: 1,
      current: 0,
      unit: '개',
      icon: Award,
      color: 'purple',
      period: 'monthly',
    },
  ]);

  const colorClasses = {
    blue: {
      bg: 'from-blue-500/20 to-blue-900/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      progress: 'from-blue-500 to-blue-600',
    },
    green: {
      bg: 'from-green-500/20 to-green-900/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      progress: 'from-green-500 to-green-600',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-900/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      progress: 'from-purple-500 to-purple-600',
    },
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-offWhite-200 flex items-center gap-2">
        <Target className="w-5 h-5 text-metallicGold-500" />
        학습 목표
      </h3>

      {goals.map((goal, index) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isCompleted = goal.current >= goal.target;
        const IconComponent = goal.icon;
        const colors = colorClasses[goal.color as keyof typeof colorClasses];

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              bg-gradient-to-br ${colors.bg} backdrop-blur-sm 
              border ${colors.border} rounded-xl p-4
              ${isCompleted ? 'ring-2 ring-green-500/30' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center
                `}
                >
                  <IconComponent className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-offWhite-200">{goal.title}</h4>
                  <p className="text-xs text-offWhite-600">
                    {goal.period === 'daily' && '매일'}
                    {goal.period === 'weekly' && '매주'}
                    {goal.period === 'monthly' && '매월'}
                  </p>
                </div>
              </div>

              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-offWhite-400">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span className={colors.text}>{progress.toFixed(0)}%</span>
              </div>

              <div className="w-full h-2 bg-deepBlack-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${colors.progress}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// 성취도 시각화 차트
export function AchievementChart() {
  const [stats] = useState({
    totalHours: 47,
    completedCourses: 3,
    averageScore: 92,
    streakDays: 12,
    badges: 8,
  });

  const achievements = [
    {
      label: '총 학습 시간',
      value: stats.totalHours,
      unit: '시간',
      icon: Clock,
      color: 'blue',
      target: 100,
    },
    {
      label: '완료 강의',
      value: stats.completedCourses,
      unit: '개',
      icon: Trophy,
      color: 'yellow',
      target: 10,
    },
    {
      label: '평균 점수',
      value: stats.averageScore,
      unit: '%',
      icon: Star,
      color: 'green',
      target: 100,
    },
    {
      label: '연속 학습',
      value: stats.streakDays,
      unit: '일',
      icon: Flame,
      color: 'red',
      target: 30,
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-metallicGold-500" />
        학습 성취도
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon;
          const progress = Math.min((achievement.value / achievement.target) * 100, 100);

          return (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`
                  w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[achievement.color as keyof typeof colorClasses]}
                  flex items-center justify-center
                `}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="text-2xl font-bold text-offWhite-200">
                    {achievement.value}
                    <span className="text-sm text-offWhite-600 ml-1">{achievement.unit}</span>
                  </div>
                  <div className="text-sm text-offWhite-500">{achievement.label}</div>
                </div>
              </div>

              <div className="text-xs text-offWhite-600 mb-1 flex justify-between">
                <span>목표까지</span>
                <span>{progress.toFixed(0)}%</span>
              </div>

              <div className="w-full h-2 bg-deepBlack-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${colorClasses[achievement.color as keyof typeof colorClasses]}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 전체 진행률 */}
      <div className="mt-6 pt-6 border-t border-metallicGold-900/20">
        <div className="text-center">
          <div className="text-lg font-semibold text-offWhite-200 mb-2">전체 진행률</div>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-deepBlack-600"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.75 }}
                transition={{ duration: 2 }}
                style={{
                  pathLength: 0.75,
                  strokeDasharray: '251.2 251.2',
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-metallicGold-500">75%</div>
                <div className="text-xs text-offWhite-600">완료</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
