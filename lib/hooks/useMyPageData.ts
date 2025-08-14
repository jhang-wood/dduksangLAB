import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface UserSite {
  id: string;
  name: string;
  url: string;
  views_today: number;
  views_yesterday: number;
  views_week: number;
  views_total: number;
  rank_today: number;
  rank_change: number;
  is_hot: boolean;
  likes: number;
  comments: number;
}

interface Mission {
  id: string;
  mission_id: string;
  progress: number;
  is_completed: boolean;
  mission: {
    id: string;
    title: string;
    description: string;
    icon: string;
    target_value: number;
    reward_points: number;
  };
}

interface UserStats {
  level: number;
  experience_points: number;
  total_points: number;
  points_today: number;
  streak_days: number;
  total_views_received: number;
  total_posts: number;
  total_comments: number;
  total_likes_received: number;
  levelInfo?: {
    name: string;
    color_scheme: string;
    min_experience: number;
    max_experience: number;
  };
}

interface RankingUser {
  rank: number;
  name: string;
  siteName: string;
  views: number;
  isMe?: boolean;
}

export function useMyPageData() {
  const [userSites, setUserSites] = useState<UserSite[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사이트 데이터 가져오기
  const fetchSites = async () => {
    try {
      const response = await fetch('/api/mypage/sites');
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data = await response.json();
      setUserSites(data.sites || []);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('사이트 데이터를 불러오는데 실패했습니다');
    }
  };

  // 미션 데이터 가져오기
  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/mypage/missions');
      if (!response.ok) throw new Error('Failed to fetch missions');
      const data = await response.json();
      setMissions(data.missions || []);
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError('미션 데이터를 불러오는데 실패했습니다');
    }
  };

  // 통계 데이터 가져오기
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/mypage/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setUserStats(data.stats || null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('통계 데이터를 불러오는데 실패했습니다');
    }
  };

  // 랭킹 데이터 가져오기
  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/mypage/rankings');
      if (!response.ok) throw new Error('Failed to fetch rankings');
      const data = await response.json();
      setRankings(data.rankings || []);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('랭킹 데이터를 불러오는데 실패했습니다');
    }
  };

  // 미션 진행도 업데이트
  const updateMissionProgress = async (missionId: string, progress: number, target: number) => {
    try {
      const response = await fetch('/api/mypage/missions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, progress, target })
      });
      if (!response.ok) throw new Error('Failed to update mission');
      await fetchMissions(); // 미션 데이터 새로고침
      await fetchStats(); // 통계 데이터 새로고침 (포인트 업데이트)
    } catch (err) {
      console.error('Error updating mission:', err);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSites(),
        fetchMissions(),
        fetchStats(),
        fetchRankings()
      ]);
      setLoading(false);
    };

    loadData();

    // 5초마다 사이트 조회수와 랭킹 업데이트
    const interval = setInterval(() => {
      fetchSites();
      fetchRankings();
    }, 5000);

    // 실시간 구독 설정 (조회수 변경 감지)
    const channel = supabase
      .channel('mypage-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_sites'
        },
        (payload) => {
          // 조회수가 변경되면 사이트 데이터 새로고침
          if (payload.new) {
            setUserSites(prev => 
              prev.map(site => 
                site.id === payload.new.id 
                  ? { ...site, ...payload.new }
                  : site
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, []);

  return {
    userSites,
    missions,
    userStats,
    rankings,
    loading,
    error,
    updateMissionProgress,
    refreshData: {
      sites: fetchSites,
      missions: fetchMissions,
      stats: fetchStats,
      rankings: fetchRankings
    }
  };
}