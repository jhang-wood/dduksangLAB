/**
 * 자동화 스케줄러 API
 * GET /api/automation/scheduler - 스케줄러 상태 조회
 * POST /api/automation/scheduler - 스케줄러 제어
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScheduler } from '@/lib/automation/scheduler';
import { logger } from '@/lib/logger';

export async function GET(_request: NextRequest) {
  try {
    const scheduler = getScheduler();
    
    const status = {
      isRunning: scheduler.isSchedulerRunning(),
      runningTasks: scheduler.getRunningTaskCount(),
      tasks: scheduler.getTaskStatus()
    };
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('스케줄러 상태 조회 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, taskId, enabled } = await request.json();
    const scheduler = getScheduler();

    switch (action) {
      case 'start':
        if (!scheduler.isSchedulerRunning()) {
          await scheduler.start();
        }
        return NextResponse.json({
          success: true,
          message: '스케줄러가 시작되었습니다'
        });

      case 'stop':
        if (scheduler.isSchedulerRunning()) {
          await scheduler.stop();
        }
        return NextResponse.json({
          success: true,
          message: '스케줄러가 중지되었습니다'
        });

      case 'toggle_task':
        if (!taskId) {
          return NextResponse.json({
            success: false,
            error: 'Missing taskId',
            message: '작업 ID가 필요합니다'
          }, { status: 400 });
        }

        const result = scheduler.setTaskEnabled(taskId, enabled);
        if (!result) {
          return NextResponse.json({
            success: false,
            error: 'Task not found',
            message: '작업을 찾을 수 없습니다'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: `작업이 ${enabled ? '활성화' : '비활성화'}되었습니다`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('스케줄러 제어 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}