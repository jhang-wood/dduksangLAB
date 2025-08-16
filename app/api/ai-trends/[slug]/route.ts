import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createAdminClient();
    let { slug } = params;

    // URL decode the slug to handle Korean characters
    try {
      slug = decodeURIComponent(slug);
    } catch (e) {
      // If decoding fails, use original slug
    }

    // Fetch the trend by slug
    const { data: trend, error } = await supabase
      .from('ai_trends')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
      }
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch trend' }, { status: 500 });
    }

    // Increment view count
    await supabase.rpc('increment_ai_trend_views', { trend_id: trend.id });

    // Get related trends (same category, different slug)
    const { data: relatedTrends } = await supabase
      .from('ai_trends')
      .select('id, title, slug, summary, category, tags, published_at, view_count, thumbnail_url')
      .eq('category', trend.category)
      .eq('is_published', true)
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(3);

    // Transform data
    const transformedTrend = {
      ...trend,
      published_at: trend.published_at || new Date().toISOString(),
      tags: trend.tags || [],
      seo_keywords: trend.seo_keywords || []
    };

    const transformedRelated = relatedTrends?.map((related: any) => ({
      ...related,
      published_at: related.published_at || new Date().toISOString(),
      tags: related.tags || []
    })) || [];

    return NextResponse.json({
      trend: transformedTrend,
      relatedTrends: transformedRelated
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createAdminClient();
    const { slug } = params;
    const body = await request.json();

    const { data: trend, error } = await supabase
      .from('ai_trends')
      .update({
        title: body.title,
        summary: body.summary,
        content: body.content,
        thumbnail_url: body.thumbnail_url,
        category: body.category,
        tags: body.tags || [],
        source_url: body.source_url,
        source_name: body.source_name,
        is_featured: body.is_featured || false,
        is_published: body.is_published,
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        seo_keywords: body.seo_keywords || []
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update trend' }, { status: 500 });
    }

    return NextResponse.json(trend);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createAdminClient();
    const { slug } = params;

    const { error } = await supabase
      .from('ai_trends')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete trend' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}