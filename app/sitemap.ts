import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceKey
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dduksanglab.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ai-trends`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sites`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lectures`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Dynamic AI trends pages
  const { data: trends } = await supabase
    .from('ai_trends')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const trendPages = (trends || []).map((trend) => ({
    url: `${baseUrl}/ai-trends/${trend.slug}`,
    lastModified: new Date(trend.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...trendPages]
}