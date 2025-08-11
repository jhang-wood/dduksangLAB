'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Users, BookOpen, TrendingUp, Settings, Brain } from 'lucide-react'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import { useAuth } from '@/lib/auth-context'

export default function AdminPage() {
  const { user, userProfile, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const adminMenus = [
    {
      icon: Users,
      title: "회원 관리",
      description: "회원 목록 조회 및 관리",
      href: "/admin/users",
      stats: "총 1,247명"
    },
    {
      icon: BookOpen,
      title: "강의 관리",
      description: "강의 콘텐츠 및 수강생 관리",
      href: "/admin/lectures",
      stats: "활성 강의 1개"
    },
    {
      icon: Brain,
      title: "AI 트렌드 관리",
      description: "AI 트렌드 콘텐츠 관리",
      href: "/admin/ai-trends",
      stats: "매일 3개 자동 수집"
    },
    {
      icon: TrendingUp,
      title: "사이트 통계",
      description: "방문자 및 매출 통계",
      href: "/admin/stats",
      stats: "일일 방문 523명"
    },
    {
      icon: Settings,
      title: "시스템 설정",
      description: "사이트 설정 및 환경 관리",
      href: "/admin/settings",
      stats: "최근 업데이트 2일 전"
    }
  ]

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="admin" />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 rounded-full border border-metallicGold-500/30 mb-8">
                <Shield className="w-5 h-5 text-metallicGold-500" />
                <span className="text-metallicGold-500 font-semibold">관리자 대시보드</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  떡상연구소 관리 시스템
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-offWhite-500 max-w-3xl mx-auto mb-4">
                환영합니다, {userProfile?.name ?? '관리자'}님
              </p>
              <p className="text-sm text-offWhite-600">
                현재 역할: {userProfile?.role === 'admin' ? '최고 관리자' : '일반 관리자'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Admin Menu Grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminMenus.map((menu, index) => (
                <motion.div
                  key={menu.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(menu.href)}
                  className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-6 hover:border-metallicGold-500/40 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <menu.icon className="w-6 h-6 text-metallicGold-500" />
                    </div>
                    <span className="text-xs text-offWhite-600">{menu.stats}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2 group-hover:text-metallicGold-500 transition-colors">
                    {menu.title}
                  </h3>
                  <p className="text-sm text-offWhite-500">
                    {menu.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="px-4 pb-20 border-t border-metallicGold-900/20">
          <div className="container mx-auto max-w-7xl pt-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-offWhite-200 mb-8 text-center">빠른 통계</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-deepBlack-600/50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-metallicGold-500 mb-2">1,247</p>
                  <p className="text-sm text-offWhite-500">전체 회원</p>
                </div>
                <div className="bg-deepBlack-600/50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-green-500 mb-2">89</p>
                  <p className="text-sm text-offWhite-500">오늘 가입</p>
                </div>
                <div className="bg-deepBlack-600/50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-blue-500 mb-2">523</p>
                  <p className="text-sm text-offWhite-500">일일 방문</p>
                </div>
                <div className="bg-deepBlack-600/50 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-purple-500 mb-2">45%</p>
                  <p className="text-sm text-offWhite-500">전환율</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}