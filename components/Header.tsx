'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  currentPage?: string;
}

const Header = React.memo(function Header({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const { user, userProfile, signOut, isAdmin } = useAuth();

  // 네비게이션 아이템을 메모이제이션
  const navItems = useMemo(() => [
    { id: 'ai-trends', label: 'AI 트렌드', href: '/ai-trends' },
    { id: 'sites', label: '사이트홍보관', href: '/sites' },
    { id: 'community', label: '커뮤니티', href: '/community' },
    { id: 'lectures', label: '강의', href: '/lectures' },
    ...(isAdmin ? [{ id: 'admin', label: '관리', href: '/admin' }] : []),
  ], [isAdmin]);

  // 사용자 표시명 메모이제이션
  const userDisplayName = useMemo(() => 
    userProfile?.name || user?.email?.split('@')[0] || '사용자',
    [userProfile?.name, user?.email]
  );

  // 콜백 함수들을 메모이제이션
  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsUserMenuOpen(false);
  }, [signOut]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  const handleMypageClick = useCallback(() => {
    router.push('/mypage');
    setIsUserMenuOpen(false);
  }, [router]);

  const handleMobileMypageClick = useCallback(() => {
    router.push('/mypage');
    setIsMenuOpen(false);
  }, [router]);

  const handleMobileSignOut = useCallback(async () => {
    await signOut();
    setIsMenuOpen(false);
  }, [signOut]);


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deepBlack-900/80 backdrop-blur-xl border-b border-metallicGold-900/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-20 h-12 md:w-28 md:h-16">
                <Image
                  src="/images/떡상연구소_로고/누끼_떡상연구소.png"
                  alt="떡상연구소"
                  fill
                  className="object-contain filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                  priority
                  sizes="(max-width: 768px) 80px, 112px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjY0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48L3N2Zz4="
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
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
                  onClick={handleUserMenuToggle}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-offWhite-500 hover:text-metallicGold-500 transition-colors"
                >
                  <User size={18} />
                  <span>{userDisplayName}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg shadow-xl">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-offWhite-600 border-b border-metallicGold-900/20">
                        {userProfile?.role === 'admin' ? '관리자' : '일반회원'}
                      </div>
                      <button
                        onClick={handleMypageClick}
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
            onClick={handleMenuToggle}
            className="md:hidden text-offWhite-500 hover:text-metallicGold-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-metallicGold-900/20 py-4">
            <nav className="space-y-1">
              {navItems.map(item => (
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
                      {userDisplayName}
                    </div>
                    <button
                      onClick={handleMobileMypageClick}
                      className="block w-full py-2 text-sm text-left text-offWhite-500 hover:text-metallicGold-500"
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={() => void handleMobileSignOut()}
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
  );
});

export default Header;
// Force cache invalidation: 1752976128
