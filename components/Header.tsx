'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()
  const { user, userProfile, signOut, isAdmin } = useAuth()

  const navItems = [
    { id: 'ai-trends', label: 'AI 트렌드', href: '/ai-trends' },
    { id: 'saas', label: 'SaaS 쇼케이스', href: '/saas' },
    { id: 'community', label: '커뮤니티', href: '/community' },
    { id: 'lectures', label: '강의', href: '/lectures' },
    ...(isAdmin ? [{ id: 'admin', label: '관리', href: '/admin' }] : [])
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/떡상연구소_로고-removebg-preview.png"
                  alt="떡상연구소"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden md:block text-lg font-semibold">떡상연구소</span>
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
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
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
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  <User size={18} />
                  <span>{userProfile?.name || user.email?.split('@')[0] || '사용자'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-neutral-500 border-b border-neutral-800">
                        {userProfile?.role === 'admin' ? '관리자' : '일반회원'}
                      </div>
                      <button
                        onClick={() => {
                          router.push('/mypage')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        마이페이지
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-sm text-left text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-colors flex items-center gap-2"
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
                className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-100 transition-all"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-white bg-neutral-900'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 px-4 border-t border-neutral-800">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-neutral-500 mb-2">
                      {userProfile?.name || user.email?.split('@')[0] || '사용자'}
                    </div>
                    <button
                      onClick={() => {
                        router.push('/mypage')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full py-2 text-sm text-left text-neutral-300 hover:text-white"
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut()
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
                    className="block w-full py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-100 transition-all text-center"
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