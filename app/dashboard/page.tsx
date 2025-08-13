'use client';

// 개인 페이지는 CSR + 동적 렌더링 (인증 필요)
export const dynamic = 'force-dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/stores/auth-store';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { BookOpen, Trophy, Clock, Target, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // 더미 데이터 (실제로는 Supabase에서 가져와야 함)
  const stats = {
    totalCourses: 1,
    completedCourses: 0,
    inProgress: 1,
    totalHours: 8,
    completedHours: 0,
    streak: 0,
  };

  const currentCourses = [
    {
      id: 'ai-agent-master',
      title: 'AI Agent 마스터과정',
      progress: 0,
      totalLessons: 5,
      completedLessons: 0,
      nextLesson: 'AI 시대의 게임체인저가 되는 법',
    },
  ];

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="dashboard" />

        <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-4">
              안녕하세요, {user.email?.split('@')[0]}님! 👋
            </h1>
            <p className="text-lg text-offWhite-500">오늘도 AI 마스터가 되는 여정을 함께 해요</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-metallicGold-500" />
                </div>
                <span className="text-sm text-offWhite-600">전체 강의</span>
              </div>
              <p className="text-3xl font-bold text-offWhite-200">{stats.totalCourses}</p>
              <p className="text-sm text-offWhite-500 mt-2">수강 중 {stats.inProgress}개</p>
            </div>

            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-900/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm text-offWhite-600">완료율</span>
              </div>
              <p className="text-3xl font-bold text-offWhite-200">
                {stats.totalCourses > 0
                  ? Math.round((stats.completedCourses / stats.totalCourses) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-offWhite-500 mt-2">완료 {stats.completedCourses}개</p>
            </div>

            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-900/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm text-offWhite-600">학습 시간</span>
              </div>
              <p className="text-3xl font-bold text-offWhite-200">{stats.completedHours}시간</p>
              <p className="text-sm text-offWhite-500 mt-2">총 {stats.totalHours}시간 중</p>
            </div>
          </motion.div>

          {/* Current Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-offWhite-200 mb-6">진행 중인 강의</h2>

            {currentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-offWhite-200 mb-2">{course.title}</h3>
                    <p className="text-sm text-offWhite-500">다음 강의: {course.nextLesson}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/lectures/${course.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center gap-2"
                  >
                    이어서 학습
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-offWhite-600 mb-2">
                    <span>
                      {course.completedLessons} / {course.totalLessons} 강의 완료
                    </span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-deepBlack-600/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Motivation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30 rounded-2xl p-8 text-center"
          >
            <Target className="w-16 h-16 text-metallicGold-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-offWhite-200 mb-4">
              AI 마스터가 되는 첫 걸음을 내딛으셨네요!
            </h2>
            <p className="text-lg text-offWhite-400 mb-6">
              매일 조금씩, 꾸준히 학습하면 곧 AI의 지배자가 될 수 있습니다.
              <br />
              오늘도 화이팅! 💪
            </p>
            <button
              onClick={() => router.push('/lectures')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
            >
              모든 강의 보기
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
