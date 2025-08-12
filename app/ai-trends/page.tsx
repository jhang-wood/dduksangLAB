import { Metadata } from 'next';
import React from 'react';
import { Clock, Eye, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI 트렌드 | 떡상연구소',
  description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
  keywords: 'AI, 인공지능, AI 트렌드, AI 기술, AI 도구, 떡상연구소',
  openGraph: {
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
  },
  alternates: {
    canonical: '/ai-trends',
  },
};

// Static generation 강제 설정
export const dynamic = 'force-static';
export const revalidate = 3600;

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
  }
];

const categories = [
  { id: 'all', label: '전체' },
  { id: 'AI 기술', label: 'AI 기술' },
  { id: 'AI 도구', label: 'AI 도구' },
  { id: 'AI 활용', label: 'AI 활용' },
  { id: 'AI 비즈니스', label: 'AI 비즈니스' },
  { id: 'AI 교육', label: 'AI 교육' },
];

export default function AITrendsPage() {
  const featuredTrends = staticTrends.filter(trend => trend.is_featured);
  
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-bold text-yellow-400">
            떡상연구소
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-yellow-400">
            AI 트렌드
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 mb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                className="px-6 py-3 rounded-lg font-medium whitespace-nowrap bg-yellow-500 text-gray-900"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trends */}
      <section className="px-4 mb-12">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-white mb-6">주목할 만한 트렌드</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTrends.map(trend => (
              <Link key={trend.id} href={`/ai-trends/${trend.slug}`} className="group">
                <article className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-yellow-500 transition-all">
                  <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                    <div className="text-4xl">🤖</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-yellow-400">
                        {trend.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(trend.published_at)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {trend.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{trend.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{formatViewCount(trend.view_count)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Trends Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-white mb-6">모든 트렌드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticTrends.map(trend => (
              <Link key={trend.id} href={`/ai-trends/${trend.slug}`} className="group">
                <article className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-yellow-500 transition-all h-full">
                  <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                    <div className="text-3xl">✨</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-yellow-500/20 rounded-full text-yellow-400">
                        {trend.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(trend.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {trend.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {trend.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{formatViewCount(trend.view_count)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}