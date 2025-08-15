'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Eye, Brain, Sparkles, TrendingUp, MessageSquare, Zap, MessageCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AITrend {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  published_at: string;
  view_count: number;
  comment_count: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Category colors for badges
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'AI 기술': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
  'AI 도구': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700' },
  'AI 활용': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
  'AI 비즈니스': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700' },
  'AI 교육': { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-700' },
};


const categories = [
  { id: 'all', label: '전체', icon: Brain },
  { id: 'AI 기술', label: 'AI 기술', icon: Brain },
  { id: 'AI 도구', label: 'AI 도구', icon: Zap },
  { id: 'AI 활용', label: 'AI 활용', icon: MessageSquare },
  { id: 'AI 비즈니스', label: 'AI 비즈니스', icon: TrendingUp },
  { id: 'AI 교육', label: 'AI 교육', icon: Sparkles },
];

export default function AITrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trends, setTrends] = useState<AITrend[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: '50',
          ...(selectedCategory !== 'all' && { category: selectedCategory }),
        });
        
        const response = await fetch(`/api/ai-trends?${params.toString()}`);
        const data = await response.json();
        
        if (data.trends) {
          setTrends(data.trends);
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
        setTrends([]);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchTrends();
  }, [selectedCategory]);
  
  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory);
  
  const featuredTrends = filteredTrends.filter(trend => trend.is_featured);
  
  // Calculate reading time (assuming 200 words per minute)
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Format relative time (5분 전, 3시간 전, 2일 전)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    } else if (diffInMinutes < 10080) { // 7 days
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };


  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="ai-trends" />
      
      {/* Hero Section - Simplified */}
      <section className="pt-24 pb-12 bg-white border-b">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI 트렌드
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              실전에서 바로 활용할 수 있는 최신 AI 기술과 도구 인사이트
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Trends */}
      {featuredTrends.length > 0 && (
        <section className="bg-white py-8">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                주목할 만한 트렌드
              </h2>
              <div className="w-16 h-1 bg-gray-900" />
            </div>

            <div className="space-y-6">
              {featuredTrends.map((trend) => {
                const categoryColor = categoryColors[trend.category] || categoryColors['AI 기술'];
                const readingTime = calculateReadingTime(trend.summary);
                
                return (
                  <Link key={trend.id} href={`/ai-trends/${trend.slug}`} className="group block">
                    <article className="flex gap-6 p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-18 md:w-40 md:h-[90px] bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src="/images/떡상연구소_로고/가죽배경_떡상연구소.png"
                            alt={trend.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                            {trend.category}
                          </span>
                          {trend.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                              FEATURED
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {trend.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {trend.summary}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatRelativeTime(trend.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {readingTime}분 읽기
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatViewCount(trend.view_count)}
                          </span>
                          {(trend.comment_count !== undefined && trend.comment_count > 0) && (
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {trend.comment_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Trends List */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              모든 트렌드
            </h2>
            <div className="w-16 h-1 bg-gray-900" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">AI 트렌드 로딩 중...</span>
              </div>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">아직 등록된 트렌드가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTrends.map((trend) => {
                const categoryColor = categoryColors[trend.category] || categoryColors['AI 기술'];
                const readingTime = calculateReadingTime(trend.summary);
                
                return (
                  <Link key={trend.id} href={`/ai-trends/${trend.slug}`} className="group block">
                    <article className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      {/* Mobile: Stack layout */}
                      <div className="flex flex-col sm:flex-row gap-4 p-6">
                        {/* Image */}
                        <div className="flex-shrink-0 order-1 sm:order-1">
                          <div className="w-full h-48 sm:w-32 sm:h-18 md:w-40 md:h-[90px] bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src="/images/떡상연구소_로고/가죽배경_떡상연구소.png"
                              alt={trend.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0 order-2 sm:order-2">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                              {trend.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {trend.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {trend.summary}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatRelativeTime(trend.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {readingTime}분 읽기
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {formatViewCount(trend.view_count)}
                            </span>
                            {(trend.comment_count !== undefined && trend.comment_count > 0) && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {trend.comment_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}