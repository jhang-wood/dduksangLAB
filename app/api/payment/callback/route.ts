import { NextRequest, NextResponse } from 'next/server'
import { payapp, completeLectureEnrollment } from '@/lib/payment/payapp'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const signature = request.headers.get('x-payapp-signature') ?? ''

    // 웹훅 검증
    if (!payapp.verifyWebhook(data, signature)) {
      return NextResponse.json(
        { error: '잘못된 요청입니다' },
        { status: 401 }
      )
    }

    const { orderid, state, pay_state, mul_no } = data

    // 결제 상태 업데이트
    let status = 'pending'
    if (state === 1 && pay_state === 4) {
      status = 'completed'
    } else if (pay_state === 5) {
      status = 'failed'
    }

    // DB 업데이트
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status,
        payapp_order_id: mul_no,
        transaction_id: mul_no,
        metadata: data,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderid)

    if (updateError) {
      logger.error('Payment update error:', updateError)
      return NextResponse.json(
        { error: '결제 정보 업데이트 실패' },
        { status: 500 }
      )
    }

    // 결제 완료시 수강 등록
    if (status === 'completed') {
      try {
        await completeLectureEnrollment(orderid)
      } catch (error) {
        logger.error('Enrollment error:', error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Payment callback error:', error)
    return NextResponse.json(
      { error: '콜백 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// GET 요청도 처리 (PayApp에서 사용할 수 있음)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const orderid = searchParams.get('orderid')
  const state = searchParams.get('state')
  const pay_state = searchParams.get('pay_state')
  const mul_no = searchParams.get('mul_no')

  if (!orderid) {
    return NextResponse.json(
      { error: '주문 ID가 필요합니다' },
      { status: 400 }
    )
  }

  // POST와 동일한 로직 처리
  const data = {
    orderid,
    state: parseInt(state ?? '0'),
    pay_state: parseInt(pay_state ?? '0'),
    mul_no
  }

  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: request.headers
  }))
}