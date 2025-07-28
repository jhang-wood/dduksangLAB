import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { initiateLecturePayment } from '@/lib/payment/payapp'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    // 사용자 프로필 조회
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 요청 바디 파싱
    const { lectureId } = await request.json()
    
    if (!lectureId) {
      return NextResponse.json(
        { error: '강의 ID가 필요합니다' },
        { status: 400 }
      )
    }

    // 결제 요청 생성
    const result = await initiateLecturePayment(
      lectureId,
      user.id,
      user.email!,
      profile.name || user.email!
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentId: result.paymentId,
        approvalUrl: result.approvalUrl
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    logger.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}