/**
 * 자동화 오케스트레이터 API
 * GET /api/automation/orchestrator - 오케스트레이터 상태 및 분석 조회
 * POST /api/automation/orchestrator - 자동화 워크플로우 실행
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/mcp/orchestrator';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    const days = parseInt(searchParams.get('days') || '7');

    // 인증 확인
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: '인증이 필요합니다',
        },
        { status: 401 }
      );
    }

    const orchestrator = getOrchestrator();

    switch (action) {
      case 'status':
        const status = {
          isReady: orchestrator.isReady(),
          timestamp: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          data: status,
        });

      case 'analytics':
        const analytics = await orchestrator.getAutomationAnalytics(days);

        return NextResponse.json({
          success: true,
          data: analytics,
        });

      case 'health':
        const healthResult = await orchestrator.executeHealthCheck();

        return NextResponse.json(
          {
            success: true,
            data: healthResult,
          },
          {
            status:
              healthResult.overall === 'healthy'
                ? 200
                : healthResult.overall === 'degraded'
                  ? 206
                  : 503,
          }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: '지원되지 않는 액션입니다',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('오케스트레이터 API 조회 오류', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: '인증이 필요합니다',
        },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: '관리자 권한이 필요합니다',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    const orchestrator = getOrchestrator();

    // 오케스트레이터 초기화 확인
    if (!orchestrator.isReady()) {
      await orchestrator.initialize();
    }

    switch (action) {
      case 'login':
        const { email, password, adminUrl } = params;

        if (!email || !password) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing credentials',
              message: '이메일과 비밀번호가 필요합니다',
            },
            { status: 400 }
          );
        }

        const loginResult = await orchestrator.executeLoginWorkflow({
          email,
          password,
          adminUrl,
        });

        return NextResponse.json(
          {
            success: loginResult.success,
            data: loginResult,
            message: loginResult.success ? '로그인 성공' : '로그인 실패',
          },
          { status: loginResult.success ? 200 : 400 }
        );

      case 'publish':
        const { title, content, category, tags, publishDate, featured, ensureLogin } = params;

        if (!title || !content) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required fields',
              message: '제목과 내용이 필요합니다',
            },
            { status: 400 }
          );
        }

        const publishResult = await orchestrator.executePublishWorkflow(
          {
            title,
            content,
            category,
            tags,
            publishDate: publishDate ? new Date(publishDate) : undefined,
            featured,
          },
          ensureLogin
            ? {
                email: ensureLogin.email,
                password: ensureLogin.password,
                adminUrl: ensureLogin.adminUrl,
              }
            : undefined
        );

        return NextResponse.json(
          {
            success: publishResult.success,
            data: publishResult,
            message: publishResult.success ? '게시 성공' : '게시 실패',
          },
          { status: publishResult.success ? 200 : 400 }
        );

      case 'health_check':
        const healthCheckResult = await orchestrator.executeHealthCheck();

        return NextResponse.json({
          success: true,
          data: healthCheckResult,
          message: `시스템 상태: ${healthCheckResult.overall}`,
        });

      case 'cleanup':
        await orchestrator.cleanup();

        return NextResponse.json({
          success: true,
          message: '자동화 시스템 정리 완료',
        });

      case 'initialize':
        await orchestrator.initialize();

        return NextResponse.json({
          success: true,
          message: '오케스트레이터 초기화 완료',
        });

      case 'config':
        const { config } = params;

        if (config) {
          orchestrator.updateConfig(config);
        }

        return NextResponse.json({
          success: true,
          message: '설정 업데이트 완료',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: '지원되지 않는 액션입니다',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('오케스트레이터 API 오류', { error });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
