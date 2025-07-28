import * as crypto from 'crypto'
import { logger } from '@/lib/logger'
import { env, getOptionalEnvVar } from '@/lib/env'

// PayApp 설정
const PAYAPP_CONFIG = {
  secretKey: getOptionalEnvVar('PAYAPP_SECRET_KEY'),
  value: getOptionalEnvVar('PAYAPP_VALUE'),
  userCode: getOptionalEnvVar('PAYAPP_USER_CODE', 'BA0209'),
  storeId: getOptionalEnvVar('PAYAPP_STORE_ID', 'dduksanglab'),
  testMode: !env.isProduction,
}

if (!PAYAPP_CONFIG.secretKey || !PAYAPP_CONFIG.value) {
  logger.warn('⚠️ PayApp 환경 변수가 설정되지 않았습니다. 결제 기능이 작동하지 않을 수 있습니다.')
}

// 가격 플랜 정의
export const PRICING_PLANS = {
  basic: {
    id: 'basic',
    name: '베이직 플랜',
    price: 9900,
    description: '기본 강의 접근',
    features: [
      '기본 강의 무제한 시청',
      '커뮤니티 접근',
      '기본 지원'
    ]
  },
  pro: {
    id: 'pro', 
    name: '프로 플랜',
    price: 29900,
    description: '전체 강의 + 프리미엄 기능',
    features: [
      '모든 강의 무제한 시청',
      '커뮤니티 프리미엄 접근',
      '1:1 멘토링 월 1회',
      'SaaS 홍보 기회',
      '우선 지원'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: 99900,
    description: '팀/기업용 맞춤 플랜',
    features: [
      '모든 프로 플랜 기능',
      '팀 계정 관리',
      '전용 멘토링',
      '맞춤형 교육 과정',
      '전용 지원'
    ]
  }
}

// PayApp 서명 생성
export function generatePayAppSignature(params: any): string {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const message = queryString + PAYAPP_CONFIG.value
  const signature = crypto
    .createHmac('sha256', PAYAPP_CONFIG.secretKey)
    .update(message)
    .digest('base64')
  
  return signature
}

// PayApp 결제 URL 생성
export function generatePayAppUrl(orderData: {
  orderId: string
  userName: string
  userEmail: string
  planId: string
  amount: number
}): string {
  const params = {
    cmd: 'pay',
    user_code: PAYAPP_CONFIG.userCode,
    store_id: PAYAPP_CONFIG.storeId,
    item_name: PRICING_PLANS[orderData.planId as keyof typeof PRICING_PLANS].name,
    amount: orderData.amount,
    order_no: orderData.orderId,
    user_name: orderData.userName,
    user_email: orderData.userEmail,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/cancel`,
    noti_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payment/webhook`,
    test_mode: PAYAPP_CONFIG.testMode ? 'Y' : 'N',
    timestamp: Math.floor(Date.now() / 1000)
  }

  const signature = generatePayAppSignature(params)
  const queryString = new URLSearchParams({
    ...Object.entries(params).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {}),
    signature
  }).toString()

  return `https://api.payapp.kr/v1/payment?${queryString}`
}

// 결제 검증
export function verifyPayAppWebhook(data: any, signature: string): boolean {
  const calculatedSignature = generatePayAppSignature(data)
  return calculatedSignature === signature
}

// 주문 ID 생성
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `DDK-${timestamp}-${random}`.toUpperCase()
}