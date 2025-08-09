'use client'

import { userNotification, logger } from '@/lib/logger'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import AdminHeader from '@/components/AdminHeader'
import { useAuth } from '@/lib/auth-context'

interface AITrend {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  tags: string[]
  published_at: string
  view_count: number
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function AdminAITrendsPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [trends, setTrends] = useState<AITrend[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUnpublished, setShowUnpublished] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'AI 기술', label: 'AI 기술' },
    { id: 'AI 도구', label: 'AI 도구' },
    { id: 'AI 활용', label: 'AI 활용' },
    { id: 'AI 비즈니스', label: 'AI 비즈니스' },
    { id: 'AI 교육', label: 'AI 교육' }
  ]

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin')
    }
  }, [isAdmin, router])

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        limit: '50',
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      })

      // Admin can see unpublished trends
      const response = await fetch(`/api/ai-trends?${params}`, {
        headers: {
          'X-Admin-Request': 'true'
        }
      })
      
      const data = await response.json()
      let trendsData = data.data || []
      
      // Filter by published status if needed
      if (!showUnpublished) {
        trendsData = trendsData.filter((trend: AITrend) => trend.is_published)
      }
      
      setTrends(trendsData)
    } catch (error) {
      logger.error('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, showUnpublished])

  useEffect(() => {
    fetchTrends()
  }, [fetchTrends])

  const handleDelete = async (id: string, title: string) => {
    if (!userNotification.confirm(`정말로 "${title}" 트렌드를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/ai-trends/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTrends()
      } else {
        userNotification.alert('삭제 실패')
      }
    } catch (error) {
      logger.error('Error deleting trend:', error)
      userNotification.alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleTogglePublish = async (trend: AITrend) => {
    try {
      const response = await fetch(`/api/ai-trends/${trend.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trend,
          is_published: !trend.is_published
        })
      })

      if (response.ok) {
        fetchTrends()
      }
    } catch (error) {
      logger.error('Error toggling publish status:', error)
    }
  }

  const handleToggleFeatured = async (trend: AITrend) => {
    try {
      const response = await fetch(`/api/ai-trends/${trend.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trend,
          is_featured: !trend.is_featured
        })
      })

      if (response.ok) {
        fetchTrends()
      }
    } catch (error) {
      logger.error('Error toggling featured status:', error)
    }
  }

  const handleCollectTrends = async () => {
    if (!userNotification.confirm('AI 트렌드를 수집하시겠습니까? (3개의 새로운 트렌드가 생성됩니다)')) {
      return
    }

    try {
      setRefreshing(true)
      const response = await fetch('/api/ai-trends/collect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'admin-collect'}`,
        }
      })

      const result = await response.json()
      
      if (response.ok) {
        userNotification.alert(`${result.created}개의 새로운 트렌드가 수집되었습니다.`)
        fetchTrends()
      } else {
        userNotification.alert(result.message || '트렌드 수집 실패')
      }
    } catch (error) {
      logger.error('Error collecting trends:', error)
      userNotification.alert('트렌드 수집 중 오류가 발생했습니다.')
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-deepBlack-900">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-offWhite-200">AI 트렌드 관리</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCollectTrends}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-metallicGold-900/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-900/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              AI 트렌드 수집
            </button>
            <Link
              href="/admin/ai-trends/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
            >
              <Plus className="w-5 h-5" />
              새 트렌드 작성
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                    : 'bg-deepBlack-300/50 text-offWhite-500 hover:bg-deepBlack-300/70'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnpublished}
                onChange={(e) => setShowUnpublished(e.target.checked)}
                className="w-4 h-4 rounded border-metallicGold-900/50 bg-deepBlack-600 text-metallicGold-500 focus:ring-metallicGold-500"
              />
              <span className="text-sm text-offWhite-500">미발행 포함</span>
            </label>
          </div>
        </div>

        {/* Trends Table */}
        <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-offWhite-600">
              로딩 중...
            </div>
          ) : trends.length === 0 ? (
            <div className="p-8 text-center text-offWhite-600">
              등록된 트렌드가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-deepBlack-600/50 border-b border-metallicGold-900/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      조회수
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-offWhite-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-metallicGold-900/20">
                  {trends.map((trend) => (
                    <motion.tr
                      key={trend.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-deepBlack-600/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-offWhite-200">
                            {trend.title}
                          </div>
                          <div className="text-xs text-offWhite-600 mt-1">
                            {trend.summary.substring(0, 50)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-metallicGold-900/20 text-metallicGold-500 rounded-full">
                          {trend.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-offWhite-500">
                        {trend.view_count}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(trend)}
                            className={`p-1 rounded ${
                              trend.is_published
                                ? 'text-green-500 hover:text-green-400'
                                : 'text-offWhite-600 hover:text-offWhite-500'
                            }`}
                            title={trend.is_published ? '발행됨' : '미발행'}
                          >
                            {trend.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(trend)}
                            className={`p-1 rounded ${
                              trend.is_featured
                                ? 'text-yellow-500 hover:text-yellow-400'
                                : 'text-offWhite-600 hover:text-offWhite-500'
                            }`}
                            title={trend.is_featured ? '추천' : '일반'}
                          >
                            <Star className="w-4 h-4" fill={trend.is_featured ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-offWhite-600">
                        {formatDate(trend.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/ai-trends/${trend.id}/edit`}
                            className="p-2 text-metallicGold-500 hover:text-metallicGold-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(trend.id, trend.title)}
                            className="p-2 text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}