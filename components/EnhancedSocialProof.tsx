'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Star,
  Clock,
  DollarSign,
  Trophy,
  Zap,
  CheckCircle,
  Activity,
  Shield
} from 'lucide-react';

// 실시간 활동 데이터 시뮬레이션
const generateRealtimeActivities = () => [
  { type: 'enrollment', user: '김**', time: '방금 전', location: '서울' },
  { type: 'completion', user: '이**', time: '2분 전', achievement: '첫 수익 달성' },
  { type: 'review', user: '박**', time: '5분 전', rating: 5, comment: '진짜 게임체인저네요' },
  { type: 'success', user: '최**', time: '12분 전', amount: '월 150만원' },
  { type: 'enrollment', user: '정**', time: '18분 전', location: '부산' },
  { type: 'completion', user: '한**', time: '25분 전', achievement: '자동화 프로그램 완성' },
];

interface EnhancedSocialProofProps {
  className?: string;
}

export default function EnhancedSocialProof({ className }: EnhancedSocialProofProps) {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities] = useState(generateRealtimeActivities());
  const [liveStats, setLiveStats] = useState({
    activeUsers: 47,
    todayEnrollments: 23,
    totalEarnings: 847200000, // 8.47억원
    currentlyLearning: 156
  });

  // 실시간 활동 로테이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activities.length]);

  // 실시간 통계 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1),
        currentlyLearning: prev.currentlyLearning + Math.floor(Math.random() * 5 - 2),
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="w-4 h-4" />;
      case 'completion': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'success': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'completion': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'review': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'success': return 'text-metallicGold-500 bg-metallicGold-500/20 border-metallicGold-500/30';
      default: return 'text-offWhite-400 bg-deepBlack-700/50 border-deepBlack-600';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    }
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  };

  return (
    <div className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-6">
            지금 이 순간에도 <span className="text-metallicGold-500">성과가 만들어지고</span> 있습니다
          </h2>
          <p className="text-xl text-offWhite-400">
            실시간으로 업데이트되는 수강생들의 성취와 성과를 확인하세요
          </p>
        </motion.div>

        {/* 실시간 통계 대시보드 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              icon: <Activity className="w-6 h-6" />,
              label: '현재 접속자',
              value: liveStats.activeUsers,
              suffix: '명',
              color: 'text-green-400',
              bgColor: 'bg-green-500/10 border-green-500/30'
            },
            {
              icon: <Users className="w-6 h-6" />,
              label: '오늘 수강신청',
              value: liveStats.todayEnrollments,
              suffix: '명',
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/10 border-blue-500/30'
            },
            {
              icon: <DollarSign className="w-6 h-6" />,
              label: '수강생 총 수익',
              value: formatCurrency(liveStats.totalEarnings),
              suffix: '',
              color: 'text-metallicGold-500',
              bgColor: 'bg-metallicGold-500/10 border-metallicGold-500/30'
            },
            {
              icon: <Trophy className="w-6 h-6" />,
              label: '현재 학습중',
              value: liveStats.currentlyLearning,
              suffix: '명',
              color: 'text-purple-400',
              bgColor: 'bg-purple-500/10 border-purple-500/30'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${stat.bgColor} rounded-2xl p-6 border backdrop-blur-sm`}
            >
              <div className={`${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                <motion.span
                  key={typeof stat.value === 'number' ? stat.value : stat.value.toString()}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-lg">{stat.suffix}</span>
              </div>
              <div className="text-sm text-offWhite-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 실시간 활동 피드 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-deepBlack-800/50 rounded-2xl p-6 border border-deepBlack-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-offWhite-200">실시간 활동</h3>
                <p className="text-sm text-offWhite-400">지금 일어나고 있는 일들</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-auto w-3 h-3 bg-green-500 rounded-full"
              />
            </div>

            <div className="space-y-4 h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                {activities.map((activity, index) => (
                  index === currentActivity && (
                    <motion.div
                      key={`${activity.user}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm ${getActivityColor(activity.type)}`}
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-offWhite-200">{activity.user}</span>
                          <span className="text-xs text-offWhite-500">{activity.time}</span>
                          {activity.location && (
                            <span className="text-xs bg-deepBlack-700/50 px-2 py-1 rounded text-offWhite-400">
                              {activity.location}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-offWhite-300">
                          {activity.type === 'enrollment' && '강의에 등록했습니다'}
                          {activity.type === 'completion' && `${activity.achievement}을 완료했습니다`}
                          {activity.type === 'review' && (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(activity.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                                ))}
                              </div>
                              <span>"{activity.comment}"</span>
                            </div>
                          )}
                          {activity.type === 'success' && `${activity.amount} 수익을 달성했습니다`}
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 성과 하이라이트 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* 이번 주 하이라이트 */}
            <div className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-6 border border-metallicGold-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-metallicGold-500" />
                <h3 className="text-xl font-bold text-metallicGold-500">이번 주 하이라이트</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-offWhite-300">신규 성공 사례</span>
                  <span className="text-2xl font-bold text-metallicGold-500">12건</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-offWhite-300">평균 첫 수익 기간</span>
                  <span className="text-2xl font-bold text-green-400">2.3개월</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-offWhite-300">최고 월 수익</span>
                  <span className="text-2xl font-bold text-red-400">780만원</span>
                </div>
              </div>
            </div>

            {/* 커뮤니티 활동 */}
            <div className="bg-deepBlack-800/50 rounded-2xl p-6 border border-deepBlack-700">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-offWhite-200">커뮤니티 현황</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">342</div>
                  <div className="text-sm text-offWhite-400">오늘 질문/답변</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">89</div>
                  <div className="text-sm text-offWhite-400">프로젝트 공유</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">156</div>
                  <div className="text-sm text-offWhite-400">멘토링 세션</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">4.9</div>
                  <div className="text-sm text-offWhite-400">만족도 점수</div>
                </div>
              </div>
            </div>

            {/* 긴급 알림 */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-red-400">⚡ 긴급 알림</h3>
              </div>
              <p className="text-offWhite-200 font-semibold mb-2">
                현재 할인가 마감까지 남은 시간
              </p>
              <div className="flex items-center gap-4 text-2xl font-bold">
                <div className="text-center">
                  <div className="text-red-400">06</div>
                  <div className="text-xs text-offWhite-400">일</div>
                </div>
                <div className="text-red-400">:</div>
                <div className="text-center">
                  <div className="text-red-400">14</div>
                  <div className="text-xs text-offWhite-400">시간</div>
                </div>
                <div className="text-red-400">:</div>
                <div className="text-center">
                  <div className="text-red-400">32</div>
                  <div className="text-xs text-offWhite-400">분</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 추가 신뢰도 지표 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Shield className="w-8 h-8" />,
              title: '100% 환불 보장',
              description: '30일 내 불만족 시 무조건 환불',
              color: 'text-green-400',
              bgColor: 'bg-green-500/10 border-green-500/30'
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: '평생 업데이트',
              description: '새로운 AI 도구 추가 시 무료 제공',
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/10 border-blue-500/30'
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: '1:1 멘토링',
              description: '개인별 맞춤 코칭 및 피드백',
              color: 'text-purple-400',
              bgColor: 'bg-purple-500/10 border-purple-500/30'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              viewport={{ once: true }}
              className={`${benefit.bgColor} rounded-2xl p-6 border backdrop-blur-sm text-center group hover:scale-105 transition-transform`}
            >
              <div className={`${benefit.color} mb-4 flex justify-center group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              <h3 className={`text-lg font-bold ${benefit.color} mb-2`}>
                {benefit.title}
              </h3>
              <p className="text-sm text-offWhite-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}