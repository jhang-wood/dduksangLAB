'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer() {
  const targetDate = new Date('2025-01-21T19:00:00+09:00').getTime()
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-premiumGold-500/20 blur-xl" />
        <div className="relative bg-gradient-to-br from-charcoal-900 to-charcoal-950 border border-premiumGold-500/30 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[120px]">
          <motion.div
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold text-premiumGold-500 font-playfair"
          >
            {value.toString().padStart(2, '0')}
          </motion.div>
        </div>
      </div>
      <p className="mt-2 text-sm md:text-base text-gray-400 font-light tracking-wider">{label}</p>
    </motion.div>
  )

  return (
    <div className="flex items-center justify-center">
      <div className="flex gap-3 md:gap-6">
        <TimeBlock value={timeLeft.days} label="DAYS" />
        <div className="flex items-center text-premiumGold-500 text-2xl md:text-4xl font-playfair">:</div>
        <TimeBlock value={timeLeft.hours} label="HOURS" />
        <div className="flex items-center text-premiumGold-500 text-2xl md:text-4xl font-playfair">:</div>
        <TimeBlock value={timeLeft.minutes} label="MINUTES" />
        <div className="flex items-center text-premiumGold-500 text-2xl md:text-4xl font-playfair">:</div>
        <TimeBlock value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  )
}