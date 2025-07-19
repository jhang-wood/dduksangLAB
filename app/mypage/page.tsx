'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Phone, LogOut, Edit2, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function MyPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: ''
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // 프로필 정보 가져오기
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormData({
          name: profileData.name || '',
          phone: profileData.phone || '',
          bio: profileData.bio || ''
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || ''
    })
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (!error) {
        setProfile({ ...profile, ...formData })
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">마이페이지</h1>
              <div className="flex gap-2">
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    수정
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      저장
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <X size={18} />
                      취소
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  로그아웃
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Mail className="inline mr-2" size={16} />
                  이메일
                </label>
                <div className="text-white bg-gray-800 px-4 py-3 rounded-lg">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <User className="inline mr-2" size={16} />
                  이름
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                ) : (
                  <div className="text-white bg-gray-800 px-4 py-3 rounded-lg">
                    {profile?.name || '미설정'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Phone className="inline mr-2" size={16} />
                  전화번호
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                ) : (
                  <div className="text-white bg-gray-800 px-4 py-3 rounded-lg">
                    {profile?.phone || '미설정'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  자기소개
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  />
                ) : (
                  <div className="text-white bg-gray-800 px-4 py-3 rounded-lg min-h-[100px]">
                    {profile?.bio || '자기소개를 작성해주세요.'}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>회원 유형: {profile?.role === 'admin' ? '관리자' : '일반회원'}</span>
                  <span>가입일: {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {profile?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">관리자 메뉴</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin"
                  className="px-4 py-3 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors text-center font-semibold"
                >
                  관리자 페이지
                </Link>
                <Link
                  href="/admin/lectures"
                  className="px-4 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-center font-semibold"
                >
                  강의 관리
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}