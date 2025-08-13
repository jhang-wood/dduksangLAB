'use client';

import { userNotification, logger } from '@/lib/logger';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Users, HelpCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { useAuth } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase';

const categories = [
  { id: 'free', label: '자유게시판', icon: MessageSquare },
  { id: 'study', label: '스터디', icon: Users },
  { id: 'qna', label: '질문/답변', icon: HelpCircle },
  { id: 'career', label: '진로/취업', icon: Briefcase },
];

export default function CommunityWritePage() {
  const [formData, setFormData] = useState({
    category: 'free',
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // 로그인 체크를 useEffect로 이동
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      userNotification.alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          category: formData.category,
          title: formData.title,
          content: formData.content,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      router.push(`/community/${data.category}/${data.id}`);
    } catch (error) {
      logger.error('Error creating post:', error);
      userNotification.alert('글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

              <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-offWhite-200">
                새 글 작성
              </h1>

              <form onSubmit={e => void handleSubmit(e)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-offWhite-500 mb-3">
                    카테고리
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.id })}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          formData.category === category.id
                            ? 'border-metallicGold-500 bg-metallicGold-500/10'
                            : 'border-metallicGold-900/30 hover:border-metallicGold-500/50'
                        }`}
                      >
                        <category.icon
                          className={`w-6 h-6 ${
                            formData.category === category.id
                              ? 'text-metallicGold-500'
                              : 'text-offWhite-600'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.category === category.id
                              ? 'text-metallicGold-500'
                              : 'text-offWhite-500'
                          }`}
                        >
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-offWhite-500 mb-2"
                  >
                    제목
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent"
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-offWhite-500 mb-2"
                  >
                    내용
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-deepBlack-300 border border-metallicGold-900/30 rounded-lg text-offWhite-500 placeholder-offWhite-600 focus:outline-none focus:ring-2 focus:ring-metallicGold-500 focus:border-transparent resize-none"
                    placeholder="내용을 입력하세요"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-lg font-medium hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all disabled:opacity-50"
                  >
                    {loading ? '작성 중...' : '글 작성하기'}
                  </button>
                  <Link
                    href="/community"
                    className="px-6 py-3 bg-deepBlack-300 text-offWhite-500 rounded-lg font-medium hover:bg-deepBlack-300/70 transition-all"
                  >
                    취소
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
