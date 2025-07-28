import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceKey
)

const genAI = new GoogleGenerativeAI(env.geminiApiKey || '')

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
    const cronSecret = process.env.CRON_SECRET

    if (authHeader !== `Bearer ${cronSecret}`) {
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

    // Generate AI trends
    for (let i = 0; i < trendsToCreate; i++) {
      const category = TREND_CATEGORIES[i % TREND_CATEGORIES.length]
      
      try {
        // Generate AI trend content using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const prompt = `당신은 AI 트렌드 전문가입니다. 최신 AI 기술, 도구, 활용 사례에 대한 트렌드 기사를 작성합니다.

중요 지침:
1. 중학생도 이해할 수 있는 쉬운 언어로 작성
2. 실제 존재하는 AI 기술이나 도구를 기반으로 작성
3. 2024-2025년 최신 트렌드 반영
4. 실용적이고 구체적인 내용 포함
5. 흥미로운 제목과 요약 작성

카테고리 "${category}"에 대한 AI 트렌드 기사를 작성해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "title": "흥미로운 제목 (50자 이내)",
  "summary": "핵심 내용 요약 (100자 이내)",
  "content": "본문 내용 (마크다운 형식, 800-1200자)",
  "tags": ["태그1", "태그2", "태그3"],
  "source_name": "출처명",
  "seo_keywords": ["SEO키워드1", "SEO키워드2", "SEO키워드3"]
}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        // Extract JSON from response (Gemini sometimes adds extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('Invalid JSON response from Gemini')
        }
        
        const trendData = JSON.parse(jsonMatch[0])

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
              seo_keywords: trendData.seo_keywords || trendData.tags || [],
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