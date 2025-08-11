'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  ShoppingCart,
  Award,
  Target,
  BarChart,
  ArrowLeft,
  Hash,
} from 'lucide-react'
import Header from '@/components/Header'
import CurriculumAccordion from '@/components/CurriculumAccordion'
import TagSystem from '@/components/TagSystem'
import RecommendationSlider from '@/components/RecommendationSlider'
import CourseStructuredData, { BreadcrumbStructuredData } from '@/components/StructuredData'
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
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  objectives?: string[]
}

interface Section {
  id: string
  title: string
  description?: string
  chapters: Chapter[]
  total_duration: number
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

interface Tag {
  id: string
  name: string
  category: 'language' | 'framework' | 'level' | 'topic' | 'industry'
  count: number
  trending?: boolean
}

interface RecommendedLecture {
  id: string
  title: string
  instructor_name: string
  thumbnail_url?: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  price: number
  rating?: number
  student_count?: number
  tags?: string[]
  reason: 'same_category' | 'same_instructor' | 'similar_level' | 'trending' | 'ai_recommended'
  discount?: {
    original_price: number
    discount_percentage: number
  }
}

const levelLabels = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급'
}

// 비개발자 타겟 강의 데이터 (Claude Code CLI 모든 것)
const COURSE_DATA = {
  title: "비개발자도 클로드코드CLI 한개로 모든것을 다한다!",
  subtitle: "3개월차 비개발자가 알려주는 진짜 실무 자동화",
  originalPrice: 299000,
  currentPrice: 149000,
  discountPercent: 50,
  launchSpecial: true,
  instructor: "떡상연구소",
  duration: "6시간 30분",
  studentCount: 0, // 신규 강의
  parts: [
    {
      title: "Part 1: 기초 환경 구축 (비개발자도 30분만에)",
      chapters: [
        { title: "MCP 서버 설치와 설정 (화면 공유로 따라하기)", duration: "25분" },
        { title: "Git 자동화 시스템 세팅 (클릭 한번으로)", duration: "20분" },
        { title: "첫 번째 자동화 성공 (성취감 UP!)", duration: "15분" }
      ]
    },
    {
      title: "Part 2: 서브에이전트와 협업하기 (마법같은 경험)",
      chapters: [
        { title: "서브에이전트가 뭔가요? (쉬운 설명)", duration: "20분" },
        { title: "여러 에이전트에게 동시에 일시키기", duration: "35분" },
        { title: "실제 프로젝트를 에이전트들이 완성하는 과정", duration: "40분" }
      ]
    },
    {
      title: "Part 3: 실무 자동화 워크플로우 (바로 써먹기)",
      chapters: [
        { title: "n8n으로 업무 자동화 (노코드)", duration: "45분" },
        { title: "Langchain 활용법 (개념부터 실습까지)", duration: "50분" },
        { title: "RAG 시스템 구축 (나만의 AI 비서 만들기)", duration: "40분" }
      ]
    }
  ],
  features: [
    "✅ 코딩 몰라도 OK! 화면공유로 따라하기만 하면 됩니다",
    "✅ 실제 3개월차 비개발자의 시행착오 노하우 모두 공개",
    "✅ 바로 써먹을 수 있는 템플릿과 설정파일 제공",
    "✅ 막힐 때마다 도움받을 수 있는 커뮤니티 제공",
    "✅ 업데이트될 때마다 새로운 내용 무료 추가"
  ],
  targetAudience: [
    "개발은 모르지만 AI로 뭔가 해보고 싶은 분",
    "반복 업무에 지쳐서 자동화하고 싶은 직장인",
    "ChatGPT보다 더 강력한 도구를 찾는 분",
    "혼자 끙끙대지 말고 제대로 배우고 싶은 분"
  ]
}

export default function LecturePreviewClient({ params }: { params: { id: string } }) {
  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [_isEnrolled, _setIsEnrolled] = useState(false)
  const [showStickyButton, setShowStickyButton] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [recommendedLectures, setRecommendedLectures] = useState<RecommendedLecture[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isSpecialCourse, setIsSpecialCourse] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const fetchLectureData = useCallback(async () => {
    try {
      // 특별 강의 ID 체크 (claude-code-nondev)
      if (params.id === 'claude-code-nondev') {
        setIsSpecialCourse(true)
        // 특별 강의는 하드코딩된 데이터 사용
        setLecture({
          id: params.id,
          title: COURSE_DATA.title,
          description: COURSE_DATA.subtitle,
          instructor_name: COURSE_DATA.instructor,
          category: "AI 자동화",
          level: "beginner",
          duration: 390, // 6시간 30분
          price: COURSE_DATA.currentPrice,
          student_count: COURSE_DATA.studentCount,
          rating: 5.0,
          tags: ["Claude Code", "AI 자동화", "비개발자", "MCP", "n8n", "RAG"],
          objectives: COURSE_DATA.features,
          target_audience: COURSE_DATA.targetAudience,
          chapters: COURSE_DATA.parts.flatMap((part, partIndex) => 
            part.chapters.map((chapter, chapterIndex) => ({
              id: `${partIndex}-${chapterIndex}`,
              title: chapter.title,
              order_index: partIndex * 10 + chapterIndex,
              duration: parseInt(chapter.duration.replace('분', '')),
              is_preview: partIndex === 0 && chapterIndex === 0 // 첫 번째 챕터만 미리보기
            }))
          )
        } as Lecture)
        setLoading(false)
        return
      }

      // 일반 강의 처리
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
          router.push(`/lectures/${params.id}`)
          return
        }
      }

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
          chapters: lectureData.chapters?.sort((a: Chapter, b: Chapter) => a.order_index - b.order_index) ?? []
        } as Lecture)
        
        if (lectureData.tags && Array.isArray(lectureData.tags)) {
          const tags: Tag[] = lectureData.tags.map((tag: string, index: number) => ({
            id: `tag-${index}`,
            name: tag,
            category: getTagCategory(tag),
            count: Math.floor(Math.random() * 100) + 10,
            trending: Math.random() > 0.7
          }))
          setAvailableTags(tags)
        }
      }
      
      await fetchRecommendedLectures()
    } catch (error) {
      logger.error('Error fetching lecture:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, user, router])
  
  const getTagCategory = (tag: string): Tag['category'] => {
    const languageKeywords = ['javascript', 'python', 'react', 'vue', 'angular', 'typescript', 'java', 'c++', 'html', 'css']
    const frameworkKeywords = ['nextjs', 'express', 'django', 'spring', 'flutter', 'react-native']
    const levelKeywords = ['초급', '중급', '고급', 'beginner', 'intermediate', 'advanced']
    const industryKeywords = ['ai', 'ml', '머신러닝', '인공지능', '블록체인', 'iot', '클라우드']
    
    const lowerTag = tag.toLowerCase()
    
    if (languageKeywords.some(keyword => lowerTag.includes(keyword))) {return 'language'}
    if (frameworkKeywords.some(keyword => lowerTag.includes(keyword))) {return 'framework'}
    if (levelKeywords.some(keyword => lowerTag.includes(keyword))) {return 'level'}
    if (industryKeywords.some(keyword => lowerTag.includes(keyword))) {return 'industry'}
    
    return 'topic'
  }
  
  const fetchRecommendedLectures = async () => {
    try {
      const { data: lecturesData } = await supabase
        .from('lectures')
        .select('*')
        .neq('id', params.id)
        .limit(12)
        
      if (lecturesData) {
        const recommended: RecommendedLecture[] = lecturesData.map((lec: any) => ({
          id: lec.id,
          title: lec.title,
          instructor_name: lec.instructor_name,
          thumbnail_url: lec.thumbnail_url,
          category: lec.category,
          level: lec.level as 'beginner' | 'intermediate' | 'advanced',
          duration: lec.duration,
          price: lec.price,
          rating: lec.rating,
          student_count: lec.student_count,
          tags: lec.tags,
          reason: getRecommendationReason(lec, lecture),
          ...(Math.random() > 0.7 ? {
            discount: {
              original_price: lec.price,
              discount_percentage: Math.floor(Math.random() * 30) + 10
            }
          } : {})
        }))
        setRecommendedLectures(recommended)
      }
    } catch (error) {
      logger.error('Error fetching recommended lectures:', error)
    }
  }
  
  const getRecommendationReason = (recommended: any, current: Lecture | null): RecommendedLecture['reason'] => {
    if (!current) {return 'trending'}
    
    if (recommended.category === current.category) {return 'same_category'}
    if (recommended.instructor_name === current.instructor_name) {return 'same_instructor'}
    if (recommended.level === current.level) {return 'similar_level'}
    if (Math.random() > 0.5) {return 'ai_recommended'}
    
    return 'trending'
  }

  useEffect(() => {
    void fetchLectureData()
  }, [fetchLectureData])

  // Sticky button scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldShow = scrollY > 800 // Show after scrolling 800px
      setShowStickyButton(shouldShow)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
  }
  
  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId])
    }
  }
  
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId))
  }
  
  const handleTagSearch = (query: string) => {
    // 태그 검색 로직 추가 가능
  }
  
  const handleRecommendedLectureClick = (lectureId: string) => {
    router.push(`/lectures/${lectureId}/preview`)
  }
  
  // 섹션 데이터 준비 (커리큘럼 아코디언용)
  const curriculumSections: Section[] = lecture?.chapters ? [
    {
      id: 'main-curriculum',
      title: '메인 커리큘럼',
      description: '이 강의의 핵심 내용을 단계별로 학습합니다.',
      chapters: lecture.chapters.map(ch => ({
        ...ch,
        difficulty: ch.difficulty ?? (
          ch.order_index <= 2 ? 'beginner' : 
          ch.order_index <= 5 ? 'intermediate' : 'advanced'
        ),
        description: ch.description ?? `${ch.title}에 대한 상세한 설명과 실습을 통해 학습합니다.`,
        objectives: ch.objectives ?? [
          `${ch.title}의 기본 개념 이해`,
          '실제 프로젝트에 적용하기',
          '베스트 프렉티스 습득'
        ]
      })),
      total_duration: lecture.chapters.reduce((sum, ch) => sum + ch.duration, 0)
    }
  ] : []

  const totalDuration = lecture?.chapters?.reduce((sum, ch) => sum + ch.duration, 0) ?? 0
  const totalChapters = lecture?.chapters?.length ?? 0

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
      
      {/* Structured Data */}
      {lecture && (
        <>
          <CourseStructuredData course={lecture} />
          <BreadcrumbStructuredData 
            items={[
              { name: '홈', url: 'https://dduksanglab.com' },
              { name: '강의', url: 'https://dduksanglab.com/lectures' },
              { name: lecture.title, url: `https://dduksanglab.com/lectures/${lecture.id}/preview` }
            ]}
          />
        </>
      )}

      {/* FastCampus Style Hero Section */}
      <section className="relative pt-16 pb-8 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 마켓 헤시태그 */}
              {isSpecialCourse && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {['#비개발자', '#ClaudeCode', '#3개월차노하우', '#실무자동화'].map((hashtag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-metallicGold-500/20 text-metallicGold-400 rounded-full text-sm font-medium border border-metallicGold-500/30"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              )}

              {/* 메인 제목 */}
              <h1 className="text-4xl lg:text-6xl font-bold text-offWhite-100 mb-6 leading-tight">
                {isSpecialCourse ? (
                  <>
                    <span className="text-metallicGold-500">비개발자도</span> 클로드코드CLI<br />
                    <span className="text-2xl lg:text-4xl text-offWhite-300">한개로 모든것을 다한다!</span>
                  </>
                ) : (
                  lecture.title
                )}
              </h1>

              {/* 서브 타이틀 */}
              <p className="text-xl lg:text-2xl text-offWhite-400 mb-12 leading-relaxed">
                {isSpecialCourse ? COURSE_DATA.subtitle : lecture.description}
              </p>

              {/* 가격 정보 - FastCampus 스타일 */}
              <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-3xl p-8 border border-metallicGold-900/30 max-w-md mx-auto mb-8">
                {isSpecialCourse && COURSE_DATA.launchSpecial && (
                  <div className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-400 text-deepBlack-900 px-4 py-2 rounded-full text-sm font-bold mb-4 inline-block">
                    특별 런칭 할인 {COURSE_DATA.discountPercent}%
                  </div>
                )}
                
                <div className="text-center">
                  {isSpecialCourse ? (
                    <>
                      <div className="text-offWhite-500 text-lg line-through mb-2">
                        정가 {COURSE_DATA.originalPrice.toLocaleString()}원
                      </div>
                      <div className="text-4xl font-bold text-metallicGold-500 mb-4">
                        {COURSE_DATA.currentPrice.toLocaleString()}원
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-metallicGold-500 mb-4">
                      {lecture.price.toLocaleString()}원
                    </div>
                  )}
                  
                  {/* CTA 버튼 */}
                  {user ? (
                    <PaymentButton
                      lectureId={lecture.id}
                      price={isSpecialCourse ? COURSE_DATA.currentPrice : lecture.price}
                      className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-2xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      수강권 선택하기
                    </PaymentButton>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-2xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      수강권 선택하기
                    </button>
                  )}
                </div>
              </div>

              {/* 강의 정보 */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-offWhite-400">
                <div className="flex items-center gap-2">
                  <Clock className="text-metallicGold-500" size={20} />
                  <span>{isSpecialCourse ? COURSE_DATA.duration : `${Math.ceil(totalDuration / 60)}분`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-metallicGold-500" size={20} />
                  <span>{totalChapters}개 챕터</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-metallicGold-500" size={20} />
                  <span>{lecture.instructor_name}</span>
                </div>
                {lecture.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 fill-current" size={20} />
                    <span>{lecture.rating}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 이 강의를 들으면 얻을 수 있는 것들 */}
      <section className="py-16 bg-gradient-to-b from-deepBlack-900 to-deepBlack-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              이 강의를 들으면 <span className="text-metallicGold-500">얻을 수 있는 것들</span>
            </h2>
            <p className="text-lg text-offWhite-400">
              3개월차 비개발자가 실제로 경험한 변화를 공유합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lecture.objectives?.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/20 hover:border-metallicGold-500/40 transition-all hover:transform hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-metallicGold-500" size={24} />
                  </div>
                  <div>
                    <p className="text-offWhite-200 font-medium leading-relaxed">
                      {objective}
                    </p>
                  </div>
                </div>
              </motion.div>
            )) || []}
          </div>
        </div>
      </section>

      {/* 커리큘럼 섹션 - FastCampus 방식 */}
      <section className="py-16 bg-gradient-to-b from-deepBlack-800 to-deepBlack-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              <span className="text-metallicGold-500">단계별</span> 학습 커리큘럼
            </h2>
            <p className="text-lg text-offWhite-400">
              비개발자도 쉬게 따라할 수 있도록 3단계로 구성했습니다
            </p>
          </motion.div>

          {isSpecialCourse && COURSE_DATA.parts.map((part, partIndex) => (
            <motion.div
              key={partIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: partIndex * 0.2 }}
              className="mb-8 bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl border border-metallicGold-900/20 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 p-6 border-b border-metallicGold-900/20">
                <h3 className="text-xl lg:text-2xl font-bold text-offWhite-100 mb-2">
                  {part.title}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {part.chapters.map((chapter, chapterIndex) => (
                  <div
                    key={chapterIndex}
                    className="flex items-center justify-between p-4 bg-deepBlack-600/30 rounded-xl hover:bg-deepBlack-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-lg flex items-center justify-center text-sm font-bold text-metallicGold-400">
                        {chapterIndex + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-offWhite-200">
                          {chapter.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-offWhite-500">
                      <Clock className="text-metallicGold-500" size={16} />
                      <span className="text-sm">{chapter.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 이런 분들께 추천 */}
      <section className="py-16 bg-gradient-to-b from-deepBlack-700 to-deepBlack-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              <span className="text-metallicGold-500">이런 분들께</span> 추천합니다
            </h2>
            <p className="text-lg text-offWhite-400">
              진짜 비개발자도 따라할 수 있게 만들었습니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {lecture.target_audience?.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/20 hover:border-metallicGold-500/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-metallicGold-500" size={20} />
                  </div>
                  <div>
                    <p className="text-offWhite-200 font-medium leading-relaxed">
                      {audience}
                    </p>
                  </div>
                </div>
              </motion.div>
            )) || []}
          </div>
        </div>
      </section>

      {/* 강사 소개 섹션 */}
      <section className="py-16 bg-deepBlack-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              강사 소개
            </h2>
            <p className="text-lg text-offWhite-400">
              3개월차 비개발자가 알려주는 진짜 이야기
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-900/20 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Award className="text-deepBlack-900" size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-offWhite-100 mb-2">
                {lecture.instructor_name}
              </h3>
              
              <p className="text-metallicGold-400 font-medium mb-6">
                3개월차 비개발자 · 떡상연구소 운영자
              </p>
              
              <div className="bg-deepBlack-600/30 rounded-xl p-6 text-left">
                <p className="text-offWhite-300 leading-relaxed">
                  "저도 3개월 전까지는 코딩을 몰랐습니다. 그래서 비개발자 입장에서 어디서 막히고, 뭘 모르는지 너무 잘 알아요. 
                  어려운 개발 용어 대신 일상 언어로 설명드리고, 실제로 써먹을 수 있는 내용만 엄선해서 알려드립니다."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 이미지 플레이스홀더 섹션들 */}
      <section className="py-16 bg-gradient-to-b from-deepBlack-900 to-deepBlack-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              실제 화면으로 보는 <span className="text-metallicGold-500">수강 예시</span>
            </h2>
            <p className="text-lg text-offWhite-400">
              비개발자도 따라할 수 있도록 화면 공유로 진행합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* 예시 이미지 플레이스홀더 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/20"
            >
              <div className="aspect-video bg-deepBlack-600/50 rounded-xl mb-4 flex items-center justify-center border border-metallicGold-900/30">
                <div className="text-center">
                  <Play className="w-16 h-16 text-metallicGold-500 mx-auto mb-2" />
                  <p className="text-offWhite-400 text-sm">
                    MCP 서버 설치 시연 영상<br />
                    (화면 공유로 따라하기)
                  </p>
                </div>
              </div>
              <h4 className="font-bold text-offWhite-200 mb-2">
                1단계: 기초 환경 세팅
              </h4>
              <p className="text-offWhite-400 text-sm">
                코딩 몰라도 OK! 클릭만 하면 됩니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/20"
            >
              <div className="aspect-video bg-deepBlack-600/50 rounded-xl mb-4 flex items-center justify-center border border-metallicGold-900/30">
                <div className="text-center">
                  <Play className="w-16 h-16 text-metallicGold-500 mx-auto mb-2" />
                  <p className="text-offWhite-400 text-sm">
                    에이전트 협업 데모<br />
                    (마법같은 자동화 경험)
                  </p>
                </div>
              </div>
              <h4 className="font-bold text-offWhite-200 mb-2">
                2단계: AI 에이전트 활용
              </h4>
              <p className="text-offWhite-400 text-sm">
                여러 에이전트가 동시에 일하는 모습을 볼 수 있어요.
              </p>
            </motion.div>
          </div>

          {/* GIF 플레이스홀더 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-deepBlack-300/30 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-900/20 text-center"
          >
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-deepBlack-600/50 rounded-xl mb-6 flex items-center justify-center border border-metallicGold-900/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-12 h-12 text-metallicGold-500" />
                  </div>
                  <p className="text-offWhite-400">
                    전체 워크플로우 데모 영상<br />
                    (처음부터 끝까지 한 번에)
                  </p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-offWhite-200 mb-3">
                3단계: 실무 자동화 완성 과정
              </h4>
              <p className="text-offWhite-400">
                n8n + RAG + Langchain을 활용한 완전한 자동화 시스템을 처음부터 끝까지 함께 만들어보세요.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 마지막 CTA 섹션 - FastCampus 스타일 */}
      <section className="py-20 bg-gradient-to-b from-deepBlack-800 to-deepBlack-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-offWhite-100 mb-4">
              지금 시작하면
            </h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-metallicGold-500 mb-8">
              이미 미래에 한 발짝 다가간 것입니다
            </h3>
            
            <div className="bg-deepBlack-300/30 backdrop-blur-sm rounded-3xl p-8 border border-metallicGold-900/30 mb-8">
              {isSpecialCourse && COURSE_DATA.launchSpecial && (
                <div className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-400 text-deepBlack-900 px-6 py-3 rounded-full text-lg font-bold mb-6 inline-block">
                  특별 런칭 할인 {COURSE_DATA.discountPercent}% | 오늘만!
                </div>
              )}
              
              <div className="text-center mb-6">
                {isSpecialCourse ? (
                  <>
                    <div className="text-offWhite-500 text-xl line-through mb-2">
                      정가 {COURSE_DATA.originalPrice.toLocaleString()}원
                    </div>
                    <div className="text-5xl font-bold text-metallicGold-500 mb-2">
                      {COURSE_DATA.currentPrice.toLocaleString()}원
                    </div>
                    <div className="text-metallicGold-400 font-medium">
                      {(COURSE_DATA.originalPrice - COURSE_DATA.currentPrice).toLocaleString()}원 절약
                    </div>
                  </>
                ) : (
                  <div className="text-5xl font-bold text-metallicGold-500">
                    {lecture.price.toLocaleString()}원
                  </div>
                )}
              </div>
              
              {/* 최종 CTA 버튼 */}
              {user ? (
                <PaymentButton
                  lectureId={lecture.id}
                  price={isSpecialCourse ? COURSE_DATA.currentPrice : lecture.price}
                  className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-2xl font-bold text-xl hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  지금 바로 수강 시작하기
                </PaymentButton>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="w-full px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-2xl font-bold text-xl hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  지금 바로 수강 시작하기
                </button>
              )}
            </div>
            
            <p className="text-offWhite-400 text-sm">
              30일 무조건 환불 보장 · 평생 업데이트 제공
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA Button - FastCampus 스타일 */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: showStickyButton ? 0 : 100, 
          opacity: showStickyButton ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-900/30 p-4 shadow-2xl"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Course info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="text-sm text-offWhite-500">수강료</div>
                <div className="font-bold text-metallicGold-500">
                  {isSpecialCourse ? `${COURSE_DATA.currentPrice.toLocaleString()}원` : `${lecture.price.toLocaleString()}원`}
                </div>
              </div>
              {isSpecialCourse && COURSE_DATA.launchSpecial && (
                <div className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-400 text-deepBlack-900 px-3 py-1 rounded-full text-xs font-bold">
                  {COURSE_DATA.discountPercent}% 할인
                </div>
              )}
            </div>
            
            {/* CTA Button */}
            <div className="flex-shrink-0">
              {user ? (
                <PaymentButton
                  lectureId={lecture.id}
                  price={isSpecialCourse ? COURSE_DATA.currentPrice : lecture.price}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                >
                  수강 시작하기
                </PaymentButton>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                >
                  수강 시작하기
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}