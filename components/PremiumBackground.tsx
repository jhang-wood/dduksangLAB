'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-deepPurple-950 to-charcoal-950" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Gold accent spots */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-premiumGold-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-deepPurple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px),
                           linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Noise texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}