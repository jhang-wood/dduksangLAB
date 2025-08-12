/**
 * 자동화 시스템 cron 작업 엔드포인트
 * Vercel Cron Jobs 또는 외부 cron 서비스에서 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScheduler } from '@/lib/automation/scheduler';
import { getContentManager } from '@/lib/automation/content-manager';
import { getHealthChecker } from '@/lib/monitoring/health-checker';
import { getNotificationService } from '@/lib/monitoring/notification-service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Cron secret 검증
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: '인증 실패',
        },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    logger.info('Cron 자동화 작업 시작', { action });

    switch (action) {
      case 'scheduled_content':
        // 예약된 콘텐츠 게시
        const contentManager = getContentManager();
        await contentManager.processScheduledContent();

        return NextResponse.json({
          success: true,
          message: '예약된 콘텐츠 처리 완료',
        });

      case 'health_check':
        // 시스템 헬스체크
        const healthChecker = getHealthChecker();

        if (!healthChecker.isHealthCheckerRunning()) {
          await healthChecker.start();
        }

        const healthResult = await healthChecker.performHealthCheck();

        // 문제 발견 시 알림 발송
        if (healthResult.overall !== 'healthy') {
          const notificationService = getNotificationService();

          await notificationService.sendTemplatedNotification('health-check', {
            title: '시스템 상태 변경',
            severity: healthResult.overall === 'degraded' ? 'warning' : 'critical',
            metadata: {
              overall_status: healthResult.overall,
              unhealthy_services: healthResult.services
                .filter(s => s.status === 'unhealthy')
                .map(s => s.name)
                .join(', '),
              recommendations: healthResult.recommendations.join(', '),
            },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            overall: healthResult.overall,
            servicesCount: healthResult.services.length,
            alertsCount: healthResult.alerts.length,
          },
          message: `헬스체크 완료 - ${healthResult.overall}`,
        });

      case 'ai_content_generation':
        // AI 콘텐츠 자동 생성
        const contentGen = getContentManager();

        const generateResult = await contentGen.generateAndManageContent({
          strategy: 'daily-trends',
          count: 3,
          publishMode: 'draft',
        });

        // 결과 알림 발송
        if (generateResult.success) {
          const notificationService = getNotificationService();

          await notificationService.sendTemplatedNotification('automation-success', {
            title: 'AI 콘텐츠 생성',
            message: `${generateResult.generated}개 콘텐츠 생성 완료`,
            severity: 'success',
            metadata: {
              generated: generateResult.generated,
              published: generateResult.published,
              scheduled: generateResult.scheduled,
            },
          });
        }

        return NextResponse.json({
          success: generateResult.success,
          data: generateResult,
          message: `AI 콘텐츠 생성 완료: ${generateResult.generated}개 생성`,
        });

      case 'database_cleanup':
        // 데이터베이스 정리
        const cleanupManager = getContentManager();
        await cleanupManager.cleanupContent(30);

        return NextResponse.json({
          success: true,
          message: '데이터베이스 정리 완료',
        });

      case 'notification_queue':
        // 알림 큐 처리
        const notificationQueue = getNotificationService();
        await notificationQueue.processNotificationQueue();

        return NextResponse.json({
          success: true,
          message: '알림 큐 처리 완료',
        });

      case 'scheduler_health':
        // 스케줄러 상태 확인 및 복구
        const scheduler = getScheduler();

        if (!scheduler.isSchedulerRunning()) {
          logger.warn('스케줄러가 중지된 상태 - 재시작 시도');
          await scheduler.start();

          // 재시작 알림
          const notificationRestart = getNotificationService();
          await notificationRestart.sendTemplatedNotification('system-alert', {
            title: '스케줄러 재시작',
            message: '중지된 스케줄러를 자동으로 재시작했습니다',
            severity: 'warning',
            metadata: {
              service: 'scheduler',
              action: 'auto_restart',
            },
          });
        }

        const status = scheduler.getTaskStatus();
        const runningTasks = scheduler.getRunningTaskCount();

        return NextResponse.json({
          success: true,
          data: {
            isRunning: scheduler.isSchedulerRunning(),
            tasksCount: status.length,
            runningTasks,
            enabledTasks: status.filter(t => t.enabled).length,
          },
          message: '스케줄러 상태 확인 완료',
        });

      case 'weekly_report':
        // 주간 리포트 생성 및 발송
        const reportManager = getContentManager();
        const analytics = await reportManager.getContentAnalytics(7);

        // 리포트 알림 발송
        const notificationReport = getNotificationService();
        await notificationReport.sendTemplatedNotification('automation-success', {
          title: '주간 자동화 리포트',
          message: '주간 시스템 분석 리포트가 생성되었습니다',
          severity: 'info',
          metadata: {
            totalContent: analytics.totalContent,
            publishedContent: analytics.publishedContent,
            successRate: analytics.performanceMetrics.successRate,
            qualityScore: analytics.contentHealth.qualityScore,
          },
        });

        return NextResponse.json({
          success: true,
          data: analytics,
          message: '주간 리포트 생성 및 발송 완료',
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
    logger.error('Cron 자동화 작업 실패', { error });

    // 오류 발생 시 알림 발송
    try {
      const notificationService = getNotificationService();
      await notificationService.sendTemplatedNotification('automation-failure', {
        title: 'Cron 작업 실패',
        message: `자동화 cron 작업이 실패했습니다: ${(error as Error).message}`,
        severity: 'error',
        metadata: {
          error: (error as Error).message,
          stack: (error as Error).stack,
        },
      });
    } catch (notificationError) {
      logger.error('오류 알림 발송 실패', { notificationError });
    }

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

// GET 요청으로 상태 확인
export async function GET() {
  try {
    const scheduler = getScheduler();
    const healthChecker = getHealthChecker();
    const notificationService = getNotificationService();

    const status = {
      scheduler: {
        isRunning: scheduler.isSchedulerRunning(),
        runningTasks: scheduler.getRunningTaskCount(),
        tasks: scheduler.getTaskStatus().length,
      },
      healthChecker: {
        isRunning: healthChecker.isHealthCheckerRunning(),
      },
      notifications: notificationService.getServiceStatus(),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: status,
      message: 'Cron 자동화 서비스 상태',
    });
  } catch (error) {
    logger.error('Cron 상태 조회 실패', { error });

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
