/**
 * 자동화 알림 시스템 API
 * GET /api/automation/notifications - 알림 서비스 상태 조회
 * POST /api/automation/notifications - 알림 발송
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNotificationService, sendQuickNotification, sendTemplatedAlert } from '@/lib/monitoring/notification-service';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

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

    const notificationService = getNotificationService();

    switch (action) {
      case 'status':
        const status = notificationService.getServiceStatus();
        
        return NextResponse.json({
          success: true,
          data: status,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('알림 서비스 API 조회 오류', { error });
    
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

    switch (action) {
      case 'send':
        const {
          title,
          message,
          severity = 'info',
          channels
        } = params;

        if (!title || !message) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
            message: '제목과 메시지가 필요합니다'
          }, { status: 400 });
        }

        const sendResult = await sendQuickNotification(
          title,
          message,
          severity,
          channels
        );

        const successCount = sendResult.filter(r => r.success).length;

        return NextResponse.json({
          success: successCount > 0,
          data: {
            results: sendResult,
            totalChannels: sendResult.length,
            successCount,
            failureCount: sendResult.length - successCount
          },
          message: `알림 발송 완료: ${successCount}/${sendResult.length} 성공`
        });

      case 'send_template':
        const {
          templateId,
          data: templateData,
          channels: templateChannels
        } = params;

        if (!templateId || !templateData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required fields',
            message: '템플릿 ID와 데이터가 필요합니다'
          }, { status: 400 });
        }

        const templateResult = await sendTemplatedAlert(
          templateId,
          templateData,
          templateChannels
        );

        const templateSuccessCount = templateResult.filter(r => r.success).length;

        return NextResponse.json({
          success: templateSuccessCount > 0,
          data: {
            results: templateResult,
            totalChannels: templateResult.length,
            successCount: templateSuccessCount,
            failureCount: templateResult.length - templateSuccessCount
          },
          message: `템플릿 알림 발송 완료: ${templateSuccessCount}/${templateResult.length} 성공`
        });

      case 'test':
        // 테스트 알림 발송
        const testResult = await sendQuickNotification(
          '🧪 테스트 알림',
          `이것은 테스트 알림입니다. 발송 시간: ${new Date().toLocaleString('ko-KR')}`,
          'info'
        );

        const testSuccessCount = testResult.filter(r => r.success).length;

        return NextResponse.json({
          success: testSuccessCount > 0,
          data: {
            results: testResult,
            totalChannels: testResult.length,
            successCount: testSuccessCount
          },
          message: `테스트 알림 발송 완료: ${testSuccessCount}/${testResult.length} 성공`
        });

      case 'config':
        const { config } = params;
        
        if (!config) {
          return NextResponse.json({
            success: false,
            error: 'Missing config',
            message: '설정이 필요합니다'
          }, { status: 400 });
        }

        const notificationService = getNotificationService();
        notificationService.updateConfig(config);

        return NextResponse.json({
          success: true,
          message: '알림 서비스 설정이 업데이트되었습니다'
        });

      case 'process_queue':
        const notificationServiceQueue = getNotificationService();
        await notificationServiceQueue.processNotificationQueue();

        return NextResponse.json({
          success: true,
          message: '알림 큐 처리 완료'
        });

      case 'validate_channels':
        const { channelsToValidate } = params;
        
        if (!channelsToValidate || !Array.isArray(channelsToValidate)) {
          return NextResponse.json({
            success: false,
            error: 'Invalid channels',
            message: '유효한 채널 배열이 필요합니다'
          }, { status: 400 });
        }

        const validationService = getNotificationService();
        const validationResults = channelsToValidate.map(channel => ({
          channel,
          isValid: validationService.validateChannelConfig(channel)
        }));

        return NextResponse.json({
          success: true,
          data: validationResults,
          message: '채널 설정 검증 완료'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: '지원되지 않는 액션입니다'
        }, { status: 400 });
    }

  } catch (error) {
    logger.error('알림 서비스 API 오류', { error });
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: (error as Error).message
    }, { status: 500 });
  }
}