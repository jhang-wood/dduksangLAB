import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 트렌드 | 떡상연구소',
  description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요. 중학생도 이해할 수 있는 쉬운 설명으로 AI 트렌드를 소개합니다.',
  keywords: 'AI 트렌드, 인공지능, AI 기술, AI 도구, AI 활용, AI 비즈니스, AI 교육',
  openGraph: {
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '떡상연구소',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요.',
  },
  alternates: {
    canonical: '/ai-trends',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function AITrendsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}