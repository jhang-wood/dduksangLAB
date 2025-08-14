'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Calendar, Shield, Edit, Save, X, 
  BookOpen, Heart, MessageSquare, Camera, TrendingUp,
  Clock, Star, CheckCircle, Activity
} from 'lucide-react';
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
  avatar_url: string | null;
  bio: string | null;
  role: string;
  is_admin?: boolean;
  is_active?: boolean;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

interface Stats {
  bookmarkedCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  communityPosts: number;
  totalLikes: number;
  learningHours: number;
}

interface EnrolledCourse {
  id: string;
  lecture: {
    title: string;
    thumbnail_url: string;
    duration: number;
  };
  progress_percentage: number;
  last_watched_at: string;
}

export default function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    bookmarkedCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    communityPosts: 0,
    totalLikes: 0,
    learningHours: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
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

      if (error) {
        // 프로필이 없는 경우 생성
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userData.user.id,
                email: userData.user.email || '',
                name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || '',
                role: 'user',
                is_admin: false,
                is_active: true,
                email_verified: false
              })
              .select()
              .single();
            
            if (!createError && newProfile) {
              setProfile(newProfile);
              setFormData({
                name: newProfile.name || '',
                phone: newProfile.phone || '',
                bio: newProfile.bio || '',
              });
            }
          }
        } else {
          console.error('Error fetching profile:', error);
        }
      } else {
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
      }
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
      
      // 수강 중인 강의 수
      const { data: enrollments, count: enrollmentCount } = await supabase
        .from('lecture_enrollments')
        .select('*, lectures(title, thumbnail_url, duration)', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // 완료한 강의 수
      const { count: completedCount } = await supabase
        .from('lecture_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      // 커뮤니티 포스트 수
      const { count: postsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      // 받은 좋아요 총합
      const { data: posts } = await supabase
        .from('community_posts')
        .select('likes')
        .eq('author_id', userId);
      
      const totalLikes = posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

      // 총 학습 시간 (수강한 강의들의 duration 합)
      const learningHours = enrollments?.reduce((sum, enrollment: any) => {
        return sum + (enrollment.lectures?.duration || 0);
      }, 0) || 0;

      setStats({
        bookmarkedCourses: userBookmarks.length,
        enrolledCourses: enrollmentCount || 0,
        completedCourses: completedCount || 0,
        communityPosts: postsCount || 0,
        totalLikes,
        learningHours: Math.round(learningHours / 60), // 분을 시간으로 변환
      });

      // 최근 수강 중인 강의 목록
      if (enrollments && enrollments.length > 0) {
        setEnrolledCourses(enrollments.slice(0, 3).map((e: any) => ({
          id: e.id,
          lecture: e.lectures,
          progress_percentage: e.progress_percentage || 0,
          last_watched_at: e.last_watched_at || e.enrolled_at,
        })));
      }
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploadingAvatar(true);

    try {
      // 이전 아바타 삭제
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`avatars/${oldPath}`]);
        }
      }

      // 새 아바타 업로드
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 프로필 업데이트
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      // 로컬 상태 업데이트
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
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
      bio: profile?.bio || '',
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

        <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
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
                  <p className="text-lg text-offWhite-500">프로필 정보와 학습 현황을 확인하세요</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 프로필 정보 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              {/* 프로필 카드 */}
              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6 mb-6">
                {/* 아바타 */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.name || 'Profile'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-metallicGold-500" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-metallicGold-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-metallicGold-400 transition-colors">
                      <Camera className="w-5 h-5 text-deepBlack-900" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-offWhite-200 mb-2">
                    {profile?.name || '이름 없음'}
                  </h2>
                  <p className="text-offWhite-500">{profile?.email}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    {profile?.email_verified && (
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        인증됨
                      </span>
                    )}
                    {profile?.is_admin && (
                      <span className="px-3 py-1 bg-metallicGold-500/10 border border-metallicGold-500/20 rounded-full text-xs text-metallicGold-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        관리자
                      </span>
                    )}
                  </div>
                </div>

                {/* 자기소개 */}
                {(profile?.bio || editing) && (
                  <div className="mb-6">
                    <label className="text-sm text-offWhite-500 mb-2 block">자기소개</label>
                    {editing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors resize-none"
                        rows={3}
                        placeholder="간단한 자기소개를 작성해주세요"
                      />
                    ) : (
                      <p className="text-offWhite-200 text-sm">{profile?.bio || '자기소개를 작성해주세요'}</p>
                    )}
                  </div>
                )}

                {/* 연락처 정보 */}
                <div className="space-y-4">
                  {editing ? (
                    <>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                          <User className="w-4 h-4" />
                          이름
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-offWhite-500 mb-2">
                          <Phone className="w-4 h-4" />
                          전화번호
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 focus:border-metallicGold-500/40 focus:outline-none transition-colors"
                          placeholder="010-0000-0000"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.phone && (
                        <div className="flex items-center gap-3 text-offWhite-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-offWhite-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(profile?.created_at || '').toLocaleDateString('ko-KR')} 가입
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* 수정/저장 버튼 */}
                <div className="mt-6">
                  {editing ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? '저장 중...' : '저장'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 hover:border-metallicGold-500/40 transition-colors flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/20 rounded-xl text-offWhite-200 hover:border-metallicGold-500/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      프로필 수정
                    </button>
                  )}
                </div>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-colors"
              >
                로그아웃
              </button>
            </motion.div>

            {/* 오른쪽: 활동 통계 및 학습 현황 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* 활동 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-offWhite-500">수강중</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.enrolledCourses}</p>
                </div>

                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-offWhite-500">완료</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.completedCourses}</p>
                </div>

                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-metallicGold-500" />
                    <span className="text-sm text-offWhite-500">학습시간</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.learningHours}h</p>
                </div>

                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-sm text-offWhite-500">찜한 강의</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.bookmarkedCourses}</p>
                </div>

                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-offWhite-500">게시글</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.communityPosts}</p>
                </div>

                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-offWhite-500">받은 좋아요</span>
                  </div>
                  <p className="text-2xl font-bold text-offWhite-200">{stats.totalLikes}</p>
                </div>
              </div>

              {/* 최근 학습 강의 */}
              {enrolledCourses.length > 0 && (
                <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-metallicGold-500" />
                    최근 학습 강의
                  </h3>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-4">
                        <div className="w-20 h-14 bg-deepBlack-900/50 rounded-lg overflow-hidden">
                          {course.lecture.thumbnail_url ? (
                            <img 
                              src={course.lecture.thumbnail_url} 
                              alt={course.lecture.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-offWhite-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-offWhite-200 font-medium mb-1">
                            {course.lecture.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-offWhite-500">
                            <span>{Math.round(course.lecture.duration / 60)}시간</span>
                            <span>{new Date(course.last_watched_at).toLocaleDateString('ko-KR')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-metallicGold-500">
                            {Math.round(course.progress_percentage)}%
                          </div>
                          <div className="w-24 h-2 bg-deepBlack-900/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-metallicGold-500 to-metallicGold-900"
                              style={{ width: `${course.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 빠른 메뉴 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push('/lectures')}
                  className="p-4 bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl hover:border-metallicGold-500/40 transition-colors text-center"
                >
                  <BookOpen className="w-6 h-6 text-metallicGold-500 mx-auto mb-2" />
                  <span className="text-sm text-offWhite-200">강의 둘러보기</span>
                </button>

                <button
                  onClick={() => router.push('/bookmarks')}
                  className="p-4 bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl hover:border-metallicGold-500/40 transition-colors text-center"
                >
                  <Heart className="w-6 h-6 text-metallicGold-500 mx-auto mb-2" />
                  <span className="text-sm text-offWhite-200">찜한 강의</span>
                </button>

                <button
                  onClick={() => router.push('/community')}
                  className="p-4 bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl hover:border-metallicGold-500/40 transition-colors text-center"
                >
                  <MessageSquare className="w-6 h-6 text-metallicGold-500 mx-auto mb-2" />
                  <span className="text-sm text-offWhite-200">커뮤니티</span>
                </button>

                <button
                  onClick={() => router.push('/ai-trends')}
                  className="p-4 bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl hover:border-metallicGold-500/40 transition-colors text-center"
                >
                  <Activity className="w-6 h-6 text-metallicGold-500 mx-auto mb-2" />
                  <span className="text-sm text-offWhite-200">AI 트렌드</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}