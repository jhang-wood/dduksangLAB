import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase-server';
import { sanitizeSlug } from '@/utils/helpers';
import AITrendDetailClient from './page-client';

interface Props {
  params: { slug: string };
}

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
  is_published: boolean;
}

/**
 * 데이터베이스에서 AI 트렌드 가져오기
 */
async function getAITrendBySlug(slug: string): Promise<AITrend | null> {
  try {
    const supabase = createAdminClient();
    
    // slug 정리
    const cleanSlug = sanitizeSlug(slug);
    
    const { data: trend, error } = await supabase
      .from('ai_trends')
      .select('*')
      .eq('slug', cleanSlug)
      .eq('is_published', true)
      .single();

    if (error || !trend) {
      return null;
    }

    // 조회수 증가
    await supabase.rpc('increment_ai_trend_views', { trend_id: trend.id });

    return {
      ...trend,
      published_at: trend.published_at || new Date().toISOString(),
      tags: trend.tags || [],
      seo_keywords: trend.seo_keywords || []
    };
  } catch (error) {
    console.error('Error fetching AI trend:', error);
    return null;
  }
}

/**
 * 관련 트렌드 가져오기 - 개선된 알고리즘
 */
async function getRelatedTrends(category: string, currentSlug: string, tags: string[] = []): Promise<AITrend[]> {
  try {
    const supabase = createAdminClient();
    const relatedTrends: AITrend[] = [];
    
    // 1. 같은 카테고리의 최신 글 3개
    const { data: categoryTrends } = await supabase
      .from('ai_trends')
      .select('id, title, slug, summary, category, tags, published_at, view_count, thumbnail_url')
      .eq('category', category)
      .eq('is_published', true)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(3);

    if (categoryTrends) {
      relatedTrends.push(...categoryTrends.map((trend: any) => ({
        ...trend,
        published_at: trend.published_at || new Date().toISOString(),
        tags: trend.tags || []
      })));
    }

    // 2. 태그가 겹치는 글 2개 (카테고리 무관)
    if (tags.length > 0 && relatedTrends.length < 6) {
      const { data: tagTrends } = await supabase
        .from('ai_trends')
        .select('id, title, slug, summary, category, tags, published_at, view_count, thumbnail_url')
        .contains('tags', tags.slice(0, 2)) // 첫 2개 태그로 검색
        .eq('is_published', true)
        .neq('slug', currentSlug)
        .order('view_count', { ascending: false })
        .limit(2);

      if (tagTrends) {
        const newTrends = tagTrends.filter(t => 
          !relatedTrends.find(rt => rt.id === t.id)
        );
        relatedTrends.push(...newTrends.map((trend: any) => ({
          ...trend,
          published_at: trend.published_at || new Date().toISOString(),
          tags: trend.tags || []
        })));
      }
    }

    // 3. 인기글 2개 추가
    if (relatedTrends.length < 6) {
      const { data: popularTrends } = await supabase
        .from('ai_trends')
        .select('id, title, slug, summary, category, tags, published_at, view_count, thumbnail_url')
        .eq('is_published', true)
        .neq('slug', currentSlug)
        .order('view_count', { ascending: false })
        .limit(2);

      if (popularTrends) {
        const newTrends = popularTrends.filter(t => 
          !relatedTrends.find(rt => rt.id === t.id)
        );
        relatedTrends.push(...newTrends.map((trend: any) => ({
          ...trend,
          published_at: trend.published_at || new Date().toISOString(),
          tags: trend.tags || []
        })));
      }
    }

    return relatedTrends.slice(0, 6); // 최대 6개
  } catch (error) {
    console.error('Error fetching related trends:', error);
    return [];
  }
}

// 동적 렌더링 활성화
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  // 정리된 slug로 데이터 조회
  const trend = await getAITrendBySlug(slug);

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
      canonical: `/ai-trends/${trend.slug}`,
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

export default async function AITrendDetailPage({ params }: Props) {
  const { slug } = params;
  
  // 데이터베이스에서 트렌드 데이터 조회
  const trend = await getAITrendBySlug(slug);
  
  if (!trend) {
    notFound();
  }

  // 관련 트렌드 조회 - 태그 기반 추천 포함
  const relatedTrends = await getRelatedTrends(trend.category, trend.slug, trend.tags);

  return <AITrendDetailClient slug={trend.slug} trend={trend} relatedTrends={relatedTrends} />;
}