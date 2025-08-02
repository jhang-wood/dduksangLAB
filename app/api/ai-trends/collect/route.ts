import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const cronSecret = process.env.CRON_SECRET || 'admin-collect'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// AI trend categories
const TREND_CATEGORIES = [
  'AI 기술',
  'AI 도구',
  'AI 활용',
  'AI 비즈니스',
  'AI 교육'
]

// POST: Collect AI trends automatically
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret or admin authentication
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')

    if (providedSecret !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check how many trends already exist for today
    const { count } = await supabase
      .from('ai_trends')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    if (count && count >= 3) {
      return NextResponse.json({
        message: 'Daily trend limit already reached',
        count
      })
    }

    const trendsToCreate = 3 - (count || 0)
    const createdTrends = []

    // Generate mock AI trends
    const mockTrendTemplates = [
      {
        title: "2025년 주목할 AI 도구 TOP 5",
        summary: "생산성 향상을 위한 최신 AI 도구들을 소개합니다.",
        content: "<h2>혁신적인 AI 도구들</h2><p>2025년에는 더욱 발전된 AI 도구들이 등장했습니다...</p>",
        tags: ["AI도구", "생산성", "자동화"],
        source_name: "AI 트렌드 연구소"
      },
      {
        title: "ChatGPT vs Claude: 성능 비교 분석",
        summary: "주요 AI 모델들의 장단점을 상세히 비교해봅니다.",
        content: "<h2>AI 모델 비교</h2><p>각 AI 모델은 고유한 특징과 강점을 가지고 있습니다...</p>",
        tags: ["ChatGPT", "Claude", "AI비교"],
        source_name: "AI 트렌드 연구소"
      },
      {
        title: "AI 시대의 새로운 직업 전망",
        summary: "AI 발전으로 인해 새롭게 주목받는 직업들을 알아봅니다.",
        content: "<h2>미래 직업 트렌드</h2><p>AI가 발전하면서 새로운 직업 기회들이 생겨나고 있습니다...</p>",
        tags: ["미래직업", "AI진로", "커리어"],
        source_name: "AI 트렌드 연구소"
      }
    ]

    // Generate AI trends
    for (let i = 0; i < trendsToCreate; i++) {
      const category = TREND_CATEGORIES[i % TREND_CATEGORIES.length]
      const template = mockTrendTemplates[i % mockTrendTemplates.length]
      
      try {
        const trendData = {
          ...template,
          title: `${template.title} - ${new Date().getMonth() + 1}월 에디션`,
          summary: template.summary,
          content: template.content + `<p>게시일: ${new Date().toLocaleDateString('ko-KR')}</p>`,
          tags: [...template.tags, category.replace(' ', '')],
          source_name: template.source_name
        }

        // Generate slug
        const slug = trendData.title.toLowerCase()
          .replace(/[^a-z0-9가-힣]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          + '-' + Date.now()

        // Generate content hash
        const contentHash = await generateContentHash(trendData.content)

        // Check for duplicate
        const { data: existingHash } = await supabase
          .from('ai_trends_hash')
          .select('id')
          .eq('content_hash', contentHash)
          .single()

        if (!existingHash) {
          // Insert the trend
          const { data: trend, error: trendError } = await supabase
            .from('ai_trends')
            .insert({
              title: trendData.title,
              slug,
              summary: trendData.summary,
              content: trendData.content,
              category,
              tags: trendData.tags || [],
              source_name: trendData.source_name || 'AI 트렌드 연구소',
              seo_title: trendData.title.substring(0, 70),
              seo_description: trendData.summary.substring(0, 160),
              seo_keywords: trendData.tags || [],
              is_published: true,
              thumbnail_url: `/images/ai-trends/default-${category.toLowerCase().replace(/\s+/g, '-')}.jpg`
            })
            .select()
            .single()

          if (!trendError && trend) {
            // Store content hash
            await supabase
              .from('ai_trends_hash')
              .insert({
                content_hash: contentHash,
                trend_id: trend.id
              })

            createdTrends.push(trend)
          }
        }
      } catch (error) {
        logger.error(`Error creating trend for category ${category}:`, error)
      }
    }

    return NextResponse.json({
      message: 'AI trends collected successfully',
      created: createdTrends.length,
      trends: createdTrends
    })
  } catch (error) {
    logger.error('Error collecting AI trends:', error)
    return NextResponse.json(
      { error: 'Failed to collect AI trends' },
      { status: 500 }
    )
  }
}

// Helper function to generate content hash
async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}