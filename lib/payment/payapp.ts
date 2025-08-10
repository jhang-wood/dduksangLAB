import crypto from 'crypto'
import { supabase } from '../supabase'
import { logger } from '@/lib/logger'
import { env, getOptionalEnvVar } from '@/lib/env'

// PayApp 설정 (컴포넌트와 API 공통 사용)
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

// 가격 플랜 정의 (컴포넌트용 export)
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

interface PayAppConfig {
  secretKey: string
  value: string
  baseUrl: string
}

interface PaymentRequest {
  orderId: string
  amount: number
  itemName: string
  customerName: string
  customerEmail: string
  returnUrl: string
  cancelUrl: string
}

interface PaymentResult {
  success: boolean
  paymentId?: string
  approvalUrl?: string
  error?: string
}

class PayAppService {
  private config: PayAppConfig

  constructor() {
    this.config = {
      secretKey: process.env.PAYAPP_SECRET_KEY || '',
      value: process.env.PAYAPP_VALUE || '',
      baseUrl: 'https://api.payapp.kr/v2'
    }
  }

  // 결제 요청 생성
  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // 1. 데이터베이스에 결제 정보 저장
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert({
          id: request.orderId,
          amount: request.amount,
          status: 'pending',
          payment_method: 'payapp',
          metadata: {
            itemName: request.itemName,
            customerName: request.customerName,
            customerEmail: request.customerEmail
          }
        })
        .select()
        .single()

      if (dbError) {
        throw new Error('결제 정보 저장 실패')
      }

      // 2. PayApp 결제 요청 데이터 생성
      const paymentData = {
        cmd: 'payrequest',
        userid: this.config.value,
        goodname: request.itemName,
        price: request.amount.toString(),
        recvphone: '',
        memo: `주문번호: ${request.orderId}`,
        reqaddr: '0',
        feedbackurl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
        returnurl: request.returnUrl,
        cancelurl: request.cancelUrl,
        orderid: request.orderId
      }

      // 3. 해시 생성
      const hashData = this.generateHash(paymentData)
      
      // 4. PayApp API 호출
      const response = await fetch(`${this.config.baseUrl}/payrequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({
          ...paymentData,
          hashdata: hashData
        })
      })

      const result = await response.json()

      if (result.state === 1) {
        // 결제 URL 업데이트
        await supabase
          .from('payments')
          .update({
            payapp_order_id: result.mul_no,
            metadata: {
              ...payment.metadata,
              payapp_response: result
            }
          })
          .eq('id', request.orderId)

        return {
          success: true,
          paymentId: result.mul_no,
          approvalUrl: result.online_url
        }
      } else {
        throw new Error(result.errorMessage || '결제 요청 실패')
      }
    } catch (error) {
      logger.error('PayApp payment creation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다'
      }
    }
  }

  // 결제 상태 확인
  async verifyPayment(orderId: string): Promise<PaymentResult> {
    try {
      // 1. DB에서 결제 정보 조회
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error || !payment) {
        throw new Error('결제 정보를 찾을 수 없습니다')
      }

      // 2. PayApp 결제 상태 확인
      const verifyData = {
        cmd: 'paycheck',
        userid: this.config.value,
        orderid: orderId,
        mul_no: payment.payapp_order_id
      }

      const hashData = this.generateHash(verifyData)
      
      const response = await fetch(`${this.config.baseUrl}/paycheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({
          ...verifyData,
          hashdata: hashData
        })
      })

      const result = await response.json()

      if (result.state === 1 && result.pay_state === 4) {
        // 결제 성공 - DB 업데이트
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_id: result.mul_no,
            payapp_receipt_url: result.receipt_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)

        return {
          success: true,
          paymentId: result.mul_no
        }
      } else {
        // 결제 실패 또는 대기중
        const status = result.pay_state === 5 ? 'failed' : 'pending'
        
        await supabase
          .from('payments')
          .update({
            status,
            error_message: result.errorMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)

        return {
          success: false,
          error: result.errorMessage || '결제가 완료되지 않았습니다'
        }
      }
    } catch (error) {
      logger.error('PayApp payment verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 확인 중 오류가 발생했습니다'
      }
    }
  }

  // 결제 취소
  async cancelPayment(orderId: string, reason: string): Promise<PaymentResult> {
    try {
      // 1. DB에서 결제 정보 조회
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error || !payment) {
        throw new Error('결제 정보를 찾을 수 없습니다')
      }

      if (payment.status !== 'completed') {
        throw new Error('완료된 결제만 취소할 수 있습니다')
      }

      // 2. PayApp 결제 취소 요청
      const cancelData = {
        cmd: 'paycancel',
        userid: this.config.value,
        orderid: orderId,
        mul_no: payment.payapp_order_id,
        cancelmemo: reason
      }

      const hashData = this.generateHash(cancelData)
      
      const response = await fetch(`${this.config.baseUrl}/paycancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`
        },
        body: JSON.stringify({
          ...cancelData,
          hashdata: hashData
        })
      })

      const result = await response.json()

      if (result.state === 1) {
        // 취소 성공 - DB 업데이트
        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            error_message: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)

        return {
          success: true
        }
      } else {
        throw new Error(result.errorMessage || '결제 취소 실패')
      }
    } catch (error) {
      logger.error('PayApp payment cancellation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 취소 중 오류가 발생했습니다'
      }
    }
  }

  // 해시 생성
  private generateHash(data: any): string {
    const hashString = Object.values(data).join('') + this.config.secretKey
    return crypto.createHash('sha256').update(hashString).digest('hex')
  }

  // 웹훅 검증
  verifyWebhook(data: any, signature: string): boolean {
    const expectedSignature = this.generateHash(data)
    return expectedSignature === signature
  }
}

export const payapp = new PayAppService()

// 결제 페이지에서 사용할 헬퍼 함수들
export async function initiateLecturePayment(
  lectureId: string,
  userId: string,
  userEmail: string,
  userName: string
) {
  // 1. 강의 정보 조회
  const { data: lecture, error: lectureError } = await supabase
    .from('lectures')
    .select('*')
    .eq('id', lectureId)
    .single()

  if (lectureError || !lecture) {
    throw new Error('강의 정보를 찾을 수 없습니다')
  }

  // 2. 이미 수강중인지 확인
  const { data: existingEnrollment } = await supabase
    .from('lecture_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('lecture_id', lectureId)
    .single()

  if (existingEnrollment) {
    throw new Error('이미 수강중인 강의입니다')
  }

  // 3. 주문 ID 생성
  const orderId = `LEC_${Date.now()}_${userId.substring(0, 8)}`

  // 4. 결제 요청
  const paymentResult = await payapp.createPayment({
    orderId,
    amount: lecture.price,
    itemName: lecture.title,
    customerName: userName,
    customerEmail: userEmail,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?orderId=${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel?orderId=${orderId}`
  })

  if (paymentResult.success) {
    // 5. DB에 결제 정보 연결
    await supabase
      .from('payments')
      .update({
        user_id: userId,
        lecture_id: lectureId
      })
      .eq('id', orderId)
  }

  return paymentResult
}

// ===== 컴포넌트용 함수들 (기존 lib/payapp.ts에서 이동) =====

// PayApp 서명 생성 (컴포넌트용)
export function generatePayAppSignature(params: any): string {
  const sortedKeys = Object.keys(params).sort()
  const queryString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const message = queryString + PAYAPP_CONFIG.value
  const signature = crypto
    .createHmac('sha256', PAYAPP_CONFIG.secretKey || '')
    .update(message)
    .digest('base64')
  
  return signature
}

// PayApp 결제 URL 생성 (컴포넌트용)
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

// 결제 검증 (webhook용)
export function verifyPayAppWebhook(data: any, signature: string): boolean {
  const calculatedSignature = generatePayAppSignature(data)
  return calculatedSignature === signature
}

// 주문 ID 생성 (컴포넌트용)
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `DDK-${timestamp}-${random}`.toUpperCase()
}

// 결제 완료 후 수강 등록
export async function completeLectureEnrollment(orderId: string) {
  // 1. 결제 확인
  const verifyResult = await payapp.verifyPayment(orderId)
  
  if (!verifyResult.success) {
    throw new Error('결제 확인에 실패했습니다')
  }

  // 2. 결제 정보 조회
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !payment) {
    throw new Error('결제 정보를 찾을 수 없습니다')
  }

  // 3. 수강 등록
  const { data: enrollment, error: enrollError } = await supabase
    .from('lecture_enrollments')
    .insert({
      user_id: payment.user_id,
      lecture_id: payment.lecture_id,
      payment_id: payment.id,
      status: 'active',
      enrolled_at: new Date().toISOString()
    })
    .select()
    .single()

  if (enrollError) {
    // 수강 등록 실패시 결제 취소
    await payapp.cancelPayment(orderId, '수강 등록 실패')
    throw new Error('수강 등록에 실패했습니다. 결제가 자동으로 취소됩니다.')
  }

  return enrollment
}