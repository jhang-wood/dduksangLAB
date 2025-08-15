'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Users, MessageSquare, HelpCircle, Briefcase, PlusCircle, Eye, Heart, Pin, Star, Clock } from 'lucide-react';
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
  views: number;
  likes: number;
  comments_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const categories = [
  { id: 'all', label: '전체', icon: MessageSquare },
  { id: 'general', label: '자유게시판', icon: MessageSquare },
  { id: 'review', label: '수강후기', icon: Users },
  { id: 'qna', label: '질문/답변', icon: HelpCircle },
  { id: 'career', label: '진로/취업', icon: Briefcase },
];

// Client component - no revalidate needed

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [selectedCategory]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handleWriteClick = () => {
    if (!user) {
      userNotification.alert('로그인이 필요한 서비스입니다.');
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
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

        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  커뮤니티
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-offWhite-500 max-w-3xl mx-auto px-4 sm:px-0">
                떡상연구소 수강생들과 함께 성장하고 소통하세요
              </p>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 text-sm sm:text-base ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900'
                        : 'bg-deepBlack-300/50 text-offWhite-500 hover:bg-deepBlack-300/70'
                    }`}
                  >
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {category.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleWriteClick}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                글쓰기
              </button>
            </div>
          </div>
        </section>

        {/* Posts List */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-deepBlack-300/30 border border-metallicGold-900/10 rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-deepBlack-300/50 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-deepBlack-300/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-deepBlack-300/50 rounded w-1/2"></div>
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
              <div className="grid gap-4">
                {posts.map(post => {
                  const category = categories.find(c => c.id === post.category);
                  return (
                    <article
                      key={post.id}
                      className="bg-deepBlack-300/30 border border-metallicGold-900/10 rounded-2xl p-6 hover:bg-deepBlack-300/50 hover:border-metallicGold-900/20 transition-all group"
                    >
                      <Link href={`/community/${post.category}/${post.id}`} className="block">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            {post.is_pinned && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                                <Pin className="w-3 h-3" />
                                고정글
                              </span>
                            )}
                            {post.is_featured && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-metallicGold-500/20 text-metallicGold-400 rounded-full text-xs font-medium">
                                <Star className="w-3 h-3" />
                                추천
                              </span>
                            )}
                            {category && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-metallicGold-900/20 text-metallicGold-500 rounded-full text-sm font-medium">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-offWhite-600">
                            <Clock className="w-4 h-4" />
                            {formatDate(post.created_at)}
                          </div>
                        </div>

                        {/* Post Title */}
                        <h2 className="text-xl font-semibold text-offWhite-200 group-hover:text-metallicGold-500 transition-colors mb-3 line-clamp-2 leading-relaxed">
                          {post.title}
                        </h2>

                        {/* Post Content Preview */}
                        {post.content && (
                          <p className="text-offWhite-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {post.content.replace(/[#*`]/g, '').substring(0, 120)}...
                          </p>
                        )}

                        {/* Post Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-offWhite-600">
                            <span className="font-medium text-offWhite-500">{post.author_name}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-offWhite-600">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.comments_count.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-deepBlack-300/50 text-offWhite-600 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 text-offWhite-600 text-xs">
                                +{post.tags.length - 3}개 더
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
