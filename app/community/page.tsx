'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, MessageSquare, HelpCircle, Briefcase, PlusCircle, Eye, Heart, Pin, Star, Search, Flame, TrendingUp, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { logger, userNotification } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  tags: string[];
  view_count: number;
  likes: number;
  comments_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const categories = [
  { id: 'general', label: 'AI 부업정보', icon: TrendingUp, color: 'purple' },
  { id: 'qna', label: 'Q&A', icon: HelpCircle, color: 'blue' },
  { id: 'study', label: '스터디모집', icon: Users, color: 'emerald' },
  { id: 'career', label: '취업·이직', icon: Briefcase, color: 'orange' },
];

// Client component - no revalidate needed

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      setPosts(data ?? []);
    } catch (error) {
      logger.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  const fetchHotPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(4);

      if (error) throw error;
      setHotPosts(data ?? []);
    } catch (error) {
      logger.error('Error fetching hot posts:', error);
    }
  }, []);


  useEffect(() => {
    void fetchPosts();
    void fetchHotPosts();
  }, [fetchPosts, fetchHotPosts]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setLoading(true);
        void fetchPosts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchPosts]);

  const handleWriteClick = () => {
    if (!user) {
      userNotification.alert('로그인이 필요한 서비스입니다.');
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
  };

  const handleDeletePost = async (postId: string, authorId: string) => {
    if (!user) {
      userNotification.alert('로그인이 필요합니다.');
      return;
    }

    // 관리자이거나 작성자인지 확인
    const isAdmin = user.role === 'admin';
    const isAuthor = user.id === authorId;
    
    if (!isAdmin && !isAuthor) {
      userNotification.alert('자신의 게시글만 삭제할 수 있습니다.');
      return;
    }

    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      userNotification.alert('게시글이 삭제되었습니다.');
      void fetchPosts(); // 목록 새로고침
    } catch (error) {
      logger.error('Error deleting post:', error);
      userNotification.alert('게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="community" />

        {/* Header Section */}
        <section className="pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-montserrat font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  커뮤니티
                </span>
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                {/* Centered Search Bar */}
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-offWhite-600" />
                  <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-deepBlack-300/30 border border-metallicGold-900/20 rounded-xl text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:border-metallicGold-500/50 focus:ring-2 focus:ring-metallicGold-500/20 transition-all"
                  />
                </div>
                
                {/* Write Button */}
                <button
                  onClick={handleWriteClick}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  <PlusCircle className="w-5 h-5" />
                  글쓰기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hot Posts Ticker Section */}
        <section className="px-4 mb-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-lg font-semibold text-offWhite-200">실시간 인기글</h2>
              <div className="text-xs text-offWhite-500 bg-red-500/20 px-2 py-1 rounded-full animate-pulse">
                LIVE
              </div>
            </div>
            
            {/* Horizontal Scrolling Hot Posts */}
            <div className="relative overflow-hidden bg-deepBlack-300/10 rounded-xl border border-metallicGold-900/10">
              <div className="flex animate-scroll-left gap-4 py-4">
                {/* 첫 번째 세트 */}
                {hotPosts.slice(0, 6).map((post, index) => {
                  const category = categories.find(c => c.id === post.category);
                  return (
                    <Link
                      key={`first-${post.id}`}
                      href={`/community/${post.category}/${post.id}`}
                      className="flex-shrink-0 w-80 p-3 bg-deepBlack-300/30 border border-metallicGold-900/10 rounded-lg hover:bg-deepBlack-300/50 hover:border-metallicGold-500/30 transition-all group mx-2"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                            HOT {index + 1}
                          </span>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                        </div>
                        {category && (
                          <span className="text-xs px-2 py-1 bg-metallicGold-900/20 text-metallicGold-500 rounded">
                            {category.label}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-offWhite-200 group-hover:text-metallicGold-500 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-offWhite-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(post.view_count || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          {(post.likes || 0).toLocaleString()}
                        </span>
                        <span className="text-green-400 text-xs">실시간</span>
                      </div>
                    </Link>
                  );
                })}
                
                {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
                {hotPosts.slice(0, 6).map((post, index) => {
                  const category = categories.find(c => c.id === post.category);
                  return (
                    <Link
                      key={`second-${post.id}`}
                      href={`/community/${post.category}/${post.id}`}
                      className="flex-shrink-0 w-80 p-3 bg-deepBlack-300/30 border border-metallicGold-900/10 rounded-lg hover:bg-deepBlack-300/50 hover:border-metallicGold-500/30 transition-all group mx-2"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                            HOT {index + 1}
                          </span>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                        </div>
                        {category && (
                          <span className="text-xs px-2 py-1 bg-metallicGold-900/20 text-metallicGold-500 rounded">
                            {category.label}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-offWhite-200 group-hover:text-metallicGold-500 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-offWhite-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(post.view_count || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          {(post.likes || 0).toLocaleString()}
                        </span>
                        <span className="text-green-400 text-xs">실시간</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        <section className="px-4 mb-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map(category => {
                const categoryPosts = posts.filter(post => post.category === category.id).slice(0, 3);
                return (
                  <div key={category.id} className="bg-deepBlack-300/20 border border-metallicGold-900/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4 text-metallicGold-500" />
                        <h3 className="text-sm font-semibold text-offWhite-200">{category.label}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className="text-xs text-metallicGold-500 hover:text-metallicGold-400 flex items-center gap-1"
                      >
                        더보기
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {categoryPosts.map(post => (
                        <Link
                          key={post.id}
                          href={`/community/${post.category}/${post.id}`}
                          className="block text-xs text-offWhite-300 hover:text-metallicGold-500 transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      ))}
                      {categoryPosts.length === 0 && (
                        <p className="text-xs text-offWhite-600">아직 게시글이 없습니다</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Posts Filter */}
        <section className="px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-offWhite-200">전체 게시글</h2>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-metallicGold-500 text-deepBlack-900'
                      : 'bg-deepBlack-300/30 text-offWhite-500 hover:bg-deepBlack-300/50'
                  }`}
                >
                  전체
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      selectedCategory === category.id
                        ? 'bg-metallicGold-500 text-deepBlack-900'
                        : 'bg-deepBlack-300/30 text-offWhite-500 hover:bg-deepBlack-300/50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Posts List */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 border-b border-metallicGold-900/10 animate-pulse">
                    <div className="w-8 h-4 bg-deepBlack-300/50 rounded"></div>
                    <div className="flex-1 h-4 bg-deepBlack-300/50 rounded"></div>
                    <div className="w-12 h-4 bg-deepBlack-300/50 rounded"></div>
                    <div className="w-8 h-4 bg-deepBlack-300/50 rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-offWhite-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-offWhite-300 mb-2">아직 작성된 글이 없습니다</h3>
                <p className="text-offWhite-600 mb-6">첫 번째 글을 작성해보세요!</p>
                <button
                  onClick={handleWriteClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  글쓰기
                </button>
              </div>
            ) : (
              <div className="bg-deepBlack-300/20 border border-metallicGold-900/10 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:flex items-center gap-4 px-4 py-3 bg-deepBlack-300/30 border-b border-metallicGold-900/10 text-sm font-medium text-offWhite-400">
                  <div className="w-16">번호</div>
                  <div className="flex-1">제목</div>
                  <div className="w-20">작성자</div>
                  <div className="w-16 text-center">조회</div>
                  <div className="w-16 text-center">추천</div>
                  <div className="w-20 text-center">작성일</div>
                  <div className="w-8"></div>
                </div>
                
                {/* Posts List */}
                <div className="divide-y divide-metallicGold-900/10">
                  {posts.map((post, index) => {
                    const category = categories.find(c => c.id === post.category);
                    return (
                      <Link
                        key={post.id}
                        href={`/community/${post.category}/${post.id}`}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-deepBlack-300/30 transition-all group"
                      >
                        {/* Post Number (Desktop) */}
                        <div className="w-16 text-sm text-offWhite-600 hidden sm:block">
                          {index + 1}
                        </div>
                        
                        {/* Title and Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Mobile Category */}
                            {category && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-metallicGold-900/20 text-metallicGold-500 rounded text-xs font-medium sm:hidden">
                                <category.icon className="w-3 h-3" />
                                {category.label}
                              </span>
                            )}
                            
                            {/* Badges */}
                            {post.is_pinned && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                                <Pin className="w-3 h-3" />
                                고정
                              </span>
                            )}
                            {post.is_featured && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-metallicGold-500/20 text-metallicGold-400 rounded text-xs font-medium">
                                <Star className="w-3 h-3" />
                                추천
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-sm font-medium text-offWhite-200 group-hover:text-metallicGold-500 transition-colors line-clamp-1 mb-1">
                            {post.title}
                          </h3>
                          
                          {/* Mobile Meta */}
                          <div className="flex items-center justify-between text-xs text-offWhite-600 sm:hidden">
                            <div className="flex items-center gap-3">
                              <span>{post.author_name}</span>
                              <span>{formatDate(post.created_at)}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {(post.view_count || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {(post.likes || 0).toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Delete Button - Mobile */}
                            {user && (user.role === 'admin' || user.id === post.author_id) && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeletePost(post.id, post.author_id);
                                }}
                                className="p-1 text-offWhite-600 hover:text-red-400 transition-colors"
                                title="게시글 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Desktop Meta */}
                        <div className="w-20 text-sm text-offWhite-600 hidden sm:block truncate">
                          {post.author_name}
                        </div>
                        
                        <div className="w-16 text-center text-sm text-offWhite-600 hidden sm:block">
                          {(post.view_count || 0).toLocaleString()}
                        </div>
                        
                        <div className="w-16 text-center text-sm text-offWhite-600 hidden sm:flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3" />
                          {(post.likes || 0)}
                        </div>
                        
                        <div className="w-20 text-center text-xs text-offWhite-600 hidden sm:block">
                          {formatDate(post.created_at)}
                        </div>
                        
                        {/* Delete Button - Desktop */}
                        {user && (user.role === 'admin' || user.id === post.author_id) && (
                          <div className="w-8 hidden sm:flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePost(post.id, post.author_id);
                              }}
                              className="p-1 text-offWhite-600 hover:text-red-400 transition-colors"
                              title="게시글 삭제"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
