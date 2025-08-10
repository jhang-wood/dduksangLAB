import { NextRequest, NextResponse } from 'next/server'

// Manual test endpoint (for development only)
export async function GET(_request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test endpoint not available in production' },
        { status: 403 }
      )
    }

    // Call the collect endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/ai-trends/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET ?? 'admin-collect'}`,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      status: response.status,
      result
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}