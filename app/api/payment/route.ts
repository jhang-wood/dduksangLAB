import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// 🚨 PAYAPP 결제 시스템 완전 비활성화 🚨
// 모든 PayApp 관련 주문 API 호출을 차단합니다.
export async function POST(request: NextRequest) {
  logger.warn('🚨 PayApp 결제 API 호출 차단됨 - 시스템 관리자에 의해 비활성화');
  
  return NextResponse.json(
    { 
      error: '결제 시스템이 현재 점검 중입니다. 잠시 후 다시 시도해 주세요.',
      code: 'PAYMENT_DISABLED',
      message: 'PayApp 결제 시스템이 관리자에 의해 비활성화되었습니다.'
    }, 
    { status: 503 }
  );
}
