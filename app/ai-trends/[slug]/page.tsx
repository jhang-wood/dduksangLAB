import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AITrendDetailClient from './page-client'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceKey
)

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params

  try {
    const { data: trend } = await supabase
      .from('ai_trends')
      .select('title, summary, seo_title, seo_description, seo_keywords, thumbnail_url')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (!trend) {
      return {
        title: 'AI 트렌드를 찾을 수 없습니다 | 떡상연구소',
        description: '요청하신 AI 트렌드 콘텐츠를 찾을 수 없습니다.',
      }
    }

    const title = trend.seo_title || trend.title
    const description = trend.seo_description || trend.summary

    return {
      title: `${title} | 떡상연구소`,
      description,
      keywords: trend.seo_keywords?.join(', ') || 'AI 트렌드, 인공지능',
      openGraph: {
        title: `${title} | 떡상연구소`,
        description,
        type: 'article',
        locale: 'ko_KR',
        siteName: '떡상연구소',
        images: trend.thumbnail_url ? [
          {
            url: trend.thumbnail_url,
            width: 1200,
            height: 630,
            alt: trend.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | 떡상연구소`,
        description,
        images: trend.thumbnail_url ? [trend.thumbnail_url] : undefined,
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
    }
  } catch (error) {
    logger.error('Error generating metadata:', error)
    return {
      title: 'AI 트렌드 | 떡상연구소',
      description: 'AI 트렌드 콘텐츠를 확인하세요.',
    }
  }
}

export default async function AITrendDetailPage({ params }: Props) {
  const { slug } = params

  // Fetch trend data
  const { data: trend, error } = await supabase
    .from('ai_trends')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !trend) {
    notFound()
  }

  // Increment view count
  await supabase.rpc('increment_ai_trend_views', { trend_id: trend.id })

  // Fetch related trends
  let relatedTrends: any[] = []
  if (trend.category) {
    const { data } = await supabase
      .from('ai_trends')
      .select('*')
      .eq('category', trend.category)
      .eq('is_published', true)
      .neq('id', trend.id)
      .limit(3)
      .order('published_at', { ascending: false })

    relatedTrends = data || []
  }

  return <AITrendDetailClient trend={trend} relatedTrends={relatedTrends} />
}