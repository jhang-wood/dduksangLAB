'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { logger } from '@/lib/logger'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()
  const { user, userProfile, signOut, isAdmin } = useAuth()

  logger.debug('[Header] Auth state:', {
    user: user?.email,
    userProfile: userProfile,
    role: userProfile?.role,
    isAdmin: isAdmin
  })

  const navItems = [
    { id: 'ai-trends', label: 'AI 트렌드', href: '/ai-trends' },
    { id: 'sites', label: '사이트홍보관', href: '/sites' },
    { id: 'community', label: '커뮤니티', href: '/community' },
    { id: 'lectures', label: '강의', href: '/lectures' },
    ...(isAdmin ? [{ id: 'admin', label: '관리', href: '/admin' }] : [])
  ]

  logger.debug('[Header] Nav items:', navItems)

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deepBlack-900/80 backdrop-blur-xl border-b border-metallicGold-900/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소"
                  fill
                  className="object-contain filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                  priority
                />
              </div>
              <span className="hidden md:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">떡상연구소</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'text-metallicGold-500'
                    : 'text-offWhite-500 hover:text-metallicGold-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-offWhite-500 hover:text-metallicGold-500 transition-colors"
                >
                  <User size={18} />
                  <span>{userProfile?.name ?? user.email?.split('@')[0] ?? '사용자'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg shadow-xl">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-offWhite-600 border-b border-metallicGold-900/20">
                        {userProfile?.role === 'admin' ? '관리자' : '일반회원'}
                      </div>
                      <button
                        onClick={() => {
                          router.push('/mypage')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-offWhite-500 hover:bg-deepBlack-600/50 hover:text-metallicGold-500 transition-colors"
                      >
                        마이페이지
                      </button>
                      <button
                        onClick={() => void handleSignOut()}
                        className="w-full px-4 py-2 text-sm text-left text-offWhite-500 hover:bg-deepBlack-600/50 hover:text-red-400 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 text-sm font-semibold rounded-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-offWhite-500 hover:text-metallicGold-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-metallicGold-900/20 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-metallicGold-500 bg-deepBlack-600/50'
                      : 'text-offWhite-500 hover:text-metallicGold-500 hover:bg-deepBlack-600/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 px-4 border-t border-metallicGold-900/20">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-offWhite-600 mb-2">
                      {userProfile?.name ?? user.email?.split('@')[0] ?? '사용자'}
                    </div>
                    <button
                      onClick={() => {
                        router.push('/mypage')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full py-2 text-sm text-left text-offWhite-500 hover:text-metallicGold-500"
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={() => {
                        void handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full py-2 text-sm text-left text-red-400 hover:text-red-300"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 text-sm font-semibold rounded-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all text-center"
                  >
                    로그인
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
// Force cache invalidation: 1752976128
