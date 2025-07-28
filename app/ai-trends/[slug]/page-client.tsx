'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Eye, ArrowLeft, Tag, Share2, Copy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import { useAuth } from '@/lib/auth-context'
import { logger } from '@/lib/logger'

interface AITrend {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  thumbnail_url: string
  category: string
  tags: string[]
  source_url: string
  source_name: string
  published_at: string
  view_count: number
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

interface AITrendDetailClientProps {
  trend: AITrend
  relatedTrends: AITrend[]
}

export default function AITrendDetailClient({ trend, relatedTrends }: AITrendDetailClientProps) {
  const { isAdmin } = useAuth()
  const [copied, setCopied] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: trend?.title,
          text: trend?.summary,
          url: url
        })
      } catch (error) {
        logger.error('Error sharing:', error)
      }
    } else {
      // Copy to clipboard as fallback
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Headers
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-2xl font-bold text-offWhite-200 mb-4 mt-8">
              {paragraph.replace('### ', '')}
            </h3>
          )
        }
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-3xl font-bold text-offWhite-200 mb-6 mt-10">
              {paragraph.replace('## ', '')}
            </h2>
          )
        }
        
        // Lists
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '))
          return (
            <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-offWhite-400">
              {items.map((item, i) => (
                <li key={i}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          )
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="text-lg text-offWhite-400 mb-6 leading-relaxed">
            {paragraph}
          </p>
        )
      })
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header />

        {/* Article Content */}
        <article className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
          {/* Back Button */}
          <Link
            href="/ai-trends"
            className="inline-flex items-center gap-2 text-offWhite-500 hover:text-metallicGold-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>AI 트렌드 목록으로</span>
          </Link>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-offWhite-600">
              <span className="px-3 py-1 bg-metallicGold-900/20 rounded-full text-metallicGold-500">
                {trend.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trend.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViewCount(trend.view_count)} 조회
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offWhite-200 mb-6">
              {trend.title}
            </h1>

            <p className="text-xl text-offWhite-500 mb-6">
              {trend.summary}
            </p>

            {/* Share and Admin Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                {trend.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-deepBlack-300/50 text-offWhite-600 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-deepBlack-300/50 text-offWhite-500 rounded-lg hover:bg-deepBlack-300/70 transition-colors"
                >
                  {copied ? <Copy className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  <span>{copied ? '복사됨!' : '공유'}</span>
                </button>
                
                {isAdmin && (
                  <Link
                    href={`/admin/ai-trends/${trend.id}/edit`}
                    className="px-4 py-2 bg-metallicGold-900/20 text-metallicGold-500 rounded-lg hover:bg-metallicGold-900/30 transition-colors"
                  >
                    수정
                  </Link>
                )}
              </div>
            </div>
          </motion.header>

          {/* Thumbnail Image */}
          {trend.thumbnail_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-96 rounded-2xl overflow-hidden mb-12"
            >
              <Image
                src={trend.thumbnail_url}
                alt={trend.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/60 to-transparent" />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            {renderContent(trend.content)}
          </motion.div>

          {/* Source Information */}
          {trend.source_name && (
            <div className="mt-12 p-6 bg-deepBlack-300/30 rounded-xl border border-metallicGold-900/20">
              <p className="text-sm text-offWhite-600">
                출처: <span className="text-metallicGold-500">{trend.source_name}</span>
                {trend.source_url && (
                  <>
                    {' • '}
                    <a
                      href={trend.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-metallicGold-500 hover:underline"
                    >
                      원문 보기
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
        </article>

        {/* Related Trends */}
        {relatedTrends.length > 0 && (
          <section className="py-16 px-4 border-t border-metallicGold-900/20">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-offWhite-200 mb-8">관련 트렌드</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTrends.map((relatedTrend) => (
                  <Link
                    key={relatedTrend.id}
                    href={`/ai-trends/${relatedTrend.slug}`}
                    className="group"
                  >
                    <motion.article
                      whileHover={{ y: -5 }}
                      className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl overflow-hidden hover:border-metallicGold-500/50 transition-all h-full"
                    >
                      {relatedTrend.thumbnail_url && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedTrend.thumbnail_url}
                            alt={relatedTrend.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-deepBlack-900/60 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-offWhite-200 mb-2 line-clamp-2 group-hover:text-metallicGold-500 transition-colors">
                          {relatedTrend.title}
                        </h3>
                        <p className="text-sm text-offWhite-600 line-clamp-3">
                          {relatedTrend.summary}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}