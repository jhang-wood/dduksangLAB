'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Users,
  BookOpen,
  Award,
  Play,
  TrendingUp,
  Zap,
  Heart,
} from 'lucide-react';
import Image from 'next/image';

interface RecommendedLecture {
  id: string;
  title: string;
  instructor_name: string;
  thumbnail_url?: string;
  preview_url?: string;
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
    expires_at?: string;
  };
}

interface RecommendationSliderProps {
  lectures: RecommendedLecture[];
  title?: string;
  subtitle?: string;
  className?: string;
  slidesPerView?: number;
  spaceBetween?: number;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  onLectureClick?: (lectureId: string) => void;
  showReasonBadge?: boolean;
}

const levelLabels = {
  beginner: { label: '초급', color: 'text-green-400 bg-green-500/20' },
  intermediate: { label: '중급', color: 'text-yellow-400 bg-yellow-500/20' },
  advanced: { label: '고급', color: 'text-red-400 bg-red-500/20' },
};

const reasonLabels = {
  same_category: { label: '같은 카테고리', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  same_instructor: { label: '같은 강사', icon: Award, color: 'from-purple-500 to-purple-600' },
  similar_level: { label: '비슷한 레벨', icon: TrendingUp, color: 'from-green-500 to-green-600' },
  trending: { label: '인기 강의', icon: Zap, color: 'from-red-500 to-red-600' },
  ai_recommended: {
    label: 'AI 추천',
    icon: Heart,
    color: 'from-metallicGold-500 to-metallicGold-600',
  },
};

export default function RecommendationSlider({
  lectures,
  title = '추천 강의',
  subtitle = '당신이 좋아할 만한 강의를 찾아보세요',
  className = '',
  slidesPerView = 3,
  spaceBetween = 24,
  showPagination = true,
  autoplay = false,
  autoplayDelay = 5000,
  onLectureClick,
  showReasonBadge = true,
}: RecommendationSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  // 반응형 slidesPerView 계산
  const [responsiveSlidesPerView, setResponsiveSlidesPerView] = useState(slidesPerView);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveSlidesPerView(1);
      } else if (width < 1024) {
        setResponsiveSlidesPerView(2);
      } else {
        setResponsiveSlidesPerView(slidesPerView);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesPerView]);

  const totalSlides = lectures.length;
  const maxIndex = Math.max(0, totalSlides - responsiveSlidesPerView);

  // 자동 재생
  useEffect(() => {
    if (autoplay && !isHovered && !isDragging) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, autoplayDelay);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, autoplayDelay, isHovered, isDragging, maxIndex]);

  // 슬라이드 이동
  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  // 터치/드래그 핸들러
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const handleLectureClick = (lectureId: string) => {
    if (onLectureClick) {
      onLectureClick(lectureId);
    }
  };

  const isDiscounted = (lecture: RecommendedLecture) => {
    return lecture.discount && lecture.discount.discount_percentage > 0;
  };

  const getDiscountedPrice = (lecture: RecommendedLecture) => {
    if (!lecture.discount) {
      return lecture.price;
    }
    const discountAmount =
      (lecture.discount.original_price * lecture.discount.discount_percentage) / 100;
    return lecture.discount.original_price - discountAmount;
  };

  if (lectures.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-offWhite-200 mb-2">{title}</h2>
          <p className="text-offWhite-500 text-lg">{subtitle}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-deepBlack-600 border border-metallicGold-900/30 flex items-center justify-center text-offWhite-400 hover:text-offWhite-200 hover:border-metallicGold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="w-12 h-12 rounded-full bg-deepBlack-600 border border-metallicGold-900/30 flex items-center justify-center text-offWhite-400 hover:text-offWhite-200 hover:border-metallicGold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex"
          animate={{
            x: `-${currentIndex * (100 / responsiveSlidesPerView) + (currentIndex * spaceBetween) / responsiveSlidesPerView}px`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: -maxIndex * 400, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ gap: spaceBetween }}
        >
          {lectures.map((lecture, index) => {
            const reason = reasonLabels[lecture.reason];
            const ReasonIcon = reason.icon;

            return (
              <motion.div
                key={lecture.id}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / responsiveSlidesPerView}% - ${(spaceBetween * (responsiveSlidesPerView - 1)) / responsiveSlidesPerView}px)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div
                  className="bg-deepBlack-300/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all group cursor-pointer"
                  onClick={() => handleLectureClick(lecture.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-deepBlack-600 overflow-hidden">
                    {lecture.thumbnail_url ? (
                      <Image
                        src={lecture.thumbnail_url}
                        alt={lecture.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 flex items-center justify-center">
                        <BookOpen className="text-metallicGold-500" size={48} />
                      </div>
                    )}

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 rounded-full flex items-center justify-center shadow-2xl"
                      >
                        <Play className="text-deepBlack-900 ml-1" size={24} />
                      </motion.div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {/* Reason Badge */}
                      {showReasonBadge && (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${reason.color} text-white rounded-full text-xs font-medium shadow-lg`}
                        >
                          <ReasonIcon size={12} />
                          <span>{reason.label}</span>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {isDiscounted(lecture) && (
                        <div className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                          {lecture.discount!.discount_percentage}% OFF
                        </div>
                      )}
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${levelLabels[lecture.level].color}`}
                      >
                        {levelLabels[lecture.level].label}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded-full flex items-center gap-1">
                      <Clock size={12} />
                      <span>{formatTime(lecture.duration)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-metallicGold-500/20 text-metallicGold-400 rounded-full text-xs font-medium">
                        {lecture.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-offWhite-200 mb-3 line-clamp-2 group-hover:text-offWhite-100 transition-colors">
                      {lecture.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-4 text-offWhite-400">
                      <Award size={16} className="text-metallicGold-500" />
                      <span className="text-sm">{lecture.instructor_name}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-offWhite-500">
                      {lecture.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 fill-current" size={14} />
                          <span>{lecture.rating}</span>
                        </div>
                      )}
                      {lecture.student_count && lecture.student_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{lecture.student_count.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {lecture.tags && lecture.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lecture.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-deepBlack-600 text-offWhite-500 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {isDiscounted(lecture) ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-metallicGold-500">
                              ₩{formatPrice(getDiscountedPrice(lecture))}
                            </span>
                            <span className="text-sm text-offWhite-500 line-through">
                              ₩{formatPrice(lecture.discount!.original_price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-metallicGold-500">
                            ₩{formatPrice(lecture.price)}
                          </span>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 rounded-full text-sm font-medium hover:shadow-lg transition-all"
                      >
                        자세히 보기
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination */}
      {showPagination && totalSlides > responsiveSlidesPerView && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(totalSlides / responsiveSlidesPerView) }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                Math.floor(currentIndex / responsiveSlidesPerView) === index
                  ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 scale-125'
                  : 'bg-deepBlack-600 hover:bg-deepBlack-500'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-deepBlack-600/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-600"
          animate={{
            width: `${((currentIndex + responsiveSlidesPerView) / totalSlides) * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
