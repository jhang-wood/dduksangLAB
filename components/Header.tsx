'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'

interface HeaderProps {
  currentPage?: string
  isAuthenticated?: boolean
  userType?: 'visitor' | 'student' | 'admin'
  userName?: string
}

export default function Header({ 
  currentPage = 'home', 
  isAuthenticated = false, 
  userType = 'visitor',
  userName = ''
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { id: 'home', label: '홈', href: '/' },
    { id: 'lectures', label: '강의', href: '/lectures' },
    { id: 'community', label: '커뮤니티', href: '/community' },
    { id: 'saas', label: 'SaaS', href: '/saas' },
    ...(userType === 'admin' ? [{ id: 'admin', label: '관리', href: '/admin' }] : [])
  ]

  const handleSignOut = () => {
    // 실제 로그아웃 로직 구현
    console.log('Sign out')
    setIsUserMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/떡상연구소_로고-removebg-preview.png"
                alt="떡상연구소 로고"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-yellow-400">떡상연구소</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <User size={20} />
                  <span>{userName || '사용자'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-yellow-500/20 rounded-lg shadow-xl">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
                        {userType === 'admin' ? '관리자' : 
                         userType === 'student' ? '수강생' : '방문자'}
                      </div>
                      <button
                        onClick={() => router.push('/profile')}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition-colors"
                      >
                        프로필
                      </button>
                      <button
                        onClick={() => router.push('/settings')}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition-colors"
                      >
                        설정
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors"
                >
                  회원가입
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-yellow-500/20">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`block px-4 py-2 font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="px-4 pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-gray-400 mb-2">
                      {userName || '사용자'} ({userType === 'admin' ? '관리자' : userType === 'student' ? '수강생' : '방문자'})
                    </div>
                    <button
                      onClick={() => {
                        router.push('/profile')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      프로필
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-300 hover:text-red-400 transition-colors"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push('/login')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition-colors text-center"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => {
                        router.push('/signup')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors text-center"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}