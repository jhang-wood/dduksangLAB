'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, Users, Star, Shield, Check, ArrowRight, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface StickyPriceCardProps {
  originalPrice: number;
  discountedPrice: number;
  isEnrolled: boolean;
  onEnrollClick: () => void;
}

export default function StickyPriceCard({
  originalPrice,
  discountedPrice,
  isEnrolled,
  onEnrollClick,
}: StickyPriceCardProps) {
  const router = useRouter();
  const { } = useAuth();
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <motion.div 
      className="sticky top-24"
      style={{ y }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-deepBlack-300/60 to-deepBlack-400/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-metallicGold-900/20"
      >
        {/* Special Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            🔥 사전예약 마감예정
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 pt-4">
          <h3 className="text-xl font-bold text-offWhite-200 mb-2">
            Claude Code CLI 마스터
          </h3>
          <p className="text-sm text-offWhite-500">
            비개발자를 위한 AI 자동화 완벽 가이드
          </p>
        </div>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-deepBlack-600/60 to-deepBlack-700/60 rounded-2xl p-6 mb-6 border border-metallicGold-900/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-offWhite-400 line-through text-base">
              ₩{originalPrice.toLocaleString()}
            </span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              {discount}% OFF
            </span>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-metallicGold-400 to-metallicGold-600">
              ₩{discountedPrice.toLocaleString()}
            </p>
            <p className="text-sm text-metallicGold-400 mt-2 font-medium">
              무려 {((originalPrice - discountedPrice)).toLocaleString()}원 할인!
            </p>
          </div>
        </div>

        {/* CTA Button */}
        {isEnrolled ? (
          <button
            onClick={() => router.push('/lectures/claude-code-master')}
            className="w-full py-5 bg-green-500/20 text-green-400 rounded-2xl font-bold text-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 border border-green-500/30"
          >
            <Check size={22} />
            학습 계속하기
          </button>
        ) : (
          <button
            onClick={onEnrollClick}
            className="w-full py-5 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-2xl font-bold text-xl hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Gift size={24} />
            지금 수강 신청하기
            <ArrowRight size={20} />
          </button>
        )}

        {/* Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-metallicGold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-offWhite-200">27개 실습 모듈</p>
              <p className="text-xs text-offWhite-500">총 27시간 분량</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-metallicGold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-offWhite-200">선착순 한정</p>
              <p className="text-xs text-offWhite-500">조기 마감 임박</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-metallicGold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-offWhite-200">1년 수강 기간</p>
              <p className="text-xs text-offWhite-500">무제한 복습 가능</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-metallicGold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-offWhite-200">Q&A 지원</p>
              <p className="text-xs text-offWhite-500">직접 답변 제공</p>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 p-5 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-2xl border border-orange-500/20"
        >
          <p className="text-center">
            <span className="text-2xl">⏰</span>
            <br />
            <span className="font-bold text-yellow-400 text-base">24시간 한정 특가</span>
            <br />
            <span className="text-sm text-offWhite-300 mt-1">이 가격은 곧 종료됩니다</span>
          </p>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-metallicGold-500">100%</p>
              <p className="text-xs text-offWhite-500">실습 위주</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-metallicGold-500">27H</p>
              <p className="text-xs text-offWhite-500">총 강의</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-metallicGold-500">1년</p>
              <p className="text-xs text-offWhite-500">수강기간</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}