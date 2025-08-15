import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('ai_trends')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

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
      published_at: trend.published_at || new Date().toISOString(),
      tags: trend.tags || [],
      seo_keywords: trend.seo_keywords || []
    })) : [];

    return NextResponse.json({
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

    const { data: trend, error } = await supabase
      .from('ai_trends')
      .insert([{
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        content: body.content,
        thumbnail_url: body.thumbnail_url,
        category: body.category,
        tags: body.tags || [],
        source_url: body.source_url,
        source_name: body.source_name,
        is_featured: body.is_featured || false,
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