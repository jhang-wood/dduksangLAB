import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPayAppWebhook } from '@/lib/payapp'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const signature = request.headers.get('X-PayApp-Signature')

    // 서명 검증
    if (!signature || !verifyPayAppWebhook(data, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // 결제 상태 확인
    if (data.status === 'paid') {
      // 사용자 정보 업데이트
      const { error: userError } = await supabase
        .from('users')
        .update({
          user_type: 'student',
          payment_status: 'paid',
          last_payment_date: new Date().toISOString()
        })
        .eq('email', data.user_email)

      if (userError) {
        console.error('사용자 업데이트 실패:', userError)
        return NextResponse.json({ error: 'User update failed' }, { status: 500 })
      }

      // 결제 기록 저장
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.user_email)
        .single()

      if (userData) {
        await supabase
          .from('payments')
          .insert({
            user_id: userData.id,
            order_id: data.order_no,
            payapp_order_id: data.payapp_order_id,
            amount: data.amount,
            status: 'completed',
            created_at: new Date().toISOString()
          })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook 처리 오류:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}