import { NextResponse } from 'next/server';

interface Props {
  params: { slug: string };
}

// Mock data for individual AI trend articles
const mockTrends = [
  {
    id: '1',
    title: '2025년 AI 자동화 혁명: 테스트 게시글',
    slug: '2025년-AI-자동화-혁명-테스트-게시글',
    summary: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 살펴보겠습니다.',
    content: `
# 2025년 AI 자동화 혁명: 테스트 게시글

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

AI 자동화는 우리의 일상과 업무를 근본적으로 변화시킬 것입니다.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['AI', '자동화', '2025년', '혁신'],
    published_at: new Date('2024-12-01').toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 1500,
    is_featured: true,
    is_published: true,
    seo_title: '2025년 AI 자동화 혁명 완전 분석',
    seo_description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    seo_keywords: ['AI', '자동화', '2025년', '혁신', '디지털 전환'],
    created_by: 'admin',
    created_at: new Date('2024-12-01').toISOString()
  },
  {
    id: '2',
    title: 'ChatGPT-4의 새로운 멀티모달 기능',
    slug: 'chatgpt-4-multimodal-features',
    summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
    content: `
# ChatGPT-4의 새로운 멀티모달 기능

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

교육, 의료, 비즈니스 분야에서 다양한 활용이 기대됩니다.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop',
    category: 'AI 기술',
    tags: ['ChatGPT', 'OpenAI', '멀티모달'],
    published_at: new Date('2024-11-15').toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 1234,
    is_featured: true,
    is_published: true,
    seo_title: 'ChatGPT-4 멀티모달 기능 완전 가이드',
    seo_description: 'OpenAI ChatGPT-4의 이미지 처리 및 멀티모달 기능을 상세히 알아보세요.',
    seo_keywords: ['ChatGPT-4', '멀티모달', 'OpenAI', 'AI'],
    created_by: 'admin',
    created_at: new Date('2024-11-15').toISOString()
  },
  {
    id: '3',
    title: 'GitHub Copilot Chat의 새로운 업데이트',
    slug: 'github-copilot-chat-update',
    summary: 'GitHub Copilot Chat의 최신 업데이트 기능을 살펴보고 개발 생산성을 높여보세요.',
    content: `
# GitHub Copilot Chat의 새로운 업데이트

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

이러한 기능들로 개발자들은 더 빠르고 효율적으로 코드를 작성할 수 있습니다.
    `,
    thumbnail_url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=600&fit=crop',
    category: 'AI 도구',
    tags: ['GitHub', 'Copilot', '개발도구'],
    published_at: new Date('2024-11-10').toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 856,
    is_featured: false,
    is_published: true,
    seo_title: 'GitHub Copilot Chat 업데이트 완전 분석',
    seo_description: 'GitHub Copilot Chat의 새로운 기능들과 개발 생산성 향상 방법을 알아보세요.',
    seo_keywords: ['GitHub Copilot', 'Chat', '개발도구', 'AI'],
    created_by: 'admin',
    created_at: new Date('2024-11-10').toISOString()
  }
];

export async function GET(_request: Request, { params }: Props) {
  try {
    let { slug } = params;
    
    // URL decode the slug to handle Korean characters
    slug = decodeURIComponent(slug);
    
    console.log('Looking for slug:', slug);
    console.log('Available slugs:', mockTrends.map(t => t.slug));
    
    // Find the trend by slug
    const trend = mockTrends.find(t => t.slug === slug);
    
    if (!trend) {
      return NextResponse.json({ error: 'AI trend not found' }, { status: 404 });
    }

    // Get related trends (same category, excluding current)
    const relatedTrends = mockTrends.filter(t => 
      t.category === trend.category && t.slug !== slug
    ).slice(0, 3);

    return NextResponse.json({
      ...trend,
      relatedTrends: relatedTrends
    });
  } catch (error) {
    console.error('Error fetching AI trend by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch AI trend' }, { status: 500 });
  }
}