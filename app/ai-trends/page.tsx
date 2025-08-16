'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Brain, Sparkles, TrendingUp, MessageSquare, Zap, MessageCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import AutomationBanner from '@/components/AutomationBanner';

interface AITrend {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  published_at: string;
  view_count: number;
  comment_count?: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Category colors for badges - Dark theme consistent
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'AI 기술': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'AI 도구': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'AI 활용': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'AI 비즈니스': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'AI 교육': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
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
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="ai-trends" />
        
        {/* Hero Section - Dark Theme */}
        <section className="pt-32 pb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/30 to-transparent" />
          <div className="container mx-auto max-w-4xl px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  AI 트렌드
                </span>
              </h1>
              <p className="text-xl text-offWhite-400 max-w-2xl mx-auto leading-relaxed">
                실전에서 바로 활용할 수 있는 최신 AI 기술과 도구 인사이트
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 mx-auto mt-6" />
            </motion.div>
          </div>
        </section>

        {/* Automation Banner */}
        <section className="py-4 relative">
          <div className="container mx-auto max-w-4xl px-4">
            <AutomationBanner />
          </div>
        </section>

        {/* Category Tabs - Dark Theme */}
        <section className="py-4 relative">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex gap-3 overflow-x-auto pb-4"
            >
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 shadow-lg shadow-metallicGold-500/30'
                        : 'bg-deepBlack-300/60 text-offWhite-400 hover:bg-deepBlack-300/80 hover:text-metallicGold-400 border border-metallicGold-900/20 hover:border-metallicGold-500/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                    {selectedCategory === category.id && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-600/20 blur-sm" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Featured Trends - Dark Theme */}
        {featuredTrends.length > 0 && (
          <section className="py-8 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlack-800/30 to-transparent" />
            <div className="container mx-auto max-w-4xl px-4 relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-offWhite-200 mb-2">
                  주목할 만한 트렌드
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900" />
              </motion.div>

              <div className="space-y-8">
                {featuredTrends.map((trend, index) => {
                  const categoryColor = categoryColors[trend.category] || categoryColors['AI 기술'];
                  const readingTime = calculateReadingTime(trend.summary);
                  
                  return (
                    <motion.div
                      key={trend.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/ai-trends/${trend.slug}`} className="group block">
                        <article className="relative group overflow-hidden bg-gradient-to-br from-deepBlack-300/60 via-deepBlack-400/40 to-deepBlack-500/60 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-8 hover:border-metallicGold-500/40 hover:shadow-2xl hover:shadow-metallicGold-500/10 transition-all duration-500">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0">
                              <div className="relative w-32 h-18 md:w-40 md:h-[90px] bg-deepBlack-600/50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                  src={trend.thumbnail || `https://source.unsplash.com/800x400/?${encodeURIComponent(trend.category)}`}
                                  alt={trend.title}
                                  width={400}
                                  height={225}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                                  {trend.category}
                                </span>
                                {trend.is_featured && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-600/20 text-metallicGold-400 border border-metallicGold-500/30">
                                    ★ FEATURED
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="text-xl font-bold text-offWhite-200 mb-3 group-hover:text-metallicGold-400 transition-colors line-clamp-2">
                                {trend.title}
                              </h3>
                              
                              <p className="text-offWhite-500 mb-4 line-clamp-2 leading-relaxed">
                                {trend.summary}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-offWhite-600">
                                <span className="flex items-center gap-1 text-offWhite-500">
                                  <Clock className="w-4 h-4 text-metallicGold-500" />
                                  {formatRelativeTime(trend.published_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4 text-metallicGold-500" />
                                  {readingTime}분 읽기
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4 text-metallicGold-500" />
                                  {formatViewCount(trend.view_count)}
                                </span>
                                {(trend.comment_count !== undefined && trend.comment_count > 0) && (
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4 text-metallicGold-500" />
                                    {trend.comment_count}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* All Trends List - Dark Theme */}
        <section className="py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlack-800/20 to-transparent" />
          <div className="container mx-auto max-w-4xl px-4 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-offWhite-200 mb-2">
                모든 트렌드
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900" />
            </motion.div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-metallicGold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-offWhite-400">AI 트렌드 로딩 중...</span>
                </div>
              </motion.div>
            ) : filteredTrends.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-offWhite-500">아직 등록된 트렌드가 없습니다.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrends.map((trend, index) => {
                  const categoryColor = categoryColors[trend.category] || categoryColors['AI 기술'];
                  const readingTime = calculateReadingTime(trend.summary);
                  
                  return (
                    <motion.div
                      key={trend.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/ai-trends/${trend.slug}`} className="group block h-full">
                        <article className="relative group overflow-hidden bg-gradient-to-br from-deepBlack-300/50 via-deepBlack-400/30 to-deepBlack-500/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl hover:border-metallicGold-500/40 hover:shadow-xl hover:shadow-metallicGold-500/5 transition-all duration-400 h-full flex flex-col">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          
                          {/* Card Content - Vertical Layout */}
                          <div className="relative flex flex-col">
                            {/* Thumbnail Image - Top */}
                            <div className="relative w-full h-48 bg-deepBlack-600/50 overflow-hidden group-hover:scale-[1.02] transition-transform duration-400">
                              <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                              <Image
                                src={trend.thumbnail || `https://source.unsplash.com/800x400/?${encodeURIComponent(trend.category)}`}
                                alt={trend.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover"
                              />
                              {/* Category Badge Overlay */}
                              <div className="absolute top-3 left-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                                  {trend.category}
                                </span>
                              </div>
                            </div>
                            
                            {/* Content - Bottom */}
                            <div className="flex-1 p-5 flex flex-col">
                              <h3 className="text-lg font-bold text-offWhite-200 mb-3 group-hover:text-metallicGold-400 transition-colors line-clamp-2">
                                {trend.title}
                              </h3>
                              
                              <p className="text-sm text-offWhite-500 mb-4 line-clamp-3 leading-relaxed flex-grow">
                                {trend.summary}
                              </p>
                              
                              {/* Meta Info */}
                              <div className="flex items-center justify-between text-xs text-offWhite-600 pt-3 border-t border-metallicGold-900/10">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-metallicGold-500" />
                                    {formatRelativeTime(trend.published_at)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-metallicGold-500" />
                                    {formatViewCount(trend.view_count)}
                                  </span>
                                </div>
                                <span className="flex items-center gap-1 text-metallicGold-400">
                                  <BookOpen className="w-3 h-3" />
                                  {readingTime}분
                                </span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}