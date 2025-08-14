'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Calendar, ChevronRight, Brain, Sparkles, TrendingUp, MessageSquare, Zap, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
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

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  'AI 기술': Brain,
  'AI 도구': Zap,
  'AI 활용': MessageSquare,
  'AI 비즈니스': TrendingUp,
  'AI 교육': Sparkles,
};

// Static mock data - synchronized with [slug]/page.tsx
const staticTrends = [
  {
    id: '1',
    title: '2025년 AI 자동화 혁명: 테스트 게시글',
    slug: '2025년-ai-자동화-혁명-테스트-게시글',
    summary: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 살펴보겠습니다.',
    category: 'AI 기술',
    tags: ['AI', '자동화', '2025년', '혁신'],
    published_at: '2024-12-01',
    view_count: 1500,
    is_featured: true,
    icon: Brain,
  },
  {
    id: '2',
    title: 'ChatGPT-4의 새로운 멀티모달 기능',
    slug: 'chatgpt-4-multimodal-features',
    summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
    category: 'AI 기술',
    tags: ['ChatGPT', 'OpenAI', '멀티모달'],
    published_at: '2024-11-15',
    view_count: 1234,
    is_featured: true,
    icon: MessageSquare,
  },
  {
    id: '3',
    title: 'GitHub Copilot Chat의 새로운 업데이트',
    slug: 'github-copilot-chat-update',
    summary: 'GitHub Copilot Chat의 최신 업데이트 기능을 살펴보고 개발 생산성을 높여보세요.',
    category: 'AI 도구',
    tags: ['GitHub', 'Copilot', '개발도구'],
    published_at: '2024-11-10',
    view_count: 856,
    is_featured: false,
    icon: Zap,
  },
  {
    id: '4',
    title: 'Claude 3.5 Sonnet의 혁신적인 코딩 능력',
    slug: 'claude-35-sonnet-coding-abilities',
    summary: 'Anthropic의 Claude 3.5 Sonnet이 보여주는 놀라운 코딩 및 추론 능력을 살펴보세요.',
    category: 'AI 기술',
    tags: ['Claude', 'Anthropic', '코딩AI'],
    published_at: '2025-08-10',
    view_count: 2341,
    is_featured: true,
    icon: Brain,
  },
  {
    id: '5',
    title: 'AI 기반 디자인 도구의 진화',
    slug: 'ai-design-tools-evolution',
    summary: 'Figma, Canva 등 디자인 도구에 AI가 통합되면서 창작 과정이 어떻게 변화하고 있는지 알아보세요.',
    category: 'AI 도구',
    tags: ['디자인', 'Figma', 'AI도구'],
    published_at: '2025-08-09',
    view_count: 1567,
    is_featured: false,
    icon: Sparkles,
  },
  {
    id: '6',
    title: 'AI와 함께하는 스마트 워크플로우',
    slug: 'smart-workflow-with-ai',
    summary: '업무 효율성을 극대화하는 AI 도구들과 워크플로우 구축 방법을 소개합니다.',
    category: 'AI 활용',
    tags: ['워크플로우', '생산성', '자동화'],
    published_at: '2025-08-08',
    view_count: 1890,
    is_featured: false,
    icon: TrendingUp,
  },
  {
    id: '7',
    title: '금융업계의 AI 혁신 사례',
    slug: 'fintech-ai-innovations',
    summary: '은행, 핀테크 기업들이 AI를 활용해 금융 서비스를 혁신하는 사례들을 살펴보세요.',
    category: 'AI 비즈니스',
    tags: ['핀테크', '금융AI', '혁신'],
    published_at: '2025-08-07',
    view_count: 1123,
    is_featured: false,
    icon: TrendingUp,
  },
  {
    id: '8',
    title: '실시간 AI 트렌드 자동화 테스트 완료',
    slug: 'realtime-ai-trends-automation-test-complete',
    summary: '떡상연구소 AI 트렌드 블로그 자동화 시스템이 성공적으로 테스트되었습니다.',
    category: 'AI 기술',
    tags: ['테스트', '자동화', '성공', '혁신'],
    published_at: '2025-08-12',
    view_count: 0,
    is_featured: true,
    icon: Sparkles,
  }
];

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
  const [useStaticData, setUseStaticData] = useState(false);
  
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
        
        if (data.trends && data.trends.length > 0) {
          setTrends(data.trends);
          setUseStaticData(false);
        } else {
          // Use static data as fallback
          setTrends(staticTrends as any);
          setUseStaticData(true);
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
        // Use static data as fallback
        setTrends(staticTrends as any);
        setUseStaticData(true);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchTrends();
  }, [selectedCategory]);
  
  const filteredTrends = useStaticData 
    ? (selectedCategory === 'all' ? trends : trends.filter(trend => trend.category === selectedCategory))
    : trends;
  
  const featuredTrends = filteredTrends.filter(trend => trend.is_featured);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-montserrat font-bold mb-6"
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                  AI 트렌드
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-offWhite-400 max-w-3xl mx-auto leading-relaxed"
              >
                매일 업데이트되는 최신 AI 기술과 도구를{' '}
                <span className="text-metallicGold-500 font-bold">실전에서 바로 활용</span>할 수 있는
                <br />
                압도적인 인사이트로 전달합니다
              </motion.p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 inline-flex items-center gap-2 px-6 py-3 bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-full"
              >
                <Sparkles className="w-5 h-5 text-metallicGold-500" />
                <span className="text-metallicGold-500 font-semibold">실시간 AI 트렌드 자동 수집 시스템 가동 중</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="px-4 mb-16">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
            >
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group relative px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'text-deepBlack-900'
                        : 'text-offWhite-400 hover:text-metallicGold-500'
                    }`}
                  >
                    {selectedCategory === category.id && (
                      <motion.div
                        layoutId="categoryBg"
                        className="absolute inset-0 bg-gradient-to-r from-metallicGold-500 via-metallicGold-600 to-metallicGold-900 rounded-2xl"
                      />
                    )}
                    <div className={`relative flex items-center gap-2 ${
                      selectedCategory === category.id ? '' : 'bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl px-6 py-3 hover:border-metallicGold-500/40'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Featured Trends */}
        {featuredTrends.length > 0 && (
          <section className="px-4 mb-20">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-offWhite-200 mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                    주목할 만한
                  </span>{' '}
                  트렌드
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTrends.map((trend, index) => {
                  const IconComponent = categoryIcons[trend.category] || Brain;
                  return (
                    <motion.div
                      key={trend.id}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/ai-trends/${trend.slug}`} className="group block h-full">
                        <article className="relative h-full bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl overflow-hidden hover:border-metallicGold-500/40 transition-all duration-300">
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Icon Header */}
                          <div className="relative h-48 bg-gradient-to-br from-metallicGold-500/5 to-deepBlack-800/50 flex items-center justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-12 h-12 text-metallicGold-500" />
                            </div>
                            {trend.is_featured && (
                              <div className="absolute top-4 right-4 px-3 py-1 bg-metallicGold-500/20 border border-metallicGold-500/30 rounded-full">
                                <span className="text-xs font-semibold text-metallicGold-500">FEATURED</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative p-8">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-metallicGold-500/10 border border-metallicGold-500/20 rounded-full text-xs font-medium text-metallicGold-500">
                                {trend.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-offWhite-600">
                                <Calendar className="w-3 h-3" />
                                {formatDate(trend.published_at)}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-offWhite-200 mb-3 group-hover:text-metallicGold-500 transition-colors line-clamp-2">
                              {trend.title}
                            </h3>
                            
                            <p className="text-offWhite-500 mb-6 line-clamp-3 leading-relaxed">
                              {trend.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm text-offWhite-600">
                                  <Eye className="w-4 h-4" />
                                  <span>{formatViewCount(trend.view_count)}</span>
                                </div>
                                {(trend.comment_count !== undefined && trend.comment_count > 0) && (
                                  <div className="flex items-center gap-1 text-sm text-offWhite-600">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{trend.comment_count}</span>
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="w-5 h-5 text-metallicGold-500 group-hover:translate-x-1 transition-transform" />
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

        {/* All Trends Grid */}
        <section className="px-4 pb-32">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-offWhite-200 mb-2">
                모든 트렌드
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900" />
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-metallicGold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-offWhite-400">AI 트렌드 로딩 중...</span>
                </div>
              </div>
            ) : filteredTrends.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-offWhite-400">아직 등록된 트렌드가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrends.map((trend, index) => {
                  const IconComponent = categoryIcons[trend.category] || Brain;
                  return (
                  <motion.div
                    key={trend.id}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/ai-trends/${trend.slug}`} className="group block h-full">
                      <article className="relative h-full bg-deepBlack-300/30 backdrop-blur-sm border border-metallicGold-900/10 rounded-2xl overflow-hidden hover:bg-deepBlack-300/50 hover:border-metallicGold-500/30 transition-all duration-300">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-6 h-6 text-metallicGold-500" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-offWhite-600">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(trend.published_at)}</span>
                            </div>
                          </div>
                          
                          <span className="inline-block px-2 py-1 bg-metallicGold-500/5 border border-metallicGold-500/10 rounded-lg text-xs font-medium text-metallicGold-500 mb-3">
                            {trend.category}
                          </span>
                          
                          <h3 className="text-lg font-semibold text-offWhite-200 mb-2 group-hover:text-metallicGold-500 transition-colors line-clamp-2">
                            {trend.title}
                          </h3>
                          
                          <p className="text-sm text-offWhite-500 mb-4 line-clamp-2 leading-relaxed">
                            {trend.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-offWhite-600">
                                <Eye className="w-4 h-4" />
                                <span>{formatViewCount(trend.view_count)}</span>
                              </div>
                              {(trend.comment_count !== undefined && trend.comment_count > 0) && (
                                <div className="flex items-center gap-1 text-sm text-offWhite-600">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{trend.comment_count}</span>
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-metallicGold-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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