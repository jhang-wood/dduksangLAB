'use client'

import { motion } from 'framer-motion'
import { 
  Star, 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  PlayCircle,
  Subtitles,
  MessageSquare,
  Infinity as InfinityIcon,
  Calendar,
  Zap,
  Eye,
  Target
} from 'lucide-react'

// 할인/가격 정보 시각적 강조 컴포넌트
export const PricingCard = ({ 
  originalPrice, 
  discountPrice, 
  discountPercent, 
  isLimited = false,
  dDay = null,
  className = ""
}: {
  originalPrice: number
  discountPrice: number
  discountPercent: number
  isLimited?: boolean
  dDay?: number | null
  className?: string
}) => {
  return (
    <motion.div 
      className={`relative bg-gradient-to-br from-deepBlack-600/80 to-deepBlack-800/80 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-500/20 ${className}`}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255, 215, 0, 0.4)' }}
      transition={{ duration: 0.3 }}
    >
      {/* 긴급성 배지 */}
      {(isLimited ?? dDay !== null) && (
        <motion.div 
          className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {dDay !== null ? `D-${dDay}` : '한정특가'}
        </motion.div>
      )}

      {/* 할인율 배지 */}
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 text-deepBlack-900 px-4 py-2 rounded-full font-bold text-lg"
          whileHover={{ scale: 1.1 }}
        >
          {discountPercent}% 할인
        </motion.div>
      </div>

      {/* 가격 정보 */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-metallicGold-500">
            ₩{discountPrice.toLocaleString()}
          </span>
          <span className="text-lg text-offWhite-600 line-through">
            ₩{originalPrice.toLocaleString()}
          </span>
        </div>
        <div className="text-green-400 font-semibold text-sm">
          <TrendingUp className="inline w-4 h-4 mr-1" />
          {(originalPrice - discountPrice).toLocaleString()}원 절약
        </div>
      </div>

      {/* 할인 남은 시간 (옵션) */}
      {dDay !== null && (
        <motion.div 
          className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30"
          animate={{ backgroundColor: ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center gap-2 text-red-400 font-bold">
            <Calendar className="w-4 h-4" />
            <span>특가 마감까지 {dDay}일</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// 진행률 표시 시스템
export const ProgressBar = ({ 
  progress, 
  total, 
  showPercentage = true,
  size = 'md',
  className = ""
}: {
  progress: number
  total: number
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) => {
  const percentage = Math.round((progress / total) * 100)
  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-offWhite-300 text-sm">학습 진도</span>
          <span className="text-metallicGold-500 font-bold text-sm">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-deepBlack-600 rounded-full ${heightClass} overflow-hidden`}>
        <motion.div
          className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 h-full rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* 진행률 애니메이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
      <div className="flex justify-between items-center mt-1 text-xs text-offWhite-500">
        <span>{progress}강 완료</span>
        <span>총 {total}강</span>
      </div>
    </div>
  )
}

// 학습 현황 대시보드
export const LearningDashboard = ({
  completedLessons,
  totalLessons,
  studyTime,
  certificates,
  className = ""
}: {
  completedLessons: number
  totalLessons: number
  studyTime: number // 분 단위
  certificates: number
  className?: string
}) => {
  const stats = [
    { 
      icon: PlayCircle, 
      label: '완료한 강의', 
      value: completedLessons, 
      total: totalLessons,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    { 
      icon: Clock, 
      label: '총 학습시간', 
      value: Math.floor(studyTime / 60), 
      unit: '시간',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    { 
      icon: Award, 
      label: '획득한 수료증', 
      value: certificates, 
      unit: '개',
      color: 'text-metallicGold-500',
      bgColor: 'bg-metallicGold-500/20'
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`${stat.bgColor} rounded-2xl p-6 border border-offWhite-800/20`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} border border-current/30 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
                {stat.total && (
                  <span className="text-offWhite-500 text-sm">
                    / {stat.total}
                  </span>
                )}
                {stat.unit && (
                  <span className="text-offWhite-500 text-sm">
                    {stat.unit}
                  </span>
                )}
              </div>
              <p className="text-offWhite-400 text-sm">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// 강의 상태 아이콘 시스템
export const CourseStatusIcons = ({
  isOnline = true,
  hasSubtitles = true,
  hasCommunity = true,
  hasCertificate = true,
  isUnlimited = true,
  className = ""
}: {
  isOnline?: boolean
  hasSubtitles?: boolean
  hasCommunity?: boolean
  hasCertificate?: boolean
  isUnlimited?: boolean
  className?: string
}) => {
  const features = [
    { 
      icon: PlayCircle, 
      label: '온라인 강의', 
      active: isOnline, 
      color: 'text-green-400' 
    },
    { 
      icon: Subtitles, 
      label: '자막 지원', 
      active: hasSubtitles, 
      color: 'text-blue-400' 
    },
    { 
      icon: MessageSquare, 
      label: '커뮤니티 접근', 
      active: hasCommunity, 
      color: 'text-purple-400' 
    },
    { 
      icon: Award, 
      label: '수료증 발급', 
      active: hasCertificate, 
      color: 'text-metallicGold-500' 
    },
    { 
      icon: InfinityIcon, 
      label: '무제한 수강', 
      active: isUnlimited, 
      color: 'text-cyan-400' 
    }
  ]

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
            feature.active 
              ? `${feature.color} border-current/30 bg-current/10` 
              : 'text-offWhite-600 border-offWhite-800/30'
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <feature.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{feature.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

// 소셜 증명 요소
export const SocialProof = ({
  studentCount,
  rating,
  reviewCount,
  liveStudents = 0,
  completionRate,
  className = ""
}: {
  studentCount: number
  rating: number
  reviewCount: number
  liveStudents?: number
  completionRate: number
  className?: string
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-offWhite-700'
        }`}
      />
    ))
  }

  return (
    <div className={`bg-deepBlack-600/50 rounded-2xl p-6 border border-metallicGold-500/20 ${className}`}>
      <h3 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-metallicGold-500" />
        수강생들의 선택
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* 수강생 수 */}
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-1 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">
              {studentCount.toLocaleString()}
            </span>
          </motion.div>
          <p className="text-sm text-offWhite-500">총 수강생</p>
        </div>

        {/* 평점 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {renderStars(rating)}
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg font-bold text-yellow-400">{rating}</span>
            <span className="text-sm text-offWhite-500">({reviewCount})</span>
          </div>
        </div>

        {/* 실시간 수강 현황 */}
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-1 mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-2xl font-bold text-green-400">
              {liveStudents}
            </span>
          </motion.div>
          <p className="text-sm text-offWhite-500">실시간 수강</p>
        </div>

        {/* 완주율 */}
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-1 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-5 h-5 text-metallicGold-500" />
            <span className="text-2xl font-bold text-metallicGold-500">
              {completionRate}%
            </span>
          </motion.div>
          <p className="text-sm text-offWhite-500">완주율</p>
        </div>
      </div>

      {/* 추가 통계 */}
      <div className="mt-6 pt-6 border-t border-offWhite-800/20">
        <div className="flex justify-center items-center gap-8 text-sm text-offWhite-400">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>지난주 {Math.floor(studentCount * 0.1)}명 신규 등록</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{Math.floor(studentCount * completionRate / 100)}명 완주</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 할인 카운트다운 타이머 (기존 CountdownTimer 확장)
export const DiscountCountdown = ({
  discountPercent,
  className = ""
}: {
  endDate?: Date
  discountPercent: number
  className?: string
}) => {
  // CountdownTimer 로직을 여기서 구현하거나 import할 수 있습니다
  // 간단한 예시로 구현
  
  return (
    <motion.div 
      className={`bg-gradient-to-r from-red-500/20 to-red-900/20 rounded-2xl p-6 border border-red-500/50 ${className}`}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          {discountPercent}% 특가 마감임박
        </h3>
        <div className="text-3xl font-bold text-offWhite-200 mb-2">
          남은 시간
        </div>
        {/* 실제 카운트다운 로직은 CountdownTimer 컴포넌트 활용 */}
        <div className="text-red-400 text-sm">
          기회를 놓치지 마세요!
        </div>
      </div>
    </motion.div>
  )
}

// 강의별 학습 완료 상태 표시
export const LessonStatus = ({
  lessons,
  currentLesson = 0,
  className = ""
}: {
  lessons: Array<{ id: number, title: string, duration: string, completed: boolean }>
  currentLesson?: number
  className?: string
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {lessons.map((lesson, index) => (
        <motion.div
          key={lesson.id}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            lesson.completed
              ? 'bg-green-400/10 border-green-400/30'
              : index === currentLesson
              ? 'bg-metallicGold-500/10 border-metallicGold-500/30'
              : 'bg-deepBlack-600/50 border-offWhite-800/20 hover:border-metallicGold-500/30'
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex-shrink-0">
            {lesson.completed ? (
              <div className="w-8 h-8 bg-green-400/20 border-2 border-green-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400 fill-current" />
              </div>
            ) : index === currentLesson ? (
              <div className="w-8 h-8 bg-metallicGold-500/20 border-2 border-metallicGold-500 rounded-full flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-metallicGold-500" />
              </div>
            ) : (
              <div className="w-8 h-8 border-2 border-offWhite-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-offWhite-500">{index + 1}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              lesson.completed ? 'text-green-400' : 'text-offWhite-200'
            }`}>
              {lesson.title}
            </h4>
            <p className="text-sm text-offWhite-500">{lesson.duration}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}