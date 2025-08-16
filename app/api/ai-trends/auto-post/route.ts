import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Cron job이거나 관리자만 허용
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isAuthorized = authHeader === `Bearer ${cronSecret}`;
    
    // 개발 환경에서는 인증 우회 (로컬호스트일 경부만)
    const isDevelopment = request.headers.get('host')?.includes('localhost');
    
    if (!isDevelopment && !isAuthorized) {
      if (user) {
        // 관리자 권한 확인
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json().catch(() => ({}));
    const { count, autoPublish = true, checkEligibility = false } = body;

    logger.info('Starting auto-post process', { count, autoPublish, checkEligibility });

    // 카테고리별 게시 가능 여부 확인
    let generateCount = count;
    const eligibleCategories: string[] = [];
    
    if (checkEligibility) {
      // 각 카테고리의 마지막 게시 시간 확인
      const categories = [
        { name: 'AI 부업정보', interval: 3 },
        { name: '바이브코딩 성공사례', interval: 7 },
        { name: 'MCP 추천', interval: 3 },
        { name: '클로드코드 Level UP', interval: 1 }
      ];
      
      for (const cat of categories) {
        const { data: categoryData } = await supabase
          .from('ai_trend_categories')
          .select('last_posted_at')
          .eq('name', cat.name)
          .single();
        
        if (!categoryData?.last_posted_at) {
          eligibleCategories.push(cat.name);
        } else {
          const lastPosted = new Date(categoryData.last_posted_at);
          const now = new Date();
          const daysSince = (now.getTime() - lastPosted.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSince >= cat.interval) {
            eligibleCategories.push(cat.name);
          }
        }
      }
      
      generateCount = eligibleCategories.length;
      logger.info('Eligible categories:', eligibleCategories);
      
      if (generateCount === 0) {
        return NextResponse.json({
          success: true,
          message: 'No categories eligible for posting today',
          stats: { generated: 0, saved: 0, failed: 0 }
        });
      }
    }

    // 1. Gemini API로 콘텐츠 생성
    const generateResponse = await fetch(
      new URL('/api/ai-trends/generate', request.url).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cronSecret}`
        },
        body: JSON.stringify({ 
          count,
          category: body.category,
          specificTopic: body.specificTopic
        })
      }
    );

    if (!generateResponse.ok) {
      throw new Error('Failed to generate content');
    }

    const { contents } = await generateResponse.json();
    
    if (!contents || contents.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No content generated'
      });
    }

    // 2. 생성된 콘텐츠를 데이터베이스에 저장
    // Service Role Key를 사용하여 RLS 우회
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const savedPosts = [];
    const errors = [];

    for (const content of contents) {
      try {
        // URL 친화적인 slug 생성 (영문만)
        const slug = content.title
          .toLowerCase()
          .replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]+/g, '') // 한글 제거
          .replace(/[^a-z0-9]+/g, '-') // 영문/숫자 외 문자를 하이픈으로
          .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
          .replace(/-{2,}/g, '-') // 연속 하이픈을 하나로
          .substring(0, 100);

        // 중복 slug 체크
        const { data: existing } = await supabaseAdmin
          .from('ai_trends')
          .select('slug')
          .eq('slug', slug)
          .single();

        const finalSlug = existing 
          ? `${slug}-${Date.now().toString(36)}`
          : slug;

        // 데이터베이스에 저장
        const { data, error } = await supabaseAdmin
          .from('ai_trends')
          .insert({
            title: content.title,
            slug: finalSlug,
            content: content.content,
            summary: content.summary,
            category: content.category,
            tags: content.tags,
            thumbnail_url: content.thumbnail || `https://placehold.co/1200x630/1a1a2e/ffd700?text=${encodeURIComponent(content.title?.substring(0, 30) || 'AI')}`,
            is_published: autoPublish,
            published_at: autoPublish ? new Date().toISOString() : null,
            view_count: 0,
            is_featured: false,
            source_name: 'Gemini AI Generated',
            seo_title: content.title.substring(0, 60),
            seo_description: content.summary.substring(0, 160),
            seo_keywords: content.tags.slice(0, 5)
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        savedPosts.push({
          id: data.id,
          title: data.title,
          slug: data.slug,
          status: data.is_published ? 'published' : 'draft'
        });

        logger.info('Post saved successfully', { 
          id: data.id, 
          title: data.title,
          status: data.is_published ? 'published' : 'draft'
        });

      } catch (error) {
        logger.error('Failed to save post:', error);
        errors.push({
          title: content.title,
          error: (error as Error).message
        });
      }
    }

    // 3. 결과 반환
    return NextResponse.json({
      success: true,
      message: `Successfully posted ${savedPosts.length} of ${contents.length} articles`,
      posts: savedPosts,
      errors: errors.length > 0 ? errors : undefined,
      stats: {
        generated: contents.length,
        saved: savedPosts.length,
        failed: errors.length,
        status: autoPublish ? 'published' : 'draft'
      }
    });

  } catch (error) {
    logger.error('Auto-post error:', error);
    return NextResponse.json(
      { 
        error: 'Auto-post failed', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Trends Auto-Post API',
    endpoint: '/api/ai-trends/auto-post',
    method: 'POST',
    description: 'Automatically generate and post AI trend articles',
    body: {
      count: 'number (optional, default: 3)',
      autoPublish: 'boolean (optional, default: true)'
    },
    authentication: 'Required: Bearer token (CRON_SECRET) or admin user session'
  });
}