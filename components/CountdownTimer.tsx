'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-12T19:00:00+09:00'); // 2025년 8월 12일 오후 7시 (한국 시간)

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative"
    >
      <div className="relative group">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-900/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />

        {/* Main container */}
        <div className="relative bg-deepBlack-300 border border-metallicGold-900/30 rounded-xl p-6 group-hover:border-metallicGold-500/50 transition-all">
          {/* Number - Only animate seconds */}
          {label === '초' ? (
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-6xl font-montserrat font-bold text-transparent bg-clip-text bg-gradient-to-br from-metallicGold-500 to-metallicGold-900"
            >
              {value.toString().padStart(2, '0')}
            </motion.div>
          ) : (
            <div className="text-5xl md:text-6xl font-montserrat font-bold text-transparent bg-clip-text bg-gradient-to-br from-metallicGold-500 to-metallicGold-900">
              {value.toString().padStart(2, '0')}
            </div>
          )}

          {/* Label */}
          <div className="text-offWhite-500 text-sm mt-2 uppercase tracking-wider">{label}</div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallicGold-100/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <TimeUnit value={timeLeft.days} label="일" delay={0} />
        <TimeUnit value={timeLeft.hours} label="시간" delay={0.1} />
        <TimeUnit value={timeLeft.minutes} label="분" delay={0.2} />
        <TimeUnit value={timeLeft.seconds} label="초" delay={0.3} />
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-4"
      >
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-metallicGold-500/50" />
        <div className="text-metallicGold-500 text-sm font-medium tracking-wider">
          GRAND OPENING
        </div>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-metallicGold-500/50" />
      </motion.div>
    </div>
  );
}
