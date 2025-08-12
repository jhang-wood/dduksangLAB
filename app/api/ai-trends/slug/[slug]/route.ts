import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { AITrend } from '@/types';

const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);

// GET: Fetch AI trend by slug
export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { data, error } = await supabase
      .from('ai_trends')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'AI trend not found' }, { status: 404 });
    }

    // Increment view count
    await supabase.rpc('increment_ai_trend_views', { trend_id: (data as AITrend).id });

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching AI trend by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch AI trend' }, { status: 500 });
  }
}
