/**
 * 보안 블로그 자동화 API
 * POST /api/automation/secure-blog
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { executeSecureBlogAutomation } from '@/lib/security/secure-blog-automation';
import { getAccessControlManager, getClientIP } from '@/lib/security/access-control';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const sourceIP = getClientIP(request as any);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    logger.info('보안 블로그 자동화 API 호출', { sourceIP, userAgent });

    // 1. 인증 헤더 확인
    const authHeader = request.headers.get('authorization');
    const cronSecret = request.headers.get('x-cron-secret');
    
    // Cron Job 또는 인증된 요청인지 확인
    const isAuthorized = (
      cronSecret && cronSecret === env.cronSecret
    ) || (
      authHeader && authHeader.startsWith('Bearer ')
    );

    if (!isAuthorized) {
      const accessControlManager = getAccessControlManager();
      await accessControlManager.recordLoginAttempt({
        ip: sourceIP,
        timestamp: new Date(),
        success: false,
        user_agent: userAgent,
        failure_reason: '인증 실패'
      });

      return NextResponse.json(
        { 
          success: false,
          error: '인증되지 않은 요청',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // 2. 요청 본문 파싱
    const body = await request.json();
    const { posts, options = {} } = body;

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '게시할 포스트가 없습니다',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // 3. 포스트 수 제한 확인
    if (posts.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: '한 번에 최대 10개의 포스트만 게시할 수 있습니다',
          code: 'TOO_MANY_POSTS'
        },
        { status: 400 }
      );
    }

    logger.info(`${posts.length}개 포스트 자동 게시 요청`, { sourceIP });

    // 4. 보안 블로그 자동화 실행
    const result = await executeSecureBlogAutomation(posts, request);

    const totalTime = Date.now() - startTime;

    logger.info('보안 블로그 자동화 API 완료', {
      success: result.success,
      postsCount: posts.length,
      totalTime,
      sourceIP
    });

    // 5. 응답 반환
    return NextResponse.json({
      success: result.success,
      data: {
        loginResult: result.loginResult,
        publishResults: result.publishResults,
        securityEvents: result.securityEvents,
        performanceMetrics: {
          ...result.performanceMetrics,
          totalTime
        }
      },
      ...(result.error && { error: result.error }),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    
    logger.error('보안 블로그 자동화 API 오류', { 
      error,
      sourceIP,
      totalTime
    });

    // 보안 이벤트 기록
    try {
      const accessControlManager = getAccessControlManager();
      await accessControlManager.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        source_ip: sourceIP,
        user_agent: userAgent,
        description: `API 오류: ${(error as Error).message}`,
        timestamp: new Date(),
        metadata: {
          api_endpoint: '/api/automation/secure-blog',
          error_type: (error as Error).constructor.name,
          execution_time: totalTime
        }
      });
    } catch (logError) {
      logger.error('보안 이벤트 로깅 실패', { logError });
    }

    return NextResponse.json(
      {
        success: false,
        error: '서버 내부 오류가 발생했습니다',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const sourceIP = getClientIP(request as any);

  try {
    // 시스템 상태 확인용 엔드포인트
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 필요' },
        { status: 401 }
      );
    }

    const { getSecureBlogAutomation } = await import('@/lib/security/secure-blog-automation');
    const automation = getSecureBlogAutomation();
    const status = automation.getAutomationStatus();

    const accessControlManager = getAccessControlManager();
    const securityStats = accessControlManager.getSecurityStats();

    return NextResponse.json({
      success: true,
      data: {
        automation_status: status,
        security_stats: {
          failed_attempts: securityStats.failedAttemptsCount,
          blocked_ips: securityStats.blockedIPsCount,
          recent_failures: securityStats.recentFailures.length
        },
        system_info: {
          memory_usage: process.memoryUsage(),
          uptime: process.uptime(),
          node_version: process.version
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('시스템 상태 조회 오류', { error, sourceIP });

    return NextResponse.json(
      {
        success: false,
        error: '시스템 상태를 조회할 수 없습니다',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 (CORS 지원)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Cron-Secret',
    },
  });
}