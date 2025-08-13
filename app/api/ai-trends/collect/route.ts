import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { serverEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

// Mock AI trends data for collection (in real implementation, this would fetch from external sources)
const mockAITrendsData = [
  {
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
    is_featured: true,
    seo_title: '2025년 AI 자동화 혁명 완전 분석',
    seo_description: 'AI 자동화가 2025년에 어떻게 모든 산업을 변화시킬지 상세히 분석합니다.',
    seo_keywords: ['AI', '자동화', '2025년', '혁신', '디지털 전환']
  },
  {
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
    is_featured: true,
    seo_title: 'ChatGPT-4 멀티모달 기능 완전 가이드',
    seo_description: 'OpenAI ChatGPT-4의 이미지 처리 및 멀티모달 기능을 상세히 알아보세요.',
    seo_keywords: ['ChatGPT-4', '멀티모달', 'OpenAI', 'AI']
  }
];

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${serverEnv.cronSecret()}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const trendData of mockAITrendsData) {
      try {
        // Check if trend already exists
        const { data: existing } = await supabase
          .from('ai_trends')
          .select('id')
          .eq('slug', trendData.slug)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        // Insert new trend
        const { error: insertError } = await supabase
          .from('ai_trends')
          .insert([{
            ...trendData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (insertError) {
          errors.push({
            slug: trendData.slug,
            error: insertError.message
          });
        } else {
          inserted++;
        }

      } catch (error) {
        errors.push({
          slug: trendData.slug,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI trends collection error:', error);
    return NextResponse.json(
      { 
        error: 'Collection failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}