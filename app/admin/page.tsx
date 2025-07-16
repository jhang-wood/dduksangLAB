'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Plus,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Star,
  AlertTriangle
} from 'lucide-react'
import Image from 'next/image'

const stats = [
  { label: "총 회원", value: "12,345", change: "+12%", icon: Users, color: "text-blue-400" },
  { label: "강의 수", value: "89", change: "+3", icon: BookOpen, color: "text-green-400" },
  { label: "커뮤니티 게시글", value: "1,234", change: "+45", icon: MessageSquare, color: "text-purple-400" },
  { label: "SaaS 등록", value: "156", change: "+8", icon: Settings, color: "text-yellow-400" },
]

const recentUsers = [
  { id: 1, name: "김사용자", email: "user1@example.com", type: "수강생", joinDate: "2024-07-15", status: "활성" },
  { id: 2, name: "이회원", email: "user2@example.com", type: "방문자", joinDate: "2024-07-14", status: "활성" },
  { id: 3, name: "박구매자", email: "user3@example.com", type: "수강생", joinDate: "2024-07-13", status: "활성" },
  { id: 4, name: "정미구매", email: "user4@example.com", type: "미구매자", joinDate: "2024-06-15", status: "비활성" },
]

const recentPosts = [
  { id: 1, title: "AI 개발자 전환 문의", author: "김개발자", category: "질문", reports: 0, status: "승인" },
  { id: 2, title: "노코드 툴 추천", author: "박노코드", category: "추천", reports: 0, status: "승인" },
  { id: 3, title: "스팸 게시글입니다", author: "스팸러", category: "광고", reports: 5, status: "검토중" },
  { id: 4, title: "데이터 분석 스터디", author: "최데이터", category: "스터디", reports: 0, status: "승인" },
]

const pendingSaas = [
  { id: 1, name: "AI 번역기", creator: "김번역", category: "AI", status: "승인대기", reports: 0 },
  { id: 2, name: "웹사이트 빌더", creator: "박빌더", category: "노코드", status: "승인대기", reports: 0 },
  { id: 3, name: "의심스러운 앱", creator: "의심자", category: "기타", status: "검토중", reports: 3 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = [
    { id: "dashboard", label: "대시보드", icon: BarChart3 },
    { id: "users", label: "회원관리", icon: Users },
    { id: "lectures", label: "강의관리", icon: BookOpen },
    { id: "community", label: "커뮤니티", icon: MessageSquare },
    { id: "saas", label: "SaaS 관리", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소 로고"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-yellow-400">떡상연구소 관리자</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="text-yellow-400" size={20} />
                <span className="text-white font-medium">관리자</span>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">대시보드</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={24} />
                          </div>
                          <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">최근 가입 회원</h3>
                      <div className="space-y-3">
                        {recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.type === "수강생" ? "bg-green-500/20 text-green-400" :
                                user.type === "방문자" ? "bg-blue-500/20 text-blue-400" :
                                "bg-red-500/20 text-red-400"
                              }`}>
                                {user.type}
                              </span>
                              <p className="text-gray-400 text-xs mt-1">{user.joinDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">승인 대기 중</h3>
                      <div className="space-y-3">
                        {pendingSaas.map((saas) => (
                          <div key={saas.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{saas.name}</p>
                              <p className="text-gray-400 text-sm">{saas.creator}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                <Check size={16} />
                              </button>
                              <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">회원 관리</h2>
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors">
                    회원 추가
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="이름, 이메일로 검색..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400">
                      <option>모든 회원</option>
                      <option>수강생</option>
                      <option>방문자</option>
                      <option>미구매자</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr className="text-gray-300">
                          <th className="px-6 py-4 text-left">이름</th>
                          <th className="px-6 py-4 text-left">이메일</th>
                          <th className="px-6 py-4 text-left">회원타입</th>
                          <th className="px-6 py-4 text-left">가입일</th>
                          <th className="px-6 py-4 text-left">상태</th>
                          <th className="px-6 py-4 text-left">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="text-gray-300 hover:bg-gray-800/30">
                            <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.type === "수강생" ? "bg-green-500/20 text-green-400" :
                                user.type === "방문자" ? "bg-blue-500/20 text-blue-400" :
                                "bg-red-500/20 text-red-400"
                              }`}>
                                {user.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">{user.joinDate}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.status === "활성" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                  <Eye size={16} />
                                </button>
                                <button className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                                  <Edit size={16} />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "community" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">커뮤니티 관리</h2>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                      신고 처리
                    </button>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-lg font-semibold text-white mb-2">총 게시글</h3>
                    <p className="text-3xl font-bold text-yellow-400">1,234</p>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-lg font-semibold text-white mb-2">신고된 게시글</h3>
                    <p className="text-3xl font-bold text-red-400">5</p>
                  </div>
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-lg font-semibold text-white mb-2">오늘 게시글</h3>
                    <p className="text-3xl font-bold text-green-400">23</p>
                  </div>
                </div>

                {/* Posts Table */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr className="text-gray-300">
                          <th className="px-6 py-4 text-left">제목</th>
                          <th className="px-6 py-4 text-left">작성자</th>
                          <th className="px-6 py-4 text-left">카테고리</th>
                          <th className="px-6 py-4 text-left">신고수</th>
                          <th className="px-6 py-4 text-left">상태</th>
                          <th className="px-6 py-4 text-left">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {recentPosts.map((post) => (
                          <tr key={post.id} className="text-gray-300 hover:bg-gray-800/30">
                            <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                            <td className="px-6 py-4">{post.author}</td>
                            <td className="px-6 py-4">{post.category}</td>
                            <td className="px-6 py-4">
                              {post.reports > 0 && (
                                <span className="flex items-center gap-1 text-red-400">
                                  <AlertTriangle size={16} />
                                  {post.reports}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                post.status === "승인" ? "bg-green-500/20 text-green-400" :
                                post.status === "검토중" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-red-500/20 text-red-400"
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                  <Eye size={16} />
                                </button>
                                <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                  <Check size={16} />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 다른 탭들도 비슷한 구조로 구현 */}
            {activeTab === "lectures" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">강의 관리</h2>
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors">
                    강의 추가
                  </button>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                  <p className="text-gray-300">강의 관리 기능 구현 예정</p>
                </div>
              </motion.div>
            )}

            {activeTab === "saas" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">SaaS 관리</h2>
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors">
                    SaaS 추가
                  </button>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                  <p className="text-gray-300">SaaS 관리 기능 구현 예정</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}