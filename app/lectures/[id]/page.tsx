'use client'

import { logger } from '@/lib/logger'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  CheckCircle,
  BookOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Header from '@/components/Header'
import { 
  getLectureWithChapters, 
  checkEnrollment, 
  getLectureProgress,
  updateLectureProgress 
} from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface Chapter {
  id: string
  title: string
  order_index: number
  video_url: string
  duration: number
  description?: string
  resources?: Array<{ title: string; url: string }>
}

interface Lecture {
  id: string
  title: string
  description: string
  instructor_name: string
  category: string
  level: string
  duration: number
  preview_url?: string
  chapters?: Chapter[]
}

interface Progress {
  chapter_id: string
  completed: boolean
  watch_time: number
  last_watched_at: string
}

export default function LectureDetailPage({ params }: { params: { id: string } }) {
  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [progress, setProgress] = useState<Progress[]>([])
  const [_enrollment, setEnrollment] = useState<{ id: string; user_id: string; lecture_id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [_volume, _setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const router = useRouter()
  const { user } = useAuth()

  const fetchLectureDataCallback = useCallback(async () => {
    try {
      // 수강 권한 확인
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      const { data: enrollmentData } = await checkEnrollment(user.id, params.id)

      if (!enrollmentData) {
        router.push(`/lectures/${params.id}/preview`)
        return
      }

      setEnrollment(enrollmentData as { id: string; user_id: string; lecture_id: string })

      // 강의 정보 조회 (챕터 포함)
      const { data: lectureData } = await getLectureWithChapters(params.id)

      if (lectureData) {
        setLecture(lectureData as Lecture)
        
        // 첫 번째 챕터 자동 선택
        const typedLectureData = lectureData as Lecture
        if (typedLectureData.chapters && typedLectureData.chapters.length > 0) {
          setCurrentChapter(typedLectureData.chapters[0] ?? null)
        }
      }

      // 진도 정보 조회
      const { data: progressData } = await getLectureProgress(user.id, params.id)

      if (progressData) {
        setProgress(progressData as Progress[])
      }
    } catch (error) {
      logger.error('Error fetching lecture:', error)
    } finally {
      setLoading(false)
    }
  }, [user, params.id, router])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    void fetchLectureDataCallback()
  }, [user, router, fetchLectureDataCallback])


  const updateProgress = async () => {
    if (!currentChapter ?? !user) {return}

    try {
      const completed = currentTime >= duration * 0.9 // 90% 이상 시청시 완료

      await updateLectureProgress(
        user.id,
        params.id,
        currentChapter.id,
        Math.floor(currentTime),
        completed
      )
    } catch (error) {
      logger.error('Error updating progress:', error)
    }
  }

  const handleChapterSelect = (chapter: Chapter) => {
    // 현재 진도 저장
    void updateProgress()
    setCurrentChapter(chapter)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const handlePreviousChapter = () => {
    if (!lecture?.chapters ?? !currentChapter) {
      return
    }
    const currentIndex = lecture.chapters.findIndex(ch => ch.id === currentChapter.id)
    if (currentIndex > 0) {
      const previousChapter = lecture.chapters[currentIndex - 1]
      if (previousChapter) {
        handleChapterSelect(previousChapter)
      }
    }
  }

  const handleNextChapter = () => {
    if (!lecture?.chapters ?? !currentChapter) {
      return
    }
    const currentIndex = lecture.chapters.findIndex(ch => ch.id === currentChapter.id)
    if (currentIndex < lecture.chapters.length - 1) {
      const nextChapter = lecture.chapters[currentIndex + 1]
      if (nextChapter) {
        handleChapterSelect(nextChapter)
      }
    }
  }

  const isChapterCompleted = (chapterId: string) => {
    return progress.find(p => p.chapter_id === chapterId)?.completed ?? false
  }

  const getChapterProgress = (chapterId: string) => {
    const chapterProgress = progress.find(p => p.chapter_id === chapterId)
    if (!chapterProgress) {return 0}
    const chapter = lecture?.chapters?.find(ch => ch.id === chapterId)
    if (!chapter) {return 0}
    return (chapterProgress.watch_time / chapter.duration) * 100
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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

      <div className="flex pt-16">
        {/* Sidebar - Chapter List */}
        <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-deepBlack-300 border-r border-metallicGold-900/30 overflow-hidden`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-offWhite-200 mb-6">
              {lecture.title}
            </h2>
            <div className="space-y-2">
              {lecture.chapters?.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    currentChapter?.id === chapter.id
                      ? 'bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 border border-metallicGold-500'
                      : 'bg-deepBlack-600 hover:bg-deepBlack-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isChapterCompleted(chapter.id) ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-offWhite-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-offWhite-200 mb-1">
                        {index + 1}. {chapter.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-offWhite-600">
                        <Clock size={14} />
                        <span>{Math.ceil(chapter.duration / 60)}분</span>
                      </div>
                      {getChapterProgress(chapter.id) > 0 && (
                        <div className="mt-2">
                          <div className="h-1 bg-deepBlack-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900"
                              style={{ width: `${getChapterProgress(chapter.id)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            {currentChapter ? (
              <video
                className="w-full h-full"
                src={currentChapter.video_url}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={handleNextChapter}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-offWhite-600">챕터를 선택해주세요</p>
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deepBlack-900/90 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1 bg-deepBlack-600 rounded-full cursor-pointer">
                  <div 
                    className="h-full bg-metallicGold-500 rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-offWhite-600 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePreviousChapter}
                    className="text-offWhite-200 hover:text-metallicGold-500 transition-colors"
                  >
                    <SkipBack size={24} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-metallicGold-500 hover:bg-metallicGold-400 flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? <Pause size={24} className="text-deepBlack-900" /> : <Play size={24} className="text-deepBlack-900 ml-1" />}
                  </button>
                  <button
                    onClick={handleNextChapter}
                    className="text-offWhite-200 hover:text-metallicGold-500 transition-colors"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-offWhite-200 hover:text-metallicGold-500 transition-colors"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <button className="text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="absolute top-4 left-4 p-2 bg-deepBlack-900/80 rounded-lg text-offWhite-200 hover:text-metallicGold-500 transition-colors"
            >
              {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Chapter Info */}
          {currentChapter && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-offWhite-200 mb-4">
                {currentChapter.title}
              </h1>
              {currentChapter.description && (
                <p className="text-offWhite-600 mb-8">
                  {currentChapter.description}
                </p>
              )}

              {/* Resources */}
              {currentChapter.resources && currentChapter.resources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <BookOpen size={24} />
                    학습 자료
                  </h3>
                  <div className="grid gap-4">
                    {currentChapter.resources.map((resource: { title: string; url: string }, index: number) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-deepBlack-600 rounded-lg border border-metallicGold-900/30 hover:border-metallicGold-500 transition-all flex items-center justify-between group"
                      >
                        <span className="text-offWhite-200">{resource.title}</span>
                        <span className="text-metallicGold-500 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h3 className="text-xl font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                  <MessageSquare size={24} />
                  댓글
                </h3>
                <div className="p-6 bg-deepBlack-600 rounded-lg border border-metallicGold-900/30 text-center text-offWhite-600">
                  댓글 기능은 준비 중입니다
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}