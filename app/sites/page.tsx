'use client'

import React, { useState, useEffect } from 'react'
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
  Globe,
  Heart,
  Eye,
  MessageSquare
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface Site {
  id: string
  name: string
  description: string
  url: string
  thumbnail_url?: string
  category: string
  tags: string[]
  creator_id: string
  creator_name: string
  views: number
  likes: number
  is_featured: boolean
  is_trending: boolean
  created_at: string
  updated_at: string
}

const categories = ["전체", "AI 도구", "포트폴리오", "블로그", "이커머스", "교육", "서비스", "기타"]

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Form states for creating new site
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    thumbnail_url: '',
    category: 'AI 도구',
    tags: ''
  })

  useEffect(() => {
    fetchSites()
  }, [selectedCategory, searchTerm])

  const fetchSites = async () => {
    try {
      let query = supabase
        .from('showcase_sites')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (selectedCategory !== "전체") {
        query = query.eq('category', selectedCategory)
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching sites:', error)
      } else {
        setSites(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSite = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

      const { data, error } = await supabase
        .from('showcase_sites')
        .insert({
          name: formData.name,
          description: formData.description,
          url: formData.url,
          thumbnail_url: formData.thumbnail_url || null,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          creator_id: user.id,
          creator_name: profile?.name || user.email?.split('@')[0] || '익명',
          views: 0,
          likes: 0,
          is_featured: false,
          is_trending: false,
          is_approved: true // Auto-approve for now
        })
        .select()
        .single()

      if (error) throw error

      setSites([data, ...sites])
      setShowCreateModal(false)
      resetForm()
    } catch (error) {
      console.error('Error creating site:', error)
      alert('사이트 등록 중 오류가 발생했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      thumbnail_url: '',
      category: 'AI 도구',
      tags: ''
    })
  }

  const handleLike = async (siteId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const { error } = await supabase.rpc('increment_site_likes', {
        site_id: siteId
      })

      if (!error) {
        setSites(sites.map(site => 
          site.id === siteId ? { ...site, likes: site.likes + 1 } : site
        ))
      }
    } catch (error) {
      console.error('Error liking site:', error)
    }
  }

  const handleView = async (site: Site) => {
    // Increment view count
    try {
      await supabase.rpc('increment_site_views', {
        site_id: site.id
      })
    } catch (error) {
      console.error('Error incrementing views:', error)
    }

    // Open site in new tab
    window.open(site.url, '_blank')
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <Header currentPage="sites" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 bg-clip-text text-transparent">
                사이트 홍보관
              </span>
            </h1>
            <p className="text-xl text-offWhite-600 max-w-2xl mx-auto mb-8">
              수강생들이 만든 놀라운 프로젝트를 만나보세요
            </p>
            
            {/* Centered Add Site Button */}
            {user && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all transform hover:scale-105"
              >
                <Plus size={24} />
                <span>사이트 홍보하기</span>
                <Sparkles size={20} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="bg-deepBlack-300 rounded-xl p-6 border border-metallicGold-900/30">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offWhite-600" size={20} />
                  <input
                    type="text"
                    placeholder="사이트명이나 설명으로 검색..."
                    className="w-full pl-10 pr-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                        : 'bg-deepBlack-600 text-offWhite-500 hover:text-metallicGold-500 hover:bg-deepBlack-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                      : 'bg-deepBlack-600 text-offWhite-500 hover:text-metallicGold-500'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                      : 'bg-deepBlack-600 text-offWhite-500 hover:text-metallicGold-500'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sites Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metallicGold-500"></div>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}>
                {sites.map((site, index) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 hover:border-metallicGold-500/50 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-deepBlack-600 overflow-hidden">
                      {site.thumbnail_url ? (
                        <img 
                          src={site.thumbnail_url} 
                          alt={site.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="w-16 h-16 text-metallicGold-500/30" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {site.is_featured && (
                          <span className="px-2 py-1 bg-metallicGold-500 text-deepBlack-900 rounded text-xs font-bold">
                            추천
                          </span>
                        )}
                        {site.is_trending && (
                          <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
                            인기
                          </span>
                        )}
                      </div>

                      {/* View Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(site)}
                          className="px-6 py-3 bg-metallicGold-500 text-deepBlack-900 rounded-lg font-bold hover:bg-metallicGold-400 transition-colors flex items-center gap-2"
                        >
                          <Eye size={20} />
                          사이트 방문
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-metallicGold-500/10 text-metallicGold-500 rounded text-xs">
                          {site.category}
                        </span>
                        {site.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-deepBlack-600 text-offWhite-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold text-offWhite-200 mb-2">
                        {site.name}
                      </h3>
                      
                      <p className="text-offWhite-600 text-sm mb-4 line-clamp-2">
                        {site.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-offWhite-500">
                          by {site.creator_name}
                        </span>
                        <div className="flex items-center gap-3 text-sm text-offWhite-600">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{site.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            <span>{site.likes}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(site)}
                          className="flex-1 px-4 py-2 bg-deepBlack-600 text-offWhite-300 rounded-lg hover:bg-deepBlack-900 transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          방문하기
                        </button>
                        <button
                          onClick={() => handleLike(site.id)}
                          className="px-4 py-2 bg-deepBlack-600 text-offWhite-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {sites.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-offWhite-600 mb-4">
                    아직 등록된 사이트가 없습니다
                  </h3>
                  <p className="text-offWhite-600 mb-8">
                    첫 번째로 당신의 프로젝트를 소개해보세요!
                  </p>
                  {user && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                    >
                      <Plus size={20} />
                      사이트 홍보하기
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-deepBlack-300 rounded-xl border border-metallicGold-900/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-metallicGold-900/30">
              <h2 className="text-2xl font-bold text-offWhite-200">사이트 홍보하기</h2>
              <p className="text-offWhite-600 mt-2">당신이 만든 멋진 프로젝트를 소개해주세요</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  사이트명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  placeholder="예: AI 콘텐츠 생성기"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  설명 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 h-24"
                  placeholder="사이트에 대한 간단한 설명을 작성해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  사이트 URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  placeholder="https://your-site.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  썸네일 URL (선택사항)
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  placeholder="https://your-site.com/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                >
                  {categories.filter(cat => cat !== "전체").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-offWhite-500 mb-2">
                  태그 (콤마로 구분)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-lg text-offWhite-200 focus:outline-none focus:ring-2 focus:ring-metallicGold-500"
                  placeholder="AI, 자동화, 노코드"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-metallicGold-900/30">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-6 py-3 text-offWhite-600 hover:text-offWhite-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateSite}
                  disabled={!formData.name || !formData.description || !formData.url}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-semibold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  등록하기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}