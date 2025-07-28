'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  Lock,
  ShoppingCart,
  ChevronDown,
  Award,
  Target,
  BarChart,
  ArrowLeft
} from 'lucide-react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { PaymentButton } from '@/hooks/usePayment'
import { logger } from '@/lib/logger'

interface Chapter {
  id: string
  title: string
  order_index: number
  duration: number
  is_preview?: boolean
}

interface Lecture {
  id: string
  title: string
  description: string
  instructor_name: string
  category: string
  level: string
  duration: number
  price: number
  preview_url?: string
  thumbnail_url?: string
  tags?: string[]
  objectives?: string[]
  requirements?: string[]
  target_audience?: string[]
  chapters?: Chapter[]
  student_count?: number
  rating?: number
}

const levelLabels = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급'
}

export default function LecturePreviewPage({ params }: { params: { id: string } }) {
  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [_isEnrolled, _setIsEnrolled] = useState(false)
  const [showAllChapters, setShowAllChapters] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchLectureData()
  }, [params.id, user])

  const fetchLectureData = async () => {
    try {
      // 수강 여부 확인
      if (user) {
        const { data: enrollment } = await supabase
          .from('lecture_enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('lecture_id', params.id)
          .eq('status', 'active')
          .single()

        if (enrollment) {
          // 이미 수강중이면 강의 페이지로 리다이렉트
          router.push(`/lectures/${params.id}`)
          return
        }
      }

      // 강의 정보 조회
      const { data: lectureData } = await supabase
        .from('lectures')
        .select(`
          *,
          chapters:lecture_chapters(
            id,
            title,
            order_index,
            duration,
            is_preview
          )
        `)
        .eq('id', params.id)
        .single()

      if (lectureData) {
        setLecture({
          ...lectureData,
          chapters: lectureData.chapters?.sort((a: any, b: any) => a.order_index - b.order_index) || []
        })
      }
    } catch (error) {
      logger.error('Error fetching lecture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
  }

  const totalDuration = lecture?.chapters?.reduce((sum, ch) => sum + ch.duration, 0) || 0
  const totalChapters = lecture?.chapters?.length || 0
  const previewChapters = lecture?.chapters?.filter(ch => ch.is_preview) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="lectures" />
        <div className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl font-bold text-offWhite-200">강의를 찾을 수 없습니다</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="lectures" />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-offWhite-600 hover:text-metallicGold-500 mb-6"
          >
            <ArrowLeft size={20} />
            뒤로 가기
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-metallicGold-500/20 text-metallicGold-500 rounded-full text-sm font-medium">
                  {lecture.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lecture.level === "beginner" ? "bg-green-500/20 text-green-400" :
                  lecture.level === "intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {levelLabels[lecture.level as keyof typeof levelLabels]}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-offWhite-200 mb-6">
                {lecture.title}
              </h1>

              <p className="text-xl text-offWhite-600 mb-8">
                {lecture.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8 text-offWhite-600">
                <div className="flex items-center gap-2">
                  <Award className="text-metallicGold-500" size={20} />
                  <span>{lecture.instructor_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{Math.ceil(totalDuration / 60)}분</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>{totalChapters}개 챕터</span>
                </div>
                {lecture.student_count && lecture.student_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <span>{lecture.student_count.toLocaleString()}명 수강</span>
                  </div>
                )}
                {lecture.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-current" size={20} />
                    <span>{lecture.rating}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {lecture.tags && lecture.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {lecture.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-deepBlack-600 text-offWhite-500 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & Enroll Button */}
              <div className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-offWhite-600 mb-2">수강료</p>
                    <p className="text-4xl font-bold text-metallicGold-500">
                      ₩{lecture.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {user ? (
                  <PaymentButton
                    lectureId={lecture.id}
                    price={lecture.price}
                    className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    <ShoppingCart size={20} className="inline mr-2" />
                    지금 수강 신청하기
                  </PaymentButton>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    로그인하고 수강 신청하기
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Column - Preview Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="sticky top-24">
                <div className="relative aspect-video bg-deepBlack-600 rounded-xl overflow-hidden">
                  {lecture.preview_url ? (
                    <video
                      className="w-full h-full object-cover"
                      controls
                      poster={lecture.thumbnail_url}
                    >
                      <source src={lecture.preview_url} type="video/mp4" />
                    </video>
                  ) : lecture.thumbnail_url ? (
                    <>
                      <img
                        src={lecture.thumbnail_url}
                        alt={lecture.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-20 h-20 bg-metallicGold-500 rounded-full flex items-center justify-center">
                          <Play className="text-deepBlack-900 ml-1" size={32} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 flex items-center justify-center">
                      <div className="w-20 h-20 bg-metallicGold-500 rounded-full flex items-center justify-center">
                        <Play className="text-deepBlack-900 ml-1" size={32} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Learning Objectives */}
              {lecture.objectives && lecture.objectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                    <Target className="text-metallicGold-500" size={28} />
                    학습 목표
                  </h2>
                  <div className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30">
                    <ul className="space-y-3">
                      {lecture.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                          <span className="text-offWhite-300">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                  <BookOpen className="text-metallicGold-500" size={28} />
                  커리큘럼
                </h2>
                <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-offWhite-600">
                        총 {totalChapters}개 챕터 • {Math.ceil(totalDuration / 60)}분
                      </p>
                      {previewChapters.length > 0 && (
                        <span className="text-sm text-metallicGold-500">
                          {previewChapters.length}개 미리보기 가능
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-metallicGold-900/30">
                    {(showAllChapters ? lecture.chapters : lecture.chapters?.slice(0, 5))?.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className={`p-4 ${chapter.is_preview ? 'hover:bg-deepBlack-600 cursor-pointer' : ''} transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {chapter.is_preview ? (
                              <Play className="text-metallicGold-500" size={20} />
                            ) : (
                              <Lock className="text-offWhite-600" size={20} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-offWhite-200">
                              {index + 1}. {chapter.title}
                            </h3>
                          </div>
                          <div className="text-sm text-offWhite-600">
                            {Math.ceil(chapter.duration / 60)}분
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalChapters > 5 && (
                    <button
                      onClick={() => setShowAllChapters(!showAllChapters)}
                      className="w-full p-4 bg-deepBlack-600 hover:bg-deepBlack-900 transition-colors flex items-center justify-center gap-2 text-metallicGold-500"
                    >
                      {showAllChapters ? '접기' : `${totalChapters - 5}개 더 보기`}
                      <ChevronDown className={`transition-transform ${showAllChapters ? 'rotate-180' : ''}`} size={20} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Requirements */}
              {lecture.requirements && lecture.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                    <BarChart className="text-metallicGold-500" size={28} />
                    수강 전 필요사항
                  </h2>
                  <div className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30">
                    <ul className="space-y-3">
                      {lecture.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-metallicGold-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-offWhite-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Instructor */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30"
                >
                  <h3 className="text-xl font-bold text-offWhite-200 mb-4">강사 소개</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 flex items-center justify-center">
                      <Award className="text-deepBlack-900" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-offWhite-200">{lecture.instructor_name}</h4>
                      <p className="text-sm text-offWhite-600">전문 강사</p>
                    </div>
                  </div>
                </motion.div>

                {/* Target Audience */}
                {lecture.target_audience && lecture.target_audience.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30"
                  >
                    <h3 className="text-xl font-bold text-offWhite-200 mb-4">이런 분들께 추천해요</h3>
                    <ul className="space-y-3">
                      {lecture.target_audience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Users className="text-metallicGold-500 mt-1 flex-shrink-0" size={16} />
                          <span className="text-sm text-offWhite-300">{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}