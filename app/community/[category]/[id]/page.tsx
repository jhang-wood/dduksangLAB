'use client';

import { userNotification, logger } from '@/lib/logger';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, MessageSquare, User, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  view_count: number;
  created_at: string;
  profiles: {
    name: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

export default function CommunityPostPage({
  params,
}: {
  params: { id: string; category: string };
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(
          `
          *,
          profiles (name)
        `
        )
        .eq('id', params.id)
        .single();

      if (error) {
        throw error;
      }

      setPost(data as Post);

      // 조회수 증가
      await supabase
        .from('community_posts')
        .update({ view_count: data.view_count + 1 })
        .eq('id', params.id);
    } catch (error) {
      logger.error('Error fetching post:', error);
      router.push('/community');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(
          `
          *,
          profiles (name)
        `
        )
        .eq('post_id', params.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }
      setComments(data ?? []);
    } catch (error) {
      logger.error('Error fetching comments:', error);
    }
  }, [params.id]);

  useEffect(() => {
    void fetchPost();
    void fetchComments();
  }, [fetchPost, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      userNotification.alert('로그인이 필요한 서비스입니다.');
      router.push('/auth/login');
      return;
    }

    if (!commentContent.trim()) {
      userNotification.alert('댓글 내용을 입력해주세요.');
      return;
    }

    setCommentLoading(true);

    try {
      const { error } = await supabase.from('community_comments').insert({
        post_id: params.id,
        user_id: user.id,
        content: commentContent,
      });

      if (error) {
        throw error;
      }

      setCommentContent('');
      void fetchComments();
    } catch (error) {
      logger.error('Error creating comment:', error);
      userNotification.alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!userNotification.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', params.id);

      if (error) {
        throw error;
      }

      router.push('/community');
    } catch (error) {
      logger.error('Error deleting post:', error);
      userNotification.alert('글 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlack-900 flex items-center justify-center">
        <div className="text-offWhite-500">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deepBlack-900 relative overflow-hidden">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <Header currentPage="community" />

        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                href="/community"
                className="inline-flex items-center gap-2 text-metallicGold-500 hover:text-metallicGold-400 mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                커뮤니티로 돌아가기
              </Link>

              {/* Post */}
              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8 mb-8">
                <h1 className="text-3xl font-bold text-offWhite-200 mb-4">{post.title}</h1>

                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-metallicGold-900/20">
                  <div className="flex items-center gap-4 text-sm text-offWhite-600">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.profiles?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.view_count}
                    </span>
                  </div>

                  {user?.id === post.user_id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => void handleDeletePost()}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-offWhite-400 whitespace-pre-wrap">{post.content}</div>
              </div>

              {/* Comments */}
              <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-offWhite-200 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  댓글 {comments.length}개
                </h2>

                {/* Comment Form */}
                <form onSubmit={e => void handleCommentSubmit(e)} className="mb-8">
                  <textarea
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-deepBlack-600/50 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent resize-none mb-4"
                    placeholder={user ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
                    disabled={!user}
                  />
                  <button
                    type="submit"
                    disabled={!user || commentLoading}
                    className="px-6 py-2 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50"
                  >
                    {commentLoading ? '작성 중...' : '댓글 작성'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-deepBlack-600/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-2 text-sm text-offWhite-600">
                        <span className="font-medium text-metallicGold-500">
                          {comment.profiles?.name}
                        </span>
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-offWhite-400">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
