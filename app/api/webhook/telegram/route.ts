import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Telegram 웹훅 시크릿 검증
    const webhookSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token')
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET || 'telegram-automation-webhook-secret-2025'
    
    if (webhookSecret !== expectedSecret) {
      console.log('Invalid webhook secret:', webhookSecret)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const update: TelegramUpdate = await request.json()
    console.log('Received Telegram update:', JSON.stringify(update, null, 2))

    // 메시지가 있는 경우에만 처리
    if (update.message && update.message.text) {
      const message = update.message
      const allowedUserId = parseInt(process.env.TELEGRAM_ALLOWED_USER_ID || '7590898112')
      
      // 허용된 사용자인지 확인
      if (message.from.id !== allowedUserId) {
        console.log(`Unauthorized user: ${message.from.id}, expected: ${allowedUserId}`)
        return NextResponse.json({ error: 'Unauthorized user' }, { status: 403 })
      }

      // n8n으로 메시지 전달
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/telegram'
      
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-Source': 'telegram-webhook'
          },
          body: JSON.stringify({
            telegram_data: {
              update_id: update.update_id,
              message: {
                message_id: message.message_id,
                from: {
                  id: message.from.id,
                  first_name: message.from.first_name,
                  username: message.from.username
                },
                chat: {
                  id: message.chat.id,
                  type: message.chat.type
                },
                date: message.date,
                text: message.text
              }
            },
            timestamp: new Date().toISOString(),
            source: 'dduksang-telegram-webhook'
          })
        })

        if (!n8nResponse.ok) {
          console.error('Failed to forward to n8n:', await n8nResponse.text())
          return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
        }

        console.log('Successfully forwarded message to n8n')
        return NextResponse.json({ ok: true })

      } catch (n8nError) {
        console.error('Error forwarding to n8n:', n8nError)
        return NextResponse.json({ error: 'n8n connection failed' }, { status: 500 })
      }
    }

    // 메시지가 없는 경우 (예: 다른 업데이트 타입)
    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET 요청 처리 (헬스체크용)
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    webhook: 'telegram'
  })
}