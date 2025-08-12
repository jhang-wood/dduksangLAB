import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AITrendDetailClient from './page-client';

interface Props {
  params: { slug: string };
}

// Mock trends data for static generation
const mockTrends = [
  {
    id: '1',
    title: '2025년 AI 자동화 혁명: 테스트 게시글',
    slug: '2025년-AI-자동화-혁명-테스트-게시글',
    summary: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 살펴보겠습니다.',
    seo_title: '2025년 AI 자동화 혁명 완전 분석',
    seo_description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    seo_keywords: ['AI', '자동화', '2025년', '혁신', '디지털 전환'],
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
  },
  {
    id: '2', 
    title: 'ChatGPT-4의 새로운 멀티모달 기능',
    slug: 'chatgpt-4-multimodal-features',
    summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
    seo_title: 'ChatGPT-4 멀티모달 기능 완전 가이드',
    seo_description: 'OpenAI ChatGPT-4의 이미지 처리 및 멀티모달 기능을 상세히 알아보세요.',
    seo_keywords: ['ChatGPT-4', '멀티모달', 'OpenAI', 'AI'],
    thumbnail_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'GitHub Copilot Chat의 새로운 업데이트', 
    slug: 'github-copilot-chat-update',
    summary: 'GitHub Copilot Chat의 최신 업데이트 기능을 살펴보고 개발 생산성을 높여보세요.',
    seo_title: 'GitHub Copilot Chat 업데이트 완전 분석',
    seo_description: 'GitHub Copilot Chat의 새로운 기능들과 개발 생산성 향상 방법을 알아보세요.',
    seo_keywords: ['GitHub Copilot', 'Chat', '개발도구', 'AI'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=600&fit=crop'
  }
];

// Generate static params for all known slugs
export async function generateStaticParams() {
  return mockTrends.map((trend) => ({
    slug: trend.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  // Find trend data from mock data
  const trend = mockTrends.find(t => t.slug === slug);

  if (!trend) {
    return {
      title: 'AI 트렌드를 찾을 수 없습니다 | 떡상연구소',
      description: '요청하신 AI 트렌드 콘텐츠를 찾을 수 없습니다.',
    };
  }

  const title = trend.seo_title ?? trend.title;
  const description = trend.seo_description ?? trend.summary;

  return {
    title: `${title} | 떡상연구소`,
    description,
    keywords: trend.seo_keywords?.join(', ') ?? 'AI 트렌드, 인공지능',
    openGraph: {
      title: `${title} | 떡상연구소`,
      description,
      type: 'article',
      locale: 'ko_KR',
      siteName: '떡상연구소',
      ...(trend.thumbnail_url && {
        images: [
          {
            url: trend.thumbnail_url,
            width: 1200,
            height: 630,
            alt: trend.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 떡상연구소`,
      description,
      ...(trend.thumbnail_url && {
        images: [trend.thumbnail_url],
      }),
    },
    alternates: {
      canonical: `/ai-trends/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false; // 완전 정적 생성

export default async function AITrendDetailPage({ params }: Props) {
  const { slug } = params;

  // Check if slug exists in our mock data
  const trendExists = mockTrends.some(trend => trend.slug === slug);
  
  if (!trendExists) {
    notFound();
  }

  return <AITrendDetailClient slug={slug} />;
}