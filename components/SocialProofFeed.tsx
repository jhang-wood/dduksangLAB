'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Play, Star, Trophy } from 'lucide-react'

interface SocialActivity {
  id: string
  type: 'enrollment' | 'completion' | 'review' | 'achievement'
  user: string
  course: string
  timestamp: Date
  rating?: number
  message?: string
}

export default function SocialProofFeed() {
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // 더미 활동 데이터
  const mockActivities: SocialActivity[] = [
    {
      id: '1',
      type: 'enrollment',
      user: '김**님',
      course: 'AI Agent 마스터과정',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      type: 'completion',
      user: '이**님',
      course: '텔레그램으로 코딩하는 혁신적 방법',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      type: 'review',
      user: '박**님',
      course: '노코드로 만드는 자동화 시스템',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      rating: 5,
      message: '정말 실무에 바로 적용할 수 있는 내용이에요!'
    },
    {
      id: '4',
      type: 'achievement',
      user: '최**님',
      course: 'AI Agent 마스터과정',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: '5',
      type: 'enrollment',
      user: '정**님',
      course: '노코드로 만드는 자동화 시스템',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    }
  ]

  useEffect(() => {
    // 실제로는 서버에서 실시간 데이터를 가져와야 함
    setActivities(mockActivities)

    // 새로운 활동 시뮬레이션
    const interval = setInterval(() => {
      const newActivity: SocialActivity = {
        id: Date.now().toString(),
        type: ['enrollment', 'completion', 'review'][Math.floor(Math.random() * 3)] as any,
        user: ['김**님', '이**님', '박**님', '최**님', '정**님'][Math.floor(Math.random() * 5)] ?? '익명님',
        course: [
          'AI Agent 마스터과정',
          '텔레그램으로 코딩하는 혁신적 방법',
          '노코드로 만드는 자동화 시스템'
        ][Math.floor(Math.random() * 3)] ?? 'AI Agent 마스터과정',
        timestamp: new Date(),
        rating: Math.floor(Math.random() * 2) + 4, // 4-5점
        message: '정말 유용한 강의입니다!'
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 30000) // 30초마다 새 활동 추가

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // 3초마다 다음 활동으로 전환
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [activities.length])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <Users className="w-4 h-4 text-green-400" />
      case 'completion':
        return <Trophy className="w-4 h-4 text-yellow-400" />
      case 'review':
        return <Star className="w-4 h-4 text-blue-400" />
      case 'achievement':
        return <Trophy className="w-4 h-4 text-purple-400" />
      default:
        return <Play className="w-4 h-4 text-metallicGold-500" />
    }
  }

  const getActivityMessage = (activity: SocialActivity) => {
    switch (activity.type) {
      case 'enrollment':
        return `수강을 시작했습니다`
      case 'completion':
        return `강의를 완주했습니다`
      case 'review':
        return `⭐ ${activity.rating}점 리뷰를 남겼습니다`
      case 'achievement':
        return `수료증을 획득했습니다`
      default:
        return `활동했습니다`
    }
  }

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)
    
    if (diffInSeconds < 60) {return '방금 전'}
    if (diffInSeconds < 3600) {return `${Math.floor(diffInSeconds / 60)}분 전`}
    if (diffInSeconds < 86400) {return `${Math.floor(diffInSeconds / 3600)}시간 전`}
    return `${Math.floor(diffInSeconds / 86400)}일 전`
  }

  if (activities.length === 0) {return null}

  return (
    <div className="fixed bottom-8 left-8 z-50 max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={activities[currentIndex]?.id}
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="bg-deepBlack-300/90 backdrop-blur-sm border border-metallicGold-900/30 rounded-xl p-4 shadow-2xl"
        >
          {activities[currentIndex] && (
            <div className="flex items-start gap-3">
              {/* 아이콘 */}
              <div className="flex-shrink-0 w-8 h-8 bg-deepBlack-600/50 rounded-lg flex items-center justify-center">
                {getActivityIcon(activities[currentIndex].type)}
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-offWhite-200 text-sm">
                    {activities[currentIndex].user}
                  </span>
                  <span className="text-xs text-offWhite-600">
                    {getTimeAgo(activities[currentIndex].timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-offWhite-400 mb-1">
                  <span className="text-metallicGold-500 font-medium">
                    {activities[currentIndex].course}
                  </span>
                  {' '}
                  {getActivityMessage(activities[currentIndex])}
                </p>

                {activities[currentIndex].message && (
                  <p className="text-xs text-offWhite-500 italic">
                    "{activities[currentIndex].message}"
                  </p>
                )}
              </div>

              {/* 닫기 버튼 (선택사항) */}
              <button 
                onClick={() => setActivities(prev => prev.filter((_, i) => i !== currentIndex))}
                className="text-offWhite-600 hover:text-offWhite-400 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 진행 표시기 */}
      <div className="flex justify-center mt-2 gap-1">
        {activities.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex % 5 
                ? 'bg-metallicGold-500' 
                : 'bg-deepBlack-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// 홈페이지나 강의 페이지에서 사용할 수 있는 통계 컴포넌트
export function LiveStats() {
  const [stats, setStats] = useState({
    activeUsers: 1247,
    completedToday: 23,
    totalEnrollments: 15893
  })

  useEffect(() => {
    // 실시간 통계 업데이트 시뮬레이션
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        completedToday: prev.completedToday + Math.floor(Math.random() * 2),
        totalEnrollments: prev.totalEnrollments + Math.floor(Math.random() * 5)
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-4 p-6 bg-deepBlack-300/30 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-offWhite-600">현재 접속</span>
        </div>
        <p className="text-xl font-bold text-green-400">{stats.activeUsers.toLocaleString()}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-offWhite-600 mb-2">오늘 완료</p>
        <p className="text-xl font-bold text-yellow-400">{stats.completedToday}</p>
      </div>

      <div className="text-center">
        <p className="text-xs text-offWhite-600 mb-2">총 수강생</p>
        <p className="text-xl font-bold text-metallicGold-500">{stats.totalEnrollments.toLocaleString()}</p>
      </div>
    </motion.div>
  )
}

// 인기 강의 배지 시스템
export function PopularBadge({ 
  isHot = false, 
  isBestseller = false, 
  isNew = false 
}: {
  isHot?: boolean
  isBestseller?: boolean
  isNew?: boolean
}) {
  if (!isHot && !isBestseller && !isNew) {return null}

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1">
      {isHot && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"
        >
          🔥 HOT
        </motion.div>
      )}
      
      {isBestseller && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-deepBlack-900 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"
        >
          👑 베스트셀러
        </motion.div>
      )}
      
      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1"
        >
          ✨ NEW
        </motion.div>
      )}
    </div>
  )
}