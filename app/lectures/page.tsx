'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PlayCircle, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  ShoppingCart,
  Check,
  Sparkles,
  Code2,
  MessageSquare,
  Zap,
  Brain,
  Rocket,
  Trophy,
  Crown,
  ArrowRight,
  Gift,
  CheckCircle2
} from 'lucide-react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { PaymentButton } from '@/hooks/usePayment'

// AI Agent 마스터과정 데이터
const masterCourse = {
  id: 'ai-agent-master',
  title: 'AI Agent 마스터과정',
  subtitle: 'AI 300만원짜리 강의, 더 이상 돈 주고 듣지 마세요',
  description: 'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법을 알려드립니다.',
  instructor_name: '떡상연구소 대표',
  duration: 480, // 8시간
  price: 990000,
  originalPrice: 1800000,
  discount: 45,
  category: 'AI',
  level: 'all',
  preview_url: '',
  thumbnail_url: '',
  studentCount: 1247,
  rating: 4.9,
  features: [
    '최정상 1%의 AI Toolset',
    '시공간 제약 없는 텔레그램 코딩',
    '자동화를 자동화하는 메타 자동화',
    '비개발자를 위한 최소 지식 원칙'
  ],
  benefits: [
    'Claude Code + Super Claude 세팅',
    '텔레그램 바이블 코딩 시스템',
    '메타 자동화 프로그램 생성',
    'EXE 파일 자동 생성 시스템',
    '1:1 맞춤형 멘토링',
    '평생 업데이트 제공'
  ],
  modules: [
    { title: 'AI 시대의 게임체인저가 되는 법', duration: '60분' },
    { title: 'Claude Code + Super Claude 완벽 세팅', duration: '90분' },
    { title: '텔레그램 바이블 코딩 마스터', duration: '120분' },
    { title: '메타 자동화 시스템 구축', duration: '90분' },
    { title: '실전 프로젝트: 나만의 AI 비즈니스', duration: '120분' }
  ]
}

export default function LecturesPage() {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    checkEnrollment()
  }, [user])

  const checkEnrollment = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      // Check if user is enrolled in AI Agent Master course
      const { data } = await supabase
        .from('lecture_enrollments')
        .select('lecture_id')
        .eq('user_id', user.id)
        .eq('lecture_id', masterCourse.id)
        .single()
      
      if (data) {
        setIsEnrolled(true)
      }
    } catch (error) {
      // User not enrolled
      setIsEnrolled(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    // Navigate to course preview/purchase page
    router.push(`/lectures/${masterCourse.id}/preview`)
  }

  const handleContinueLearning = () => {
    router.push(`/lectures/${masterCourse.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="lectures" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border border-metallicGold-500/30 mb-8">
              <Sparkles className="w-5 h-5 text-metallicGold-500" />
              <span className="text-metallicGold-500 font-semibold">GRAND OPEN SPECIAL</span>
              <Sparkles className="w-5 h-5 text-metallicGold-500" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
              <span className="block text-offWhite-200 mb-4">{masterCourse.title}</span>
              <span className="block text-3xl md:text-4xl bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 bg-clip-text text-transparent">
                {masterCourse.subtitle}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-offWhite-500 max-w-4xl mx-auto leading-relaxed">
              {masterCourse.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Course Display */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Course Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Price Card */}
              <div className="bg-deepBlack-300 rounded-3xl p-8 border border-metallicGold-900/30 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-offWhite-600 line-through text-lg">₩{masterCourse.originalPrice.toLocaleString()}</p>
                    <p className="text-4xl font-bold text-metallicGold-500">₩{masterCourse.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                      {masterCourse.discount}% 할인
                    </div>
                  </div>
                </div>

                {isEnrolled ? (
                  <button
                    onClick={handleContinueLearning}
                    className="w-full px-8 py-4 bg-green-500/20 text-green-400 rounded-xl font-bold text-lg border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    학습 계속하기
                  </button>
                ) : user ? (
                  <PaymentButton
                    lectureId={masterCourse.id}
                    price={masterCourse.price}
                    className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    <ShoppingCart size={20} className="inline mr-2" />
                    지금 수강 신청하기
                  </PaymentButton>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    로그인하고 수강 신청하기
                  </button>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-metallicGold-900/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-metallicGold-500 mb-1">
                      <Star className="fill-current" size={16} />
                      <span className="font-bold">{masterCourse.rating}</span>
                    </div>
                    <p className="text-sm text-offWhite-600">평점</p>
                  </div>
                  <div className="text-center">
                    <p className="text-metallicGold-500 font-bold mb-1">{masterCourse.studentCount.toLocaleString()}+</p>
                    <p className="text-sm text-offWhite-600">수강생</p>
                  </div>
                  <div className="text-center">
                    <p className="text-metallicGold-500 font-bold mb-1">{masterCourse.duration / 60}시간</p>
                    <p className="text-sm text-offWhite-600">총 강의</p>
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-offWhite-200 mb-6">이런 분들께 추천합니다</h3>
                <div className="space-y-4">
                  {[
                    "비싼 강의료에 지친 직장인",
                    "AI로 자동화 비즈니스를 시작하고 싶은 사업가",
                    "코딩 없이 프로그램을 만들고 싶은 비개발자",
                    "시간과 장소에 구애받지 않고 일하고 싶은 프리랜서"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-offWhite-300 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Course Curriculum */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-offWhite-200 mb-6">무엇을 배우나요?</h3>
              
              {/* Key Features */}
              <div className="grid gap-6 mb-10">
                {masterCourse.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 hover:border-metallicGold-500/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-deepBlack-900 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-metallicGold-500 mb-2">{feature}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Course Modules */}
              <h3 className="text-2xl font-bold text-offWhite-200 mb-6">커리큘럼</h3>
              <div className="space-y-4">
                {masterCourse.modules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-deepBlack-600/50 rounded-xl p-5 border border-metallicGold-900/20 hover:border-metallicGold-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="text-metallicGold-500" size={20} />
                        <h4 className="font-medium text-offWhite-200">{module.title}</h4>
                      </div>
                      <span className="text-sm text-offWhite-600">{module.duration}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-10 bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-2xl p-8 border border-metallicGold-500/30">
                <h3 className="text-xl font-bold text-metallicGold-500 mb-4 flex items-center gap-2">
                  <Gift size={24} />
                  수강생 전용 혜택
                </h3>
                <ul className="space-y-3">
                  {masterCourse.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-offWhite-300">
                      <span className="text-metallicGold-500 mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center bg-deepBlack-300/30 backdrop-blur-sm rounded-3xl p-12 border border-metallicGold-900/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-6">
              지금이 가장 저렴한 가격입니다
            </h2>
            <p className="text-xl text-offWhite-500 mb-8">
              그랜드 오픈 기념 <span className="text-metallicGold-500 font-bold">45% 할인</span>은 선착순 100명 한정입니다
            </p>
            {!isEnrolled && (
              <button
                onClick={handleEnrollClick}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
              >
                <Rocket size={24} />
                지금 바로 시작하기
                <ArrowRight size={20} />
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}