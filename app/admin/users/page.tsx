'use client'

import { userNotification, logger } from '@/lib/logger'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter,
  Trash2,
  Shield,
  ShieldCheck,
  Eye
} from 'lucide-react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const router = useRouter()
  const { user } = useAuth()

  const fetchUsers = useCallback(async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter)
      }

      const { data, error } = await query

      if (error) { throw error }
      
      let filteredUsers = data ?? []
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter((userData: any) => 
          userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userData.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setUsers(filteredUsers)
    } catch (error) {
      logger.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, roleFilter])

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/')
      return
    }

    void fetchUsers()
  }, [user, router, fetchUsers])

  useEffect(() => {
    void checkAdminAccess()
  }, [checkAdminAccess])

  useEffect(() => {
    if (!loading) {
      void fetchUsers()
    }
  }, [fetchUsers, loading])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) { throw error }
      
      void fetchUsers()
    } catch (error) {
      logger.error('Error updating role:', error)
      userNotification.alert('역할 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!userNotification.confirm('정말 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) { throw error }
      
      void fetchUsers()
    } catch (error) {
      logger.error('Error deleting user:', error)
      userNotification.alert('사용자 삭제 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-offWhite-200">회원 관리</h1>
          <div className="text-sm text-offWhite-600">
            총 {users.length}명
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offWhite-600 w-5 h-5" />
              <input
                type="text"
                placeholder="이메일 또는 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offWhite-600 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
              >
                <option value="all">모든 역할</option>
                <option value="user">일반 사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-deepBlack-600 border-b border-metallicGold-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-offWhite-500">사용자</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-offWhite-500">역할</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-offWhite-500">가입일</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-offWhite-500">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-metallicGold-900/20">
                {users.map((userData) => (
                  <motion.tr
                    key={userData.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-deepBlack-600/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-metallicGold-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-deepBlack-900" />
                        </div>
                        <div>
                          <div className="font-medium text-offWhite-200">
                            {userData.name ?? '이름 없음'}
                          </div>
                          <div className="text-sm text-offWhite-600">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={userData.role}
                        onChange={(e) => void handleRoleChange(userData.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          userData.role === 'admin'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        } focus:outline-none focus:ring-2 focus:ring-metallicGold-500`}
                      >
                        <option value="user">일반 사용자</option>
                        <option value="admin">관리자</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-offWhite-600">
                      {formatDate(userData.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/users/${userData.id}`)}
                          className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                          title="상세보기"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => void handleDeleteUser(userData.id)}
                          className="p-2 text-offWhite-600 hover:text-red-500 transition-colors"
                          title="삭제"
                          disabled={userData.id === user?.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-offWhite-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-offWhite-600 mb-2">
                사용자가 없습니다
              </h3>
              <p className="text-offWhite-600">
                검색 조건을 확인해보세요
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-metallicGold-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">전체 사용자</h3>
            </div>
            <p className="text-3xl font-bold text-metallicGold-500">
              {users.length}명
            </p>
          </div>

          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-red-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">관리자</h3>
            </div>
            <p className="text-3xl font-bold text-red-500">
              {users.filter(u => u.role === 'admin').length}명
            </p>
          </div>

          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">일반 사용자</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">
              {users.filter(u => u.role === 'user').length}명
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}