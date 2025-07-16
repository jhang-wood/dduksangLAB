'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlayCircle, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react'
import Image from 'next/image'

const lectures = [
  {
    id: 1,
    title: "AI 기초부터 실전까지",
    instructor: "김AI박사",
    duration: "2시간 30분",
    students: 1250,
    rating: 4.8,
    price: "59,000원",
    tags: ["AI", "기초", "실전"],
    level: "초급",
    thumbnail: "/images/lecture1.jpg",
    description: "AI의 기본 개념부터 실제 프로젝트까지 완벽하게 마스터하세요."
  },
  {
    id: 2,
    title: "노코드로 만드는 SaaS",
    instructor: "박노코드",
    duration: "3시간 15분",
    students: 890,
    rating: 4.9,
    price: "79,000원",
    tags: ["노코드", "SaaS", "창업"],
    level: "중급",
    thumbnail: "/images/lecture2.jpg",
    description: "코딩 없이도 전문적인 SaaS 서비스를 만들 수 있습니다."
  },
  {
    id: 3,
    title: "ChatGPT 활용 마케팅",
    instructor: "이마케팅",
    duration: "1시간 45분",
    students: 2100,
    rating: 4.7,
    price: "49,000원",
    tags: ["ChatGPT", "마케팅", "실무"],
    level: "초급",
    thumbnail: "/images/lecture3.jpg",
    description: "ChatGPT를 활용한 혁신적인 마케팅 전략을 배워보세요."
  },
  {
    id: 4,
    title: "데이터 분석 with AI",
    instructor: "최데이터",
    duration: "4시간 10분",
    students: 720,
    rating: 4.6,
    price: "99,000원",
    tags: ["데이터", "분석", "AI"],
    level: "고급",
    thumbnail: "/images/lecture4.jpg",
    description: "AI를 활용한 데이터 분석 기법을 실전에서 활용해보세요."
  }
]

const categories = ["전체", "AI", "노코드", "마케팅", "데이터"]
const levels = ["전체", "초급", "중급", "고급"]

export default function LecturesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedLevel, setSelectedLevel] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")

  const filteredLectures = lectures.filter(lecture => {
    const matchesCategory = selectedCategory === "전체" || lecture.tags.includes(selectedCategory)
    const matchesLevel = selectedLevel === "전체" || lecture.level === selectedLevel
    const matchesSearch = searchTerm === "" || 
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesLevel && matchesSearch
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
              <a href="/lectures" className="text-yellow-400">강의</a>
              <a href="/community" className="text-gray-300 hover:text-yellow-400 transition-colors">커뮤니티</a>
              <a href="/saas" className="text-gray-300 hover:text-yellow-400 transition-colors">SaaS</a>
            </nav>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition-colors">
                로그인
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
              <span className="text-yellow-400">전문 강의</span>
              <span className="text-white"> 컬렉션</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              AI 시대를 앞서가는 전문 교육 프로그램
            </p>
          </motion.div>
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
                    placeholder="강의명, 강사명으로 검색..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2">
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

              {/* Level Filter */}
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {level}
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

      {/* Lectures Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className={`grid gap-6 ${
            viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          }`}>
            {filteredLectures.map((lecture, index) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-video bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lecture.level === "초급" ? "bg-green-500 text-white" :
                      lecture.level === "중급" ? "bg-yellow-500 text-black" :
                      "bg-red-500 text-white"
                    }`}>
                      {lecture.level}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="text-black" size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {lecture.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {lecture.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {lecture.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{lecture.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{lecture.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={16} />
                      <span>{lecture.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{lecture.students.toLocaleString()}명</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">
                      {lecture.price}
                    </span>
                    <button className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                      수강하기
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLectures.length === 0 && (
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