'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/stores/auth-store';

interface BookmarkButtonProps {
  courseId: string;
  courseName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function BookmarkButton({
  courseId,
  courseName,
  className = '',
  size = 'md',
  showText = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  // 사이즈 설정
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  useEffect(() => {
    // 로컬스토리지에서 북마크 상태 확인
    if (typeof window !== 'undefined' && user) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]');
      setIsBookmarked(bookmarks.some((bookmark: any) => bookmark.courseId === courseId));
    }
  }, [courseId, user]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // 로그인 모달 또는 로그인 페이지로 리디렉션
      return;
    }

    setIsAnimating(true);

    try {
      // 로컬스토리지에서 북마크 관리
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]');

      if (isBookmarked) {
        // 북마크 제거
        const updatedBookmarks = bookmarks.filter(
          (bookmark: any) => bookmark.courseId !== courseId
        );
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
      } else {
        // 북마크 추가
        const newBookmark = {
          courseId,
          courseName,
          bookmarkedAt: new Date().toISOString(),
          userId: user.id,
        };
        bookmarks.push(newBookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(true);
      }

      // TODO: Supabase에 저장하는 로직 추가
      // await supabase.from('bookmarks').upsert(...)
    } catch (error) {
      console.error('북마크 처리 중 오류:', error);
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      onClick={handleBookmark}
      className={`
        group relative inline-flex items-center gap-2 rounded-xl transition-all duration-300
        hover:scale-105 active:scale-95
        ${buttonSizes[size]} ${className}
      `}
      whileTap={{ scale: 0.9 }}
      disabled={!user}
    >
      {/* 배경 효과 */}
      <div
        className={`
        absolute inset-0 rounded-xl transition-all duration-300
        ${
          isBookmarked
            ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30'
            : 'bg-deepBlack-300/30 border border-metallicGold-900/20 hover:border-metallicGold-500/40'
        }
      `}
      />

      {/* 하트 아이콘 */}
      <div className="relative z-10">
        <AnimatePresence>
          <motion.div
            key={isBookmarked ? 'filled' : 'empty'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            <Heart
              className={`
                ${sizeClasses[size]} transition-colors duration-300
                ${
                  isBookmarked
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-metallicGold-500 group-hover:text-pink-400'
                }
              `}
            />
          </motion.div>
        </AnimatePresence>

        {/* 애니메이션 효과 */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className={`${sizeClasses[size]} fill-pink-500 text-pink-500`} />
          </motion.div>
        )}
      </div>

      {/* 텍스트 */}
      {showText && (
        <span
          className={`
          relative z-10 text-sm font-medium transition-colors duration-300
          ${isBookmarked ? 'text-pink-500' : 'text-offWhite-400 group-hover:text-pink-400'}
        `}
        >
          {isBookmarked ? '찜 완료' : '찜하기'}
        </span>
      )}

      {/* 호버 효과 */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-xl" />
      </div>
    </motion.button>
  );
}
