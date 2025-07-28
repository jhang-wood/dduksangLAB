import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel Cron job
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${env.cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the collect AI trends API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai-trends/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result
    })
  } catch (error) {
    logger.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}