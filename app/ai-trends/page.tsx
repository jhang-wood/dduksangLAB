import { Metadata } from 'next';
import AITrendsPageClient from './page-client';

export const metadata: Metadata = {
  title: 'AI 트렌드 | 떡상연구소',
  description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
  keywords: 'AI, 인공지능, AI 트렌드, AI 기술, AI 도구, 떡상연구소',
  openGraph: {
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 트렌드 | 떡상연구소',
    description: '매일 업데이트되는 최신 AI 기술과 도구, 활용 사례를 쉽게 알아보세요',
  },
  alternates: {
    canonical: '/ai-trends',
  },
};

// Static generation 강제 설정
export const dynamic = 'force-static';
export const revalidate = 3600; // 1시간마다 revalidate

export default function AITrendsPage() {
  return <AITrendsPageClient />;
}