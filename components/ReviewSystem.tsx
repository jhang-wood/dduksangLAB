'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, MessageSquare, User, Verified, Filter } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  isVerified?: boolean;
  helpfulCount: number;
  createdAt: Date;
  progress?: number;
  tags: string[];
}

interface ReviewSystemProps {
  courseId?: string;
  showLatest?: boolean;
  maxReviews?: number;
  variant?: 'full' | 'compact' | 'featured';
}

export default function ReviewSystem({
  courseId,
  showLatest = false,
  maxReviews = 10,
  variant = 'full',
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'recent' | 'helpful' | 'verified'>('all');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // 더미 리뷰 데이터 - useMemo로 최적화
  const mockReviews: Review[] = useMemo(() => [
    {
      id: '1',
      userId: 'user1',
      userName: '김민수',
      rating: 5,
      title: '정말 실무에 바로 적용할 수 있는 강의',
      content:
        'AI Agent를 실제로 구축하면서 배우는 방식이 너무 좋았습니다. 특히 Claude Code 활용법이 인상깊었어요. 이제 업무 자동화가 훨씬 쉬워졌습니다.',
      courseId: 'ai-agent-master',
      courseName: 'AI Agent 마스터과정',
      isVerified: true,
      helpfulCount: 24,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      progress: 100,
      tags: ['실무활용', '자동화', '유용함'],
    },
    {
      id: '2',
      userId: 'user2',
      userName: '박지영',
      rating: 5,
      title: '비개발자도 쉽게 따라할 수 있어요',
      content:
        '코딩을 전혀 모르는 상태에서 시작했는데, 설명이 너무 친절하고 체계적이에요. 텔레그램으로 프로그램을 만드는 게 정말 신기했습니다.',
      courseId: 'telegram-coding',
      courseName: '텔레그램으로 코딩하는 혁신적 방법',
      isVerified: false,
      helpfulCount: 18,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      progress: 85,
      tags: ['초보자친화적', '혁신적', '추천'],
    },
    {
      id: '3',
      userId: 'user3',
      userName: '이동훈',
      rating: 4,
      title: '내용은 좋은데 조금 어려워요',
      content:
        '내용 자체는 정말 유용하고 최신 트렌드를 잘 반영하고 있어요. 다만 완전 초보에게는 조금 어려울 수 있을 것 같아요. 하지만 충분히 가치있는 투자입니다.',
      courseId: 'no-code-automation',
      courseName: '노코드로 만드는 자동화 시스템',
      isVerified: true,
      helpfulCount: 12,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      progress: 65,
      tags: ['유용함', '조금어려움', '가성비좋음'],
    },
    {
      id: '4',
      userId: 'user4',
      userName: '최수빈',
      rating: 5,
      title: '떡상연구소 강의는 항상 믿고 봐요',
      content:
        '이번에도 기대를 저버리지 않네요! AI 기술을 이렇게 쉽게 활용할 수 있다니 정말 놀랍습니다. 수강료가 아깝지 않아요.',
      courseId: 'ai-agent-master',
      courseName: 'AI Agent 마스터과정',
      isVerified: true,
      helpfulCount: 31,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 40,
      tags: ['떡상연구소최고', '믿고수강', '만족'],
    },
    {
      id: '5',
      userId: 'user5',
      userName: '정예은',
      rating: 5,
      title: '투자 대비 최고의 수익률',
      content:
        '30만원이 전혀 아깝지 않습니다. 실제로 회사에서 AI 도구들을 활용해서 업무 효율이 3배는 올라갔어요. 동료들도 모두 놀라고 있습니다.',
      courseId: 'ai-agent-master',
      courseName: 'AI Agent 마스터과정',
      isVerified: false,
      helpfulCount: 29,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      progress: 95,
      tags: ['가성비최고', '업무효율성', '추천강의'],
    },
  ], []);

  useEffect(() => {
    // 실제로는 서버에서 리뷰 데이터를 가져와야 함
    let filteredReviews = mockReviews;

    if (courseId) {
      filteredReviews = filteredReviews.filter(r => r.courseId === courseId);
    }

    if (selectedRating) {
      filteredReviews = filteredReviews.filter(r => r.rating === selectedRating);
    }

    switch (filter) {
      case 'recent':
        filteredReviews = filteredReviews.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case 'helpful':
        filteredReviews = filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'verified':
        filteredReviews = filteredReviews.filter(r => r.isVerified);
        break;
    }

    if (showLatest) {
      filteredReviews = filteredReviews.slice(0, maxReviews);
    }

    setReviews(filteredReviews);
  }, [courseId, filter, selectedRating, showLatest, maxReviews, mockReviews]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return '오늘';
    }
    if (diffInDays === 1) {
      return '어제';
    }
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }
    if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)}주 전`;
    }
    return `${Math.floor(diffInDays / 30)}개월 전`;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-offWhite-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {reviews.slice(0, 3).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-deepBlack-300/30 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-metallicGold-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-offWhite-200 text-sm">{review.userName}</span>
                  {review.isVerified && <Verified className="w-4 h-4 text-blue-500" />}
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  <span className="text-xs text-offWhite-600">{getTimeAgo(review.createdAt)}</span>
                </div>

                <p className="text-sm text-offWhite-400 line-clamp-2">{review.content}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button className="flex items-center gap-1 text-xs text-offWhite-600 hover:text-metallicGold-500 transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpfulCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.slice(0, 2).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 backdrop-blur-sm border border-metallicGold-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-metallicGold-500" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-offWhite-200">{review.userName}</span>
                  {review.isVerified && <Verified className="w-4 h-4 text-blue-500" />}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-offWhite-600">{getTimeAgo(review.createdAt)}</span>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-offWhite-200 mb-3">{review.title}</h4>

            <p className="text-offWhite-400 leading-relaxed mb-4">{review.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-metallicGold-500/10 text-metallicGold-500 rounded-lg text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-offWhite-600 hover:text-metallicGold-500 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>도움됨 {review.helpfulCount}</span>
                </button>

                {review.progress && (
                  <span className="text-offWhite-600">진도 {review.progress}%</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-offWhite-500" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-lg px-3 py-2 text-offWhite-200"
          >
            <option value="all">전체</option>
            <option value="recent">최신순</option>
            <option value="helpful">도움순</option>
            <option value="verified">인증된 리뷰</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-offWhite-600">평점:</span>
          <div className="flex gap-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors ${
                  selectedRating === rating
                    ? 'bg-metallicGold-500/20 text-metallicGold-500'
                    : 'text-offWhite-600 hover:text-offWhite-400'
                }`}
              >
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </button>
            ))}
            {selectedRating && (
              <button
                onClick={() => setSelectedRating(null)}
                className="px-2 py-1 text-xs text-offWhite-600 hover:text-offWhite-400"
              >
                전체
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-metallicGold-500" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-offWhite-200">{review.userName}</span>
                        {review.isVerified && <Verified className="w-4 h-4 text-blue-500" />}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-offWhite-600">
                          {getTimeAgo(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-bold text-lg text-offWhite-200 mb-3">{review.title}</h4>

                  <p className="text-offWhite-400 leading-relaxed mb-4">{review.content}</p>

                  {!courseId && (
                    <p className="text-sm text-metallicGold-500 mb-3">📚 {review.courseName}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-metallicGold-500/10 text-metallicGold-500 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-offWhite-600 hover:text-metallicGold-500 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>도움됨 {review.helpfulCount}</span>
                      </button>

                      <button className="flex items-center gap-1 text-offWhite-600 hover:text-metallicGold-500 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>답글</span>
                      </button>
                    </div>

                    {review.progress && (
                      <span className="text-sm text-offWhite-600">진도 {review.progress}%</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-offWhite-600 mx-auto mb-4" />
          <p className="text-lg text-offWhite-400 mb-2">아직 리뷰가 없습니다</p>
          <p className="text-offWhite-600">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}
