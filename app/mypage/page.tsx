'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X, BookOpen, Heart, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  bookmarkedCourses: number;
  enrolledCourses: number;
  communityPosts: number;
}

export default function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    bookmarkedCourses: 0,
    enrolledCourses: 0,
    communityPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      // 북마크 수 가져오기 (로컬스토리지)
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]');
      const userBookmarks = bookmarks.filter((b: any) => b.userId === userId);
      
      // 커뮤니티 포스트 수 가져오기
      const { count: postsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      // 결제한 강의 수 가져오기
      const { count: paymentsCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      setStats({
        bookmarkedCourses: userBookmarks.length,
        enrolledCourses: paymentsCount || 0,
        communityPosts: postsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchProfile(user.id);
    fetchStats(user.id);
  }, [user, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;

      await fetchProfile(user!.id);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
    });
    setEditing(false);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="mypage" />

        <div className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
          {/* 페이지 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-metallicGold-500" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-2">마이페이지</h1>
                  <p className="text-lg text-offWhite-500">프로필 정보와 활동 내역을 확인하세요</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-deepBlack-300/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 hover:border-metallicGold-500/40 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </button>
              )}
            </div>
          </motion.div>

          {/* 프로필 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-offWhite-200 mb-6">프로필 정보</h2>
            
            <div className="space-y-6">
              {/* 이름 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                  <User className="w-4 h-4" />
                  이름
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <p className="text-offWhite-200">{profile?.name || '이름을 설정해주세요'}</p>
                )}
              </div>

              {/* 이메일 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                  <Mail className="w-4 h-4" />
                  이메일
                </label>
                <p className="text-offWhite-200">{profile?.email}</p>
              </div>

              {/* 전화번호 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                  <Phone className="w-4 h-4" />
                  전화번호
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                    placeholder="전화번호를 입력하세요"
                  />
                ) : (
                  <p className="text-offWhite-200">{profile?.phone || '전화번호를 설정해주세요'}</p>
                )}
              </div>

              {/* 권한 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                  <Shield className="w-4 h-4" />
                  권한
                </label>
                <p className="text-offWhite-200">
                  {profile?.role === 'admin' ? '관리자' : '일반 사용자'}
                </p>
              </div>

              {/* 가입일 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  가입일
                </label>
                <p className="text-offWhite-200">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ko-KR') : ''}
                </p>
              </div>

              {/* 수정 버튼 */}
              {editing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 hover:border-metallicGold-500/40 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* 활동 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
                <h3 className="text-lg font-bold text-offWhite-200">찜한 강의</h3>
              </div>
              <p className="text-3xl font-bold text-metallicGold-500">{stats.bookmarkedCourses}</p>
              <button
                onClick={() => router.push('/bookmarks')}
                className="mt-4 text-sm text-offWhite-500 hover:text-metallicGold-500 transition-colors"
              >
                보러가기 →
              </button>
            </div>

            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-offWhite-200">수강중인 강의</h3>
              </div>
              <p className="text-3xl font-bold text-metallicGold-500">{stats.enrolledCourses}</p>
              <button
                onClick={() => router.push('/lectures')}
                className="mt-4 text-sm text-offWhite-500 hover:text-metallicGold-500 transition-colors"
              >
                강의 둘러보기 →
              </button>
            </div>

            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-bold text-offWhite-200">커뮤니티 활동</h3>
              </div>
              <p className="text-3xl font-bold text-metallicGold-500">{stats.communityPosts}</p>
              <button
                onClick={() => router.push('/community')}
                className="mt-4 text-sm text-offWhite-500 hover:text-metallicGold-500 transition-colors"
              >
                커뮤니티 가기 →
              </button>
            </div>
          </motion.div>

          {/* 로그아웃 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-colors"
            >
              로그아웃
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}