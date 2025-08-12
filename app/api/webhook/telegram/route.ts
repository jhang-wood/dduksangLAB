import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env';
import { logger } from '@/lib/logger';
import { TelegramUpdate } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Telegram 웹훅 시크릿 검증
    const webhookSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    const expectedSecret = serverEnv.telegramWebhookSecret();

    if (webhookSecret !== expectedSecret) {
      logger.warn('Invalid webhook secret received');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const update = (await request.json()) as TelegramUpdate;
    logger.info('Received Telegram update:', JSON.stringify(update, null, 2));

    // 메시지가 있는 경우에만 처리
    if (update.message?.text) {
      const message = update.message;
      const allowedUserId = parseInt(serverEnv.telegramAllowedUserId(), 10);

      // 허용된 사용자인지 확인
      if (message.from.id !== allowedUserId) {
        logger.warn(`Unauthorized user: ${message.from.id}, expected: ${allowedUserId}`);
        return NextResponse.json({ error: 'Unauthorized user' }, { status: 403 });
      }

      // n8n으로 메시지 전달
      const n8nWebhookUrl = serverEnv.n8nWebhookUrl();

      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-Source': 'telegram-webhook',
          },
          body: JSON.stringify({
            telegram_data: {
              update_id: update.update_id,
              message: {
                message_id: message.message_id,
                from: {
                  id: message.from.id,
                  first_name: message.from.first_name,
                  username: message.from.username,
                },
                chat: {
                  id: message.chat.id,
                  type: message.chat.type,
                },
                date: message.date,
                text: message.text,
              },
            },
            timestamp: new Date().toISOString(),
            source: 'dduksang-telegram-webhook',
          }),
        });

        if (!n8nResponse.ok) {
          logger.error('Failed to forward to n8n:', await n8nResponse.text());
          return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
        }

        logger.info('Successfully forwarded message to n8n');
        return NextResponse.json({ ok: true });
      } catch (n8nError) {
        logger.error('Error forwarding to n8n:', n8nError);
        return NextResponse.json({ error: 'n8n connection failed' }, { status: 500 });
      }
    }

    // 메시지가 없는 경우 (예: 다른 업데이트 타입)
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET 요청 처리 (헬스체크용)
export function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    webhook: 'telegram',
  });
}
