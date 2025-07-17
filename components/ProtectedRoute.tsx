'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 로그인되지 않은 경우 홈으로
        router.push('/')
      } else if (requireAdmin && userProfile?.role !== 'admin') {
        // 관리자 권한이 필요한데 관리자가 아닌 경우
        router.push('/')
      }
    }
  }, [user, userProfile, loading, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-yellow-400">로딩 중...</div>
      </div>
    )
  }

  if (!user || (requireAdmin && userProfile?.role !== 'admin')) {
    return null
  }

  return <>{children}</>
}