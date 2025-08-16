import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { generateSlug, generateUniqueSlug, validateSlug } from '@/utils/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    
    // Check if this is an admin request
    const isAdminRequest = request.headers.get('X-Admin-Request') === 'true';
    
    // Query parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('ai_trends')
      .select('*');

    // For non-admin requests, only show published trends
    if (!isAdminRequest) {
      query = query.eq('is_published', true);
    }
    
    query = query.order('created_at', { ascending: false });

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: trends, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }

    // Transform data for frontend
    const transformedTrends = trends ? trends.map((trend: any) => ({
      ...trend,
      thumbnail: trend.thumbnail_url || trend.thumbnail, // Map thumbnail_url to thumbnail for consistency
      published_at: trend.published_at || new Date().toISOString(),
      tags: trend.tags || [],
      seo_keywords: trend.seo_keywords || []
    })) : [];

    return NextResponse.json({
      data: transformedTrends, // 관리자 페이지에서 사용하는 필드명
      trends: transformedTrends,
      count: transformedTrends.length,
      hasMore: transformedTrends.length === limit
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.summary || !body.content) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    // Generate or validate slug
    let slug = body.slug;
    if (!slug || !validateSlug(slug)) {
      slug = generateSlug(body.title);
    }

    // Check for slug uniqueness
    const { data: existingSlugs } = await supabase
      .from('ai_trends')
      .select('slug')
      .neq('slug', ''); // Exclude empty slugs

    const slugList = existingSlugs?.map(item => item.slug) || [];
    const uniqueSlug = generateUniqueSlug(slug, slugList);

    const { data: trend, error } = await supabase
      .from('ai_trends')
      .insert([{
        title: body.title,
        slug: uniqueSlug,
        summary: body.summary,
        content: body.content,
        thumbnail_url: body.thumbnail_url,
        category: body.category,
        tags: body.tags || [],
        source_url: body.source_url,
        source_name: body.source_name,
        is_featured: body.is_featured || false,
        is_published: body.is_published !== false, // Default to true
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        seo_keywords: body.seo_keywords || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to create trend' }, { status: 500 });
    }

    return NextResponse.json(trend, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}