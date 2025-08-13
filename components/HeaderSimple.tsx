'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  currentPage?: string;
}

export default function HeaderSimple({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Derived state
  const isAdmin = userProfile?.role === 'admin';
  
  // 클라이언트 사이드에서만 초기화 및 사용자 인증 확인
  useEffect(() => {
    const initialize = async () => {
      if (typeof window !== 'undefined') {
        setMounted(true);
        try {
          // 사용자 인증 상태 확인
          const { data: { user: authUser } } = await supabase.auth.getUser();
          setUser(authUser);
          
          if (authUser) {
            // 사용자 프로필 정보 가져오기
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('인증 확인 오류:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (!mounted) {
      initialize();
    }
  }, [mounted]);

  // Handle responsive behavior
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const navItems = [
    { id: 'ai-trends', label: 'AI 트렌드', href: '/ai-trends' },
    { id: 'sites', label: '사이트홍보관', href: '/sites' },
    { id: 'community', label: '커뮤니티', href: '/community' },
    { id: 'lectures', label: '강의', href: '/lectures' },
    ...(mounted && isAdmin ? [{ id: 'admin', label: '관리', href: '/admin' }] : []),
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(15, 15, 15, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffd700'
              }}>떡상연구소</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isDesktop && (
            <nav style={{ 
              display: 'flex',
              alignItems: 'center', 
              gap: '32px'
            }}>
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: currentPage === item.id ? '#ffd700' : '#cccccc',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffd700'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = currentPage === item.id ? '#ffd700' : '#cccccc'}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Auth Section */}
          {isDesktop && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center'
            }}>
              {(!mounted || loading) ? (
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(100, 100, 100, 0.3)',
                  color: '#999',
                  fontSize: '14px',
                  borderRadius: '8px'
                }}>로딩 중...</div>
              ) : user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#cccccc',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                  >
                    <span>👤</span>
                    <span>{userProfile?.name ?? user.email?.split('@')[0] ?? '사용자'}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '8px',
                      width: '192px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                    }}>
                      <div style={{ padding: '4px 0' }}>
                        <div style={{
                          padding: '8px 16px',
                          fontSize: '12px',
                          color: '#999',
                          borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
                        }}>
                          {userProfile?.role === 'admin' ? '관리자' : '일반회원'}
                        </div>
                        <button
                          onClick={() => {
                            router.push('/mypage');
                            setIsUserMenuOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            fontSize: '14px',
                            textAlign: 'left',
                            color: '#cccccc',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s, color 0.2s'
                          }}
                          onMouseOver={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = 'rgba(100, 100, 100, 0.3)';
                            (e.target as HTMLElement).style.color = '#ffd700';
                          }}
                          onMouseOut={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = 'transparent';
                            (e.target as HTMLElement).style.color = '#cccccc';
                          }}
                        >
                          마이페이지
                        </button>
                        <button
                          onClick={() => void handleSignOut()}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            fontSize: '14px',
                            textAlign: 'left',
                            color: '#cccccc',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s, color 0.2s'
                          }}
                          onMouseOver={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = 'rgba(100, 100, 100, 0.3)';
                            (e.target as HTMLElement).style.color = '#ff6b6b';
                          }}
                          onMouseOut={(e) => {
                            (e.target as HTMLElement).style.backgroundColor = 'transparent';
                            (e.target as HTMLElement).style.color = '#cccccc';
                          }}
                        >
                          <span>🚪</span>
                          <span>로그아웃</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#ffd700',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#ffed4e'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#ffd700'}
                >
                  로그인
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'block',
                color: '#cccccc',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffd700'}
              onMouseOut={(e) => (e.target as HTMLElement).style.color = '#cccccc'}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {!isDesktop && isMenuOpen && (
          <div style={{
            display: 'block',
            borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            paddingTop: '16px',
            paddingBottom: '16px'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: currentPage === item.id ? '#ffd700' : '#cccccc',
                    backgroundColor: currentPage === item.id ? 'rgba(100, 100, 100, 0.3)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'color 0.2s, background-color 0.2s'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.color = '#ffd700';
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(100, 100, 100, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.color = currentPage === item.id ? '#ffd700' : '#cccccc';
                    (e.target as HTMLElement).style.backgroundColor = currentPage === item.id ? 'rgba(100, 100, 100, 0.3)' : 'transparent';
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div style={{
                paddingTop: '16px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderTop: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                {(!mounted || loading) ? (
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(100, 100, 100, 0.3)',
                    color: '#999',
                    fontSize: '14px',
                    borderRadius: '8px'
                  }}>로딩 중...</div>
                ) : user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#999',
                      marginBottom: '8px'
                    }}>
                      {userProfile?.name ?? user.email?.split('@')[0] ?? '사용자'}
                    </div>
                    <button
                      onClick={() => {
                        router.push('/mypage');
                        setIsMenuOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 0',
                        fontSize: '14px',
                        textAlign: 'left',
                        color: '#cccccc',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffd700'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.color = '#cccccc'}
                    >
                      마이페이지
                    </button>
                    <button
                      onClick={() => {
                        void handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 0',
                        fontSize: '14px',
                        textAlign: 'left',
                        color: '#ff6b6b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ff5252'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.color = '#ff6b6b'}
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 0',
                      backgroundColor: '#ffd700',
                      color: '#000',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#ffed4e'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#ffd700'}
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
}