'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

// 할인 타이머 컴포넌트
export function DiscountTimer({
  endDate,
  discountPercent,
  variant = 'default',
}: {
  endDate: Date;
  discountPercent: number;
  variant?: 'default' | 'compact' | 'banner';
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsEnded(false);
      } else {
        setIsEnded(true);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (isEnded) {
    return null;
  }

  const getUrgencyColor = () => {
    const totalMinutes = timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;
    if (totalMinutes < 60) {
      return 'red';
    } // 1시간 미만
    if (totalMinutes < 24 * 60) {
      return 'orange';
    } // 24시간 미만
    return 'yellow'; // 그 외
  };

  const urgencyColor = getUrgencyColor();
  const colorClasses = {
    red: {
      bg: 'from-red-500/20 to-red-900/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      pulse: 'animate-pulse',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-900/20',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      pulse: '',
    },
    yellow: {
      bg: 'from-yellow-500/20 to-yellow-900/20',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      pulse: '',
    },
  };

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${colorClasses[urgencyColor].bg} border ${colorClasses[urgencyColor].border} px-6 py-3 ${colorClasses[urgencyColor].pulse}`}
      >
        <div className="container mx-auto flex items-center justify-center gap-4 text-center">
          <Zap className={`w-5 h-5 ${colorClasses[urgencyColor].text}`} />
          <span className={`font-bold ${colorClasses[urgencyColor].text}`}>
            🔥 {discountPercent}% 특가 할인 마감까지
          </span>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${colorClasses[urgencyColor].text} font-mono`}>
              {timeLeft.days > 0 && <span>{timeLeft.days}일</span>}
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${colorClasses[urgencyColor].bg} border ${colorClasses[urgencyColor].border} rounded-lg ${colorClasses[urgencyColor].pulse}`}
      >
        <Clock className={`w-4 h-4 ${colorClasses[urgencyColor].text}`} />
        <span className={`text-sm font-semibold ${colorClasses[urgencyColor].text}`}>
          {timeLeft.days > 0 && `${timeLeft.days}일 `}
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-gradient-to-br ${colorClasses[urgencyColor].bg} border ${colorClasses[urgencyColor].border} rounded-2xl p-6 ${colorClasses[urgencyColor].pulse}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className={`w-6 h-6 ${colorClasses[urgencyColor].text}`} />
          <h3 className={`text-lg font-bold ${colorClasses[urgencyColor].text}`}>
            {discountPercent}% 특가 마감까지
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {timeLeft.days > 0 && (
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${colorClasses[urgencyColor].text}`}>
                {timeLeft.days}
              </div>
              <div className="text-xs text-offWhite-600">일</div>
            </div>
          )}
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${colorClasses[urgencyColor].text}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-offWhite-600">시</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${colorClasses[urgencyColor].text}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-offWhite-600">분</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-mono font-bold ${colorClasses[urgencyColor].text}`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-offWhite-600">초</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 남은 수강권 수량 표시 컴포넌트
export function StockIndicator({
  total,
  remaining,
  variant = 'default',
}: {
  total: number;
  remaining: number;
  variant?: 'default' | 'compact' | 'minimal';
}) {
  const percentage = (remaining / total) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  const getStatusColor = () => {
    if (isCritical) {
      return 'red';
    }
    if (isLow) {
      return 'orange';
    }
    return 'green';
  };

  const statusColor = getStatusColor();
  const colorClasses = {
    red: {
      bg: 'from-red-500/20 to-red-900/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      bar: 'bg-red-500',
      pulse: 'animate-pulse',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-900/20',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      bar: 'bg-orange-500',
      pulse: '',
    },
    green: {
      bg: 'from-green-500/20 to-green-900/20',
      border: 'border-green-500/40',
      text: 'text-green-400',
      bar: 'bg-green-500',
      pulse: '',
    },
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Users className={`w-4 h-4 ${colorClasses[statusColor].text}`} />
        <span className={colorClasses[statusColor].text}>{remaining}석 남음</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${colorClasses[statusColor].bg} border ${colorClasses[statusColor].border} rounded-lg ${colorClasses[statusColor].pulse}`}
      >
        <Users className={`w-4 h-4 ${colorClasses[statusColor].text}`} />
        <div className="flex-1">
          <div className={`text-sm font-semibold ${colorClasses[statusColor].text} mb-1`}>
            {remaining}석 남음
          </div>
          <div className="w-20 h-1 bg-deepBlack-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={`h-full ${colorClasses[statusColor].bar}`}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-gradient-to-br ${colorClasses[statusColor].bg} border ${colorClasses[statusColor].border} rounded-xl p-4 ${colorClasses[statusColor].pulse}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Users className={`w-5 h-5 ${colorClasses[statusColor].text}`} />
        <div>
          <div className={`font-bold ${colorClasses[statusColor].text}`}>{remaining}석 남음</div>
          <div className="text-xs text-offWhite-600">전체 {total}석 중</div>
        </div>
      </div>

      <div className="w-full h-2 bg-deepBlack-600 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${colorClasses[statusColor].bar}`}
        />
      </div>

      <div className="text-right text-xs text-offWhite-600 mt-1">{percentage.toFixed(1)}% 남음</div>
    </motion.div>
  );
}

// 얼리버드 할인 카운트다운
export function EarlyBirdCountdown({
  stages,
  currentStage,
}: {
  stages: Array<{
    name: string;
    discount: number;
    endDate: Date;
    slots: number;
    remaining: number;
  }>;
  currentStage: number;
}) {
  const stage = stages[currentStage];
  if (!stage) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 border border-metallicGold-500/40 rounded-2xl p-6"
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-metallicGold-500 mb-2">🎯 {stage.name}</h3>
        <p className="text-metallicGold-300">{stage.discount}% 특별 할인 진행 중</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <DiscountTimer endDate={stage.endDate} discountPercent={stage.discount} variant="default" />

        <StockIndicator total={stage.slots} remaining={stage.remaining} variant="default" />
      </div>

      {/* 다음 단계 미리보기 */}
      {currentStage < stages.length - 1 && (
        <div className="mt-4 pt-4 border-t border-metallicGold-900/30">
          <div className="text-center text-sm text-offWhite-500">
            다음 단계: {stages[currentStage + 1]?.name}({stages[currentStage + 1]?.discount}% 할인)
          </div>
        </div>
      )}
    </motion.div>
  );
}

// 제한된 시간 오퍼 배너
export function LimitedTimeOffer({
  title,
  subtitle,
  endDate,
  ctaText,
  onCTAClick,
  variant = 'banner',
}: {
  title: string;
  subtitle: string;
  endDate: Date;
  ctaText: string;
  onCTAClick: () => void;
  variant?: 'banner' | 'modal' | 'sticky';
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  if (variant === 'sticky') {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-800 text-white p-4 shadow-2xl"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <div className="font-bold text-lg">{title}</div>
              <div className="text-sm opacity-90">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DiscountTimer endDate={endDate} discountPercent={50} variant="compact" />

            <button
              onClick={onCTAClick}
              className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              {ctaText}
            </button>

            <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white">
              ×
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Banner variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-red-500/20 to-red-900/20 border border-red-500/40 rounded-2xl p-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl font-bold text-red-400">{title}</h2>
      </div>

      <p className="text-lg text-offWhite-300 mb-6">{subtitle}</p>

      <div className="mb-6">
        <DiscountTimer endDate={endDate} discountPercent={50} variant="default" />
      </div>

      <button
        onClick={onCTAClick}
        className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-400 hover:to-red-600 transition-all"
      >
        {ctaText}
      </button>
    </motion.div>
  );
}

// 실시간 구매 현황 표시
export function RealTimePurchaseIndicator() {
  const [purchases, setPurchases] = useState(0);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    // 실시간 구매 시뮬레이션
    const interval = setInterval(
      () => {
        setPurchases(prev => prev + Math.floor(Math.random() * 3) + 1);
        setShowPurchase(true);

        setTimeout(() => setShowPurchase(false), 3000);
      },
      Math.random() * 30000 + 15000
    ); // 15-45초 간격

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showPurchase && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-24 right-4 bg-green-500/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl z-40"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <div className="font-semibold">방금 구매 완료!</div>
              <div className="text-sm opacity-90">총 {purchases}명이 수강 중</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
