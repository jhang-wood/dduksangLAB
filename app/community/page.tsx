'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, MessageSquare, HelpCircle, Briefcase, PlusCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
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
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-500 to-metallicGold-900">
                  커뮤니티
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-offWhite-500 max-w-3xl mx-auto px-4 sm:px-0">
                떡상연구소 수강생들과
                <br className="sm:hidden" />
                함께 성장하고 소통하세요
              </p>
            </motion.div>
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
            <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-offWhite-600">로딩 중...</div>
              ) : posts.length === 0 ? (
                <div className="p-20 text-center text-offWhite-600">아직 작성된 글이 없습니다.</div>
              ) : (
                <div className="divide-y divide-metallicGold-900/20">
                  {posts.map(post => (
                    <Link
                      key={post.id}
                      href={`/community/${post.category}/${post.id}`}
                      className="block p-4 sm:p-6 hover:bg-deepBlack-300/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 text-xs sm:text-sm text-offWhite-600">
                        <span className="px-2 sm:px-3 py-1 bg-metallicGold-900/20 rounded-full text-metallicGold-500 inline-block w-fit">
                          {categories.find(c => c.id === post.category)?.label}
                        </span>
                        <span>{post.author_name}</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          {post.views}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-offWhite-200 hover:text-metallicGold-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
