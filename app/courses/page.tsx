'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import CourseCard from '@/components/CourseCard';
import SocialProofFeed from '@/components/SocialProofFeed';
import ReviewSystem from '@/components/ReviewSystem';
import { Search, Filter } from 'lucide-react';

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
    price: 490000,
    discountPrice: 297000,
    tags: ['AI', '자동화', '실무', '고급'],
    level: 'intermediate' as const,
    thumbnail: 'https://via.placeholder.com/400x225/1a1a2e/eee?text=AI+Agent',
    preview: 'https://example.com/preview.mp4',
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.tags.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      
      {/* 소셜 증명 피드 */}
      <SocialProofFeed />

      <div className="relative z-10">
        <Header currentPage="courses" />

        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* 페이지 헤더 */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-offWhite-200 mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                AI 마스터 과정
              </span>
              <br />전체 강의
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-offWhite-400 max-w-3xl mx-auto"
            >
              실무에서 바로 활용할 수 있는 AI 기술을 체계적으로 학습하세요
            </motion.p>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-offWhite-500" size={20} />
              <input
                type="text"
                placeholder="강의를 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl text-offWhite-200 placeholder-offWhite-500 focus:border-metallicGold-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-offWhite-500" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-12 pr-8 py-3 bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl text-offWhite-200 focus:border-metallicGold-500 transition-colors min-w-[200px]"
              >
                <option value="all">모든 카테고리</option>
                <option value="AI">AI</option>
                <option value="자동화">자동화</option>
                <option value="실무">실무</option>
              </select>
            </div>
          </div>

          {/* 강의 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* 리뷰 시스템 */}
          <div className="mt-20">
            <ReviewSystem courseId="all-courses" />
          </div>
        </div>
      </div>
    </div>
  );
}