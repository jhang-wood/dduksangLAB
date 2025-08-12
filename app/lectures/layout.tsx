import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent 마스터과정 - AI 300만원짜리 강의를 99만원에',
  description: 'AI로 비싼 강의의 핵심만 추출하고 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법. 수강생 2,847명이 실제 수익 창출한 검증된 커리큘럼.',
  keywords: [
    'AI Agent', 'AI 마스터과정', 'AI 자동화', 'Claude Code', 'Super Claude',
    '텔레그램 코딩', '메타 자동화', 'EXE 파일 생성', 'AI 수익화',
    '떡상연구소', 'AI 교육', 'AI 도구', '비개발자', '자동화 프로그램'
  ],
  openGraph: {
    title: 'AI Agent 마스터과정 - AI 300만원짜리 강의를 99만원에 | 떡상연구소',
    description: '수강생 2,847명이 실제 수익 창출한 AI 자동화 마스터과정. Claude Code + Super Claude 완벽 세팅부터 메타 자동화까지!',
    images: [
      {
        url: '/og-lectures.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Agent 마스터과정 - 떡상연구소',
      }
    ],
  },
  twitter: {
    title: 'AI Agent 마스터과정 - AI 300만원짜리 강의를 99만원에',
    description: '수강생 2,847명이 실제 수익 창출한 AI 자동화 마스터과정',
    images: ['/twitter-lectures.jpg'],
  },
  alternates: {
    canonical: '/lectures',
  },
};

export default function LecturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}