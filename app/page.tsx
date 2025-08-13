// 홈페이지는 SEO를 위해 SSR 유지
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dduksangLAB - AI 300만원짜리 강의, 더 이상 돈 주고 듣지 마세요',
  description: 'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법을 알려드립니다.',
  keywords: ['AI', '인공지능', '자동화', '프로그래밍', '강의', 'Claude Code', '떡상연구소'],
  openGraph: {
    title: 'dduksangLAB - AI 자동화 마스터',
    description: 'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 방법',
    url: 'https://dduksang.com',
    siteName: 'dduksangLAB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dduksangLAB - AI 자동화 마스터',
    description: 'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 방법',
  },
};

import HomePageClient from '@/components/HomePageClient';

export default function HomePage() {
  return <HomePageClient />;
}
