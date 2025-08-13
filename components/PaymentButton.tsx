'use client';

import { logger, userNotification } from '@/lib/logger';

import { useState } from 'react';
import { generatePayAppUrl, generateOrderId, PRICING_PLANS } from '@/lib/payment/payapp';
import { useAuthStore } from '@/providers/auth-store-provider';

interface PaymentButtonProps {
  planId: keyof typeof PRICING_PLANS;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({ planId, className, children }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const plan = PRICING_PLANS[planId];

  const handlePayment = (): void => {
    if (!user) {
      userNotification.alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();
      const paymentUrl = generatePayAppUrl({
        orderId,
        userName: (user.user_metadata?.name as string) ?? user.email?.split('@')[0] ?? '고객',
        userEmail: user.email ?? '',
        planId,
        amount: plan.price,
      });

      // 새 창에서 결제 페이지 열기
      window.open(paymentUrl, 'payapp_payment', 'width=800,height=600');
    } catch (error) {
      logger.error('결제 URL 생성 실패:', error);
      userNotification.alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={
        className ??
        'px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50'
      }
    >
      {loading ? '처리 중...' : (children ?? `${plan.name} 구매하기`)}
    </button>
  );
}
