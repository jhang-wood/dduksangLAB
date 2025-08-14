'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Trophy, Coins, UserPlus, Copy, Check, BarChart3,
  Flame, Star, Users, MessageSquare, Activity, TrendingUp,
  Globe, Calendar, Clock, Heart, ChevronRight, Plus,
  Home, FolderOpen, History, Settings, Bell, Target, Gift
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type TabType = 'dashboard' | 'sites' | 'activity' | 'settings';

interface UserStats {
  totalViews: number;
  todayViews: number;
  totalPoints: number;
  currentRank: number;
  totalSites: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  consecutiveDays: number;
}

interface SiteData {
  id: string;
  name: string;
  url: string;
  description: string;
  views_today: number;
  views_total: number;
  rank_today: number;
  rank_change: number;
  likes: number;
  comments: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'site_view' | 'site_registered';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

export default function ImprovedMyPage() {
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 사용자 데이터 상태
  const [userStats, setUserStats] = useState<UserStats>({
    totalViews: 0,
    todayViews: 0,
    totalPoints: 0,
    currentRank: 999,
    totalSites: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    consecutiveDays: 1
  });
  
  const [userSites, setUserSites] = useState<SiteData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    setMounted(true);
    fetchUserData();
    
    // 30초마다 데이터 새로고침
    const interval = setInterval(() => {
      fetchUserData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Supabase 실시간 구독
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // 사이트 조회수 실시간 업데이트
      const siteViewsChannel = supabase
        .channel('site-views-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'site_views'
          },
          (payload) => {
            // 조회수 업데이트 시 데이터 새로고침
            fetchUserData();
          }
        )
        .subscribe();
      
      // 커뮤니티 활동 실시간 업데이트
      const communityChannel = supabase
        .channel('community-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'community_posts',
            filter: `author_id=eq.${user.id}`
          },
          (payload) => {
            fetchUserData();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(siteViewsChannel);
        supabase.removeChannel(communityChannel);
      };
    };
    
    setupRealtimeSubscription();
  }, []);

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 현재 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // 프로필 정보
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserName(profile.name || profile.email?.split('@')[0] || '사용자');
      }

      // 사용자 사이트 정보
      const { data: sites } = await supabase
        .from('user_sites')
        .select('*')
        .eq('user_id', user.id)
        .order('views_today', { ascending: false });
      
      if (sites) {
        setUserSites(sites);
        
        // 통계 계산
        const totalViews = sites.reduce((sum, site) => sum + (site.views_total || 0), 0);
        const todayViews = sites.reduce((sum, site) => sum + (site.views_today || 0), 0);
        const bestRank = sites.length > 0 ? Math.min(...sites.map(s => s.rank_today || 999)) : 999;
        
        setUserStats(prev => ({
          ...prev,
          totalViews,
          todayViews,
          totalSites: sites.length,
          currentRank: bestRank
        }));
      }

      // 커뮤니티 활동 통계
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id')
        .eq('author_id', user.id);
      
      const { data: comments } = await supabase
        .from('community_comments')
        .select('id')
        .eq('author_id', user.id);
      
      setUserStats(prev => ({
        ...prev,
        totalPosts: posts?.length || 0,
        totalComments: comments?.length || 0
      }));

      // 최근 활동 내역 (임시 데이터)
      setRecentActivities([
        {
          id: '1',
          type: 'site_registered',
          title: '새 사이트 등록',
          description: '떡상랩 사이트를 등록했습니다',
          timestamp: '1시간 전',
          icon: <Globe className="w-4 h-4" />
        },
        {
          id: '2',
          type: 'post',
          title: '게시글 작성',
          description: 'AI 활용 팁 공유',
          timestamp: '3시간 전',
          icon: <MessageSquare className="w-4 h-4" />
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 추천인 코드 복사
  const copyReferralCode = () => {
    const fullLink = `https://dduksang.com?ref=${userName.toUpperCase()}2025`;
    navigator.clipboard.writeText(fullLink);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  // 로딩 상태
  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-deepBlack-900 via-deepBlack-800 to-deepBlack-900"></div>
      
      <div className="relative z-10">
        {/* 헤더 */}
        <header className="bg-deepBlack-800/50 border-b border-metallicGold-900/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-metallicGold-500">떡상랩</div>
              <nav className="hidden md:flex items-center space-x-6">
                <button onClick={() => router.push('/ai-trends')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">AI 트렌드</button>
                <button onClick={() => router.push('/sites')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">사이트홍보관</button>
                <button onClick={() => router.push('/community')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">커뮤니티</button>
                <button onClick={() => router.push('/lectures')} className="text-offWhite-400 hover:text-metallicGold-500 transition-colors">강의</button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          
          {/* 웰컴 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-offWhite-200">환영합니다, </span>
              <span className="text-metallicGold-500">{userName}</span>
              <span className="text-offWhite-200">님! 🎉</span>
            </h1>
            <p className="text-offWhite-500">오늘도 떡상을 향해 달려봅시다!</p>
          </motion.div>

          {/* 탭 네비게이션 */}
          <div className="flex flex-wrap gap-2 mb-8 bg-deepBlack-800/30 p-2 rounded-xl">
            {[
              { id: 'dashboard', label: '대시보드', icon: <Home className="w-4 h-4" /> },
              { id: 'sites', label: '내 사이트', icon: <Globe className="w-4 h-4" /> },
              { id: 'activity', label: '활동 내역', icon: <History className="w-4 h-4" /> },
              { id: 'settings', label: '설정', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-metallicGold-500/20 text-metallicGold-500 border border-metallicGold-500/30' 
                    : 'text-offWhite-400 hover:text-offWhite-200 hover:bg-deepBlack-700/30'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* 대시보드 탭 */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* 메인 통계 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  
                  {/* 순위 카드 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border-2 border-metallicGold-500/40 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-metallicGold-500" />
                      {userStats.currentRank <= 10 && (
                        <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full animate-pulse">
                          TOP 10
                        </div>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-metallicGold-500 mb-2">
                      #{formatNumber(userStats.currentRank)}
                    </div>
                    <div className="text-sm text-offWhite-500">최고 순위</div>
                  </motion.div>

                  {/* 오늘 조회수 카드 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Eye className="w-8 h-8 text-blue-500" />
                      <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        오늘
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {formatNumber(userStats.todayViews)}
                    </div>
                    <div className="text-sm text-offWhite-500">조회수</div>
                  </motion.div>

                  {/* 포인트 카드 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Coins className="w-8 h-8 text-yellow-500" />
                      <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                        +0P
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {formatNumber(userStats.totalPoints)}P
                    </div>
                    <div className="text-sm text-offWhite-500">보유 포인트</div>
                  </motion.div>

                  {/* 총 조회수 카드 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                      <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        누적
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {formatNumber(userStats.totalViews)}
                    </div>
                    <div className="text-sm text-offWhite-500">총 조회수</div>
                  </motion.div>
                </div>

                {/* 차트 섹션 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* 조회수 트렌드 차트 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-metallicGold-500" />
                      조회수 트렌드 (최근 7일)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { day: '월', views: 12 },
                        { day: '화', views: 19 },
                        { day: '수', views: 15 },
                        { day: '목', views: 25 },
                        { day: '금', views: 22 },
                        { day: '토', views: 30 },
                        { day: '일', views: userStats.todayViews }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="day" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #444',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#FFD700" 
                          strokeWidth={2}
                          dot={{ fill: '#FFD700', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* 활동 분포 차트 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-metallicGold-500" />
                      활동 분포
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[
                        { name: '사이트', value: userStats.totalSites },
                        { name: '게시글', value: userStats.totalPosts },
                        { name: '댓글', value: userStats.totalComments },
                        { name: '좋아요', value: userStats.totalLikes }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #444',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#FFD700" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* 하단 섹션 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  
                  {/* 추천인 제도 */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-offWhite-200 flex items-center gap-3">
                        <UserPlus className="w-6 h-6 text-metallicGold-500" />
                        친구 초대
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
                        <Gift className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-xl font-bold text-blue-400 mb-1">500P</div>
                        <div className="text-xs text-offWhite-500">친구 가입 시</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
                        <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-xl font-bold text-green-400 mb-1">2,000P</div>
                        <div className="text-xs text-offWhite-500">친구 활동 시</div>
                      </div>
                    </div>

                    <div className="bg-deepBlack-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-offWhite-500 mb-1">내 추천 코드</div>
                          <code className="text-metallicGold-500 font-mono text-sm font-bold">
                            {userName.toUpperCase()}2025
                          </code>
                        </div>
                        <button
                          onClick={copyReferralCode}
                          className="flex items-center gap-2 px-3 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 rounded-lg text-sm text-metallicGold-500 transition-all hover:scale-105"
                        >
                          {referralCodeCopied ? (
                            <>
                              <Check className="w-4 h-4" />
                              복사완료!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              복사
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* 커뮤니티 활동 */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-metallicGold-500" />
                      커뮤니티 활동
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                        <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-offWhite-200">
                          {userStats.totalPosts}
                        </div>
                        <div className="text-sm text-offWhite-500">작성글</div>
                      </div>
                      <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                        <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-offWhite-200">
                          {userStats.totalComments}
                        </div>
                        <div className="text-sm text-offWhite-500">댓글</div>
                      </div>
                      <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-offWhite-200">
                          {userStats.totalLikes}
                        </div>
                        <div className="text-sm text-offWhite-500">좋아요</div>
                      </div>
                      <div className="text-center p-4 bg-deepBlack-900/30 rounded-xl hover:bg-deepBlack-900/50 transition-colors">
                        <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-offWhite-200">
                          {userStats.consecutiveDays}
                        </div>
                        <div className="text-sm text-offWhite-500">연속출석</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 빠른 액션 */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-3">
                      <Target className="w-6 h-6 text-metallicGold-500" />
                      빠른 시작
                    </h2>

                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/sites/register')}
                        className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        사이트 등록하기
                      </button>
                      <button
                        onClick={() => router.push('/community/write')}
                        className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-bold hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        글 작성하기
                      </button>
                      <button
                        onClick={() => router.push('/community')}
                        className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-bold hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        커뮤니티 둘러보기
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* 내 사이트 탭 */}
            {activeTab === 'sites' && (
              <motion.div
                key="sites"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-offWhite-200">내가 등록한 사이트</h2>
                  <button
                    onClick={() => router.push('/sites/register')}
                    className="px-4 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 border border-metallicGold-500/30 rounded-lg text-metallicGold-500 font-medium transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    새 사이트 등록
                  </button>
                </div>

                {userSites.length === 0 ? (
                  <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-12 text-center">
                    <Globe className="w-16 h-16 text-metallicGold-500/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                      아직 등록한 사이트가 없습니다
                    </h3>
                    <p className="text-offWhite-500 mb-6">
                      지금 사이트를 등록하고 홍보를 시작해보세요!
                    </p>
                    <button
                      onClick={() => router.push('/sites/register')}
                      className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all duration-200 hover:scale-105"
                    >
                      첫 사이트 등록하기
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userSites.map((site) => (
                      <motion.div
                        key={site.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6 hover:border-metallicGold-700/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-offWhite-200 mb-1">{site.name}</h3>
                            <a 
                              href={site.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-metallicGold-500 hover:text-metallicGold-400 transition-colors"
                            >
                              {site.url}
                            </a>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-5 h-5 text-metallicGold-500" />
                            <span className="text-metallicGold-500 font-bold">#{site.rank_today || '---'}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-offWhite-500 mb-4 line-clamp-2">
                          {site.description || '설명이 없습니다'}
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-2 bg-deepBlack-900/30 rounded-lg">
                            <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-offWhite-200">{formatNumber(site.views_today)}</div>
                            <div className="text-xs text-offWhite-500">오늘</div>
                          </div>
                          <div className="text-center p-2 bg-deepBlack-900/30 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-offWhite-200">{formatNumber(site.views_total)}</div>
                            <div className="text-xs text-offWhite-500">총 조회</div>
                          </div>
                          <div className="text-center p-2 bg-deepBlack-900/30 rounded-lg">
                            <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-offWhite-200">{site.likes}</div>
                            <div className="text-xs text-offWhite-500">좋아요</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-lg text-sm font-medium hover:bg-deepBlack-600/50 transition-all">
                            통계 보기
                          </button>
                          <button className="flex-1 py-2 bg-metallicGold-500/20 border border-metallicGold-500/30 text-metallicGold-500 rounded-lg text-sm font-medium hover:bg-metallicGold-500/30 transition-all">
                            편집
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 활동 내역 탭 */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-offWhite-200">최근 활동 내역</h2>
                  <p className="text-offWhite-500 mt-2">내 모든 활동을 한눈에 확인하세요</p>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-4 hover:border-metallicGold-700/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-metallicGold-500/20 rounded-full flex items-center justify-center text-metallicGold-500">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-offWhite-200 font-medium">{activity.title}</h4>
                          <p className="text-sm text-offWhite-500 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-offWhite-500" />
                            <span className="text-xs text-offWhite-500">{activity.timestamp}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-offWhite-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {recentActivities.length === 0 && (
                  <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-12 text-center">
                    <History className="w-16 h-16 text-metallicGold-500/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                      아직 활동 내역이 없습니다
                    </h3>
                    <p className="text-offWhite-500">
                      사이트를 등록하거나 커뮤니티에 참여해보세요!
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* 설정 탭 */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-offWhite-200">설정</h2>
                  <p className="text-offWhite-500 mt-2">계정 및 알림 설정을 관리하세요</p>
                </div>

                <div className="space-y-6">
                  {/* 알림 설정 */}
                  <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-metallicGold-500" />
                      알림 설정
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'site_views', label: '내 사이트 조회 알림', enabled: true },
                        { id: 'comments', label: '댓글 알림', enabled: true },
                        { id: 'likes', label: '좋아요 알림', enabled: false },
                        { id: 'newsletter', label: '뉴스레터 수신', enabled: false }
                      ].map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between">
                          <span className="text-offWhite-300">{setting.label}</span>
                          <button 
                            className={`w-12 h-6 rounded-full transition-colors ${
                              setting.enabled 
                                ? 'bg-metallicGold-500' 
                                : 'bg-deepBlack-700 border border-offWhite-700'
                            }`}
                          >
                            <div 
                              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 계정 설정 */}
                  <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-metallicGold-500" />
                      계정 설정
                    </h3>
                    
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                        프로필 편집
                      </button>
                      <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-xl font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                        비밀번호 변경
                      </button>
                      <button className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/20 hover:border-red-500/50 transition-all text-left px-4">
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}