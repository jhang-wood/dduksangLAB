'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { PRICING_PLANS, generatePayAppUrl, generateOrderId } from '@/lib/payment/payapp'
// UI components are not used in this modal
// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'
// import { modalStyles, cardStyles } from '@/components/ui'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [showPlans, setShowPlans] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          throw error
        }
        onClose()
      } else {
        // 회원가입 시 플랜 선택 화면으로
        if (!showPlans) {
          setShowPlans(true)
          setLoading(false)
          return
        }

        // 회원가입 및 결제 처리
        const { error } = await signUp(email, password, { 
          name,
          selected_plan: selectedPlan 
        })
        
        if (!error) {
          // 결제 페이지로 리디렉트
          const orderId = generateOrderId()
          const plan = PRICING_PLANS[selectedPlan as keyof typeof PRICING_PLANS]
          const paymentUrl = generatePayAppUrl({
            orderId,
            userName: name,
            userEmail: email,
            planId: selectedPlan,
            amount: plan.price
          })
          
          // 새 창에서 결제 페이지 열기
          window.open(paymentUrl, 'payapp_payment', 'width=800,height=600')
          
          // 모달 닫기
          onClose()
        } else if (error) {
          throw error
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setLoading(false)
    }
  }

  if (!isOpen) {return null}

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {mode === 'signin' ? '로그인' : showPlans ? '플랜 선택' : '회원가입'}
        </h2>

        <form onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(e)
        }} className="space-y-4">
          {mode === 'signup' && !showPlans ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="홍길동"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </>
          ) : mode === 'signup' && showPlans ? (
            <div className="space-y-4">
              {Object.entries(PRICING_PLANS).map(([key, plan]) => (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                      <div className="mt-3 space-y-1">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-400 mr-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        ₩{plan.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">/월</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : 
             mode === 'signin' ? '로그인' : 
             showPlans ? '결제하기' : '다음'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          {mode === 'signin' ? (
            <>
              계정이 없으신가요?{' '}
              <button
                onClick={() => {
                  setMode('signup')
                  setError(null)
                  setShowPlans(false)
                }}
                className="text-yellow-400 hover:underline"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => {
                  setMode('signin')
                  setError(null)
                  setShowPlans(false)
                }}
                className="text-yellow-400 hover:underline"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}