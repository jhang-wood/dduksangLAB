import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AITrendDetailClient from './page-client';

interface Props {
  params: { slug: string };
}

// Mock trends data for static generation - synchronized with page.tsx
const mockTrends = [
  {
    id: '1',
    title: '2025년 AI 자동화 혁명: 테스트 게시글',
    slug: '2025년-ai-자동화-혁명-테스트-게시글',
    summary: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 살펴보겠습니다.',
    content: `# 2025년 AI 자동화 혁명: 테스트 게시글

2025년은 AI 자동화의 전환점이 될 것입니다. 이 글에서는 주요 변화들을 살펴보겠습니다.

## 주요 변화들

### 1. 업무 자동화
- RPA(로보틱 프로세스 자동화)의 확산
- 인텔리전트 문서 처리
- 자동화된 고객 서비스

### 2. 제조업 혁신
- 스마트 팩토리의 확산
- 예측 유지보수
- 품질 관리 자동화

### 3. 서비스 산업
- 개인화된 추천 시스템
- 자동 번역 및 통역
- 헬스케어 진단 지원

## 결론

AI 자동화는 우리의 일상과 업무를 근본적으로 변화시킬 것입니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['AI', '자동화', '2025년', '혁신'],
    source_url: 'https://example.com',
    source_name: '떡상연구소',
    published_at: new Date('2024-12-01').toISOString(),
    view_count: 1500,
    seo_title: '2025년 AI 자동화 혁명 완전 분석',
    seo_description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    seo_keywords: ['AI', '자동화', '2025년', '혁신', '디지털 전환']
  },
  {
    id: '2', 
    title: 'ChatGPT-4의 새로운 멀티모달 기능',
    slug: 'chatgpt-4-multimodal-features',
    summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
    content: `# ChatGPT-4의 새로운 멀티모달 기능

OpenAI의 ChatGPT-4가 이미지와 텍스트를 동시에 처리할 수 있는 멀티모달 기능을 선보였습니다.

## 주요 기능들

### 이미지 분석
- 사진 내용 설명
- 차트 및 그래프 해석
- 의료 영상 분석 지원

### 문서 처리
- PDF 문서 요약
- 표 데이터 분석
- 코드 스크린샷 해석

## 활용 사례

교육, 의료, 비즈니스 분야에서 다양한 활용이 기대됩니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['ChatGPT', 'OpenAI', '멀티모달'],
    source_url: 'https://openai.com',
    source_name: 'OpenAI',
    published_at: new Date('2024-11-15').toISOString(),
    view_count: 1234,
    seo_title: 'ChatGPT-4 멀티모달 기능 완전 가이드',
    seo_description: 'OpenAI ChatGPT-4의 이미지 처리 및 멀티모달 기능을 상세히 알아보세요.',
    seo_keywords: ['ChatGPT-4', '멀티모달', 'OpenAI', 'AI']
  },
  {
    id: '3',
    title: 'GitHub Copilot Chat의 새로운 업데이트', 
    slug: 'github-copilot-chat-update',
    summary: 'GitHub Copilot Chat의 최신 업데이트 기능을 살펴보고 개발 생산성을 높여보세요.',
    content: `# GitHub Copilot Chat의 새로운 업데이트

GitHub Copilot Chat이 개발자들의 코딩 경험을 더욱 향상시키는 새로운 기능들을 출시했습니다.

## 새로운 기능들

### 코드 리뷰 자동화
- 버그 발견 및 제안
- 성능 최적화 팁
- 보안 취약점 분석

### 문서화 지원
- 자동 주석 생성
- README 파일 작성
- API 문서 생성

## 개발 생산성 향상

이러한 기능들로 개발자들은 더 빠르고 효율적으로 코드를 작성할 수 있습니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=600&fit=crop',
    category: 'AI 도구',
    tags: ['GitHub', 'Copilot', '개발도구'],
    source_url: 'https://github.com',
    source_name: 'GitHub',
    published_at: new Date('2024-11-10').toISOString(),
    view_count: 856,
    seo_title: 'GitHub Copilot Chat 업데이트 완전 분석',
    seo_description: 'GitHub Copilot Chat의 새로운 기능들과 개발 생산성 향상 방법을 알아보세요.',
    seo_keywords: ['GitHub Copilot', 'Chat', '개발도구', 'AI']
  },
  {
    id: '4',
    title: 'Claude 3.5 Sonnet의 혁신적인 코딩 능력',
    slug: 'claude-35-sonnet-coding-abilities',
    summary: 'Anthropic의 Claude 3.5 Sonnet이 보여주는 놀라운 코딩 및 추론 능력을 살펴보세요.',
    content: `# Claude 3.5 Sonnet의 혁신적인 코딩 능력

Anthropic의 Claude 3.5 Sonnet은 코딩과 논리적 추론에서 탁월한 성능을 보여주고 있습니다.

## 주요 특징들

### 코딩 전문성
- 복잡한 알고리즘 구현
- 코드 리팩토링 및 최적화
- 다양한 프로그래밍 언어 지원

### 추론 능력
- 논리적 문제 해결
- 단계별 사고 과정 설명
- 창의적 솔루션 제안

## 실제 활용 사례

개발자들이 어떻게 Claude 3.5를 활용하여 생산성을 높이고 있는지 살펴보겠습니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['Claude', 'Anthropic', '코딩AI'],
    source_url: 'https://anthropic.com',
    source_name: 'Anthropic',
    published_at: new Date('2025-08-10').toISOString(),
    view_count: 2341,
    seo_title: 'Claude 3.5 Sonnet 코딩 능력 완전 분석',
    seo_description: 'Anthropic Claude 3.5 Sonnet의 혁신적인 코딩과 추론 능력을 상세히 알아보세요.',
    seo_keywords: ['Claude 3.5', 'Sonnet', 'Anthropic', '코딩AI', '추론']
  },
  {
    id: '5',
    title: 'AI 기반 디자인 도구의 진화',
    slug: 'ai-design-tools-evolution',
    summary: 'Figma, Canva 등 디자인 도구에 AI가 통합되면서 창작 과정이 어떻게 변화하고 있는지 알아보세요.',
    content: `# AI 기반 디자인 도구의 진화

디자인 분야에서 AI 기술이 창작 과정을 혁신하고 있습니다.

## 주요 도구들

### Figma AI
- 자동 레이아웃 생성
- 컴포넌트 자동 생성
- 디자인 시스템 최적화

### Adobe Firefly
- 생성형 이미지 제작
- 텍스트 효과 자동화
- 브랜드 일관성 유지

## 디자이너의 새로운 역할

AI 도구가 발전하면서 디자이너의 역할도 변화하고 있습니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    category: 'AI 도구',
    tags: ['디자인', 'Figma', 'AI도구'],
    source_url: 'https://figma.com',
    source_name: 'Figma',
    published_at: new Date('2025-08-09').toISOString(),
    view_count: 1567,
    seo_title: 'AI 디자인 도구 완전 가이드',
    seo_description: 'Figma, Canva 등 AI 기반 디자인 도구의 진화와 활용법을 알아보세요.',
    seo_keywords: ['AI 디자인', 'Figma', 'Canva', '디자인 도구']
  },
  {
    id: '6',
    title: 'AI와 함께하는 스마트 워크플로우',
    slug: 'smart-workflow-with-ai',
    summary: '업무 효율성을 극대화하는 AI 도구들과 워크플로우 구축 방법을 소개합니다.',
    content: `# AI와 함께하는 스마트 워크플로우

AI 도구를 활용한 효율적인 워크플로우 구축 방법을 알아보겠습니다.

## 핵심 도구들

### 자동화 도구
- Zapier를 통한 앱 연결
- 반복 작업 자동화
- 워크플로우 최적화

### 생산성 AI
- 문서 작성 지원
- 일정 관리 최적화
- 이메일 자동 분류

## 구현 전략

단계별로 AI 워크플로우를 구축하는 방법을 살펴보겠습니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    category: 'AI 활용',
    tags: ['워크플로우', '생산성', '자동화'],
    source_url: 'https://zapier.com',
    source_name: 'Zapier',
    published_at: new Date('2025-08-08').toISOString(),
    view_count: 1890,
    seo_title: 'AI 스마트 워크플로우 구축 가이드',
    seo_description: 'AI 도구를 활용한 효율적인 워크플로우 구축과 생산성 향상 방법을 알아보세요.',
    seo_keywords: ['AI 워크플로우', '자동화', '생산성', 'Zapier']
  },
  {
    id: '7',
    title: '금융업계의 AI 혁신 사례',
    slug: 'fintech-ai-innovations',
    summary: '은행, 핀테크 기업들이 AI를 활용해 금융 서비스를 혁신하는 사례들을 살펴보세요.',
    content: `# 금융업계의 AI 혁신 사례

금융 분야에서 AI 기술이 어떻게 혁신을 이끌고 있는지 살펴보겠습니다.

## 주요 혁신 영역

### 리스크 관리
- 신용 평가 자동화
- 사기 탐지 시스템
- 실시간 위험 분석

### 고객 서비스
- AI 챗봇 상담
- 개인화된 금융 상품 추천
- 투자 포트폴리오 최적화

## 실제 사례

글로벌 금융기관들의 AI 도입 사례를 분석해보겠습니다.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop',
    category: 'AI 비즈니스',
    tags: ['핀테크', '금융AI', '혁신'],
    source_url: 'https://fintech.com',
    source_name: 'FinTech News',
    published_at: new Date('2025-08-07').toISOString(),
    view_count: 1123,
    seo_title: '금융업계 AI 혁신 사례 분석',
    seo_description: '은행과 핀테크 기업들의 AI 활용 혁신 사례와 미래 전망을 알아보세요.',
    seo_keywords: ['핀테크', '금융AI', 'AI 혁신', '디지털 금융']
  }
];

// NOTE: generateStaticParams 함수는 동적 렌더링을 위해 비활성화됨
// 필요시 정적 생성으로 전환하려면 아래 함수의 주석을 해제
// export async function generateStaticParams() {
//   // Supabase에서 동적으로 slug 목록을 가져오는 방식 권장
//   return await getAiTrendsSlugs();
// }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let { slug } = params;

  // URL decode the slug to handle Korean characters
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {
    // If decoding fails, use original slug
  }

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

// Use dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic';

export default async function AITrendDetailPage({ params }: Props) {
  let { slug } = params;

  // URL decode the slug to handle Korean characters
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {
    // If decoding fails, use original slug
  }

  // Find the trend data
  const trend = mockTrends.find(t => t.slug === slug);
  
  if (!trend) {
    notFound();
  }

  // Get related trends (same category, excluding current)
  const relatedTrends = mockTrends.filter(t => 
    t.category === trend.category && t.slug !== slug
  ).slice(0, 3);

  return <AITrendDetailClient slug={slug} trend={trend} relatedTrends={relatedTrends} />;
}