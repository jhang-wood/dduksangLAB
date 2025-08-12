'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import CourseCard from '@/components/CourseCard';
import SocialProofFeed, { LiveStats, PopularBadge } from '@/components/SocialProofFeed';
import {
  DiscountTimer,
  EarlyBirdCountdown,
  LimitedTimeOffer,
  RealTimePurchaseIndicator,
} from '@/components/UrgencyElements';
import {
  PreviewModal,
  CurriculumSection,
  AskInstructorButton,
  FreeTrialContent,
} from '@/components/InteractiveElements';
import {
  BadgeSystem,
  StreakTracker,
  LearningGoals,
  AchievementChart,
} from '@/components/GamificationSystem';
import ReviewSystem from '@/components/ReviewSystem';
import { Search, Filter, BookOpen, Users, Star } from 'lucide-react';

// 더미 강의 데이터
const mockCourses = [
  {
    id: 'ai-agent-master',
    title: 'AI Agent 마스터과정 - 실무 완성편',
    description:
      '실제 업무에서 활용할 수 있는 AI 에이전트를 구축하고 운영하는 실전 기술을 배웁니다. Claude Code부터 자동화 시스템까지 완벽 마스터.',
    instructor: '떡상연구소',
    duration: '8시간 30분',
    students: 1247,
    rating: 4.9,
    price: 398000,
    discountPrice: 299000,
    level: 'advanced' as const,
    tags: ['AI', 'Claude Code', '자동화', '실무'],
    preview: 'https://example.com/preview1',
    curriculum: [
      { title: 'AI Agent 개요 및 환경 설정', duration: '25분', isPreview: true },
      { title: 'Claude Code 마스터하기', duration: '45분', isPreview: false },
      { title: '실무 자동화 프로젝트', duration: '60분', isPreview: false },
      { title: '배포 및 운영', duration: '40분', isPreview: false },
      { title: '트러블슈팅과 최적화', duration: '30분', isPreview: false },
    ],
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
    preview: 'https://example.com/preview2',
    curriculum: [
      { title: '텔레그램 봇 기초', duration: '30분', isPreview: true },
      { title: '코딩 워크플로우 설계', duration: '50분', isPreview: false },
      { title: '실시간 협업 시스템', duration: '40분', isPreview: false },
    ],
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
    preview: 'https://example.com/preview3',
    curriculum: [
      { title: '노코드 도구 소개', duration: '20분', isPreview: true },
      { title: 'Make.com 마스터하기', duration: '45분', isPreview: false },
      { title: 'n8n으로 고급 자동화', duration: '60분', isPreview: false },
    ],
  },
];

// 얼리버드 단계 데이터
const earlyBirdStages = [
  {
    name: '1차 얼리버드',
    discount: 40,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    slots: 50,
    remaining: 12,
  },
  {
    name: '2차 얼리버드',
    discount: 30,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    slots: 100,
    remaining: 78,
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [previewCourse, setPreviewCourse] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // 강의 필터링 및 정렬
  const filteredCourses = mockCourses
    .filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
        case 'price-high':
          return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
        default:
          return 0;
      }
    });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />

      {/* 소셜 증명 피드 */}
      <SocialProofFeed />

      {/* 실시간 구매 표시 */}
      <RealTimePurchaseIndicator />

      <div className="relative z-10">
        <Header currentPage="courses" />

        {/* 할인 배너 */}
        <DiscountTimer
          endDate={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
          discountPercent={25}
          variant="banner"
        />

        <div className="container mx-auto max-w-7xl px-4 pt-8 pb-20">
          {/* 페이지 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-6 text-center">
              AI 마스터가 되는{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                완벽한 강의
              </span>
            </h1>
            <p className="text-lg text-offWhite-500 text-center max-w-3xl mx-auto">
              실무에서 바로 활용할 수 있는 AI 기술을 배우고, 자동화로 업무 효율성을 극대화하세요
            </p>
          </motion.div>

          {/* 실시간 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <LiveStats />
          </motion.div>

          {/* 얼리버드 카운트다운 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <EarlyBirdCountdown stages={earlyBirdStages} currentStage={0} />
          </motion.div>

          {/* 검색 및 필터 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-offWhite-500" />
                <input
                  type="text"
                  placeholder="강의, 태그, 강사명으로 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 placeholder-offWhite-500 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                />
              </div>

              {/* 필터 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-offWhite-500" />
                  <select
                    value={selectedLevel}
                    onChange={e => setSelectedLevel(e.target.value)}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl px-4 py-3 text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none"
                  >
                    <option value="all">모든 레벨</option>
                    <option value="beginner">초급</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">고급</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl px-4 py-3 text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none"
                >
                  <option value="popular">인기순</option>
                  <option value="rating">평점순</option>
                  <option value="price-low">가격 낮은순</option>
                  <option value="price-high">가격 높은순</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* 강의 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <PopularBadge
                  isHot={course.students > 1000}
                  isBestseller={course.rating >= 4.8}
                  isNew={index === 2}
                />

                <div className="group">
                  <CourseCard course={course} index={index} variant="default" />

                  {/* 미리보기 버튼 */}
                  <div className="absolute top-4 left-4">
                    <button
                      onClick={() => setPreviewCourse(course)}
                      className="bg-deepBlack-900/80 backdrop-blur-sm text-offWhite-200 px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all hover:bg-metallicGold-500 hover:text-deepBlack-900"
                    >
                      미리보기
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 상세 정보 섹션들 */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* 커리큘럼 상세 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-metallicGold-500" />
                상세 커리큘럼
              </h2>

              <div className="space-y-4">
                {mockCourses[0]?.curriculum?.map((section, index) => (
                  <CurriculumSection
                    key={index}
                    title={`${index + 1}장. ${section.title}`}
                    duration={section.duration}
                    lessons={[
                      {
                        title: section.title,
                        duration: section.duration,
                        isPreview: section.isPreview,
                        isCompleted: index < 2,
                      },
                    ]}
                    isExpanded={expandedSections[`section-${index}`] ?? false}
                    onToggle={() => toggleSection(`section-${index}`)}
                  />
                ))}
              </div>
            </motion.div>

            {/* 무료 체험 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FreeTrialContent
                course={{
                  title: mockCourses[0]?.title ?? '',
                  freeContent: {
                    duration: '15분',
                    description:
                      'AI Agent의 기본 개념과 환경 설정 방법을 무료로 체험해보세요. 실제 강의의 퀀리티를 직접 확인할 수 있습니다.',
                  },
                }}
                onStartTrial={() => {}}
              />

              <div className="mt-6">
                <AskInstructorButton instructorName="떡상연구소" />
              </div>
            </motion.div>
          </div>

          {/* 리뷰 시스템 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-metallicGold-500" />
              수강생 후기
            </h2>

            <div className="mb-8">
              <ReviewSystem variant="featured" maxReviews={4} />
            </div>

            <ReviewSystem variant="compact" maxReviews={6} />
          </motion.div>

          {/* 게이미피케이션 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-metallicGold-500" />
              학습 현황 대시보드
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <StreakTracker currentStreak={5} bestStreak={12} />
                <LearningGoals />
              </div>

              <div className="space-y-8">
                <AchievementChart />
                <BadgeSystem userId="current-user" />
              </div>
            </div>
          </motion.div>

          {/* 제한 시간 오퍼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <LimitedTimeOffer
              title="🔥 지금만! 특별 론칭 할인"
              subtitle="모든 강의 최대 40% 할인 + 평생 업데이트 보장"
              endDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              ctaText="지금 바로 수강하기"
              onCTAClick={() => {}}
              variant="banner"
            />
          </motion.div>
        </div>
      </div>

      {/* 미리보기 모달 */}
      <PreviewModal
        isOpen={!!previewCourse}
        onClose={() => setPreviewCourse(null)}
        course={
          previewCourse ?? {
            id: '',
            title: '',
            instructor: '',
            duration: '',
            description: '',
            curriculum: [],
          }
        }
      />
    </div>
  );
}
