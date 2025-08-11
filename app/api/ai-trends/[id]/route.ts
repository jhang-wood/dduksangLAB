import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

// GET: Fetch single AI trend
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('ai_trends')
      .select('*')
      .eq('id', params.id)
      .eq('is_published', true)
      .single()

    if (error) {throw error}

    if (!data) {
      return NextResponse.json(
        { error: 'AI trend not found' },
        { status: 404 }
      )
    }

    // Increment view count using admin client for write operation
    const adminClient = createAdminClient()
    await adminClient.rpc('increment_ai_trend_views', { trend_id: params.id })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching AI trend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI trend' },
      { status: 500 }
    )
  }
}

// PUT: Update AI trend (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin using RLS-aware query
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile ?? profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json() as {
      title?: string
      slug?: string
      summary?: string
      content?: string
      thumbnail_url?: string
      category?: string
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

    // Update using user-scoped client to respect RLS
    const { data, error } = await supabase
      .from('ai_trends')
      .update({
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
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {throw error}

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating AI trend:', error)
    return NextResponse.json(
      { error: 'Failed to update AI trend' },
      { status: 500 }
    )
  }
}

// DELETE: Delete AI trend (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin using RLS-aware query
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile ?? profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete using user-scoped client to respect RLS
    const { error } = await supabase
      .from('ai_trends')
      .delete()
      .eq('id', params.id)

    if (error) {throw error}

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting AI trend:', error)
    return NextResponse.json(
      { error: 'Failed to delete AI trend' },
      { status: 500 }
    )
  }
}