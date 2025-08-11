/**
 * 자동화 콘텐츠 관리 API
 * GET /api/automation/content - 콘텐츠 분석 조회
 * POST /api/automation/content - AI 콘텐츠 생성 및 관리
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentManager } from '@/lib/automation/content-manager';
import { getBlogPublisher } from '@/lib/automation/blog-publisher';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const action = searchParams.get('action') || 'analytics';

    // 인증 확인 (선택사항)
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: '인증이 필요합니다'
      }, { status: 401 });
    }

    const contentManager = getContentManager();

    switch (action) {
      case 'analytics':
        const analytics = await contentManager.getContentAnalytics(days);
        return NextResponse.json({
          success: true,
          data: analytics,
          timestamp: new Date().toISOString()
        });

      case 'scheduled':
        // 예약된 콘텐츠 처리 상태 확인
        await contentManager.processScheduledContent();
        return NextResponse.json({
          success: true,
          message: '예약된 콘텐츠 처리가 완료되었습니다'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('콘텐츠 관리 API 조회 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: '인증이 필요합니다'
      }, { status: 401 });
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: '관리자 권한이 필요합니다'
      }, { status: 403 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    const contentManager = getContentManager();

    switch (action) {
      case 'generate':
        const {
          strategy = 'daily-trends',
          count = 3,
          publishMode = 'draft',
          scheduleTime
        } = params;

        const generateResult = await contentManager.generateAndManageContent({
          strategy,
          count,
          publishMode,
          scheduleTime: scheduleTime ? new Date(scheduleTime) : undefined
        });

        return NextResponse.json({
          success: generateResult.success,
          data: generateResult,
          message: `AI 콘텐츠 생성 완료: ${generateResult.generated}개 생성`
        });

      case 'publish':
        const {
          title,
          content,
          category,
          tags,
          featured = false
        } = params;

        if (!title || !content) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
            message: '제목과 내용이 필요합니다'
          }, { status: 400 });
        }

        const blogPublisher = getBlogPublisher();
        const publishResult = await blogPublisher.publishPost({
          title,
          content,
          category,
          tags,
          featured
        }, {
          loginCredentials: {
            email: process.env.ADMIN_EMAIL || '',
            password: process.env.ADMIN_PASSWORD || ''
          },
          validateContent: true,
          notifyOnComplete: true
        });

        return NextResponse.json({
          success: publishResult.success,
          data: publishResult,
          message: publishResult.success ? '콘텐츠 게시 완료' : '콘텐츠 게시 실패'
        }, { status: publishResult.success ? 200 : 400 });

      case 'cleanup':
        const { days = 90 } = params;
        await contentManager.cleanupContent(days);
        
        return NextResponse.json({
          success: true,
          message: `콘텐츠 정리 완료 (${days}일 기준)`
        });

      case 'duplicate_check':
        const { checkTitle, checkContent } = params;
        
        if (!checkTitle || !checkContent) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
            message: '제목과 내용이 필요합니다'
          }, { status: 400 });
        }

        const duplicateResult = await contentManager.checkDuplicate(checkTitle, checkContent);
        
        return NextResponse.json({
          success: true,
          data: duplicateResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('콘텐츠 관리 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}