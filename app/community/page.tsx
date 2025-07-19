'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Clock, 
  User, 
  Plus,
  Filter,
  Search,
  TrendingUp,
  MessageCircle,
  Star,
  Flag,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import { supabase, CommunityPost, getCommunityPosts } from '@/lib/supabase'
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

const categories = ["전체", "질문", "추천", "경험공유", "스터디", "토론"]

// 커뮤니티 게시글 타입 확장 (작성자 정보 포함)
interface PostWithAuthor extends CommunityPost {
  profiles: {
    name: string
    avatar_url: string | null
  }
  comment_count?: number
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    activeUsers: 0,
    todayPosts: 0
  })

  // 게시글 불러오기
  useEffect(() => {
    loadPosts()
    loadStats()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      
      // 게시글 불러오기 (작성자 정보 포함)
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading posts:', error)
        return
      }

      // 각 게시글의 댓글 수 계산
      const postsWithCommentCount = await Promise.all(
        (posts || []).map(async (post) => {
          const { count } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('is_published', true)

          return {
            ...post,
            comment_count: count || 0
          }
        })
      )

      setPosts(postsWithCommentCount)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // 전체 게시글 수
      const { count: postsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // 활성 사용자 수 (최근 30일 내 게시글 작성)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: activeAuthors } = await supabase
        .from('community_posts')
        .select('author_id')
        .eq('is_published', true)
        .gte('created_at', thirtyDaysAgo.toISOString())
      
      const uniqueAuthors = new Set(activeAuthors?.map(post => post.author_id) || [])

      // 오늘 게시글 수
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: todayCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .gte('created_at', today.toISOString())

      setStats({
        totalPosts: postsCount || 0,
        totalComments: 0, // 댓글 기능 구현 시 업데이트
        activeUsers: uniqueAuthors.size,
        todayPosts: todayCount || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes
    } else if (sortBy === "views") {
      return b.views - a.views
    } else {
      // latest - 최신순
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  // 시간 포맷팅 함수
  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소 로고"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-yellow-400">떡상연구소</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">홈</a>
              <a href="/lectures" className="text-gray-300 hover:text-yellow-400 transition-colors">강의</a>
              <a href="/community" className="text-yellow-400">커뮤니티</a>
              <a href="/saas" className="text-gray-300 hover:text-yellow-400 transition-colors">SaaS</a>
            </nav>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors flex items-center">
                <Plus size={16} className="mr-1" />
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">커뮤니티</span>
              <span className="text-white"> 광장</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              전국의 AI 전문가들과 지식을 공유하고 네트워킹하세요
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.totalPosts.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">총 게시글</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.totalComments.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">총 댓글</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">활성 회원</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.todayPosts.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">오늘 게시글</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="제목, 작성자로 검색..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("latest")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === "latest"
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === "popular"
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  인기순
                </button>
                <button
                  onClick={() => setSortBy("views")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === "views"
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  조회순
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-yellow-400" size={48} />
            </div>
          ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:border-yellow-500/40 cursor-pointer ${
                  post.likes > 20 ? 'border-yellow-500/30' : 'border-yellow-500/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {post.profiles?.avatar_url ? (
                      <Image
                        src={post.profiles.avatar_url}
                        alt={post.profiles.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <User className="text-gray-400" size={20} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-white">{post.profiles?.name || '익명'}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.category === "질문" ? "bg-blue-500/20 text-blue-400" :
                        post.category === "추천" ? "bg-green-500/20 text-green-400" :
                        post.category === "경험공유" ? "bg-purple-500/20 text-purple-400" :
                        post.category === "스터디" ? "bg-orange-500/20 text-orange-400" :
                        "bg-pink-500/20 text-pink-400"
                      }`}>
                        {post.category}
                      </span>
                      {post.likes > 20 && (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs">
                          <TrendingUp size={12} />
                          인기
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">{formatTimeAgo(post.created_at)}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
                      {post.title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <MessageCircle size={16} />
                        <span>{post.comment_count || 0}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{post.views}</span>
                      </span>
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors ml-auto">
                        <Flag size={16} />
                        <span>신고</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                게시글이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                첫 번째 게시글을 작성해보세요!
              </p>
              <button className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                글쓰기
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}