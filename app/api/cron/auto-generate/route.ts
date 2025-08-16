import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Force dynamic rendering for cron job
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel Cron job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron job attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Starting scheduled AI trends generation');

    // 현재 시간 체크 (한국 시간 기준)
    const koreaTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    const hour = koreaTime.getHours();
    
    // 오전 8시에만 실행 (매일 1회)
    if (hour !== 8) {
      logger.info(`Skipping generation - not scheduled time (current: ${hour}시)`);
      return NextResponse.json({
        success: true,
        message: 'Not scheduled time',
        currentHour: hour
      });
    }

    // Auto-post API 호출 (카테고리별 주기 체크 포함)
    const autoPostUrl = new URL('/api/ai-trends/auto-post', request.url);
    const response = await fetch(autoPostUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`
      },
      body: JSON.stringify({
        checkEligibility: true, // 카테고리별 게시 가능 여부 체크
        autoPublish: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Auto-post failed: ${error}`);
    }

    const result = await response.json();
    
    logger.info('Cron job completed successfully', {
      hour: `${hour}시`,
      generated: result.stats?.generated || 0,
      saved: result.stats?.saved || 0,
      failed: result.stats?.failed || 0
    });

    // Slack 또는 Discord 웹훅으로 알림 (옵션)
    if (process.env.SLACK_WEBHOOK_URL) {
      const categories = result.generatedByCategory || {};
      const categoryDetails = Object.entries(categories)
        .map(([cat, count]) => `- ${cat}: ${count}개`)
        .join('\n');
      
      await sendNotification({
        text: `🤖 AI 트렌드 자동 생성 완료\n` +
              `⏰ 시간: 오전 8시\n` +
              `📊 카테고리별 생성:\n${categoryDetails}\n` +
              `✅ 총 생성: ${result.stats?.generated || 0}개\n` +
              `💾 저장: ${result.stats?.saved || 0}개\n` +
              `❌ 실패: ${result.stats?.failed || 0}개`
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled generation completed',
      timestamp: new Date().toISOString(),
      koreaTime: koreaTime.toISOString(),
      hour,
      result
    });

  } catch (error) {
    logger.error('Cron job error:', error);
    
    // 에러 알림 (옵션)
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendNotification({
        text: `❌ AI 트렌드 자동 생성 실패\n` +
              `에러: ${(error as Error).message}`
      });
    }

    return NextResponse.json(
      { 
        error: 'Cron job failed',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// Slack/Discord 알림 헬퍼 함수
async function sendNotification(payload: { text: string }) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    logger.error('Notification failed:', error);
  }
}