'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, TrendingUp, FileText, Users, BarChart3, Settings, LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { logger } from '@/lib/logger'

export default function AdminHeader() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    // 로그아웃 처리
    const { error } = await supabase.auth.signOut()
    if (error) {
      // 에러가 있어도 홈으로 이동
      logger.error('로그아웃 에러:', error)
    }
    router.push('/')
    router.refresh() // 서버 컴포넌트 새로고침
  }

  return (
    <header className="bg-deepBlack-800 border-b border-deepBlack-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-2xl font-bold text-metallicGold-500">
              관리자 대시보드
            </Link>
            <nav className="flex space-x-6">
              <Link href="/admin" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <Home size={18} />
                <span>홈</span>
              </Link>
              <Link href="/admin/ai-trends" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <TrendingUp size={18} />
                <span>AI 트렌드</span>
              </Link>
              <Link href="/admin/lectures" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <FileText size={18} />
                <span>강의 관리</span>
              </Link>
              <Link href="/admin/users" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <Users size={18} />
                <span>회원 관리</span>
              </Link>
              <Link href="/admin/stats" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <BarChart3 size={18} />
                <span>통계</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center space-x-2 text-offWhite-200 hover:text-metallicGold-500 transition-colors">
                <Settings size={18} />
                <span>설정</span>
              </Link>
            </nav>
          </div>
          <button
            onClick={() => void handleLogout()}
            className="flex items-center space-x-2 text-offWhite-300 hover:text-metallicGold-500 transition-colors"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  )
}