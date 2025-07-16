'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Star, 
  ExternalLink, 
  Users, 
  Calendar, 
  Tag,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react'
import Image from 'next/image'

const saasProducts = [
  {
    id: 1,
    name: "AI 글쓰기 도우미",
    description: "AI가 도와주는 전문적인 글쓰기 툴",
    category: "AI",
    tags: ["AI", "글쓰기", "생산성"],
    price: "월 29,000원",
    rating: 4.8,
    users: 1200,
    launchDate: "2024-01-15",
    trending: true,
    featured: true,
    logo: "/images/saas1.png",
    website: "https://ai-writing.com",
    creator: "김개발자",
    status: "인기"
  },
  {
    id: 2,
    name: "노코드 웹빌더",
    description: "코딩 없이 만드는 전문 웹사이트",
    category: "노코드",
    tags: ["노코드", "웹개발", "빌더"],
    price: "월 49,000원",
    rating: 4.9,
    users: 890,
    launchDate: "2024-02-01",
    trending: false,
    featured: true,
    logo: "/images/saas2.png",
    website: "https://nocode-builder.com",
    creator: "박노코드",
    status: "신규"
  },
  {
    id: 3,
    name: "마케팅 자동화",
    description: "AI 기반 마케팅 캠페인 자동화",
    category: "마케팅",
    tags: ["마케팅", "자동화", "AI"],
    price: "월 99,000원",
    rating: 4.7,
    users: 2300,
    launchDate: "2023-12-10",
    trending: true,
    featured: false,
    logo: "/images/saas3.png",
    website: "https://marketing-auto.com",
    creator: "이마케팅",
    status: "급상승"
  },
  {
    id: 4,
    name: "데이터 분석 플랫폼",
    description: "비즈니스 데이터 분석 및 시각화",
    category: "분석",
    tags: ["데이터", "분석", "시각화"],
    price: "월 79,000원",
    rating: 4.6,
    users: 560,
    launchDate: "2024-03-01",
    trending: false,
    featured: false,
    logo: "/images/saas4.png",
    website: "https://data-platform.com",
    creator: "최데이터",
    status: "인기"
  },
  {
    id: 5,
    name: "챗봇 빌더",
    description: "고객 응대 챗봇 쉽게 만들기",
    category: "AI",
    tags: ["AI", "챗봇", "고객서비스"],
    price: "월 39,000원",
    rating: 4.5,
    users: 1800,
    launchDate: "2024-01-20",
    trending: false,
    featured: true,
    logo: "/images/saas5.png",
    website: "https://chatbot-builder.com",
    creator: "정챗봇",
    status: "신규"
  },
  {
    id: 6,
    name: "프로젝트 관리",
    description: "팀 협업을 위한 프로젝트 관리 툴",
    category: "생산성",
    tags: ["협업", "프로젝트", "관리"],
    price: "월 59,000원",
    rating: 4.8,
    users: 950,
    launchDate: "2024-02-15",
    trending: true,
    featured: false,
    logo: "/images/saas6.png",
    website: "https://project-manager.com",
    creator: "한협업",
    status: "급상승"
  }
]

const categories = ["전체", "AI", "노코드", "마케팅", "분석", "생산성"]
const statuses = ["전체", "신규", "인기", "급상승"]

export default function SaaSPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")

  const filteredProducts = saasProducts.filter(product => {
    const matchesCategory = selectedCategory === "전체" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "전체" || product.status === selectedStatus
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  const featuredProducts = saasProducts.filter(product => product.featured)
  const trendingProducts = saasProducts.filter(product => product.trending)

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
              <a href="/community" className="text-gray-300 hover:text-yellow-400 transition-colors">커뮤니티</a>
              <a href="/saas" className="text-yellow-400">SaaS</a>
            </nav>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors flex items-center">
                <Plus size={16} className="mr-1" />
                SaaS 등록
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
              <span className="text-yellow-400">SaaS</span>
              <span className="text-white"> 홍보관</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              혁신적인 SaaS 제품들을 발견하고 여러분의 서비스를 홍보하세요
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-yellow-400" size={24} />
            <h3 className="text-2xl font-bold text-white">추천 SaaS</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <Zap className="text-black" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-medium">
                    추천
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-white font-medium">{product.rating}</span>
                  <span className="text-gray-400 text-sm">({product.users}명)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{product.price}</span>
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors">
                    자세히 보기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-yellow-400" size={24} />
            <h3 className="text-2xl font-bold text-white">급상승 SaaS</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                    급상승
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-white font-medium">{product.rating}</span>
                  <span className="text-gray-400 text-sm">({product.users}명)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{product.price}</span>
                  <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors">
                    자세히 보기
                  </button>
                </div>
              </motion.div>
            ))}
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
                    placeholder="SaaS 이름, 설명으로 검색..."
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

              {/* Status Filter */}
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">모든 SaaS</h3>
          <div className={`grid gap-6 ${
            viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === "신규" ? "bg-green-500 text-white" :
                    product.status === "인기" ? "bg-blue-500 text-white" :
                    "bg-red-500 text-white"
                  }`}>
                    {product.status}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {product.name}
                </h4>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{product.users}명</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{product.launchDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-yellow-400">{product.price}</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <Heart className="text-gray-400" size={16} />
                    </button>
                    <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center">
                      <ExternalLink size={16} className="mr-1" />
                      방문
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 필터를 사용해보세요
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}