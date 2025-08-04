'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { logger } from '@/lib/logger'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handlePaymentSuccess()
  }, [])

  const handlePaymentSuccess = async () => {
    try {
      const orderId = searchParams.get('order_no')
      const payappOrderId = searchParams.get('payapp_order_id')
      
      if (!orderId || !user) {
        throw new Error('잘못된 접근입니다.')
      }

      // 사용자 타입을 student로 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          user_type: 'student',
          payment_status: 'paid',
          last_payment_date: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // 결제 기록 저장
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          order_id: orderId,
          payapp_order_id: payappOrderId,
          amount: 29900, // 프로 플랜 기준
          status: 'completed',
          created_at: new Date().toISOString()
        })

      if (paymentError) {
        logger.error('결제 기록 저장 실패:', paymentError)
      }

      setTimeout(() => {
        router.push('/lectures')
      }, 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          {processing ? (
            <>
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">결제 처리 중...</h1>
              <p className="text-gray-400">잠시만 기다려주세요.</p>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-3xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">결제 처리 실패</h1>
              <p className="text-red-400 mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-400" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">결제 완료!</h1>
              <p className="text-gray-400 mb-6">
                프로 플랜 가입이 완료되었습니다.<br />
                모든 강의를 자유롭게 수강하실 수 있습니다.
              </p>
              <p className="text-sm text-gray-500">
                잠시 후 강의 페이지로 이동합니다...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">결제 처리 중...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}