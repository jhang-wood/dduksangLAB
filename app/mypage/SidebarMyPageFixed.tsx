'use client';

import React, { useState, useEffect } from 'react';
import { 
  Eye, Trophy, Coins, UserPlus, Copy, Check,
  Flame, Star, Users, MessageSquare, Activity, TrendingUp,
  Globe, Clock, Heart, ChevronRight, Plus, Gift,
  Home, History, Settings, Bell, BarChart3,
  User, Menu, X, ArrowUp, ArrowDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';

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

export default function SidebarMyPageFixed() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);
  const [_loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 사용자 데이터 상태
  const [userStats, setUserStats] = useState<UserStats>({
    totalViews: 0,
    todayViews: 0,
    totalPoints: 0,
    currentRank: 0,
    totalSites: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    consecutiveDays: 1
  });
  
  const [userSites, setUserSites] = useState<SiteData[]>([]);
  const [allSites, setAllSites] = useState<SiteData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
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
      const { data: sites, error: sitesError } = await supabase
        .from('user_sites')
        .select('*')
        .eq('user_id', user.id)
        .order('views_today', { ascending: false });
      
      // 사이트 데이터 처리 (에러가 있어도 빈 배열로 처리)
      const userSitesData = sites || [];
      setUserSites(userSitesData);
      
      // 통계 계산
      const totalViews = userSitesData.reduce((sum: number, site: any) => sum + (site.views_total || 0), 0);
      const todayViews = userSitesData.reduce((sum: number, site: any) => sum + (site.views_today || 0), 0);
      const validRanks = userSitesData.filter((s: any) => s.rank_today && s.rank_today > 0).map((s: any) => s.rank_today!);
      const bestRank = validRanks.length > 0 ? Math.min(...validRanks) : 0;
      
      setUserStats(prev => ({
        ...prev,
        totalViews,
        todayViews,
        totalSites: userSitesData.length,
        currentRank: bestRank
      }));

      if (sitesError) {
        // 사이트 데이터 로드 실패 시 무시 (선택사항: 사용자에게 표시하는 로직 추가 가능)
      }

      // 전체 사이트 순위 가져오기
      const { data: allSitesData } = await supabase
        .from('user_sites')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .eq('is_active', true)
        .order('views_today', { ascending: false })
        .limit(20);

      if (allSitesData) {
        setAllSites(allSitesData);
      }

      // 최근 활동 내역
      setRecentActivities([
        {
          id: '1',
          type: 'site_registered',
          title: '새 사이트 등록',
          description: '떡상랩 사이트를 등록했습니다',
          timestamp: '1시간 전',
          icon: <Globe className="w-4 h-4" />
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

  // 사이트 탭 컨텐츠 컴포넌트
  const SitesTabContent = () => {
    const isUserSite = (siteId: string) => userSites.some(site => site.id === siteId);
    const getRankChange = (site: SiteData) => {
      const change = site.rank_change || 0;
      return change;
    };

    return (
      <div className="space-y-8">
        {/* 내 사이트 현황 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-offWhite-200">내 사이트 현황</h2>
            <button
              onClick={() => router.push('/sites/register')}
              className="px-4 py-2 bg-metallicGold-500/20 hover:bg-metallicGold-500/30 border border-metallicGold-500/30 rounded-lg text-metallicGold-500 font-medium transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 사이트 등록
            </button>
          </div>
          
          {userSites.length === 0 ? (
            <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-8 text-center">
              <Globe className="w-12 h-12 text-metallicGold-500/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-offWhite-200 mb-2">아직 등록한 사이트가 없습니다</h3>
              <p className="text-offWhite-500 mb-4">지금 사이트를 등록하고 홍보를 시작해보세요!</p>
              <button
                onClick={() => router.push('/sites/register')}
                className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
              >
                첫 사이트 등록하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSites.map((site) => (
                <div
                  key={site.id}
                  className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6 hover:border-metallicGold-700/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-offWhite-200 mb-1">{site.name}</h3>
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-metallicGold-500 hover:text-metallicGold-400">
                        {site.url}
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-metallicGold-500">#{site.rank_today || '---'}</div>
                      {getRankChange(site) !== 0 && (
                        <div className={`text-xs flex items-center ${getRankChange(site) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {getRankChange(site) > 0 ? (
                            <ArrowDown className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowUp className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(getRankChange(site))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-offWhite-500 mb-4 line-clamp-2">{site.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                      <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.views_today)}</p>
                      <p className="text-xs text-offWhite-500">오늘</p>
                    </div>
                    <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.views_total)}</p>
                      <p className="text-xs text-offWhite-500">총 조회</p>
                    </div>
                    <div className="text-center p-3 bg-deepBlack-900/30 rounded-lg">
                      <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-offWhite-200">{formatNumber(site.likes)}</p>
                      <p className="text-xs text-offWhite-500">좋아요</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 전체 실시간 순위 */}
        <div>
          <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-metallicGold-500" />
            실시간 사이트 순위
          </h2>
          
          <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
            {allSites.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-metallicGold-500/30 mx-auto mb-4" />
                <p className="text-offWhite-500">아직 등록된 사이트가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allSites.map((site, index) => {
                  const isMysite = isUserSite(site.id);
                  const rankChange = getRankChange(site);
                  
                  return (
                    <div
                      key={site.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        isMysite 
                          ? 'bg-gradient-to-r from-metallicGold-500/10 to-metallicGold-900/10 border border-metallicGold-500/30' 
                          : 'bg-deepBlack-700/30 hover:bg-deepBlack-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index < 3 
                            ? 'bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                            : isMysite
                            ? 'bg-metallicGold-500/30 text-metallicGold-400'
                            : 'bg-deepBlack-600 text-offWhite-500'
                        }`}>
                          {index + 1}
                        </div>
                        {isMysite && (
                          <span className="px-2 py-1 bg-metallicGold-500/30 rounded text-xs text-metallicGold-400 font-bold">
                            MY
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${isMysite ? 'text-metallicGold-400' : 'text-offWhite-200'}`}>
                            {site.name}
                          </h3>
                          {rankChange !== 0 && (
                            <div className={`text-xs flex items-center ${rankChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {rankChange > 0 ? (
                                <ArrowDown className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowUp className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(rankChange)}
                            </div>
                          )}
                        </div>
                        <a 
                          href={site.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-offWhite-500 hover:text-metallicGold-400 transition-colors"
                        >
                          {site.url}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className={`text-lg font-bold ${isMysite ? 'text-metallicGold-400' : 'text-offWhite-200'}`}>
                            {formatNumber(site.views_today)}
                          </p>
                          <p className="text-xs text-offWhite-500">오늘 조회수</p>
                        </div>
                        <div className="flex items-center gap-2 text-offWhite-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{formatNumber(site.likes)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 사이드바 메뉴 아이템
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <Home className="w-5 h-5" /> },
    { id: 'sites', label: '내 사이트', icon: <Globe className="w-5 h-5" /> },
    { id: 'activity', label: '활동 내역', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: '설정', icon: <Settings className="w-5 h-5" /> }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-deepBlack-900">
        <Header currentPage="mypage" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-offWhite-200 mb-4">로그인이 필요합니다</h2>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      {/* 공통 헤더 */}
      <Header currentPage="mypage" />
      
      <div className="flex">
        {/* 모바일 메뉴 토글 */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-2 bg-deepBlack-800 rounded-lg border border-metallicGold-900/30"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-metallicGold-500" /> : <Menu className="w-6 h-6 text-metallicGold-500" />}
        </button>
        
        {/* 사이드바 */}
        <aside
          className={`w-64 bg-deepBlack-800 border-r border-metallicGold-900/30 ${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <div className="p-6">
            {/* 사용자 정보 */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500 to-metallicGold-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-deepBlack-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-offWhite-200">{userName}</h3>
                  <p className="text-sm text-offWhite-500">
                    {userStats.currentRank > 0 ? (
                      <span className="text-metallicGold-500">#{userStats.currentRank}</span>
                    ) : (
                      <span className="text-offWhite-500">순위 없음</span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* 빠른 통계 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-deepBlack-900/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-metallicGold-500">{formatNumber(userStats.totalViews)}</p>
                  <p className="text-xs text-offWhite-500">총 조회수</p>
                </div>
                <div className="bg-deepBlack-900/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-yellow-500">{formatNumber(userStats.totalPoints)}</p>
                  <p className="text-xs text-offWhite-500">포인트</p>
                </div>
              </div>
            </div>
            
            {/* 메뉴 */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-metallicGold-500/20 to-metallicGold-900/20 text-metallicGold-500 border border-metallicGold-500/30' 
                      : 'text-offWhite-400 hover:text-offWhite-200 hover:bg-deepBlack-700/30'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
          </div>
        </aside>
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6 lg:p-8">
          {/* 대시보드 */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">대시보드</h1>
              
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border border-metallicGold-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8 text-metallicGold-500" />
                    {userStats.currentRank > 0 && userStats.currentRank <= 10 && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">TOP 10</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-metallicGold-500">
                    {userStats.currentRank > 0 ? `#${formatNumber(userStats.currentRank)}` : '순위 없음'}
                  </p>
                  <p className="text-sm text-offWhite-500">현재 순위</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="w-8 h-8 text-blue-500" />
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">오늘</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{formatNumber(userStats.todayViews)}</p>
                  <p className="text-sm text-offWhite-500">조회수</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Coins className="w-8 h-8 text-yellow-500" />
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">+0P</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{formatNumber(userStats.totalPoints)}P</p>
                  <p className="text-sm text-offWhite-500">보유 포인트</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">누적</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{formatNumber(userStats.totalViews)}</p>
                  <p className="text-sm text-offWhite-500">총 조회수</p>
                </div>
              </div>
              
              {/* 활동 통계 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 커뮤니티 활동 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-metallicGold-500" />
                    커뮤니티 활동
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalPosts}</p>
                      <p className="text-sm text-offWhite-500">작성글</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalComments}</p>
                      <p className="text-sm text-offWhite-500">댓글</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.totalLikes}</p>
                      <p className="text-sm text-offWhite-500">좋아요</p>
                    </div>
                    <div className="text-center p-4 bg-deepBlack-900/30 rounded-lg">
                      <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-offWhite-200">{userStats.consecutiveDays}</p>
                      <p className="text-sm text-offWhite-500">연속출석</p>
                    </div>
                  </div>
                </div>
                
                {/* 친구 초대 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-metallicGold-500" />
                    친구 초대
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-center">
                      <Gift className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-400">500P</p>
                      <p className="text-xs text-offWhite-500">친구 가입 시</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <Star className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-400">2,000P</p>
                      <p className="text-xs text-offWhite-500">친구 활동 시</p>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400 text-center">
                      포인트로 곧 이용하실 수 있는 추가적인 서비스를 구축 중이니까 우선 포인트를 모아두시는 것을 추천드립니다.
                    </p>
                  </div>
                  <div className="p-4 bg-deepBlack-900/50 rounded-lg">
                    <p className="text-xs text-offWhite-500 mb-2">내 추천 코드</p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-metallicGold-500">{userName.toUpperCase()}2025</code>
                      <button
                        onClick={copyReferralCode}
                        className="p-2 hover:bg-deepBlack-700 rounded transition-colors"
                      >
                        {referralCodeCopied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-offWhite-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 내 사이트 */}
          {activeTab === 'sites' && <SitesTabContent />}
          
          {/* 활동 내역 */}
          {activeTab === 'activity' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">활동 내역</h1>
              
              <div className="space-y-4">
                {recentActivities.map((activity, _index) => (
                  <div
                    key={activity.id}
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
                  </div>
                ))}
              </div>
              
              {recentActivities.length === 0 && (
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-12 text-center">
                  <History className="w-16 h-16 text-metallicGold-500/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-offWhite-200 mb-2">아직 활동 내역이 없습니다</h3>
                  <p className="text-offWhite-500">사이트를 등록하거나 커뮤니티에 참여해보세요!</p>
                </div>
              )}
            </div>
          )}
          
          {/* 설정 */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-offWhite-200 mb-6">설정</h1>
              
              <div className="space-y-6">
                {/* 알림 설정 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
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
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            setting.enabled 
                              ? 'bg-metallicGold-500' 
                              : 'bg-deepBlack-700 border border-offWhite-700'
                          }`}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 계정 설정 */}
                <div className="bg-deepBlack-300/50 border border-metallicGold-900/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-offWhite-200 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-metallicGold-500" />
                    계정 설정
                  </h3>
                  
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-lg font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                      프로필 편집
                    </button>
                    <button className="w-full py-3 bg-deepBlack-700/50 border border-metallicGold-900/30 text-offWhite-200 rounded-lg font-medium hover:bg-deepBlack-600/50 hover:border-metallicGold-700/50 transition-all text-left px-4">
                      비밀번호 변경
                    </button>
                    <button 
                      onClick={() => {
                        supabase.auth.signOut();
                        router.push('/');
                      }}
                      className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/20 hover:border-red-500/50 transition-all text-left px-4"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}