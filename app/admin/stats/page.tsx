"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { logger } from "@/lib/logger";

interface Stats {
  totalUsers: number;
  totalLectures: number;
  totalPosts: number;
  totalSites: number;
  totalPayments: number;
  totalRevenue: number;
  todaySignups: number;
  todayViews: number;
  publishedLectures: number;
  avgRating: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLectures: 0,
    totalPosts: 0,
    totalSites: 0,
    totalPayments: 0,
    totalRevenue: 0,
    todaySignups: 0,
    todayViews: 523,
    publishedLectures: 0,
    avgRating: 4.8,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<
    Array<{
      type: string;
      message: string;
      time: string;
    }>
  >([]);
  const router = useRouter();
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    try {
      // Fetch basic stats
      const [
        usersResult,
        lecturesResult,
        postsResult,
        sitesResult,
        paymentsResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("lectures")
          .select("id, is_published, rating")
          .order("created_at", { ascending: false }),
        supabase
          .from("community_posts")
          .select("id, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("showcase_sites")
          .select("id, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("payments")
          .select("id, amount, status, created_at")
          .eq("status", "completed"),
      ]);

      const users = usersResult.data || [];
      const lectures = lecturesResult.data || [];
      const posts = postsResult.data || [];
      const sites = sitesResult.data || [];
      const payments = paymentsResult.data || [];

      // Calculate today's signups
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySignups = users.filter(
        (user) => new Date(user.created_at) >= today,
      ).length;

      // Calculate published lectures
      const publishedLectures = lectures.filter(
        (lecture) => lecture.is_published,
      ).length;

      // Calculate average rating
      const ratingsSum = lectures.reduce(
        (sum, lecture) => sum + (lecture.rating || 0),
        0,
      );
      const avgRating = lectures.length > 0 ? ratingsSum / lectures.length : 0;

      // Calculate total revenue
      const totalRevenue = payments.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0,
      );

      setStats({
        totalUsers: users.length,
        totalLectures: lectures.length,
        totalPosts: posts.length,
        totalSites: sites.length,
        totalPayments: payments.length,
        totalRevenue,
        todaySignups,
        todayViews: Math.floor(Math.random() * 200) + 400, // Dynamic mock data
        publishedLectures,
        avgRating,
      });

      // Set recent activities (last 10 items)
      const activities = [
        ...users.slice(0, 3).map((user) => ({
          type: "user",
          message: "새 사용자가 가입했습니다",
          time: user.created_at,
        })),
        ...posts.slice(0, 3).map((post) => ({
          type: "post",
          message: "새 게시글이 작성되었습니다",
          time: post.created_at,
        })),
        ...sites.slice(0, 2).map((site) => ({
          type: "site",
          message: "새 사이트가 등록되었습니다",
          time: site.created_at,
        })),
        ...payments.slice(0, 2).map((payment) => ({
          type: "payment",
          message: `₩${payment.amount?.toLocaleString()} 결제가 완료되었습니다`,
          time: payment.created_at,
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10);

      setRecentActivities(activities);
    } catch (error) {
      logger.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [user, router, fetchStats]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, fetchStats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "post":
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "site":
        return <Eye className="w-4 h-4 text-purple-500" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
      </div>
    );
  }

  // Chart Components
  const UserGrowthChart = () => {
    const mockData = [
      { day: "월", users: 45, newUsers: 12 },
      { day: "화", users: 52, newUsers: 18 },
      { day: "수", users: 38, newUsers: 8 },
      { day: "목", users: 61, newUsers: 22 },
      { day: "금", users: 55, newUsers: 15 },
      { day: "토", users: 72, newUsers: 28 },
      { day: "일", users: 48, newUsers: 11 },
    ];

    const maxValue = Math.max(...mockData.map((d) => d.users));

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-offWhite-600">총 방문자</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-offWhite-600">신규 가입</span>
            </div>
          </div>
        </div>
        <div className="h-40 flex items-end justify-between gap-2">
          {mockData.map((data, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full flex flex-col gap-1 h-32 justify-end">
                <div
                  className="w-full bg-blue-500/80 rounded-t"
                  style={{ height: `${(data.users / maxValue) * 100}%` }}
                ></div>
                <div
                  className="w-full bg-green-500/80 rounded-t"
                  style={{ height: `${(data.newUsers / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-offWhite-600">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-metallicGold-900/30">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {mockData.reduce((sum, d) => sum + d.users, 0)}
            </div>
            <div className="text-xs text-offWhite-600">주간 총 방문자</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {mockData.reduce((sum, d) => sum + d.newUsers, 0)}
            </div>
            <div className="text-xs text-offWhite-600">주간 신규 가입</div>
          </div>
        </div>
      </div>
    );
  };

  const RevenueChart = () => {
    const mockRevenueData = [
      { day: "월", revenue: 150000, orders: 3 },
      { day: "화", revenue: 220000, orders: 5 },
      { day: "수", revenue: 180000, orders: 4 },
      { day: "목", revenue: 320000, orders: 7 },
      { day: "금", revenue: 280000, orders: 6 },
      { day: "토", revenue: 450000, orders: 9 },
      { day: "일", revenue: 190000, orders: 4 },
    ];

    const maxRevenue = Math.max(...mockRevenueData.map((d) => d.revenue));

    return (
      <div className="space-y-4">
        <div className="h-40 flex items-end justify-between gap-2">
          {mockRevenueData.map((data, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="relative w-full h-32 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t relative group cursor-pointer"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-deepBlack-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₩{data.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-offWhite-600">{data.day}</div>
                <div className="text-xs text-yellow-400">{data.orders}건</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-metallicGold-900/30">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              ₩
              {mockRevenueData
                .reduce((sum, d) => sum + d.revenue, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-offWhite-600">주간 총 매출</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {mockRevenueData.reduce((sum, d) => sum + d.orders, 0)}
            </div>
            <div className="text-xs text-offWhite-600">주간 총 주문</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-offWhite-200">사이트 통계</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-metallicGold-500/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-500/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              새로고침
            </button>
            <div className="text-sm text-offWhite-600">
              {new Date().toLocaleDateString("ko-KR")} 업데이트
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
                +{stats.todaySignups}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-offWhite-200 mb-1">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <p className="text-sm text-offWhite-600">전체 회원</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-metallicGold-500 bg-metallicGold-500/20 px-2 py-1 rounded-full">
                {stats.publishedLectures}개 게시
              </span>
            </div>
            <h3 className="text-2xl font-bold text-offWhite-200 mb-1">
              {stats.totalLectures}
            </h3>
            <p className="text-sm text-offWhite-600">총 강의</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-purple-500 bg-purple-500/20 px-2 py-1 rounded-full">
                일일
              </span>
            </div>
            <h3 className="text-2xl font-bold text-offWhite-200 mb-1">
              {stats.todayViews.toLocaleString()}
            </h3>
            <p className="text-sm text-offWhite-600">오늘 방문자</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-yellow-500 bg-yellow-500/20 px-2 py-1 rounded-full">
                {stats.totalPayments}건
              </span>
            </div>
            <h3 className="text-2xl font-bold text-offWhite-200 mb-1">
              ₩{stats.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-offWhite-600">총 매출</p>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">
                커뮤니티
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-offWhite-600">총 게시글</span>
                <span className="text-offWhite-200 font-semibold">
                  {stats.totalPosts}개
                </span>
              </div>
            </div>
          </div>

          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">
                사이트 홍보
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-offWhite-600">등록된 사이트</span>
                <span className="text-offWhite-200 font-semibold">
                  {stats.totalSites}개
                </span>
              </div>
            </div>
          </div>

          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">평점</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-offWhite-600">평균 평점</span>
                <span className="text-offWhite-200 font-semibold">
                  {stats.avgRating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">
                사용자 증가 추이 (최근 7일)
              </h3>
            </div>
            <UserGrowthChart />
          </div>

          {/* Revenue Chart */}
          <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-offWhite-200">
                매출 분석 (최근 7일)
              </h3>
            </div>
            <RevenueChart />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-metallicGold-500" />
            <h3 className="text-lg font-semibold text-offWhite-200">
              최근 활동
            </h3>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-offWhite-600 text-center py-8">
                최근 활동이 없습니다.
              </p>
            ) : (
              recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-deepBlack-600/50 rounded-lg"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-offWhite-200 text-sm">
                      {activity.message}
                    </p>
                  </div>
                  <span className="text-xs text-offWhite-600">
                    {formatDate(activity.time)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
