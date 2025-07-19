'use client'

import React, { useState, useEffect } from 'react'
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
  AlertTriangle,
  DollarSign,
  Activity
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalUsers: number
  totalLectures: number
  totalPosts: number
  totalSaas: number
  userGrowth: number
  activeUsers: number
  revenue: number
  paidUsers: number
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLectures: 0,
    totalPosts: 0,
    totalSaas: 0,
    userGrowth: 0,
    activeUsers: 0,
    revenue: 0,
    paidUsers: 0
  })
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [saasProducts, setSaasProducts] = useState<any[]>([])
  const { signOut } = useAuth()

  const tabs = [
    { id: "dashboard", label: "대시보드", icon: BarChart3 },
    { id: "users", label: "회원관리", icon: Users },
    { id: "lectures", label: "강의관리", icon: BookOpen },
    { id: "community", label: "커뮤니티", icon: MessageSquare },
    { id: "saas", label: "SaaS 관리", icon: Settings },
  ]

  useEffect(() => {
    loadDashboardData()
  }, [activeTab])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // 사용자 통계
      const { data: usersData, count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10)
      
      // 유료 사용자 수 (role이 user인 일반 회원 대신 실제 결제한 사용자를 추적해야 함)
      const { count: paidUserCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user') // 일단 일반 유저로 설정, 추후 결제 정보와 연동 필요
      
      // 강의 통계
      const { data: lecturesData, count: lectureCount } = await supabase
        .from('lectures')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10)
      
      // 커뮤니티 게시글 통계
      const { data: postsData, count: postCount } = await supabase
        .from('community_posts')
        .select('*, profiles(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10)
      
      // SaaS 제품 통계
      const { data: saasData, count: saasCount } = await supabase
        .from('saas_products')
        .select('*, profiles(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10)
      
      // 활성 사용자 수 (최근 7일 이내 로그인)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUserCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', sevenDaysAgo.toISOString())
      
      // 이번 달 가입자 수 증가율 계산
      const thisMonthStart = new Date()
      thisMonthStart.setDate(1)
      thisMonthStart.setHours(0, 0, 0, 0)
      
      const lastMonthStart = new Date(thisMonthStart)
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
      
      const { count: thisMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart.toISOString())
      
      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart.toISOString())
        .lt('created_at', thisMonthStart.toISOString())
      
      const userGrowth = lastMonthUsers && lastMonthUsers > 0 
        ? Math.round(((thisMonthUsers || 0) - lastMonthUsers) / lastMonthUsers * 100)
        : 0
      
      setStats({
        totalUsers: userCount || 0,
        totalLectures: lectureCount || 0,
        totalPosts: postCount || 0,
        totalSaas: saasCount || 0,
        userGrowth,
        activeUsers: activeUserCount || 0,
        revenue: (paidUserCount || 0) * 29900, // 프로 플랜 기준 예상 수익
        paidUsers: paidUserCount || 0
      })
      
      setUsers(usersData || [])
      setPosts(postsData || [])
      setLectures(lecturesData || [])
      setSaasProducts(saasData || [])
      
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (!error) {
        loadDashboardData()
      }
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
      
      if (!error) {
        loadDashboardData()
      }
    }
  }

  const handleApproveSaas = async (saasId: string) => {
    const { error } = await supabase
      .from('saas_products')
      .update({ status: 'approved' })
      .eq('id', saasId)
    
    if (!error) {
      loadDashboardData()
    }
  }

  const statsDisplay = [
    { label: "전체 회원", value: stats.totalUsers.toLocaleString(), change: `+${stats.userGrowth}%`, icon: Users, color: "text-blue-400" },
    { label: "강의 수", value: stats.totalLectures.toString(), change: "Active", icon: BookOpen, color: "text-green-400" },
    { label: "커뮤니티 게시글", value: stats.totalPosts.toLocaleString(), change: "Active", icon: MessageSquare, color: "text-purple-400" },
    { label: "SaaS 등록", value: stats.totalSaas.toString(), change: "Active", icon: Settings, color: "text-yellow-400" },
    { label: "활성 사용자", value: stats.activeUsers.toLocaleString(), change: "7일 이내", icon: Activity, color: "text-green-400" },
    { label: "유료 회원", value: stats.paidUsers.toLocaleString(), change: "수강생", icon: Star, color: "text-yellow-400" },
    { label: "예상 수익", value: `₩${stats.revenue.toLocaleString()}`, change: "월간", icon: DollarSign, color: "text-green-400" },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header currentPage="admin" />

        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-yellow-400">로딩 중...</div>
                </div>
              ) : (
                <>
                  {/* Dashboard Tab */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">대시보드</h2>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsDisplay.map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <stat.icon className={stat.color} size={24} />
                              <span className="text-xs text-gray-500">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Recent Activity */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Users */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">최근 가입 회원</h3>
                          <div className="space-y-3">
                            {users.slice(0, 5).map((user) => (
                              <div key={user.id} className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium">{user.name || user.email?.split('@')[0]}</p>
                                  <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  user.role === 'admin' 
                                    ? 'bg-red-900/50 text-red-400' 
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                  {user.role === 'admin' ? '관리자' : '일반회원'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Posts */}
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">최근 게시글</h3>
                          <div className="space-y-3">
                            {posts.slice(0, 5).map((post) => (
                              <div key={post.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-white font-medium truncate">{post.title}</p>
                                  <p className="text-xs text-gray-400">{post.profiles?.name || '익명'}</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Users Tab */}
                  {activeTab === "users" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">회원 관리</h2>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              placeholder="회원 검색..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">사용자</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">유형</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">가입일</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">상태</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">액션</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {users.filter(user => 
                              user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.name?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((user) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-white">{user.name || '미설정'}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    user.role === 'admin' 
                                      ? 'bg-red-900/50 text-red-400'
                                      : 'bg-gray-800 text-gray-400'
                                  }`}>
                                    {user.role === 'admin' ? '관리자' : '일반회원'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs rounded bg-green-900/50 text-green-400">
                                    활성
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-blue-400 hover:text-blue-300">
                                      <Eye size={16} />
                                    </button>
                                    <button className="text-yellow-400 hover:text-yellow-300">
                                      <Edit size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
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
                  )}

                  {/* Community Tab */}
                  {activeTab === "community" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">커뮤니티 관리</h2>
                      </div>

                      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">게시글</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">작성자</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">카테고리</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">작성일</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">액션</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {posts.map((post) => (
                              <tr key={post.id}>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{post.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {post.profiles?.name || '익명'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">
                                    {post.category || '일반'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-blue-400 hover:text-blue-300">
                                      <Eye size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeletePost(post.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
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
                  )}

                  {/* SaaS Tab */}
                  {activeTab === "saas" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">SaaS 관리</h2>
                      </div>

                      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">제품명</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">개발자</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">카테고리</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">상태</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">액션</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {saasProducts.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {product.profiles?.name || '익명'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    product.status === 'approved' 
                                      ? 'bg-green-900/50 text-green-400'
                                      : 'bg-yellow-900/50 text-yellow-400'
                                  }`}>
                                    {product.status === 'approved' ? '승인됨' : '대기중'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    {product.status !== 'approved' && (
                                      <button 
                                        onClick={() => handleApproveSaas(product.id)}
                                        className="text-green-400 hover:text-green-300"
                                      >
                                        <Check size={16} />
                                      </button>
                                    )}
                                    <button className="text-blue-400 hover:text-blue-300">
                                      <Eye size={16} />
                                    </button>
                                    <button className="text-red-400 hover:text-red-300">
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
                  )}

                  {/* Lectures Tab */}
                  {activeTab === "lectures" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">강의 관리</h2>
                        <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                          <Plus size={20} />
                          <span>새 강의 추가</span>
                        </button>
                      </div>

                      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">강의명</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">강사</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">수강생</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">가격</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">액션</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {lectures.map((lecture) => (
                              <tr key={lecture.id}>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{lecture.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {lecture.instructor}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {lecture.students || 0}명
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  ₩{(lecture.price || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-blue-400 hover:text-blue-300">
                                      <Eye size={16} />
                                    </button>
                                    <button className="text-yellow-400 hover:text-yellow-300">
                                      <Edit size={16} />
                                    </button>
                                    <button className="text-red-400 hover:text-red-300">
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
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}