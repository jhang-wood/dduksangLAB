'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Timer, X, Check, AlertCircle } from 'lucide-react';

interface CouponSystemProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
}

export default function CouponSystem({
  originalPrice,
  discountedPrice,
  className = '',
}: CouponSystemProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [error, setError] = useState('');
  
  const couponDiscount = 30000; // 3만원 추가 할인
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
  };

  return (
    <div className={className}>
      {/* Price Display */}
      <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        <div className="space-y-3 sm:space-y-4">
          {/* Original Price */}
          <div className="flex items-center justify-between text-base sm:text-lg">
            <span className="text-offWhite-500">정가</span>
            <span className="text-offWhite-500 line-through">
              ₩{originalPrice.toLocaleString()}
            </span>
          </div>

          {/* Discounted Price */}
          <div className="flex items-center justify-between text-lg sm:text-xl">
            <span className="text-offWhite-300">런칭 특가</span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded">
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
              className="flex items-center justify-between text-base sm:text-lg border-t border-metallicGold-900/20 pt-3 sm:pt-4"
            >
              <span className="text-green-400 flex items-center gap-2">
                <Check size={16} />
                쿠폰 할인
              </span>
              <span className="text-green-400 font-semibold">
                -₩{couponDiscount.toLocaleString()}
              </span>
            </motion.div>
          )}

          {/* Final Price */}
          <div className="border-t border-metallicGold-900/20 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-xl font-bold text-offWhite-200">최종 가격</span>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-metallicGold-500">
                  ₩{finalPrice.toLocaleString()}
                </p>
                {couponApplied && (
                  <p className="text-xs sm:text-sm text-offWhite-500 mt-1">
                    총 {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}% 할인
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coupon Button or Timer */}
          {!couponApplied ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-deepBlack-900 rounded-xl font-bold text-base sm:text-lg hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2"
            >
              <Gift size={20} />
              추가 3만원 할인 쿠폰 받기
            </motion.button>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-green-400 font-semibold text-sm sm:text-base">쿠폰 적용됨!</p>
                  <p className="text-xs sm:text-sm text-offWhite-500">코드: {couponCode}</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <Timer size={16} />
                  <span className="text-sm sm:text-base font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring' }}
              className="bg-deepBlack-900 border border-metallicGold-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-metallicGold-500">
                  🎁 추가 3만원 할인 쿠폰
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-offWhite-500 hover:text-offWhite-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <p className="text-offWhite-300 text-sm sm:text-base">
                  이메일 주소를 입력하시면 즉시 3만원 할인 쿠폰을 발급해드립니다.
                  <br />
                  <span className="text-yellow-500 font-semibold">24시간 한정 특가!</span>
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일 주소 입력"
                      className="w-full px-4 py-3 bg-deepBlack-600 border border-metallicGold-900/30 rounded-xl text-offWhite-200 placeholder-offWhite-600 focus:outline-none focus:border-metallicGold-500/50 transition-colors text-sm sm:text-base"
                      required
                    />
                    {error && (
                      <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-metallicGold-500 to-metallicGold-900 text-deepBlack-900 rounded-xl font-bold text-base sm:text-lg hover:from-metallicGold-400 hover:to-metallicGold-800 transition-all"
                  >
                    쿠폰 받기
                  </button>
                </form>

                <p className="text-xs text-offWhite-600 text-center">
                  * 이메일은 쿠폰 발송 및 강의 안내 목적으로만 사용됩니다
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}