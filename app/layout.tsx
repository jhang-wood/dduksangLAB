import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: '떡상연구소 : AI 노코드로 SaaS 만들고 수익화하는 실전 교육 플랫폼',
    template: '%s | 떡상연구소'
  },
  description: 'AI 도구와 노코드로 실제 수익 창출한 수강생 1,200명+! 0원으로 시작해서 월 100만원까지, 떡상연구소에서 SaaS 수익화 전 과정을 배워보세요',
  keywords: [
    'AI 교육', 'AI 수익화', '노코드', '노코드 창업', 'SaaS 제작', 'SaaS 수익화', 
    '온라인 강의', '창업', '부업', 'AI 도구', 'Claude', 'ChatGPT', 
    '떡상연구소', '웹앱 개발', '자동화', '1인 개발자'
  ],
  authors: [{ name: '떡상연구소' }],
  creator: '떡상연구소',
  publisher: '떡상연구소',
  metadataBase: new URL('https://www.dduksang.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.dduksang.com',
    siteName: '떡상연구소',
    title: '떡상연구소 : AI 노코드로 SaaS 만들고 수익화하는 실전 교육 플랫폼',
    description: 'AI 도구와 노코드로 실제 수익 창출한 수강생 1,200명+! 0원으로 시작해서 월 100만원까지',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '떡상연구소 - AI 노코드 SaaS 수익화 교육',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '떡상연구소 : AI 노코드로 SaaS 만들고 수익화하는 실전 교육 플랫폼',
    description: 'AI 도구와 노코드로 실제 수익 창출한 수강생 1,200명+!',
    images: ['/twitter-image.jpg'],
    creator: '@dduksang_lab',
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
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${montserrat.variable} font-sans bg-deepBlack-900 text-offWhite-200 antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
