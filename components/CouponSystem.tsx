'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Timer, X, Check, AlertCircle } from 'lucide-react';

interface CouponSystemProps {
  originalPrice: number;
  discountedPrice: number;
  couponDiscount: number;
  onCouponApplied?: (finalPrice: number) => void;
}

export default function CouponSystem({
  originalPrice,
  discountedPrice,
  couponDiscount,
  onCouponApplied,
}: CouponSystemProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [error, setError] = useState('');

  const finalPrice = couponApplied ? discountedPrice - couponDiscount : discountedPrice;

  useEffect(() => {
    if (couponApplied && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCouponApplied(false);
            setCouponCode('');
            return 24 * 60 * 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [couponApplied, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 주소를 입력해주세요');
      return;
    }

    // Generate coupon code
    const code = `CLAUDE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCouponCode(code);
    setCouponApplied(true);
    setShowModal(false);
    setError('');
    
    if (onCouponApplied) {
      onCouponApplied(finalPrice);
    }
  };

  return (
    <>
      {/* Price Display */}
      <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-3xl p-8">
        <div className="space-y-4">
          {/* Original Price */}
          <div className="flex items-center justify-between text-lg">
            <span className="text-offWhite-500">정가</span>
            <span className="text-offWhite-500 line-through">
              ₩{originalPrice.toLocaleString()}
            </span>
          </div>

          {/* Discounted Price */}
          <div className="flex items-center justify-between text-xl">
            <span className="text-offWhite-300">런칭 특가</span>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded">
                -{Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%
              </span>
              <span className="text-offWhite-200 font-semibold">
                ₩{discountedPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Coupon Applied */}
          {couponApplied && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-metallicGold-900/20 pt-4"
            >
              <div className="flex items-center justify-between text-xl">
                <span className="text-emerald-400 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  쿠폰 적용
                </span>
                <span className="text-emerald-400 font-semibold">
                  -₩{couponDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Timer className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  쿠폰 유효시간: {formatTime(timeLeft)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Final Price */}
          <div className="border-t border-metallicGold-900/20 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-offWhite-200">최종 가격</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-metallicGold-500">
                  ₩{finalPrice.toLocaleString()}
                </p>
                {!couponApplied && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <Gift className="w-4 h-4" />
                    쿠폰 받고 추가 할인
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Coupon Code Display */}
          {couponApplied && couponCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4"
            >
              <p className="text-sm text-offWhite-400 mb-1">적용된 쿠폰 코드</p>
              <p className="text-lg font-mono font-bold text-emerald-400">{couponCode}</p>
            </motion.div>
          )}
        </div>

        {/* CTA Button */}
        {!couponApplied ? (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            쿠폰 받고 수강 신청하기
          </button>
        ) : (
          <button className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-emerald-600 transition-all transform hover:scale-[1.02]">
            지금 바로 시작하기
          </button>
        )}
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-deepBlack-800 border border-metallicGold-500/30 rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-offWhite-200">
                  🎁 추가 할인 쿠폰 받기
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-metallicGold-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-offWhite-500" />
                </button>
              </div>

              {/* Discount Info */}
              <div className="bg-metallicGold-500/10 border border-metallicGold-500/30 rounded-xl p-4 mb-6">
                <p className="text-3xl font-bold text-metallicGold-500 text-center mb-2">
                  ₩{couponDiscount.toLocaleString()} 추가 할인
                </p>
                <p className="text-sm text-offWhite-400 text-center">
                  이메일 입력 시 즉시 발급 • 24시간 한정
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm text-offWhite-400 mb-2">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-deepBlack-900/50 border border-metallicGold-900/30 rounded-xl text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:border-metallicGold-500/50 transition-colors"
                    required
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                >
                  쿠폰 받기
                </button>
              </form>

              {/* Notice */}
              <p className="mt-4 text-xs text-offWhite-500 text-center">
                * 쿠폰은 발급 후 24시간 내 사용하지 않으면 자동 소멸됩니다
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}