'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Search, Filter, BookOpen, Clock } from 'lucide-react'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import CourseCard from '@/components/CourseCard'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface BookmarkedCourse {
  courseId: string
  courseName: string
  bookmarkedAt: string
  userId: string
}

// 더미 강의 데이터
const allCourses = [
  {
    id: 'ai-agent-master',
    title: 'AI Agent 마스터과정 - 실무 완성편',
    description: '실제 업무에서 활용할 수 있는 AI 에이전트를 구축하고 운영하는 실전 기술을 배웁니다. Claude Code부터 자동화 시스템까지 완벽 마스터.',
    instructor: '떡상연구소',
    duration: '8시간 30분',
    students: 1247,
    rating: 4.9,
    price: 398000,
    discountPrice: 299000,
    level: 'advanced' as const,
    tags: ['AI', 'Claude Code', '자동화', '실무'],
    preview: 'https://example.com/preview1'
  },
  {
    id: 'telegram-coding',
    title: '텔레그램으로 코딩하는 혁신적 방법',
    description: '언제 어디서든 텔레그램만으로 프로그램을 만드는 혁신적인 개발 방법론을 배웁니다.',
    instructor: '떡상연구소',
    duration: '6시간 20분',
    students: 892,
    rating: 4.8,
    price: 298000,
    discountPrice: 199000,
    level: 'intermediate' as const,
    tags: ['텔레그램', '모바일개발', '생산성'],
    preview: 'https://example.com/preview2'
  },
  {
    id: 'no-code-automation',
    title: '노코드로 만드는 자동화 시스템',
    description: '코딩 없이 강력한 자동화 시스템을 구축하는 방법을 단계별로 학습합니다.',
    instructor: '떡상연구소',
    duration: '5시간 45분',
    students: 1534,
    rating: 4.7,
    price: 198000,
    discountPrice: 149000,
    level: 'beginner' as const,
    tags: ['노코드', '자동화', 'Make', 'n8n'],
    preview: 'https://example.com/preview3'
  }
]

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedCourse[]>([])
  const [bookmarkedCourses, setBookmarkedCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'instructor'>('recent')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // 로컬스토리지에서 북마크 데이터 가져오기
    const loadBookmarks = () => {
      try {
        const bookmarkData = JSON.parse(localStorage.getItem('bookmarks') ?? '[]')
        const userBookmarks = bookmarkData.filter((bookmark: BookmarkedCourse) => 
          bookmark.userId === user.id
        )
        
        setBookmarks(userBookmarks)
        
        // 북마크된 강의 정보 매칭
        const matchedCourses = userBookmarks.map((bookmark: BookmarkedCourse) => {
          const course = allCourses.find(c => c.id === bookmark.courseId)
          return course ? { 
            ...course, 
            bookmarkedAt: bookmark.bookmarkedAt 
          } : null
        }).filter(Boolean)
        
        setBookmarkedCourses(matchedCourses)
      } catch (error) {
        console.error('북마크 데이터 로드 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookmarks()

    // 북마크 변경 감지를 위한 이벤트 리스너 (다른 탭에서 변경 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookmarks') {
        loadBookmarks()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user, router])

  // 검색 및 정렬 필터링
  const filteredCourses = bookmarkedCourses
    .filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
        case 'name':
          return a.title.localeCompare(b.title)
        case 'instructor':
          return a.instructor.localeCompare(b.instructor)
        default:
          return 0
      }
    })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="bookmarks" />

        <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
          {/* 페이지 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-2">
                  찜한 강의
                </h1>
                <p className="text-lg text-offWhite-500">
                  관심있는 강의들을 모아서 확인해보세요
                </p>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-metallicGold-500" />
                  <div>
                    <p className="text-sm text-offWhite-600">찜한 강의</p>
                    <p className="text-xl font-bold text-offWhite-200">{bookmarks.length}개</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-offWhite-600">총 학습 시간</p>
                    <p className="text-xl font-bold text-offWhite-200">
                      {bookmarkedCourses.reduce((total, course) => {
                        const hours = parseInt(course.duration?.split('시간')[0] ?? '0')
                        return total + hours
                      }, 0)}시간
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-sm text-offWhite-600">평균 평점</p>
                    <p className="text-xl font-bold text-offWhite-200">
                      {bookmarkedCourses.length > 0 
                        ? (bookmarkedCourses.reduce((sum, course) => sum + course.rating, 0) / bookmarkedCourses.length).toFixed(1)
                        : '0.0'
                      }점
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 검색 및 필터 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-offWhite-500" />
                <input
                  type="text"
                  placeholder="찜한 강의를 검색해보세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 placeholder-offWhite-500 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                />
              </div>

              {/* 정렬 필터 */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-offWhite-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl px-4 py-3 text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                >
                  <option value="recent">최근 찜한 순</option>
                  <option value="name">강의명 순</option>
                  <option value="instructor">강사명 순</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* 강의 목록 */}
          <AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallicGold-500"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                {searchQuery ? (
                  <>
                    <Search className="w-16 h-16 text-offWhite-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-offWhite-400 mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-offWhite-600">
                      다른 키워드로 검색해보세요
                    </p>
                  </>
                ) : (
                  <>
                    <Heart className="w-16 h-16 text-offWhite-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-offWhite-400 mb-2">
                      아직 찜한 강의가 없습니다
                    </h3>
                    <p className="text-offWhite-600 mb-6">
                      관심있는 강의를 찜해보세요
                    </p>
                    <button
                      onClick={() => router.push('/courses')}
                      className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                    >
                      강의 둘러보기
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* 추천 섹션 */}
          {!loading && bookmarkedCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-offWhite-200 mb-8">
                이런 강의는 어떠세요?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses
                  .filter(course => !bookmarkedCourses.some(bc => bc.id === course.id))
                  .slice(0, 3)
                  .map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      variant="default"
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}