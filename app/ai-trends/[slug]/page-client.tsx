'use client';

import React, { useState } from 'react';
import { Calendar, Eye, ArrowLeft, Tag, Share2, Copy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Script from 'next/script';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface AITrend {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail_url: string;
  category: string;
  tags: string[];
  source_url?: string;
  source_name?: string;
  published_at: string;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

interface AITrendDetailClientProps {
  slug: string;
  trend: AITrend | null;
  relatedTrends: AITrend[];
}

export default function AITrendDetailClient({ slug: _slug, trend: initialTrend, relatedTrends: initialRelatedTrends }: AITrendDetailClientProps) {
  const [trend] = useState<AITrend | null>(initialTrend);
  const [relatedTrends] = useState<AITrend[]>(initialRelatedTrends);
  const [loading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: trend?.title ?? '',
          text: trend?.summary ?? '',
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Copy to clipboard as fallback
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const renderContent = (content: string) => {
    let htmlContent = content;
    
    // 마크다운인지 확인 (# 또는 ## 로 시작하거나 **를 포함하면 마크다운으로 간주)
    if (content.includes('#') || content.includes('**') || content.includes('*') || content.includes('-')) {
      try {
        // 마크다운을 HTML로 변환
        htmlContent = marked(content);
        
        // 브라우저 환경에서만 DOMPurify 실행 (SSR 호환성)
        if (typeof window !== 'undefined') {
          htmlContent = DOMPurify.sanitize(htmlContent);
        }
      } catch (error) {
        console.error('마크다운 변환 오류:', error);
        htmlContent = content; // 변환 실패 시 원본 사용
      }
    }
    
    return (
      <div 
        className="prose prose-lg prose-invert max-w-none article-content-wrapper"
        style={{
          // CSS-in-JS로 강제 스타일 적용 (Tailwind override 방지)
          '--heading-color': '#E8E8E8',
          '--text-color': '#C4C4C4',
          '--accent-color': '#FFD700'
        } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="relative z-10">
          <Header />
          <div className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
            <div className="animate-pulse">
              <div className="h-8 bg-deepBlack-600/50 rounded mb-8 w-32" />
              <div className="h-12 bg-deepBlack-600/50 rounded mb-6" />
              <div className="h-6 bg-deepBlack-600/50 rounded mb-6 w-3/4" />
              <div className="h-96 bg-deepBlack-600/50 rounded-2xl mb-12" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-deepBlack-600/50 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="relative z-10">
          <Header />
          <div className="container mx-auto max-w-4xl px-4 pt-32 pb-20 text-center">
            <h1 className="text-3xl font-bold text-offWhite-200 mb-4">
              게시글을 찾을 수 없습니다
            </h1>
            <p className="text-offWhite-500 mb-8">
              요청하신 AI 트렌드 게시글을 찾을 수 없습니다.
            </p>
            <Link
              href="/ai-trends"
              className="inline-flex items-center gap-2 px-6 py-3 bg-metallicGold-500 text-deepBlack-900 rounded-lg hover:bg-metallicGold-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              AI 트렌드 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 구조화된 데이터 생성 (SEO)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": trend.title,
    "description": trend.summary,
    "image": trend.thumbnail_url,
    "datePublished": trend.published_at,
    "dateModified": trend.published_at,
    "author": {
      "@type": "Organization",
      "name": "떡상연구소",
      "url": "https://dduksang.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "떡상연구소",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dduksang.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dduksang.com/ai-trends/${trend.slug}`
    },
    "keywords": trend.tags.join(", "),
    "articleSection": trend.category,
    "wordCount": trend.content.length,
    "inLanguage": "ko-KR"
  };

  return (
    <>
      {/* 구조화된 데이터 스크립트 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
        <NeuralNetworkBackground />
        <div className="relative z-10">
          <Header />

        {/* Article Content */}
        <article className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
          {/* Back Button */}
          <Link
            href="/ai-trends"
            className="inline-flex items-center gap-2 text-offWhite-500 hover:text-metallicGold-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>AI 트렌드 목록으로</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-sm text-offWhite-600">
              <span className="px-3 py-1 bg-metallicGold-900/20 rounded-full text-metallicGold-500">
                {trend.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trend.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViewCount(trend.view_count)} 조회
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offWhite-200 mb-6">
              {trend.title}
            </h1>

            <p className="text-xl text-offWhite-500 mb-6">{trend.summary}</p>

            {/* Share and Tags */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                {trend.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-deepBlack-300/50 text-offWhite-600 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  void handleShare();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-deepBlack-300/50 text-offWhite-500 rounded-lg hover:bg-deepBlack-300/70 transition-colors"
              >
                {copied ? <Copy className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                <span>{copied ? '복사됨!' : '공유'}</span>
              </button>
            </div>
          </header>

          {/* Thumbnail Image */}
          {trend.thumbnail_url && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
              <Image src={trend.thumbnail_url} alt={trend.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/60 to-transparent" />
            </div>
          )}

          {/* Article Content - SEO 최적화된 콘텐츠 */}
          <article className="article-content">
            {renderContent(trend.content)}
          </article>

          {/* Source Information */}
          {trend.source_name && (
            <div className="mt-12 p-6 bg-deepBlack-300/30 rounded-xl border border-metallicGold-900/20">
              <p className="text-sm text-offWhite-600">
                출처: <span className="text-metallicGold-500">{trend.source_name}</span>
                {trend.source_url && (
                  <>
                    {' • '}
                    <a
                      href={trend.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-metallicGold-500 hover:underline"
                    >
                      원문 보기
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
        </article>

        {/* Related Trends */}
        {relatedTrends.length > 0 && (
          <section className="py-16 px-4 border-t border-metallicGold-900/20">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-offWhite-200 mb-8">관련 트렌드</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTrends.map(relatedTrend => (
                  <Link
                    key={relatedTrend.id}
                    href={`/ai-trends/${relatedTrend.slug}`}
                    className="group"
                  >
                    <article className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl overflow-hidden hover:border-metallicGold-500/50 transition-all h-full">
                      {relatedTrend.thumbnail_url && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedTrend.thumbnail_url}
                            alt={relatedTrend.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/60 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-offWhite-200 mb-2 line-clamp-2 group-hover:text-metallicGold-500 transition-colors">
                          {relatedTrend.title}
                        </h3>
                        <p className="text-sm text-offWhite-600 line-clamp-3">
                          {relatedTrend.summary}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Premium Course Promotion - 미니멀하고 고급스러운 디자인 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="relative group">
              {/* 메인 카드 */}
              <div className="bg-gradient-to-br from-deepBlack-200/50 to-deepBlack-300/30 backdrop-blur-xl border border-metallicGold-900/20 rounded-3xl p-8 relative overflow-hidden">
                
                {/* 서브틀한 배경 패턴 */}
                <div className="absolute inset-0 opacity-[0.02]">
                  <div className="absolute top-8 right-8 w-64 h-64 border border-metallicGold-500 rounded-full"></div>
                  <div className="absolute -bottom-32 -left-32 w-96 h-96 border border-metallicGold-500 rounded-full"></div>
                </div>
                
                {/* 그라데이션 오버레이 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-metallicGold-500/5 to-transparent rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* 헤더 섹션 */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-metallicGold-400 to-metallicGold-600 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-medium text-offWhite-200 mb-1">
                        실무 AI 활용 강의
                      </h3>
                      <p className="text-sm text-offWhite-500">
                        현업에서 바로 써먹는 실전 커리큘럼
                      </p>
                    </div>
                  </div>
                  
                  {/* 메인 컨텐츠 - 리스트 형식 */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* 왼쪽: 핵심 특징 */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-metallicGold-400 uppercase tracking-wider mb-4">
                        핵심 특징
                      </h4>
                      
                      {[
                        { num: "01", text: "현업 사례 중심 실습" },
                        { num: "02", text: "1:1 멘토링 세션" },
                        { num: "03", text: "평생 무료 업데이트" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-metallicGold-500/10 border border-metallicGold-500/20 flex items-center justify-center">
                            <span className="text-xs font-mono text-metallicGold-400">{item.num}</span>
                          </div>
                          <span className="text-sm text-offWhite-300">{item.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 오른쪽: 학습 방식 */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-metallicGold-400 uppercase tracking-wider mb-4">
                        학습 방식
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-deepBlack-300/30 border border-metallicGold-900/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-metallicGold-400 rounded-full"></div>
                            <span className="text-xs font-medium text-offWhite-300">프로젝트 기반</span>
                          </div>
                          <p className="text-xs text-offWhite-500 pl-3.5">실제 업무에 적용 가능한 프로젝트</p>
                        </div>
                        
                        <div className="p-3 rounded-xl bg-deepBlack-300/30 border border-metallicGold-900/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-metallicGold-400 rounded-full"></div>
                            <span className="text-xs font-medium text-offWhite-300">단계별 진행</span>
                          </div>
                          <p className="text-xs text-offWhite-500 pl-3.5">기초부터 고급까지 체계적 학습</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA 섹션 */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-metallicGold-900/20">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-xs text-offWhite-500 mb-1">
                        무료 체험 • 언제든 질문 • 만족도 보장
                      </p>
                    </div>
                    
                    <Link
                      href="/lectures"
                      className="group/btn relative px-6 py-2.5 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 rounded-xl font-medium text-sm hover:from-metallicGold-400 hover:to-metallicGold-500 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <span>강의 둘러보기</span>
                      <div className="w-4 h-4 rounded-full bg-deepBlack-900/20 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
                        <span className="text-xs">→</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}