import { NextRequest, NextResponse } from 'next/server'
import { createActionClient, createAdminClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { AITrend } from '@/types'

// GET: Fetch AI trends with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '12', 10)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Use action client for RLS-aware queries  
    const supabase = createActionClient()
    
    let query = supabase
      .from('ai_trends')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(from, to)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error, count } = await query

    if (error) {throw error}

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit)
      }
    })
  } catch (error) {
    logger.error('Error fetching AI trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI trends' },
      { status: 500 }
    )
  }
}

// POST: Create new AI trend (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header first (Bearer token)
    const authHeader = request.headers.get('authorization')
    let user = null
    let userSupabase = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      const token = authHeader.substring(7)
      logger.log('[API] Using Authorization header token')
      
      // Create supabase client with the specific token
      const { createClient } = await import('@supabase/supabase-js')
      const tokenSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      )
      
      const { data: { user: tokenUser }, error: tokenError } = await tokenSupabase.auth.getUser()
      
      if (tokenUser && !tokenError) {
        user = tokenUser
        userSupabase = tokenSupabase
        logger.log('[API] Authorization header auth result:', { 
          user: user.email, 
          success: true 
        })
      } else {
        logger.log('[API] Authorization header auth failed:', { 
          error: tokenError?.message 
        })
      }
    }

    // Fallback to cookie-based auth if no Authorization header or token auth failed
    if (!user) {
      const supabase = createActionClient()
      const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser()
      
      if (cookieUser && !cookieError) {
        user = cookieUser
        userSupabase = supabase
        logger.log('[API] Cookie-based auth result:', { 
          user: user.email, 
          success: true 
        })
      } else {
        logger.log('[API] Cookie-based auth failed:', { 
          error: cookieError?.message 
        })
      }
    }

    if (!user || !userSupabase) {
      logger.error('[API] No authenticated user found via token or cookies')
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      )
    }

    // Check if user is admin using admin client to bypass RLS
    const adminClient = createAdminClient()
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    logger.log('[API] Profile check result:', { 
      profile: profile?.role, 
      error: profileError?.message 
    })

    if (profileError || !profile || profile.role !== 'admin') {
      logger.error('[API] Admin access denied:', { profile, error: profileError })
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json() as {
      title: string
      slug?: string
      summary: string
      content: string
      thumbnail_url?: string
      category: string
      tags?: string[]
      source_url?: string
      source_name?: string
      seo_title?: string
      seo_description?: string
      seo_keywords?: string[]
      is_featured?: boolean
      is_published?: boolean
    }
    const {
      title,
      slug,
      summary,
      content,
      thumbnail_url,
      category,
      tags,
      source_url,
      source_name,
      seo_title,
      seo_description,
      seo_keywords,
      is_featured,
      is_published
    } = body

    logger.log('[API] Processing request body, title:', title)
    logger.log('[API] Processing request body, title:', title)

    // Generate slug if not provided
    const finalSlug = slug ?? title.toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    logger.log('[API] Generated slug:', finalSlug)

    // Create content hash for duplicate prevention
    const contentHash = await generateContentHash(content)
    logger.log('[API] Generated content hash:', `${contentHash.substring(0, 16)  }...`)

    // Check for duplicate using existing admin client
    logger.log('[API] Checking for duplicate content...')
    const { data: existingHash } = await adminClient
      .from('ai_trends_hash')
      .select('id')
      .eq('content_hash', contentHash)
      .single()

    logger.log('[API] Duplicate check result:', existingHash ? 'Found duplicate' : 'No duplicate')

    if (existingHash) {
      return NextResponse.json(
        { error: 'Duplicate content detected' },
        { status: 409 }
      )
    }

    // Insert the trend using the authenticated client (token or cookie-based)
    logger.log('[API] Inserting trend into database...')
    const { data: trend, error: trendError } = await userSupabase
      .from('ai_trends')
      .insert({
        title,
        slug: finalSlug,
        summary,
        content,
        thumbnail_url,
        category,
        tags: tags ?? [],
        source_url,
        source_name,
        seo_title: seo_title ?? title.substring(0, 70),
        seo_description: seo_description ?? summary.substring(0, 160),
        seo_keywords: seo_keywords ?? tags ?? [],
        is_featured: is_featured ?? false,
        is_published: is_published !== false,
        created_by: user.id
      })
      .select()
      .single()

    logger.log('[API] Database insert result:', trendError ? 'ERROR' : 'SUCCESS', trendError || 'Trend created')

    if (trendError) {
      logger.error('[API] Trend insertion failed:', trendError)
      throw trendError
    }

    logger.log('[API] Trend created successfully:', (trend as AITrend).id)

    // Store content hash using admin client
    const { error: hashError } = await adminClient
      .from('ai_trends_hash')
      .insert({
        content_hash: contentHash,
        trend_id: (trend as AITrend).id
      })

    if (hashError) {
      logger.error('[API] Hash insertion failed:', hashError)
      // Don't throw here, trend is already created
    } else {
      logger.log('[API] Content hash stored successfully')
    }

    return NextResponse.json(trend)
  } catch (error) {
    logger.error('[API] Error creating AI trend:', error)
    logger.error('[API] Error creating AI trend:', error)
    
    // Extract meaningful error information
    let errorMessage = 'Unknown error'
    let errorDetails = null
    
    if (error && typeof error === 'object') {
      if ('message' in error) {errorMessage = String(error.message)}
      if ('code' in error) {errorDetails = { code: error.code }}
      if ('details' in error) {errorDetails = { ...errorDetails, details: error.details }}
      if ('hint' in error) {errorDetails = { ...errorDetails, hint: error.hint }}
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create AI trend',
        message: errorMessage,
        details: errorDetails
      },
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