'use client';

import { motion } from 'framer-motion';
import { Star, User, ThumbsUp, Quote } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
  badges?: string[];
}

export const ReviewSection = ({
  reviews,
  averageRating,
  totalReviews,
  className = '',
}: {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  className?: string;
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-offWhite-700'
        }`}
      />
    ));
  };

  const ratingDistribution = [
    { stars: 5, count: Math.floor(totalReviews * 0.7) },
    { stars: 4, count: Math.floor(totalReviews * 0.2) },
    { stars: 3, count: Math.floor(totalReviews * 0.07) },
    { stars: 2, count: Math.floor(totalReviews * 0.02) },
    { stars: 1, count: Math.floor(totalReviews * 0.01) },
  ];

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        {/* 리뷰 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-deepBlack-600/50 rounded-3xl p-8 border border-metallicGold-500/20 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* 평점 요약 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="text-5xl font-bold text-metallicGold-500">{averageRating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-2">{renderStars(averageRating)}</div>
                  <p className="text-offWhite-500 text-sm">
                    {totalReviews.toLocaleString()}개의 리뷰
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  수강생 만족도 98%
                </span>
                <span className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                  재수강 희망률 95%
                </span>
              </div>
            </div>

            {/* 평점 분포 */}
            <div className="space-y-2">
              {ratingDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-offWhite-400">{item.stars}</span>
                  </div>
                  <div className="flex-1 bg-deepBlack-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-700 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.count / totalReviews) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <span className="text-sm text-offWhite-500 w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 개별 리뷰 목록 */}
        <div>
          <h3 className="text-2xl font-bold text-offWhite-200 mb-8">수강생 후기</h3>
          <div className="grid gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-deepBlack-600/30 rounded-2xl p-6 border border-offWhite-800/20 hover:border-metallicGold-500/30 transition-all"
              >
                {/* 리뷰 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-deepBlack-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-offWhite-200">{review.userName}</span>
                        {review.verified && (
                          <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            인증 수강생
                          </span>
                        )}
                        {review.badges?.map((badge, i) => (
                          <span
                            key={i}
                            className="bg-metallicGold-500/20 text-metallicGold-500 px-2 py-1 rounded-full text-xs font-bold"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        <span className="text-offWhite-500 text-sm">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 리뷰 내용 */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-metallicGold-500/30" />
                  <p className="text-offWhite-300 leading-relaxed pl-6 mb-4">{review.comment}</p>
                </div>

                {/* 리뷰 하단 */}
                <div className="flex items-center justify-between pt-4 border-t border-offWhite-800/20">
                  <button className="flex items-center gap-2 text-offWhite-500 hover:text-metallicGold-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">도움됨 ({review.helpful})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 더보기 버튼 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-3 border border-metallicGold-500/30 text-metallicGold-500 rounded-xl font-semibold hover:bg-metallicGold-500/10 transition-all">
            더 많은 리뷰 보기
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// 샘플 리뷰 데이터
export const sampleReviews: Review[] = [
  {
    id: 1,
    userName: '김**',
    rating: 5,
    date: '2024년 8월',
    comment:
      '정말 놀랍습니다! 비개발자인 제가 3일 만에 자동화 프로그램을 만들어냈어요. 특히 텔레그램으로 코딩하는 부분은 혁신적이었습니다. 이제 출퇴근길에도 프로그래밍을 할 수 있게 되었네요.',
    helpful: 24,
    verified: true,
    badges: ['완주생', '추천왕'],
  },
  {
    id: 2,
    userName: '이**',
    rating: 5,
    date: '2024년 7월',
    comment:
      '300만원짜리 강의를 들을 뻔했는데 이 강의로 더 실용적인 내용을 배웠습니다. Claude Code 세팅부터 실전 활용까지, 정말 체계적으로 설명해주시네요. 투자 대비 효과 최고!',
    helpful: 18,
    verified: true,
    badges: ['얼리버드'],
  },
  {
    id: 3,
    userName: '박**',
    rating: 5,
    date: '2024년 7월',
    comment:
      'AI 도구를 이렇게 효율적으로 쓸 수 있다는 걸 몰랐네요. 메타 자동화 개념은 정말 충격적이었습니다. 이제 자동화를 위한 자동화를 만들고 있어요. 사고의 전환이 일어났습니다.',
    helpful: 31,
    verified: true,
    badges: ['완주생', '실전왕'],
  },
];
