'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function LimitedTimer() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Reset to 24 hours when timer reaches 0
          return 24 * 60 * 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-metallicGold-500" />
        <p className="text-lg text-offWhite-400">무료 제공 종료까지</p>
      </div>
      
      <div className="flex gap-4">
        <div className="text-center">
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-500/30 rounded-xl p-4 min-w-[80px]">
            <span className="text-3xl font-bold text-metallicGold-500">{hours}</span>
          </div>
          <p className="text-sm text-offWhite-500 mt-2">시간</p>
        </div>
        
        <div className="flex items-center text-2xl text-metallicGold-500">:</div>
        
        <div className="text-center">
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-500/30 rounded-xl p-4 min-w-[80px]">
            <span className="text-3xl font-bold text-metallicGold-500">{minutes}</span>
          </div>
          <p className="text-sm text-offWhite-500 mt-2">분</p>
        </div>
        
        <div className="flex items-center text-2xl text-metallicGold-500">:</div>
        
        <div className="text-center">
          <div className="bg-deepBlack-300/50 backdrop-blur-sm border border-metallicGold-500/30 rounded-xl p-4 min-w-[80px]">
            <span className="text-3xl font-bold text-metallicGold-500">{seconds}</span>
          </div>
          <p className="text-sm text-offWhite-500 mt-2">초</p>
        </div>
      </div>
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-metallicGold-400 mt-4"
      >
        ⚡ 지금이 마지막 기회입니다
      </motion.p>
    </motion.div>
  );
}