'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, LogOut, CreditCard, BookOpen, 
  Shield, Bell, Settings, Camera, Check, X
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

interface TabContent {
  id: string
  label: string
  icon: React.ElementType
}

const tabs: TabContent[] = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'lectures', label: '내 강의', icon: BookOpen },
  { id: 'payments', label: '결제 내역', icon: CreditCard },
  { id: 'security', label: '보안', icon: Shield },
  { id: 'notifications', label: '알림', icon: Bell },
]

export default function MyPage() {
  const { user, userProfile, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  })
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || ''
      })
    }
  }, [userProfile])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, activeTab])

  const fetchUserData = async () => {
    if (!user) return
    
    try {
      if (activeTab === 'lectures') {
        const { data } = await supabase
          .from('lecture_enrollments')
          .select(`
            *,
            lectures (
              id,
              title,
              thumbnail_url,
              instructor_id,
              duration,
              level
            )
          `)
          .eq('user_id', user.id)
          .order('enrolled_at', { ascending: false })
        
        if (data) setEnrollments(data)
      } else if (activeTab === 'payments') {
        const { data } = await supabase
          .from('payments')
          .select(`
            *,
            lectures (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) setPayments(data)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const handleProfileUpdate = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (!error) {
        setEditMode(false)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="mypage" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-metallicGold-500 mb-8">마이페이지</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 text-metallicGold-500'
                          : 'text-offWhite-500 hover:text-metallicGold-500 hover:bg-deepBlack-600/50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-metallicGold-900/30">
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">로그아웃</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-deepBlack-300 rounded-xl p-8 border border-metallicGold-900/30">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-offWhite-200">프로필 정보</h2>
                      {!editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="px-4 py-2 text-sm bg-metallicGold-500/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-500/30 transition-all"
                        >
                          수정
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-metallicGold-500 text-deepBlack-900 rounded-lg hover:bg-metallicGold-400 transition-all disabled:opacity-50"
                          >
                            {loading ? '저장 중...' : '저장'}
                          </button>
                          <button
                            onClick={() => {
                              setEditMode(false)
                              setProfileData({
                                name: userProfile?.name || '',
                                email: userProfile?.email || '',
                                phone: userProfile?.phone || '',
                                bio: userProfile?.bio || ''
                              })
                            }}
                            className="px-4 py-2 text-sm bg-deepBlack-600 text-offWhite-500 rounded-lg hover:bg-deepBlack-900 transition-all"
                          >
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-deepBlack-600 border-2 border-metallicGold-500/30 flex items-center justify-center">
                            {userProfile?.avatar_url ? (
                              <Image
                                src={userProfile.avatar_url}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="w-12 h-12 text-metallicGold-500/50" />
                            )}
                          </div>
                          {editMode && (
                            <button className="absolute bottom-0 right-0 p-2 bg-metallicGold-500 rounded-full text-deepBlack-900 hover:bg-metallicGold-400 transition-all">
                              <Camera className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-2">
                            <label className="text-sm text-offWhite-600">이름</label>
                            {editMode ? (
                              <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full mt-1 px-4 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                              />
                            ) : (
                              <p className="text-offWhite-200 font-medium">{profileData.name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-offWhite-600">이메일</label>
                        <p className="text-offWhite-200 font-medium">{profileData.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-offWhite-600">전화번호</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full mt-1 px-4 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                          />
                        ) : (
                          <p className="text-offWhite-200 font-medium">{profileData.phone || '등록된 번호가 없습니다'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-offWhite-600">소개</label>
                        {editMode ? (
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={4}
                            className="w-full mt-1 px-4 py-2 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                            placeholder="자기소개를 입력하세요"
                          />
                        ) : (
                          <p className="text-offWhite-200 font-medium">{profileData.bio || '소개가 없습니다'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-offWhite-600">회원 등급</label>
                        <p className="text-offWhite-200 font-medium">
                          {userProfile?.role === 'admin' ? (
                            <span className="text-metallicGold-500">관리자</span>
                          ) : (
                            '일반 회원'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'lectures' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-offWhite-200 mb-6">내 강의</h2>
                    {enrollments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enrollments.map((enrollment) => (
                          <div
                            key={enrollment.id}
                            className="bg-deepBlack-600 rounded-lg p-4 border border-metallicGold-900/30"
                          >
                            <h3 className="text-lg font-medium text-offWhite-200 mb-2">
                              {enrollment.lectures?.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-offWhite-600">
                              <span>진행률: {enrollment.progress_percentage}%</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                enrollment.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-metallicGold-500/20 text-metallicGold-500'
                              }`}>
                                {enrollment.status === 'completed' ? '완료' : '수강중'}
                              </span>
                            </div>
                            <div className="mt-3">
                              <div className="w-full bg-deepBlack-900 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress_percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-offWhite-600 text-center py-8">수강 중인 강의가 없습니다</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'payments' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-offWhite-200 mb-6">결제 내역</h2>
                    {payments.length > 0 ? (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between bg-deepBlack-600 rounded-lg p-4 border border-metallicGold-900/30"
                          >
                            <div>
                              <h3 className="text-lg font-medium text-offWhite-200">
                                {payment.lectures?.title || '강의'}
                              </h3>
                              <p className="text-sm text-offWhite-600">
                                {new Date(payment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-metallicGold-500">
                                ₩{payment.amount.toLocaleString()}
                              </p>
                              <p className={`text-sm ${
                                payment.status === 'completed' 
                                  ? 'text-green-400' 
                                  : payment.status === 'failed'
                                  ? 'text-red-400'
                                  : 'text-yellow-400'
                              }`}>
                                {payment.status === 'completed' ? '완료' 
                                  : payment.status === 'failed' ? '실패' 
                                  : '대기중'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-offWhite-600 text-center py-8">결제 내역이 없습니다</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-offWhite-200 mb-6">보안 설정</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-offWhite-200 mb-3">비밀번호 변경</h3>
                        <button className="px-6 py-3 bg-metallicGold-500/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-500/30 transition-all">
                          비밀번호 변경하기
                        </button>
                      </div>
                      
                      <div className="pt-6 border-t border-metallicGold-900/30">
                        <h3 className="text-lg font-medium text-offWhite-200 mb-3">이중 인증</h3>
                        <p className="text-offWhite-600 mb-3">계정 보안을 강화하기 위해 이중 인증을 설정하세요</p>
                        <button className="px-6 py-3 bg-metallicGold-500/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-500/30 transition-all">
                          이중 인증 설정
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-offWhite-200 mb-6">알림 설정</h2>
                    <div className="space-y-4">
                      {[
                        { id: 'email', label: '이메일 알림', description: '중요한 업데이트를 이메일로 받습니다' },
                        { id: 'lecture', label: '강의 알림', description: '새로운 강의 및 업데이트 알림' },
                        { id: 'community', label: '커뮤니티 알림', description: '댓글 및 좋아요 알림' },
                        { id: 'marketing', label: '마케팅 알림', description: '프로모션 및 이벤트 정보' },
                      ].map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-4 bg-deepBlack-600 rounded-lg border border-metallicGold-900/30">
                          <div>
                            <h3 className="font-medium text-offWhite-200">{notification.label}</h3>
                            <p className="text-sm text-offWhite-600">{notification.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-deepBlack-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-metallicGold-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-metallicGold-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}