'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, Eye, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import { logger } from '@/lib/logger'

interface AITrend {
  id: string
  title: string
  slug: string
  summary: string
  thumbnail_url: string
  category: string
  tags: string[]
  published_at: string
  view_count: number
  is_featured: boolean
}

interface InitialData {
  featuredTrends: AITrend[]
  trends: AITrend[]
  totalPages: number
}

interface AITrendsClientProps {
  initialData: InitialData
}

const categories = [
  { id: 'all', label: '전체' },
  { id: 'AI 기술', label: 'AI 기술' },
  { id: 'AI 도구', label: 'AI 도구' },
  { id: 'AI 활용', label: 'AI 활용' },
  { id: 'AI 비즈니스', label: 'AI 비즈니스' },
  { id: 'AI 교육', label: 'AI 교육' }
]

// Memoized TrendCard component for better performance
const TrendCard = React.memo(({ trend, isFeatured = false }: { trend: AITrend; isFeatured?: boolean }) => {
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const formatViewCount = useCallback((count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }, [])

  return (
    <Link
      href={`/ai-trends/${trend.slug}`}
      className="group"
      prefetch={false}
    >
      <motion.article
        whileHover={{ y: -5 }}
        className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl overflow-hidden hover:border-metallicGold-500/50 transition-all h-full"
      >
        {trend.thumbnail_url && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={trend.thumbnail_url}
              alt={trend.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/60 to-transparent" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-xs text-offWhite-600">
            <span className="px-2 py-1 bg-metallicGold-900/20 rounded-full text-metallicGold-500">
              {trend.category}
            </span>
            <span className="flex items-center gap-1">
              {isFeatured ? <Calendar className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {formatDate(trend.published_at)}
            </span>
          </div>
          <h3 className={`font-semibold text-offWhite-200 mb-${isFeatured ? '3' : '2'} line-clamp-2 group-hover:text-metallicGold-500 transition-colors ${
            isFeatured ? 'text-xl mb-3' : 'text-lg mb-2'
          }`}>
            {trend.title}
          </h3>
          <p className={`text-offWhite-600 line-clamp-${isFeatured ? '2' : '3'} mb-4 ${
            isFeatured ? 'text-base' : 'text-sm'
          }`}>
            {trend.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-offWhite-600">
              <Eye className="w-4 h-4" />
              <span>{formatViewCount(trend.view_count)}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-metallicGold-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.article>
    </Link>
  )
})

TrendCard.displayName = 'TrendCard'

// Loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-deepBlack-300/50 rounded-2xl overflow-hidden">
          <div className="h-48 bg-deepBlack-600/50" />
          <div className="p-6">
            <div className="h-4 bg-deepBlack-600/50 rounded w-1/3 mb-3" />
            <div className="h-6 bg-deepBlack-600/50 rounded mb-3" />
            <div className="h-4 bg-deepBlack-600/50 rounded w-full mb-2" />
            <div className="h-4 bg-deepBlack-600/50 rounded w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

export default function AITrendsClient({ initialData }: AITrendsClientProps) {
  const [trends, setTrends] = useState<AITrend[]>(initialData.trends)
  const [featuredTrends, setFeaturedTrends] = useState<AITrend[]>(initialData.featuredTrends)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)

  // Debounced fetch function for better performance
  const fetchTrends = useCallback(async (category: string, pageNum: number) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(category !== 'all' && { category })
      })
      
      const response = await fetch(`/api/ai-trends?${params}`)
      const data = await response.json()
      
      setTrends(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)

      // Only fetch featured trends when on first page of all categories
      if (pageNum === 1 && category === 'all' && featuredTrends.length === 0) {
        const featuredRes = await fetch('/api/ai-trends?featured=true&limit=3')
        const featuredData = await featuredRes.json()
        setFeaturedTrends(featuredData.data || [])
      }
    } catch (error) {
      logger.error('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }, [featuredTrends.length])

  // Effect for category/page changes (skip initial load)
  useEffect(() => {
    if (selectedCategory !== 'all' || page !== 1) {
      fetchTrends(selectedCategory, page)
    }
  }, [selectedCategory, page, fetchTrends])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setPage(1)
    if (categoryId !== 'all') {
      setFeaturedTrends([]) // Clear featured trends for non-all categories
    } else {
      setFeaturedTrends(initialData.featuredTrends) // Restore initial featured trends
    }
  }, [initialData.featuredTrends])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Memoized pagination buttons for performance
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null

    const buttons = []
    const maxButtons = 5
    const startPage = Math.max(1, page - Math.floor(maxButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg font-medium transition-all ${
            page === i
              ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
              : 'bg-deepBlack-300/50 text-offWhite-500 hover:bg-deepBlack-300/70'
          }`}
        >
          {i}
        </button>
      )
    }

    return buttons
  }, [page, totalPages, handlePageChange])

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="ai-trends" />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  AI 트렌드
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-offWhite-500 max-w-3xl mx-auto px-4 sm:px-0">
                매일 업데이트되는 최신 AI 기술과 도구,<br className="sm:hidden" />
                활용 사례를 쉽게 알아보세요
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="px-4 mb-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                      : 'bg-deepBlack-300/50 text-offWhite-500 hover:bg-deepBlack-300/70'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Trends (only on first page, all category) */}
        {page === 1 && selectedCategory === 'all' && featuredTrends.length > 0 && (
          <section className="px-4 mb-12">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-offWhite-200 mb-6">주목할 만한 트렌드</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTrends.map((trend) => (
                  <TrendCard key={trend.id} trend={trend} isFeatured={true} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Trends Grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <LoadingSkeleton />
            ) : trends.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-offWhite-600">아직 등록된 트렌드가 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trends.map((trend) => (
                    <TrendCard key={trend.id} trend={trend} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-deepBlack-300/50 text-offWhite-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-deepBlack-300/70 transition-colors"
                    >
                      이전
                    </button>
                    <div className="flex items-center gap-2">
                      {paginationButtons}
                    </div>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-deepBlack-300/50 text-offWhite-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-deepBlack-300/70 transition-colors"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}