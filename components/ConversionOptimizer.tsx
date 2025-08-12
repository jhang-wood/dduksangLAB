'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Users,
  Clock,
  AlertTriangle,
  Zap,
  Star,
  ArrowRight,
  X,
  CheckCircle
} from 'lucide-react';

interface ConversionOptimizerProps {
  isVisible: boolean;
  currentStudents: number;
  priceEndDate?: string;
  className?: string;
}

export default function ConversionOptimizer({
  isVisible,
  currentStudents,
  priceEndDate: _priceEndDate, // 미사용 매개변수를 _로 시작하도록 변경
  className
}: ConversionOptimizerProps) {
  const [showUrgency, setShowUrgency] = useState(false);
  const [showScarcity, setShowScarcity] = useState(false);
  const [viewerCount, setViewerCount] = useState(47);
  const [recentPurchases, setRecentPurchases] = useState<Array<{id: string, name: string, time: string}>>([]);

  // 실시간 뷰어 카운트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
        return Math.max(35, Math.min(67, prev + change));
      });
    }, 8000 + Math.random() * 4000); // 8-12초마다 변경

    return () => clearInterval(interval);
  }, []);

  // 긴급성 메시지 표시
  useEffect(() => {
    if (isVisible) {
      const urgencyTimer = setTimeout(() => setShowUrgency(true), 3000);
      const scarcityTimer = setTimeout(() => setShowScarcity(true), 8000);
      
      return () => {
        clearTimeout(urgencyTimer);
        clearTimeout(scarcityTimer);
      };
    }
    return () => {}; // 함수는 항상 cleanup 함수를 반환해야 함
  }, [isVisible]);

  // 최근 구매 시뮬레이션
  useEffect(() => {
    const names = ['김**', '이**', '박**', '최**', '정**', '한**', '조**', '윤**'];
    const generatePurchase = () => ({
      id: Date.now().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      time: '방금 전'
    });

    const interval = setInterval(() => {
      setRecentPurchases(prev => {
        const newPurchase = generatePurchase();
        return [newPurchase, ...prev.slice(0, 2)];
      });
    }, 15000 + Math.random() * 15000); // 15-30초마다

    // 초기 구매 내역
    setRecentPurchases([generatePurchase(), generatePurchase()]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      {/* 실시간 뷰어 카운터 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
        className="fixed top-24 left-4 z-40 bg-deepBlack-800/95 backdrop-blur-md border border-deepBlack-600 rounded-xl p-3 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-red-500 rounded-full"
          />
          <Eye className="w-4 h-4 text-offWhite-400" />
          <span className="text-sm font-semibold text-offWhite-200">
            <motion.span
              key={viewerCount}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {viewerCount}
            </motion.span>
            명이 보고 있음
          </span>
        </div>
      </motion.div>

      {/* 최근 구매 알림 */}
      <AnimatePresence>
        {recentPurchases.map((purchase, index) => (
          index === 0 && (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="fixed top-40 left-4 z-40 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-xl p-4 shadow-lg max-w-xs"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-green-400">
                    {purchase.name}님이 수강신청
                  </div>
                  <div className="text-xs text-offWhite-400">{purchase.time}</div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* 긴급성 알림 */}
      <AnimatePresence>
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-4 shadow-xl max-w-md mx-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span className="font-bold text-red-400">⚠️ 마감 임박!</span>
              </div>
              <p className="text-sm text-offWhite-200 mb-2">
                이 가격으로는 오늘이 마지막입니다
              </p>
              <div className="flex justify-between items-center text-xs text-offWhite-400">
                <span>할인 종료까지</span>
                <span className="font-mono text-red-400">06:14:32</span>
              </div>
            </motion.div>
            <button
              onClick={() => setShowUrgency(false)}
              className="absolute top-2 right-2 text-offWhite-400 hover:text-offWhite-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 희소성 알림 */}
      <AnimatePresence>
        {showScarcity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 bg-orange-500/20 backdrop-blur-md border border-orange-500/50 rounded-xl p-4 shadow-lg max-w-xs"
          >
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-orange-400 mb-1">
                  선착순 마감 임박
                </div>
                <div className="text-xs text-offWhite-300 mb-2">
                  현재 {currentStudents + 156}명 수강중
                </div>
                <div className="w-full bg-deepBlack-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1.5 }}
                    className="bg-orange-500 h-2 rounded-full"
                  />
                </div>
                <div className="text-xs text-offWhite-400">
                  87% 마감 (13% 남음)
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowScarcity(false)}
              className="absolute top-2 right-2 text-offWhite-400 hover:text-offWhite-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 페이지 하단 스티키 CTA 강화 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-deepBlack-900/95 via-deepBlack-800/95 to-deepBlack-900/95 backdrop-blur-md border-t border-metallicGold-500/30 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 왼쪽: 가격 정보 & 혜택 */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-metallicGold-500">₩990,000</div>
                <div className="text-sm">
                  <div className="line-through text-offWhite-500">₩1,800,000</div>
                  <div className="text-red-400 font-bold">45% 할인</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full"
                >
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">06:14:32</span>
                </motion.div>
                
                <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  <Users className="w-3 h-3" />
                  <span>{currentStudents + 23}명 수강중</span>
                </div>
                
                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span>4.9 (342)</span>
                </div>
              </div>
            </div>

            {/* 오른쪽: CTA 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-metallicGold-500 to-metallicGold-600 text-deepBlack-900 rounded-xl font-bold text-lg hover:from-metallicGold-400 hover:to-metallicGold-500 transition-all shadow-xl hover:shadow-2xl"
            >
              <Zap className="w-5 h-5" />
              지금 바로 시작하기
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="w-full bg-deepBlack-700 h-1">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '87%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="bg-gradient-to-r from-red-500 to-orange-500 h-1"
          />
        </div>
      </motion.div>

      {/* 떠나려는 사용자를 위한 Exit Intent 팝업 */}
      <AnimatePresence>
        {/* 이 부분은 실제 마우스 이벤트로 트리거되어야 함 */}
      </AnimatePresence>
    </div>
  );
}