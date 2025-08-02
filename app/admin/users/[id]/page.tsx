'use client'

import { userNotification, logger } from '@/lib/logger'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  Activity,
  Shield,
  ShieldCheck,
  Edit,
  Save,
  X
} from 'lucide-react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface UserDetail {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_login_at?: string
}

interface UserActivity {
  id: string
  type: string
  description: string
  created_at: string
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [userLectures, setUserLectures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  })
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
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

    fetchUserDetail()
  }

  const fetchUserDetail = async () => {
    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      setUserDetail(userData)

      if (userData) {
        setEditForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user'
        })
      }

      // Fetch user's lecture enrollments
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lecture_enrollments')
        .select(`
          *,
          lectures (
            id,
            title,
            thumbnail_url,
            instructor_name,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!lecturesError) {
        setUserLectures(lecturesData || [])
      }

      // Generate mock activities (in real app, you'd have an activities table)
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          type: 'login',
          description: '로그인',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        {
          id: '2',
          type: 'enrollment',
          description: '새 강의 등록',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
          id: '3',
          type: 'comment',
          description: '커뮤니티 댓글 작성',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        }
      ]
      setUserActivities(mockActivities)

    } catch (error) {
      logger.error('Error fetching user detail:', error)
      userNotification.alert('사용자 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setEditing(false)
      fetchUserDetail()
      userNotification.alert('사용자 정보가 수정되었습니다.')
    } catch (error) {
      logger.error('Error updating user:', error)
      userNotification.alert('사용자 정보 수정 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <Activity className="w-4 h-4 text-green-500" />
      case 'enrollment': return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'comment': return <Mail className="w-4 h-4 text-purple-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="admin" />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-offWhite-600 mb-4">
              사용자를 찾을 수 없습니다
            </h3>
            <button
              onClick={() => router.push('/admin/users')}
              className="px-6 py-3 bg-metallicGold-500 text-deepBlack-900 rounded-lg font-semibold hover:bg-metallicGold-400 transition-colors"
            >
              사용자 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/users')}
            className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-offWhite-200">사용자 상세 정보</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-offWhite-200">기본 정보</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="p-2 text-offWhite-600 hover:text-metallicGold-500 transition-colors"
                >
                  {editing ? <X size={20} /> : <Edit size={20} />}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">이름</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">이메일</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">전화번호</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-offWhite-500 mb-2">역할</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                    >
                      <option value="user">일반 사용자</option>
                      <option value="admin">관리자</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateUser}
                      className="px-4 py-2 bg-metallicGold-500 text-deepBlack-900 rounded-lg font-medium hover:bg-metallicGold-400 transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      저장
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 text-offWhite-600 hover:text-offWhite-200 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-metallicGold-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-deepBlack-900" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-offWhite-200">
                        {userDetail.name || '이름 없음'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {userDetail.role === 'admin' ? (
                          <Shield className="w-4 h-4 text-red-500" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          userDetail.role === 'admin' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {userDetail.role === 'admin' ? '관리자' : '일반 사용자'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-offWhite-600" />
                      <span className="text-offWhite-200">{userDetail.email}</span>
                    </div>
                    {userDetail.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-offWhite-600" />
                        <span className="text-offWhite-200">{userDetail.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-offWhite-600" />
                      <span className="text-offWhite-200">
                        가입일: {formatDate(userDetail.created_at)}
                      </span>
                    </div>
                    {userDetail.last_login_at && (
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-offWhite-600" />
                        <span className="text-offWhite-200">
                          최근 로그인: {formatDate(userDetail.last_login_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User's Lectures */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <h3 className="text-lg font-semibold text-offWhite-200 mb-4">수강 중인 강의</h3>
              {userLectures.length === 0 ? (
                <p className="text-offWhite-600 text-center py-8">수강 중인 강의가 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {userLectures.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-4 p-3 bg-deepBlack-600/50 rounded-lg">
                      <div className="w-12 h-12 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-metallicGold-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-offWhite-200">{enrollment.lectures?.title}</h4>
                        <p className="text-sm text-offWhite-600">
                          강사: {enrollment.lectures?.instructor_name} | 
                          등록일: {formatDate(enrollment.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-metallicGold-500">
                          ₩{enrollment.lectures?.price?.toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          enrollment.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {enrollment.status === 'active' ? '수강중' : '완료'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <h3 className="text-lg font-semibold text-offWhite-200 mb-4">통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-offWhite-600">수강 강의</span>
                  <span className="text-offWhite-200 font-semibold">{userLectures.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-offWhite-600">총 결제금액</span>
                  <span className="text-offWhite-200 font-semibold">
                    ₩{userLectures.reduce((sum, e) => sum + (e.lectures?.price || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
              <h3 className="text-lg font-semibold text-offWhite-200 mb-4">최근 활동</h3>
              <div className="space-y-3">
                {userActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm text-offWhite-200">{activity.description}</p>
                      <p className="text-xs text-offWhite-600">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}