'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">결제가 취소되었습니다</h1>
          <p className="text-gray-400 mb-6">
            결제를 취소하셨습니다.<br />
            언제든지 다시 시도하실 수 있습니다.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              홈으로 돌아가기
            </button>
            <button
              onClick={() => router.push('/lectures')}
              className="w-full px-6 py-3 border border-gray-700 text-gray-400 font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              무료 강의 둘러보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}