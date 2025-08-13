'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function RealTimeCounter() {
  const [viewers, setViewers] = useState(27);
  const [spotsLeft, setSpotsLeft] = useState(73);
  const [recentSignup, setRecentSignup] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Simulate real-time viewer changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.min(Math.max(newValue, 15), 45);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => {
        if (prev <= 10) return prev;
        const decrease = Math.random() > 0.7 ? 1 : 0;
        return prev - decrease;
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate recent signups
  useEffect(() => {
    const names = [
      '김**님', '이**님', '박**님', '최**님', '정**님',
      '강**님', '조**님', '윤**님', '장**님', '임**님'
    ];
    
    const showSignup = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setRecentSignup(randomName);
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    };

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showSignup();
      
      // Then show periodically
      const interval = setInterval(showSignup, 45000); // Every 45 seconds
      
      return () => clearInterval(interval);
    }, 10000); // First notification after 10 seconds

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <>
      {/* Real-time Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-900/20 rounded-2xl p-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* Current Viewers */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <span className="text-offWhite-300">
              현재 <motion.span
                key={viewers}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-emerald-400"
              >
                {viewers}명
              </motion.span>이 보고 있습니다
            </span>
          </div>

          {/* Spots Left */}
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span className="text-offWhite-300">
              오늘 마감까지{' '}
              <motion.span
                key={spotsLeft}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-bold ${spotsLeft <= 20 ? 'text-red-400' : 'text-yellow-500'}`}
              >
                {spotsLeft}자리
              </motion.span>{' '}
              남음
            </span>
          </div>

          {/* Urgency Indicator */}
          {spotsLeft <= 20 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold animate-pulse">
                조기 마감 임박
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Recent Signup Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 0 }}
            className="fixed bottom-20 right-4 z-40 max-w-sm"
          >
            <div className="bg-deepBlack-800 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-offWhite-200 font-semibold">
                    {recentSignup}이 방금 등록했습니다
                  </p>
                  <p className="text-xs text-offWhite-500 mt-1">
                    {spotsLeft}자리 남음
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}