import React from 'react'
import { Metadata } from 'next'
import AITrendsClient from './page-client'

export const metadata: Metadata = {
  title: 'AI 트렌드 | 떡상연구소',
  description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
  keywords: 'AI 트렌드, 인공지능, AI 기술, AI 도구, AI 활용',
  openGraph: {
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
    type: 'website',
  },
}

// Server-side data fetching for initial load
async function getInitialTrends() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dduksang.com'
    
    // Fetch both featured and regular trends in parallel
    const [featuredRes, trendsRes] = await Promise.all([
      fetch(`${baseUrl}/api/ai-trends?featured=true&limit=3`, {
        next: { revalidate: 300 } // 5 minutes cache
      }),
      fetch(`${baseUrl}/api/ai-trends?page=1&limit=12`, {
        next: { revalidate: 300 } // 5 minutes cache
      })
    ])

    const [featuredData, trendsData] = await Promise.all([
      featuredRes.json(),
      trendsRes.json()
    ])

    return {
      featuredTrends: featuredData.data || [],
      trends: trendsData.data || [],
      totalPages: trendsData.pagination?.totalPages || 1
    }
  } catch (error) {
    console.error('Error fetching initial trends:', error)
    return {
      featuredTrends: [],
      trends: [],
      totalPages: 1
    }
  }
}

export default async function AITrendsPage() {
  const initialData = await getInitialTrends()

  return <AITrendsClient initialData={initialData} />
}