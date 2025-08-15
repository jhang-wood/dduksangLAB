'use client';

import React from 'react';
import { Clock, Users, Star, Shield, Check, ArrowRight, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimplePriceCardProps {
  originalPrice: number;
  discountedPrice: number;
  isEnrolled: boolean;
  onEnrollClick: () => void;
}

export default function SimplePriceCard({
  originalPrice,
  discountedPrice,
  isEnrolled,
  onEnrollClick,
}: SimplePriceCardProps) {
  const router = useRouter();
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-deepBlack-300/60 to-deepBlack-400/60 backdrop-blur-xl rounded-3xl p-6 border border-metallicGold-900/20 shadow-xl relative">
        
        {/* Special Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            🔥 사전예약 진행중
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4 pt-3">
          <h3 className="text-lg font-bold text-offWhite-200 mb-1">
            Claude Code CLI 마스터
          </h3>
          <p className="text-xs text-offWhite-500">
            비개발자를 위한 AI 자동화
          </p>
        </div>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-deepBlack-600/60 to-deepBlack-700/60 rounded-2xl p-4 mb-4 border border-metallicGold-900/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-offWhite-400 line-through text-base">
              ₩{originalPrice.toLocaleString()}
            </span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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

        {/* Features */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-metallicGold-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-metallicGold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-offWhite-200">13개 실습 모듈</p>
              <p className="text-xs text-offWhite-500">총 13시간 분량</p>
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
              <p className="text-xs text-offWhite-500">복습 가능</p>
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

        {/* Static Timer Section - No JavaScript logic */}
        <div className="mt-4 p-3 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-xl border border-orange-500/20">
          <div className="text-center">
            <p className="font-bold text-yellow-400 text-sm mb-1">사전예약 한정특가 마감까지</p>
            <div className="bg-deepBlack-800/80 rounded-lg px-3 py-2 inline-block">
              <p className="text-sm font-mono font-bold text-metallicGold-500">
                1일 23:59:59
              </p>
            </div>
            <p className="text-xs text-red-300 mt-2 font-semibold">⚠️ 1차 사전예약 마감일: 8월 17일</p>
            <p className="text-xs text-offWhite-300 mt-1">이 가격은 곧 종료됩니다</p>
          </div>
        </div>

        {/* CTA Button */}
        {isEnrolled ? (
          <button
            onClick={() => router.push('/lectures/claude-code-master')}
            className="w-full mt-4 py-3 bg-green-500/20 text-green-400 rounded-xl font-bold text-base hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 border border-green-500/30"
          >
            <Check size={20} />
            학습 계속하기
          </button>
        ) : (
          <button
            onClick={onEnrollClick}
            className="w-full mt-4 py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-base hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gift size={18} />
            수강 신청
            <ArrowRight size={16} />
          </button>
        )}

      </div>
    </div>
  );
}