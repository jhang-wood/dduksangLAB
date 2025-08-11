'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  X, 
  ChevronDown, 
 
  MessageSquare, 
  Send,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Volume2,
  Maximize,
  User,
  Award
} from 'lucide-react'

// 강의 미리보기 모달
interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  course: {
    id: string
    title: string
    instructor: string
    duration: string
    description: string
    thumbnail?: string
    previewVideo?: string
    curriculum: Array<{
      title: string
      duration: string
      isPreview: boolean
    }>
  }
}

export function PreviewModal({ isOpen, onClose, course }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'curriculum' | 'instructor'>('preview')
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // 비디오 로딩 시뮬레이션
      setTimeout(() => setIsVideoLoaded(true), 1000)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) {return null}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-deepBlack-900 border border-metallicGold-900/30 rounded-2xl overflow-hidden max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-metallicGold-900/20">
            <div>
              <h2 className="text-xl font-bold text-offWhite-200">
                {course.title}
              </h2>
              <p className="text-offWhite-500 mt-1">{course.instructor}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-deepBlack-300 hover:bg-deepBlack-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-offWhite-400" />
            </button>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex border-b border-metallicGold-900/20">
            {[
              { id: 'preview' as const, label: '미리보기', icon: Play },
              { id: 'curriculum' as const, label: '커리큘럼', icon: BookOpen },
              { id: 'instructor' as const, label: '강사소개', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'text-metallicGold-500 border-b-2 border-metallicGold-500' 
                      : 'text-offWhite-500 hover:text-offWhite-300'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                {/* 비디오 플레이어 */}
                <div className="aspect-video bg-deepBlack-600 rounded-xl overflow-hidden relative">
                  {!isVideoLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallicGold-500"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 flex items-center justify-center group cursor-pointer">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-metallicGold-500 rounded-full flex items-center justify-center shadow-2xl"
                      >
                        <Play className="w-8 h-8 text-deepBlack-900 ml-1" />
                      </motion.div>
                      
                      {/* 컨트롤 바 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 text-white">
                          <PlayCircle className="w-5 h-5" />
                          <div className="flex-1 h-1 bg-white/30 rounded-full">
                            <div className="w-1/3 h-full bg-metallicGold-500 rounded-full"></div>
                          </div>
                          <Volume2 className="w-5 h-5" />
                          <Maximize className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 강의 정보 */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-offWhite-400">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-offWhite-400">
                    <Users className="w-4 h-4" />
                    <span>1,247명 수강</span>
                  </div>
                  <div className="flex items-center gap-2 text-offWhite-400">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9 (324 리뷰)</span>
                  </div>
                </div>

                <div className="bg-deepBlack-300/50 rounded-xl p-4">
                  <h4 className="font-semibold text-offWhite-200 mb-2">강의 소개</h4>
                  <p className="text-offWhite-400 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-offWhite-200">강의 커리큘럼</h4>
                <div className="space-y-2">
                  {course.curriculum.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-deepBlack-300/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-deepBlack-600 rounded-lg flex items-center justify-center text-sm text-offWhite-500">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-offWhite-200">
                            {lesson.title}
                          </div>
                          {lesson.isPreview && (
                            <span className="text-xs text-metallicGold-500">
                              무료 미리보기
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-offWhite-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{lesson.duration}</span>
                        {lesson.isPreview && (
                          <Play className="w-4 h-4 text-metallicGold-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-metallicGold-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-offWhite-200 mb-2">
                      {course.instructor}
                    </h4>
                    <p className="text-offWhite-400 mb-4">
                      AI 자동화 전문가, 떡상연구소 대표
                    </p>
                    <div className="flex items-center gap-4 text-sm text-offWhite-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>5개 강의</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>15,000+ 수강생</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>평점 4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-deepBlack-300/50 rounded-xl p-4">
                  <h5 className="font-semibold text-offWhite-200 mb-3">강사 소개</h5>
                  <p className="text-offWhite-400 leading-relaxed">
                    10년 이상의 AI 개발 경험을 바탕으로 실무에서 바로 활용할 수 있는 
                    자동화 솔루션을 개발하고 있습니다. 복잡한 기술을 쉽게 전달하는 
                    것을 목표로 하여 많은 비개발자들이 AI의 힘을 활용할 수 있도록 
                    돕고 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="p-6 border-t border-metallicGold-900/20 bg-deepBlack-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-metallicGold-500">
                  ₩299,000
                </div>
                <div className="text-sm text-offWhite-500">
                  정가 ₩398,000 (25% 할인)
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all">
                지금 수강하기
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// 커리큘럼 상세 펼치기/접기
interface CurriculumSectionProps {
  title: string
  duration: string
  lessons: Array<{
    title: string
    duration: string
    isCompleted?: boolean
    isPreview?: boolean
  }>
  isExpanded?: boolean
  onToggle?: () => void
}

export function CurriculumSection({ 
  title, 
  duration, 
  lessons, 
  isExpanded = false, 
  onToggle 
}: CurriculumSectionProps) {
  return (
    <div className="border border-metallicGold-900/20 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-deepBlack-300/50 hover:bg-deepBlack-300/70 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-metallicGold-500" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-offWhite-200">{title}</h4>
            <p className="text-sm text-offWhite-500">{lessons.length}개 강의 • {duration}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-offWhite-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2 bg-deepBlack-200/30">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-deepBlack-600/30 rounded-lg hover:bg-deepBlack-600/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-2 h-2 bg-offWhite-600 rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        lesson.isCompleted ? 'text-offWhite-300' : 'text-offWhite-200'
                      }`}>
                        {lesson.title}
                      </div>
                      {lesson.isPreview && (
                        <span className="text-xs text-metallicGold-500">무료 미리보기</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-offWhite-500">{lesson.duration}</span>
                    {lesson.isPreview && (
                      <Play className="w-4 h-4 text-metallicGold-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 강사에게 질문하기 버튼/모달
export function AskInstructorButton({ instructorName }: { instructorName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {return}

    setIsSubmitting(true)
    
    // 실제로는 서버로 질문을 전송해야 함
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setMessage('')
    setIsModalOpen(false)
    
    // 성공 알림 표시
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-3 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 hover:border-metallicGold-500/40 hover:bg-deepBlack-300/70 transition-all flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        <span>{instructorName}에게 질문하기</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-deepBlack-900 border border-metallicGold-900/30 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-offWhite-200">
                  강사에게 질문하기
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-deepBlack-300 hover:bg-deepBlack-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-offWhite-400" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 p-3 bg-deepBlack-300/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-metallicGold-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-offWhite-200">
                      {instructorName}
                    </div>
                    <div className="text-sm text-offWhite-500">
                      보통 24시간 내 답변
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="궁금한 점을 자유롭게 질문해주세요. 강의 내용, 실습 관련 질문 등 무엇이든 좋습니다."
                    rows={4}
                    className="w-full p-3 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-lg text-offWhite-200 placeholder-offWhite-500 focus:border-metallicGold-500/40 focus:outline-none resize-none"
                    disabled={isSubmitting}
                  />
                  <div className="text-right text-xs text-offWhite-600 mt-1">
                    {message.length}/500
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-deepBlack-600 text-offWhite-300 rounded-lg hover:bg-deepBlack-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-deepBlack-900"></div>
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        질문 전송
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 무료 체험 콘텐츠 접근
export function FreeTrialContent({ 
  course,
  onStartTrial 
}: {
  course: {
    title: string
    freeContent: {
      videoUrl?: string
      duration: string
      description: string
    }
  }
  onStartTrial: () => void
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
          <Play className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-400">무료 체험</h3>
          <p className="text-sm text-offWhite-500">
            구매 전 강의를 미리 경험해보세요
          </p>
        </div>
      </div>

      <div className="aspect-video bg-deepBlack-600 rounded-xl mb-4 overflow-hidden relative group">
        {!isVideoPlaying ? (
          <div 
            className="w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center cursor-pointer"
            onClick={() => setIsVideoPlaying(true)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
            
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-sm font-medium">무료 미리보기</div>
              <div className="text-xs opacity-80">{course.freeContent.duration}</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-deepBlack-600 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-offWhite-400">동영상 로딩 중...</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-offWhite-400 leading-relaxed">
          {course.freeContent.description}
        </p>

        <button
          onClick={onStartTrial}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          무료 체험 시작하기
        </button>

        <div className="text-center text-xs text-offWhite-600">
          체험 후 마음에 드시면 정식 강의를 수강해보세요
        </div>
      </div>
    </div>
  )
}