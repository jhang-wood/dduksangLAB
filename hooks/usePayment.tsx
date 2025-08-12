'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface PaymentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePayment(options?: PaymentOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const initiateLecturePayment = async (lectureId: string) => {
    if (!user) {
      setError('로그인이 필요합니다');
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lectureId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? '결제 요청에 실패했습니다');
      }

      if (data.success && data.approvalUrl) {
        // PayApp 결제 페이지로 리다이렉트
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('결제 URL을 받아올 수 없습니다');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '결제 중 오류가 발생했습니다';
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiateLecturePayment,
    loading,
    error,
  };
}

// 결제 버튼 컴포넌트
export function PaymentButton({
  lectureId,
  price,
  className = '',
  children,
}: {
  lectureId: string;
  price: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const { initiateLecturePayment, loading } = usePayment();

  return (
    <button
      onClick={() => initiateLecturePayment(lectureId)}
      disabled={loading}
      className={`relative flex items-center justify-center px-6 py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          결제 처리 중...
        </>
      ) : (
        (children ?? `₩${price.toLocaleString()} 결제하기`)
      )}
    </button>
  );
}
