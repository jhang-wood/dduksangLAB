import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '떡상연구소 - AI 기반 교육 플랫폼',
  description: 'AI/노코드 교육 콘텐츠 제공, 수강생 간 커뮤니티 활성화, 개인/팀 SaaS 홍보 플랫폼',
  keywords: 'AI 교육, 노코드, 커뮤니티, SaaS, 온라인 강의',
  authors: [{ name: '떡상연구소' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.variable} font-sans bg-neutral-950 text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}