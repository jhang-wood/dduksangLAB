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
  Hash,
} from 'lucide-react';
import Header from '@/components/Header';
import CurriculumAccordion from '@/components/CurriculumAccordion';
import TagSystem from '@/components/TagSystem';
import RecommendationSlider from '@/components/RecommendationSlider';
import CourseStructuredData, { BreadcrumbStructuredData } from '@/components/StructuredData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/stores/auth-store';
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

interface Tag {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'level' | 'topic' | 'industry';
  count: number;
  trending?: boolean;
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
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recommendedLectures, setRecommendedLectures] = useState<RecommendedLecture[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
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

        // 태그 데이터 생성
        if (lectureData.tags && Array.isArray(lectureData.tags)) {
          const tags: Tag[] = lectureData.tags.map((tag: string, index: number) => ({
            id: `tag-${index}`,
            name: tag,
            category: getTagCategory(tag),
            count: Math.floor(Math.random() * 100) + 10,
            trending: Math.random() > 0.7,
          }));
          setAvailableTags(tags);
        }
      }

      // 추천 강의 로드
      await fetchRecommendedLectures();
    } catch (error) {
      logger.error('Error fetching lecture:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id, user, router, fetchRecommendedLectures]);

  const getTagCategory = (tag: string): Tag['category'] => {
    const languageKeywords = [
      'javascript',
      'python',
      'react',
      'vue',
      'angular',
      'typescript',
      'java',
      'c++',
      'html',
      'css',
    ];
    const frameworkKeywords = ['nextjs', 'express', 'django', 'spring', 'flutter', 'react-native'];
    const levelKeywords = ['초급', '중급', '고급', 'beginner', 'intermediate', 'advanced'];
    const industryKeywords = ['ai', 'ml', '머신러닝', '인공지능', '블록체인', 'iot', '클라우드'];

    const lowerTag = tag.toLowerCase();

    if (languageKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'language';
    }
    if (frameworkKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'framework';
    }
    if (levelKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'level';
    }
    if (industryKeywords.some(keyword => lowerTag.includes(keyword))) {
      return 'industry';
    }

    return 'topic';
  };


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

  // Sticky button scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 800; // Show after scrolling 800px
      setShowStickyButton(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnrollClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  };

  const handleTagSelect = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const handleTagSearch = (_query: string) => {
    // 태그 검색 로직 추가 가능
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

      {/* Enhanced Hero Section with FastCampus-style layout */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 via-deepBlack-900 to-deepBlack-900" />

        {/* Hero content container */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-offWhite-600 hover:text-metallicGold-500 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              뒤로 가기
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Course badges */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 text-metallicGold-400 rounded-full text-sm font-medium border border-metallicGold-500/30">
                      {lecture.category}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${
                        lecture.level === 'beginner'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : lecture.level === 'intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {levelLabels[lecture.level as keyof typeof levelLabels]}
                    </span>
                  </div>

                  {/* Course title */}
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-offWhite-200 mb-6 leading-tight">
                    {lecture.title}
                  </h1>

                  {/* Course description */}
                  <p className="text-lg lg:text-xl text-offWhite-500 mb-8 leading-relaxed">
                    {lecture.description}
                  </p>

                  {/* Course stats */}
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-offWhite-400">
                      <Award className="text-metallicGold-500" size={20} />
                      <span className="font-medium">{lecture.instructor_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-offWhite-400">
                      <Clock className="text-metallicGold-500" size={20} />
                      <span>{Math.ceil(totalDuration / 60)}분</span>
                    </div>
                    <div className="flex items-center gap-2 text-offWhite-400">
                      <BookOpen className="text-metallicGold-500" size={20} />
                      <span>{totalChapters}개 챕터</span>
                    </div>
                    {lecture.student_count && lecture.student_count > 0 && (
                      <div className="flex items-center gap-2 text-offWhite-400">
                        <Users className="text-metallicGold-500" size={20} />
                        <span>{lecture.student_count.toLocaleString()}명 수강</span>
                      </div>
                    )}
                    {lecture.rating && (
                      <div className="flex items-center gap-2 text-offWhite-400">
                        <Star className="text-yellow-500 fill-current" size={20} />
                        <span>{lecture.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {lecture.tags && lecture.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {lecture.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-deepBlack-600/50 backdrop-blur-sm text-offWhite-500 rounded-full text-sm border border-deepBlack-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Video & Pricing Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-24"
                >
                  {/* Video preview card */}
                  <div className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-4 border border-metallicGold-900/30 mb-6">
                    <div className="relative aspect-video bg-deepBlack-600 rounded-xl overflow-hidden mb-4">
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
                            <div className="w-16 h-16 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center shadow-xl">
                              <Play className="text-deepBlack-900 ml-1" size={28} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center shadow-xl">
                            <Play className="text-deepBlack-900 ml-1" size={28} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing section */}
                    <div className="text-center mb-6">
                      <p className="text-offWhite-600 text-sm mb-2">수강료</p>
                      <p className="text-3xl font-bold text-metallicGold-500">
                        ₩{lecture.price.toLocaleString()}
                      </p>
                    </div>

                    {/* CTA Button */}
                    {user ? (
                      <PaymentButton
                        lectureId={lecture.id}
                        price={lecture.price}
                        className="w-full px-6 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        <ShoppingCart size={20} className="inline mr-2" />
                        지금 수강 신청하기
                      </PaymentButton>
                    ) : (
                      <button
                        onClick={handleEnrollClick}
                        className="w-full px-6 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        로그인하고 수강 신청하기
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Course Content with Card-based Sections */}
      <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-900 to-deepBlack-300/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Objectives Card */}
              {lecture.objectives && lecture.objectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center">
                      <Target className="text-deepBlack-900" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-offWhite-200">학습 목표</h2>
                  </div>
                  <ul className="space-y-4">
                    {lecture.objectives.map((objective, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="text-green-500" size={16} />
                        </div>
                        <span className="text-offWhite-300 leading-relaxed">{objective}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Enhanced Curriculum with Accordion */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-deepBlack-900" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-offWhite-200">상세 커리큘럼</h2>
                  </div>
                  <p className="text-offWhite-500 mb-6">
                    체계적으로 구성된 커리큘럼으로 단계별 학습이 가능합니다. 미리보기가 가능한
                    챕터를 먼저 확인해보세요.
                  </p>
                </div>

                <CurriculumAccordion
                  sections={curriculumSections}
                  showPreviewOnly={false}
                  className="mb-8"
                />
              </motion.div>

              {/* Requirements Card */}
              {lecture.requirements && lecture.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center">
                      <BarChart className="text-deepBlack-900" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-offWhite-200">수강 전 필요사항</h2>
                  </div>
                  <ul className="space-y-4">
                    {lecture.requirements.map((req, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-2 h-2 bg-metallicGold-500 rounded-full mt-3 flex-shrink-0" />
                        <span className="text-offWhite-300 leading-relaxed">{req}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Interactive Tag System */}
              {availableTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-8 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center">
                      <Hash className="text-deepBlack-900" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-offWhite-200">관련 태그</h2>
                  </div>
                  <p className="text-offWhite-500 mb-6">
                    이 강의와 관련된 태그를 클릭하여 비슷한 강의를 찾아보세요.
                  </p>

                  <TagSystem
                    tags={availableTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagRemove={handleTagRemove}
                    onSearch={handleTagSearch}
                    maxVisibleTags={12}
                    showSearch={false}
                    showCategories={false}
                  />
                </motion.div>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Instructor Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all"
                >
                  <h3 className="text-xl font-bold text-offWhite-200 mb-6">강사 소개</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 flex items-center justify-center shadow-xl">
                      <Award className="text-deepBlack-900" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-offWhite-200 text-lg">
                        {lecture.instructor_name}
                      </h4>
                      <p className="text-sm text-metallicGold-400 font-medium">전문 강사</p>
                    </div>
                  </div>
                </motion.div>

                {/* Target Audience Card */}
                {lecture.target_audience && lecture.target_audience.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl p-6 border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all"
                  >
                    <h3 className="text-xl font-bold text-offWhite-200 mb-6">
                      이런 분들께 추천해요
                    </h3>
                    <ul className="space-y-4">
                      {lecture.target_audience.map((audience, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 bg-metallicGold-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Users className="text-metallicGold-500" size={14} />
                          </div>
                          <span className="text-sm text-offWhite-300 leading-relaxed">
                            {audience}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses Recommendation Section */}
      {recommendedLectures.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-deepBlack-300/20 to-deepBlack-900">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <RecommendationSlider
                lectures={recommendedLectures}
                title="이런 강의도 좋아요"
                subtitle={`${lecture?.category ?? ''} 강의를 더 학습하고 싶다면, 이 강의들을 추천드려요`}
                onLectureClick={handleRecommendedLectureClick}
                slidesPerView={3}
                spaceBetween={24}
                showPagination={true}
                autoplay={true}
                autoplayDelay={6000}
                showReasonBadge={true}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Sticky CTA Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: showStickyButton ? 0 : 100,
          opacity: showStickyButton ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-900/30 p-4 shadow-2xl"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Course info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="text-deepBlack-900" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-offWhite-200 truncate">{lecture?.title}</h3>
                <div className="flex items-center gap-4 text-sm text-offWhite-500">
                  <span>₩{lecture?.price.toLocaleString()}</span>
                  <span>•</span>
                  <span>{Math.ceil(totalDuration / 60)}분</span>
                  <span>•</span>
                  <span>{totalChapters}개 챕터</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              {user ? (
                <PaymentButton
                  lectureId={lecture.id}
                  price={lecture.price}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                >
                  <ShoppingCart size={18} className="inline mr-2" />
                  수강 신청하기
                </PaymentButton>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap"
                >
                  수강 신청하기
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
