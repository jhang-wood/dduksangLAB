'use client'

import React, { useState } from 'react'
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
  Flag
} from 'lucide-react'
import Image from 'next/image'

const posts = [
  {
    id: 1,
    title: "AI 개발자로 전환하는 방법",
    author: "김개발자",
    avatar: "/images/avatar1.jpg",
    content: "최근 AI 분야로 커리어 전환을 고민하고 있습니다. 어떤 순서로 공부해야 할까요?",
    category: "질문",
    tags: ["AI", "개발", "커리어"],
    likes: 24,
    comments: 12,
    views: 456,
    createdAt: "2시간 전",
    isPopular: true
  },
  {
    id: 2,
    title: "노코드 툴 추천 부탁드립니다",
    author: "박노코드",
    avatar: "/images/avatar2.jpg",
    content: "초보자도 쉽게 사용할 수 있는 노코드 툴을 찾고 있습니다. 추천해주세요!",
    category: "추천",
    tags: ["노코드", "툴", "추천"],
    likes: 18,
    comments: 8,
    views: 234,
    createdAt: "4시간 전",
    isPopular: false
  },
  {
    id: 3,
    title: "ChatGPT API 활용 프로젝트 후기",
    author: "이프로젝트",
    avatar: "/images/avatar3.jpg",
    content: "ChatGPT API를 활용해서 고객 서비스 챗봇을 만들어봤습니다. 경험을 공유합니다.",
    category: "경험공유",
    tags: ["ChatGPT", "API", "프로젝트"],
    likes: 42,
    comments: 15,
    views: 789,
    createdAt: "6시간 전",
    isPopular: true
  },
  {
    id: 4,
    title: "데이터 분석 스터디 모집",
    author: "최데이터",
    avatar: "/images/avatar4.jpg",
    content: "데이터 분석 스터디를 함께 할 분들을 찾습니다. 매주 토요일 오후 2시 예정입니다.",
    category: "스터디",
    tags: ["데이터", "분석", "스터디"],
    likes: 15,
    comments: 23,
    views: 123,
    createdAt: "8시간 전",
    isPopular: false
  },
  {
    id: 5,
    title: "AI 시대 마케팅 전략",
    author: "정마케팅",
    avatar: "/images/avatar5.jpg",
    content: "AI 도구들을 활용한 마케팅 전략에 대해 이야기해보고 싶습니다.",
    category: "토론",
    tags: ["AI", "마케팅", "전략"],
    likes: 31,
    comments: 19,
    views: 567,
    createdAt: "12시간 전",
    isPopular: true
  }
]

const categories = ["전체", "질문", "추천", "경험공유", "스터디", "토론"]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("latest")

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes
    } else if (sortBy === "comments") {
      return b.comments - a.comments
    } else {
      return 0 // latest - 실제로는 createdAt으로 정렬
    }
  })

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
              <div className="text-2xl font-bold text-yellow-400 mb-2">1,234</div>
              <div className="text-gray-400 text-sm">총 게시글</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">5,678</div>
              <div className="text-gray-400 text-sm">총 댓글</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">890</div>
              <div className="text-gray-400 text-sm">활성 회원</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">123</div>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:border-yellow-500/40 ${
                  post.isPopular ? 'border-yellow-500/30' : 'border-yellow-500/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="text-gray-400" size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-white">{post.author}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.category === "질문" ? "bg-blue-500/20 text-blue-400" :
                        post.category === "추천" ? "bg-green-500/20 text-green-400" :
                        post.category === "경험공유" ? "bg-purple-500/20 text-purple-400" :
                        post.category === "스터디" ? "bg-orange-500/20 text-orange-400" :
                        "bg-pink-500/20 text-pink-400"
                      }`}>
                        {post.category}
                      </span>
                      {post.isPopular && (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs">
                          <TrendingUp size={12} />
                          인기
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">{post.createdAt}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-yellow-400 transition-colors cursor-pointer">
                      {post.title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <MessageCircle size={16} />
                        <span>{post.comments}</span>
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