import { Metadata } from 'next';
import AITrendDetailClient from '../[slug]/page-client';

export const metadata: Metadata = {
  title: '2025년 AI 자동화 혁명: 테스트 게시글 | 떡상연구소',
  description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
  keywords: 'AI, 자동화, 2025년, 혁신, 디지털 전환',
  openGraph: {
    title: '2025년 AI 자동화 혁명: 테스트 게시글 | 떡상연구소',
    description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    type: 'article',
    locale: 'ko_KR',
    siteName: '떡상연구소',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        width: 1200,
        height: 630,
        alt: '2025년 AI 자동화 혁명: 테스트 게시글',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2025년 AI 자동화 혁명: 테스트 게시글 | 떡상연구소',
    description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'],
  },
};

const trendData = {
  id: '1',
  title: '2025년 AI 자동화 혁명: 테스트 게시글',
  slug: '2025년-AI-자동화-혁명-테스트-게시글',
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
};

const relatedTrends = [
  {
    id: '2',
    title: 'ChatGPT-4의 새로운 멀티모달 기능',
    slug: 'chatgpt-4-multimodal-features',
    summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
    content: '# ChatGPT-4의 새로운 멀티모달 기능\n\nOpenAI의 ChatGPT-4가 이미지와 텍스트를 동시에 처리할 수 있는 새로운 기능을 선보였습니다.',
    thumbnail_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['ChatGPT', 'OpenAI', '멀티모달'],
    source_url: 'https://openai.com',
    source_name: 'OpenAI',
    published_at: new Date('2024-11-15').toISOString(),
    view_count: 1234
  }
];

export default function AITrendDetailPage() {
  return <AITrendDetailClient slug={trendData.slug} trend={trendData} relatedTrends={relatedTrends} />;
}