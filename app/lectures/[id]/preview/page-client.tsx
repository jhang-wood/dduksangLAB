'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import Header from '@/components/Header';
import CurriculumAccordion from '@/components/CurriculumAccordion';
import RecommendationSlider from '@/components/RecommendationSlider';
import CourseStructuredData, { BreadcrumbStructuredData } from '@/components/StructuredData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { PaymentButton } from '@/hooks/usePayment';
import { logger } from '@/lib/logger';

interface Chapter {
  id: string;
  title: string;
  order_index: number;
  duration: number;
  is_preview?: boolean;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  objectives?: string[];
}

interface Section {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
  total_duration: number;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  preview_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  objectives?: string[];
  requirements?: string[];
  target_audience?: string[];
  chapters?: Chapter[];
  student_count?: number;
  rating?: number;
}


interface RecommendedLecture {
  id: string;
  title: string;
  instructor_name: string;
  thumbnail_url?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  rating?: number;
  student_count?: number;
  tags?: string[];
  reason: 'same_category' | 'same_instructor' | 'similar_level' | 'trending' | 'ai_recommended';
  discount?: {
    original_price: number;
    discount_percentage: number;
  };
}

const levelLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};

export default function LecturePreviewClient({ params }: { params: { id: string } }) {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [_isEnrolled, _setIsEnrolled] = useState(false);
  const [recommendedLectures, setRecommendedLectures] = useState<RecommendedLecture[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  const fetchRecommendedLectures = useCallback(async () => {
    try {
      const { data: lecturesData } = await supabase
        .from('lectures')
        .select('*')
        .neq('id', params.id)
        .limit(12);

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
          ...(Math.random() > 0.7
            ? {
                discount: {
                  original_price: lec.price,
                  discount_percentage: Math.floor(Math.random() * 30) + 10,
                },
              }
            : {}),
        }));
        setRecommendedLectures(recommended);
      }
    } catch (error) {
      logger.error('Error fetching recommended lectures:', error);
    }
  }, [params.id, lecture]);

  const fetchLectureData = useCallback(async () => {
    try {
      // 수강 여부 확인
      if (user) {
        const { data: enrollment } = await supabase
          .from('lecture_enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('lecture_id', params.id)
          .eq('status', 'active')
          .single();

        if (enrollment) {
          // 이미 수강중이면 강의 페이지로 리다이렉트
          router.push(`/lectures/${params.id}`);
          return;
        }
      }

      // 강의 정보 조회
      const { data: lectureData } = await supabase
        .from('lectures')
        .select(
          `
          *,
          chapters:lecture_chapters(
            id,
            title,
            order_index,
            duration,
            is_preview
          )
        `
        )
        .eq('id', params.id)
        .single();

      if (lectureData) {
        setLecture({
          ...lectureData,
          chapters:
            lectureData.chapters?.sort((a: Chapter, b: Chapter) => a.order_index - b.order_index) ??
            [],
        } as Lecture);

      }

      // 추천 강의 로드
      await fetchRecommendedLectures();
    } catch (error) {
      logger.error('Error fetching lecture:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id, user, router, fetchRecommendedLectures]);



  const getRecommendationReason = (
    recommended: any,
    current: Lecture | null
  ): RecommendedLecture['reason'] => {
    if (!current) {
      return 'trending';
    }

    if (recommended.category === current.category) {
      return 'same_category';
    }
    if (recommended.instructor_name === current.instructor_name) {
      return 'same_instructor';
    }
    if (recommended.level === current.level) {
      return 'similar_level';
    }
    if (Math.random() > 0.5) {
      return 'ai_recommended';
    }

    return 'trending';
  };

  useEffect(() => {
    void fetchLectureData();
  }, [fetchLectureData]);


  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  };


  const handleRecommendedLectureClick = (lectureId: string) => {
    router.push(`/lectures/${lectureId}/preview`);
  };

  // 섹션 데이터 준비 (커리큘럼 아코디언용)
  const curriculumSections: Section[] = lecture?.chapters
    ? [
        {
          id: 'main-curriculum',
          title: '메인 커리큘럼',
          description: '이 강의의 핵심 내용을 단계별로 학습합니다.',
          chapters: lecture.chapters.map(ch => ({
            ...ch,
            difficulty:
              ch.difficulty ??
              (ch.order_index <= 2
                ? 'beginner'
                : ch.order_index <= 5
                  ? 'intermediate'
                  : 'advanced'),
            description:
              ch.description ?? `${ch.title}에 대한 상세한 설명과 실습을 통해 학습합니다.`,
            objectives: ch.objectives ?? [
              `${ch.title}의 기본 개념 이해`,
              '실제 프로젝트에 적용하기',
              '베스트 프렉티스 습득',
            ],
          })),
          total_duration: lecture.chapters.reduce((sum, ch) => sum + ch.duration, 0),
        },
      ]
    : [];

  const totalDuration = lecture?.chapters?.reduce((sum, ch) => sum + ch.duration, 0) ?? 0;
  const totalChapters = lecture?.chapters?.length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="lectures" />
        <div className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl font-bold text-offWhite-200">강의를 찾을 수 없습니다</h1>
        </div>
      </div>
    );
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
              {
                name: lecture.title,
                url: `https://dduksanglab.com/lectures/${lecture.id}/preview`,
              },
            ]}
          />
        </>
      )}

      {/* Hero Section - 단일 컬럼 레이아웃 */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-deepBlack-900" />
        
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-offWhite-600 hover:text-metallicGold-500 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              뒤로 가기
            </button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* 카테고리 및 레벨 배지 */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-metallicGold-500/20 text-metallicGold-400 rounded-full text-sm font-medium">
                  {lecture.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lecture.level === 'beginner'
                      ? 'bg-green-500/20 text-green-400'
                      : lecture.level === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {levelLabels[lecture.level as keyof typeof levelLabels]}
                </span>
              </div>

              {/* 강의 제목 */}
              <h1 className="text-3xl lg:text-5xl font-bold text-offWhite-200 mb-6 leading-tight">
                {lecture.title}
              </h1>

              {/* 강의 설명 */}
              <p className="text-lg text-offWhite-500 mb-8 leading-relaxed max-w-2xl mx-auto">
                {lecture.description}
              </p>

              {/* 강의 통계 */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-offWhite-400">
                  <Award className="text-metallicGold-500" size={18} />
                  <span>{lecture.instructor_name}</span>
                </div>
                <div className="flex items-center gap-2 text-offWhite-400">
                  <Clock className="text-metallicGold-500" size={18} />
                  <span>{Math.ceil(totalDuration / 60)}분</span>
                </div>
                <div className="flex items-center gap-2 text-offWhite-400">
                  <BookOpen className="text-metallicGold-500" size={18} />
                  <span>{totalChapters}개 챕터</span>
                </div>
                {lecture.student_count && lecture.student_count > 0 && (
                  <div className="flex items-center gap-2 text-offWhite-400">
                    <Users className="text-metallicGold-500" size={18} />
                    <span>{lecture.student_count.toLocaleString()}명 수강</span>
                  </div>
                )}
                {lecture.rating && (
                  <div className="flex items-center gap-2 text-offWhite-400">
                    <Star className="text-yellow-500 fill-current" size={18} />
                    <span>{lecture.rating}</span>
                  </div>
                )}
              </div>

              {/* 비디오 미리보기 */}
              {(lecture.preview_url || lecture.thumbnail_url) && (
                <div className="max-w-2xl mx-auto mb-8">
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
                        <div
                          className="w-full h-full object-cover bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${lecture.thumbnail_url})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center">
                            <Play className="text-deepBlack-900 ml-1" size={28} />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* 태그 */}
              {lecture.tags && lecture.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {lecture.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-deepBlack-600 text-offWhite-500 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 컨텐츠 섹션 - 단일 컬럼 */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* 학습 목표 */}
            {lecture.objectives && lecture.objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-deepBlack-300 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-metallicGold-500" size={20} />
                  <h2 className="text-xl font-bold text-offWhite-200">학습 목표</h2>
                </div>
                <ul className="space-y-3">
                  {lecture.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5" size={16} />
                      <span className="text-offWhite-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 커리큘럼 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-metallicGold-500" size={20} />
                <h2 className="text-xl font-bold text-offWhite-200">커리큘럼</h2>
              </div>
              <CurriculumAccordion
                sections={curriculumSections}
                showPreviewOnly={false}
                className=""
              />
            </motion.div>

            {/* 수강 전 필요사항 */}
            {lecture.requirements && lecture.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-deepBlack-300 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <BarChart className="text-metallicGold-500" size={20} />
                  <h2 className="text-xl font-bold text-offWhite-200">수강 전 필요사항</h2>
                </div>
                <ul className="space-y-3">
                  {lecture.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-metallicGold-500 rounded-full mt-2" />
                      <span className="text-offWhite-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 강사 소개 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-deepBlack-300 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-metallicGold-500" size={20} />
                <h2 className="text-xl font-bold text-offWhite-200">강사 소개</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 flex items-center justify-center">
                  <Award className="text-deepBlack-900" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-offWhite-200">{lecture.instructor_name}</h4>
                  <p className="text-sm text-metallicGold-400">전문 강사</p>
                </div>
              </div>
            </motion.div>

            {/* 추천 대상 */}
            {lecture.target_audience && lecture.target_audience.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-deepBlack-300 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="text-metallicGold-500" size={20} />
                  <h2 className="text-xl font-bold text-offWhite-200">이런 분들께 추천해요</h2>
                </div>
                <ul className="space-y-3">
                  {lecture.target_audience.map((audience, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-metallicGold-500 rounded-full mt-2" />
                      <span className="text-offWhite-300">{audience}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 추천 강의 */}
      {recommendedLectures.length > 0 && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <RecommendationSlider
                lectures={recommendedLectures}
                title="추천 강의"
                subtitle={`${lecture?.category ?? ''} 관련 강의를 더 학습해보세요`}
                onLectureClick={handleRecommendedLectureClick}
                slidesPerView={3}
                spaceBetween={24}
                showPagination={true}
                autoplay={true}
                autoplayDelay={6000}
                showReasonBadge={false}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* 하단 고정 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900 border-t border-deepBlack-600 p-4 safe-area-inset-bottom">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* 가격 정보 */}
            <div>
              <p className="text-xs text-offWhite-500 mb-1">수강료</p>
              <p className="text-xl sm:text-2xl font-bold text-metallicGold-500">
                ₩{lecture?.price.toLocaleString()}
              </p>
            </div>

            {/* 수강신청 버튼 */}
            <div className="flex-shrink-0">
              {user ? (
                <PaymentButton
                  lectureId={lecture.id}
                  price={lecture.price}
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all text-sm sm:text-base"
                >
                  <ShoppingCart size={16} className="inline mr-1 sm:mr-2" />
                  수강신청
                </PaymentButton>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all text-sm sm:text-base"
                >
                  수강신청
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 여백 확보 */}
      <div className="h-20" />
    </div>
  );
}
