import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build base query for counting
    let countQuery = supabase
      .from('ai_trends')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true);

    // Build data query
    let dataQuery = supabase
      .from('ai_trends')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    // Apply filters to both queries
    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category);
      dataQuery = dataQuery.eq('category', category);
    }

    if (featured === 'true') {
      countQuery = countQuery.eq('is_featured', true);
      dataQuery = dataQuery.eq('is_featured', true);
    }

    // Apply pagination to data query
    dataQuery = dataQuery.range(offset, offset + limit - 1);

    // Execute both queries
    const [{ count: totalCount, error: countError }, { data: trends, error: dataError }] = await Promise.all([
      countQuery,
      dataQuery
    ]);

    if (countError || dataError) {
      console.error('Database error:', countError || dataError);
      return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }

    // Transform data for frontend
    const transformedTrends = trends?.map((trend: any) => ({
      ...trend,
      published_at: trend.published_at || new Date().toISOString(),
      tags: trend.tags || [],
      seo_keywords: trend.seo_keywords || []
    })) || [];

    const totalPages = Math.ceil((totalCount || 0) / limit);

    const response = NextResponse.json({
      data: transformedTrends,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasMore: page < totalPages
      }
    });

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    
    return response;

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