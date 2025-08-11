/**
 * 자동화 시스템 헬스체크 API
 * GET /api/automation/health
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHealthChecker } from '@/lib/monitoring/health-checker';
import { logger } from '@/lib/logger';

export async function GET(_request: NextRequest) {
  try {
    const healthChecker = getHealthChecker();
    
    // 헬스체크 실행
    const healthResult = await healthChecker.performHealthCheck();
    
    return NextResponse.json({
      success: true,
      data: healthResult,
      timestamp: new Date().toISOString()
    }, {
      status: healthResult.overall === 'healthy' ? 200 : 
             healthResult.overall === 'degraded' ? 206 : 503
    });

  } catch (error) {
    logger.error('헬스체크 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const healthChecker = getHealthChecker();

    switch (action) {
      case 'start':
        if (!healthChecker.isHealthCheckerRunning()) {
          await healthChecker.start();
        }
        return NextResponse.json({
          success: true,
          message: '헬스체커가 시작되었습니다'
        });

      case 'stop':
        if (healthChecker.isHealthCheckerRunning()) {
          await healthChecker.stop();
        }
        return NextResponse.json({
          success: true,
          message: '헬스체커가 중지되었습니다'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('헬스체크 제어 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}