import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPayAppWebhook } from '@/lib/payment/payapp';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface PayAppWebhookData {
  status: string;
  user_email: string;
  order_no: string;
  payapp_order_id: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const rawData = (await request.json()) as Record<string, unknown>;
    const signature = request.headers.get('X-PayApp-Signature');

    // 서명 검증
    if (!signature || !verifyPayAppWebhook(rawData, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = rawData as unknown as PayAppWebhookData;

    // 결제 상태 확인
    if (data.status === 'paid') {
      // 사용자 정보 업데이트
      const { error: userError } = await supabase
        .from('users')
        .update({
          user_type: 'student',
          payment_status: 'paid',
          last_payment_date: new Date().toISOString(),
        })
        .eq('email', data.user_email);

      if (userError) {
        logger.error('사용자 업데이트 실패:', userError);
        return NextResponse.json({ error: 'User update failed' }, { status: 500 });
      }

      // 결제 기록 저장
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.user_email)
        .single();

      if (userFetchError) {
        logger.error('사용자 조회 실패:', userFetchError);
        return NextResponse.json({ error: 'User fetch failed' }, { status: 500 });
      }

      if (userData && typeof userData === 'object' && 'id' in userData) {
        const { error: paymentError } = await supabase.from('payments').insert({
          user_id: userData.id as string,
          order_id: data.order_no,
          payapp_order_id: data.payapp_order_id,
          amount: data.amount,
          status: 'completed',
          created_at: new Date().toISOString(),
        });

        if (paymentError) {
          logger.error('결제 기록 저장 실패:', paymentError);
          return NextResponse.json({ error: 'Payment record failed' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Webhook 처리 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
